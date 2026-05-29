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
        }),
        cache: "no-store"
      });

      if (!response.ok) throw new Error(`BrightData API Error: ${response.statusText}`);

      const data = await response.text();
      return data.substring(0, 8000);
    } catch (error) {
      console.error("search_web_signals failed:", error);
      return "SERP tool error: unable to fetch live search results.";
    }
  }
});

export const BrightDataCompanyEnrichmentTool = new DynamicTool({
  name: "enrich_target_company",
  description: "Use this to find the real name and role of a decision-maker at a target company.",
  func: async (input: string) => {
    const query = input.trim();

    try {
      const linkedInQuery = `site:linkedin.com/in "Engineering" OR "CTO" "${query}"`;
      const response = await fetch("https://api.brightdata.com/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BRIGHT_DATA_BEARER_TOKEN}`
        },
        body: JSON.stringify({
          zone: "serp_api2",
          url: `https://www.google.com/search?q=${encodeURIComponent(linkedInQuery)}`,
          format: "raw"
        }),
        cache: "no-store"
      });

      if (!response.ok) throw new Error(`BrightData API Error: ${response.statusText}`);

      const data = await response.text();
      return data.substring(0, 4000);
    } catch (error) {
      console.error("enrich_target_company failed:", error);
      return "Enrichment tool error: unable to fetch LinkedIn profile search results.";
    }
  }
});

export function getBrightDataTools() {
  return [BrightDataSERPTool, BrightDataCompanyEnrichmentTool];
}
