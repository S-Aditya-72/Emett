import type { AccountSignal, Campaign } from "@/types";

export async function saveCampaign(campaign: Campaign): Promise<void> {
  void campaign;
}

export async function getCampaigns(): Promise<Campaign[]> {
  return [];
}

export async function saveAccountSignal(signal: AccountSignal): Promise<void> {
  void signal;
}

export function subscribeToCampaignSignals(
  campaignId: string,
  callback: (signals: AccountSignal[]) => void
): () => void {
  void campaignId;
  void callback;

  return () => {
    // no-op unsubscribe placeholder
  };
}
