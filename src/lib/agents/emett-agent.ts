import { saveAccountSignal } from "@/lib/firebase/firestore";

export async function runEmettAgent(
  campaignId: string,
  competitor: string,
  painPoints?: string
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 4000));

  const painSummary = painPoints?.trim() ? painPoints : "general negative feedback";
  const signalIntent = `Engineers at Acme Corp are actively discussing ${painSummary} in public threads while comparing against ${competitor}.`;

  try {
    await saveAccountSignal({
      campaignId,
      accountId: "acme-corp",
      companyName: "Acme Corp",
      intentSignal: signalIntent,
      sourceType: "Reddit",
      confidenceScore: 92,
      identifiedDecisionMakers: [
        {
          name: "Alice Smith",
          role: "VP Engineering",
          linkedInUrl: "https://www.linkedin.com/in/alice-smith-vpeng"
        }
      ],
      recommendedAction:
        "Lead with low-latency benchmarks and migration support to address cold start concerns.",
      draftedEmail:
        "Hi Alice,\n\nI noticed your team has been discussing cold start delays and pricing pressure. We help engineering teams reduce response latency by up to 40% without increasing infra costs. If useful, I can share a short teardown tailored to Acme Corp's current stack.\n\nBest,\nYour Name"
    });
  } catch (error) {
    console.error("Mock Emett agent failed to save account signal:", error);
  }
}
