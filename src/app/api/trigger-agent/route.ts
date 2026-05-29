export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { runEmettAgent } from "@/lib/agents/emett-agent";

interface TriggerAgentRequest {
  campaignId: string;
  competitor: string;
  painPoints?: string;
  ourProduct: string;
  ourProductDescription: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as TriggerAgentRequest;
  const { campaignId, competitor, painPoints, ourProduct, ourProductDescription } = body;

  void runEmettAgent(campaignId, competitor, painPoints, ourProduct, ourProductDescription);

  return NextResponse.json({ success: true });
}
