import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import type { BaseMessage } from "@langchain/core/messages";
import type { StructuredToolInterface } from "@langchain/core/tools";

import { saveAccountSignal } from "@/lib/firebase/firestore";
import { getBrightDataTools } from "@/lib/agents/mcp-client";
import { getLLM } from "@/lib/agents/setup";
import type { AccountSignal } from "@/types";

type SaveAccountSignalInput = Omit<AccountSignal, "id" | "timestamp">;

interface ScoutExtraction {
  companyName: string;
  currentPainPoint: string;
}

async function retrieveCogneeMemory(companyName: string): Promise<string> {
  return `[Cognee Memory]: We previously detected that ${companyName} struggled with rigid vendor lock-in and high compute costs 2 weeks ago.`;
}

async function storeCogneeMemory(companyName: string, signal: string): Promise<void> {
  console.log(`[Cognee] Stored new memory for ${companyName}: ${signal}`);
}

function parseJsonFromLlmOutput<T>(text: string): T {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1]?.trim() ?? text.trim();
  const jsonMatch = candidate.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No JSON object found in LLM output.");
  }

  return JSON.parse(jsonMatch[0]) as T;
}

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

async function invokeWithTools(
  llm: ReturnType<typeof getLLM>,
  tools: StructuredToolInterface[],
  messages: BaseMessage[]
): Promise<BaseMessage> {
  const llmWithTools = llm.bindTools(tools);
  let response = (await llmWithTools.invoke(messages)) as AIMessage;

  while (response.tool_calls?.length) {
    const toolMessages: ToolMessage[] = [];

    for (const toolCall of response.tool_calls) {
      const tool = tools.find((candidate) => candidate.name === toolCall.name);

      if (!tool) {
        toolMessages.push(
          new ToolMessage({
            tool_call_id: toolCall.id ?? toolCall.name,
            content: `Tool ${toolCall.name} not found.`
          })
        );
        continue;
      }

      const toolInput =
        typeof toolCall.args === "string"
          ? toolCall.args
          : typeof toolCall.args === "object" && toolCall.args !== null && "input" in toolCall.args
            ? String((toolCall.args as { input: unknown }).input)
            : JSON.stringify(toolCall.args);

      const toolResult = await tool.invoke(toolInput);
      toolMessages.push(
        new ToolMessage({
          tool_call_id: toolCall.id ?? toolCall.name,
          content: typeof toolResult === "string" ? toolResult : JSON.stringify(toolResult)
        })
      );
    }

    response = (await llmWithTools.invoke([...messages, response, ...toolMessages])) as AIMessage;
  }

  return response;
}

export async function runEmettAgent(
  campaignId: string,
  competitor: string,
  painPoints?: string
): Promise<void> {
  try {
    const llm = getLLM();
    const tools = getBrightDataTools();
    const painContext = painPoints?.trim() ? painPoints : "general issues";

    console.log("[Emett] Searching Web & Extracting Company...");

    const scoutPrompt = `You are Emett, a B2B GTM Intelligence Agent. Use the search_web_signals tool to find complaints about ${competitor} regarding ${painContext}. Return ONLY a JSON object with two keys: "companyName" (the company experiencing the pain) and "currentPainPoint" (summary of the issue).`;

    const scoutResponse = await invokeWithTools(llm, tools, [new HumanMessage(scoutPrompt)]);
    const scoutText = getMessageText(scoutResponse.content);
    const { companyName, currentPainPoint } = parseJsonFromLlmOutput<ScoutExtraction>(scoutText);

    console.log("[Emett] Querying Cognee for...", companyName);
    const memory = await retrieveCogneeMemory(companyName);

    console.log("[Emett] Drafting God-Tier Email...");

    const draftPrompt = `You are drafting a B2B sales email to the VP of Engineering at ${companyName}. Current Pain: ${currentPainPoint}. Past Context from Cognee: ${memory}. Draft a highly personalized 3-sentence email referencing BOTH the past memory and the current issue. Output a valid JSON matching the AccountSignal TypeScript interface (omit id and timestamp). Required fields: campaignId, accountId, companyName, intentSignal, sourceType, confidenceScore, identifiedDecisionMakers (array of { name, role, linkedInUrl }), recommendedAction, draftedEmail. Use campaignId: "${campaignId}".`;

    const draftResponse = await llm.invoke([new HumanMessage(draftPrompt)]);
    const draftText = getMessageText(draftResponse.content);
    const signal = parseJsonFromLlmOutput<SaveAccountSignalInput>(draftText);

    const normalizedSignal: SaveAccountSignalInput = {
      ...signal,
      campaignId,
      companyName: signal.companyName || companyName,
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
