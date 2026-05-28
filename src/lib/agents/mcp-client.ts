import { DynamicTool } from "@langchain/core/tools";

const hasBrightDataApiKey = Boolean(process.env.BRIGHT_DATA_API_KEY);
const hasWebUnlockerUrl = Boolean(process.env.BRIGHT_DATA_WEB_UNLOCKER_URL);

if (!hasBrightDataApiKey) {
  console.warn("BRIGHT_DATA_API_KEY is missing. Bright Data SERP tool will return mocked results.");
}

if (!hasWebUnlockerUrl) {
  console.warn("BRIGHT_DATA_WEB_UNLOCKER_URL is missing. Web Unlocker tool will return mocked results.");
}

export const BrightDataSERPTool = new DynamicTool({
  name: "bright_data_serp_search",
  description:
    "Use this to search the web (like Google or Reddit) for recent complaints or discussions about a specific competitor.",
  func: async (input: string) => {
    try {
      // TODO: Replace mock with a real HTTP POST call to Bright Data's SERP API endpoint.
      // Suggested flow:
      // 1) Build request payload from `input` (query text, locale, search engine params).
      // 2) Send POST with Authorization header using process.env.BRIGHT_DATA_API_KEY.
      // 3) Parse response and return concise snippets (title, URL, extracted complaint text).
      // 4) Normalize output for downstream agent prompts.
      void input;
      return "Mock SERP Result: Found a Reddit thread complaining about Vercel's cold starts.";
    } catch (error) {
      console.error("BrightDataSERPTool failed:", error);
      return "SERP tool error: unable to fetch live search results.";
    }
  }
});

export const BrightDataWebUnlockerTool = new DynamicTool({
  name: "bright_data_web_unlocker",
  description:
    "Use this to bypass bot protections and read the text content of a specific URL found via the SERP tool.",
  func: async (input: string) => {
    try {
      // TODO: Replace mock with a real fetch routed through Bright Data Web Unlocker.
      // Suggested flow:
      // 1) Read target URL from `input`.
      // 2) Route request through process.env.BRIGHT_DATA_WEB_UNLOCKER_URL as proxy/gateway.
      // 3) Include Bright Data auth token from process.env.BRIGHT_DATA_API_KEY if required.
      // 4) Extract meaningful page text (problem statements, user quotes, product mentions).
      // 5) Return cleaned text for LLM summarization.
      void input;
      return "Mock Web Unlocker Result: Extracted complaint details from a protected forum page.";
    } catch (error) {
      console.error("BrightDataWebUnlockerTool failed:", error);
      return "Web Unlocker tool error: unable to fetch protected page content.";
    }
  }
});

export function getBrightDataTools() {
  return [BrightDataSERPTool, BrightDataWebUnlockerTool];
}
