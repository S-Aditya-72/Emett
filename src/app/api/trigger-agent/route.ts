import { NextResponse } from "next/server";

import { runEmettAgent } from "@/lib/agents/emett-agent";

interface TriggerAgentRequest {
  campaignId: string;
  competitor: string;
  painPoints: string[];
}

export async function POST(request: Request) {
  const body = (await request.json()) as TriggerAgentRequest;
  const { campaignId, competitor, painPoints } = body;

  void runEmettAgent(campaignId, competitor, painPoints);

  return NextResponse.json(
    {
      success: true,
      message: "Emett agent trigger acknowledged.",
      campaignId
    },
    { status: 200 }
  );
}
