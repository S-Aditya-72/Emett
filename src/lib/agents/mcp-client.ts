import { DynamicTool } from "@langchain/core/tools";

if (!process.env.BRIGHT_DATA_BEARER_TOKEN) {
  console.warn("BRIGHT_DATA_BEARER_TOKEN is missing. search_web_signals may fail until configured.");
}

export const BrightDataSERPTool = new DynamicTool({
  name: "search_web_signals",
  description:
    "Search Google for complaints or frustration regarding a competitor. Input should be a search query like 'site:reddit.com Vercel cold starts'.",
  func: async (input: string) => {
    const query = input.trim();

    try {
      const response = await fetch("https://api.brightdata.com/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BRIGHT_DATA_BEARER_TOKEN}`
        },
        body: JSON.stringify({
          zone: "serp_api2",
          url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
          format: "raw"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("search_web_signals Bright Data API error:", response.status, errorText);
        return `SERP tool error: Bright Data request failed with status ${response.status}.`;
      }

      const data = await response.text();
      return data;
    } catch (error) {
      console.error("search_web_signals failed:", error);
      return "SERP tool error: unable to fetch live search results.";
    }
  }
});

export function getBrightDataTools() {
  return [BrightDataSERPTool];
}
