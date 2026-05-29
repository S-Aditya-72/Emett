import { HumanMessage } from "@langchain/core/messages";
import type { BaseMessage } from "@langchain/core/messages";

import { saveAccountSignal } from "@/lib/firebase/firestore";
import { getBrightDataTools } from "@/lib/agents/mcp-client";
import { getLLM } from "@/lib/agents/setup";
import type { AccountSignal } from "@/types";

type SaveAccountSignalInput = Omit<AccountSignal, "id" | "timestamp">;

interface ScoutExtraction {
  companyName: string;
  currentPainPoint: string;
}

interface PersonExtraction {
  name: string;
}

async function retrieveCogneeMemory(companyName: string): Promise<string> {
  try {
    const response = await fetch("http://127.0.0.1:8000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ companyName })
    });

    const data = (await response.json()) as { memory?: string };

    if (data.memory && data.memory.trim().length > 0) {
      return `[Cognee Memory]: ${data.memory}`;
    }

    return "No historical memory found for this company.";
  } catch (error) {
    console.error("[Cognee] Failed to retrieve memory:", error);
    return "No historical memory found for this company.";
  }
}

async function storeCogneeMemory(companyName: string, signal: string): Promise<void> {
  try {
    const response = await fetch("http://127.0.0.1:8000/remember", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ companyName, signal })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Cognee] Failed to store memory:", response.status, errorText);
      return;
    }

    console.log(`[Cognee] Successfully stored memory for ${companyName}`);
  } catch (error) {
    console.error("[Cognee] Failed to store memory:", error);
  }
}

function parseJsonSafe<T>(text: string): T {
  const cleanText = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleanText) as T;
  } catch {
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON object found in LLM output.");
    }

    return JSON.parse(jsonMatch[0]) as T;
  }
}

const RAW_JSON_INSTRUCTION =
  "CRITICAL: Return ONLY raw, valid JSON. Do not include markdown code blocks, backticks, or extra text.";

function getMessageText(content: BaseMessage["content"]): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if ("text" in part && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join("\n");
  }

  return String(content);
}

export async function runEmettAgent(
  campaignId: string,
  competitor: string,
  painPoints: string | undefined,
  ourProduct: string,
  ourProductDescription: string
): Promise<void> {
  try {
    const llm = getLLM();
    const tools = getBrightDataTools();

    console.log("[Emett] Step 1: Forcing Bright Data SERP search...");

    const serpTool = tools.find((tool) => tool.name === "search_web_signals");
    if (!serpTool) {
      throw new Error("search_web_signals tool not found.");
    }

    const query = `site:reddit.com OR site:github.com "${competitor}" "${painPoints || "complaint"}"`;
    const serpResults = await serpTool.invoke(query);
    console.log("[Emett] Bright Data SERP Results fetched.");

    console.log("[Emett] Step 2: Extracting prospect from SERP results...");

    const extractionPrompt = `You are an AI data extractor. Read these live web search results:\n\n${serpResults}\n\nFind ONE specific third-party company or developer complaining about ${competitor}. The company CANNOT be ${competitor}. Extract their name as 'companyName', and summarize their complaint as 'currentPainPoint'. Return ONLY valid JSON with no markdown.
${RAW_JSON_INSTRUCTION}`;

    const extractionResponse = await llm.invoke([new HumanMessage(extractionPrompt)]);
    const extractionText = getMessageText(extractionResponse.content);
    const { companyName, currentPainPoint } = parseJsonSafe<ScoutExtraction>(extractionText);

    console.log("[Emett] Step 3: Forcing company enrichment for", companyName);

    const enrichTool = tools.find((tool) => tool.name === "enrich_target_company");
    if (!enrichTool) {
      throw new Error("enrich_target_company tool not found.");
    }

    const enrichmentSerpData = await enrichTool.invoke(companyName);

    const personExtractionPrompt = `Read these Google Search results for LinkedIn profiles:\n\n${enrichmentSerpData}\n\nFind the name of a person who works as an Engineering Leader or CTO at ${companyName}. Return ONLY a JSON object with a single key 'name'. Do not return markdown. If no clear name is found, return {"name": "Engineering Leadership"}.`;

    const extractedPerson = await llm.invoke([new HumanMessage(personExtractionPrompt)]);
    const parsedEnrichment = parseJsonSafe<PersonExtraction>(getMessageText(extractedPerson.content));
    const realDecisionMakerName = parsedEnrichment.name;

    console.log("[Emett] Querying Cognee for...", companyName);
    const memory = await retrieveCogneeMemory(companyName);

    console.log("[Emett] Step 4: Drafting God-Tier Email...");

    const draftPrompt = `You are an elite Enterprise Sales Exec selling ${ourProduct}. Write a cold email to ${realDecisionMakerName} at ${companyName}.
Current Pain: ${currentPainPoint}.
Cognee Memory: ${memory}.
Our Product Features: ${ourProductDescription}.
RULES:
- No fluff. Do NOT say 'I hope this finds you well'.
- Use Pain-Agitate-Solve.
- Reference the historical memory and today's pain with ${competitor}.
- Explicitly map their pain to our features (${ourProductDescription}) to prove WHY ${ourProduct} is the exact cure.
- Max 3 sentences. Tone: direct, confident.
- Output valid JSON matching the AccountSignal type (omit id and timestamp).
CRITICAL JSON MAPPING: 'companyName' MUST be the name of the prospective third-party customer experiencing the pain. It MUST NOT be ${competitor}.
Required fields: campaignId, accountId, companyName, intentSignal, sourceType, confidenceScore, identifiedDecisionMakers (array of { name, role, linkedInUrl }), recommendedAction, draftedEmail.
Use campaignId: "${campaignId}". Ensure identifiedDecisionMakers includes ${realDecisionMakerName}.
${RAW_JSON_INSTRUCTION}`;

    const draftResponse = await llm.invoke([new HumanMessage(draftPrompt)]);
    const draftText = getMessageText(draftResponse.content);
    const signal = parseJsonSafe<SaveAccountSignalInput>(draftText);

    const normalizedSignal: SaveAccountSignalInput = {
      ...signal,
      campaignId,
      companyName: signal.companyName || companyName,
      competitorUsed: competitor,
      accountId: signal.accountId || companyName.toLowerCase().replace(/\s+/g, "-"),
      intentSignal: signal.intentSignal || currentPainPoint
    };

    console.log("[Emett] Storing Cognee memory...");
    await storeCogneeMemory(normalizedSignal.companyName, normalizedSignal.intentSignal);

    console.log("[Emett] Saving account signal to Firebase...");
    await saveAccountSignal(normalizedSignal);

    console.log("[Emett] Agent run complete for campaign:", campaignId);
  } catch (error) {
    console.error("[Emett] Agent run failed:", error);
  }
}
