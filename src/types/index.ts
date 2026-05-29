export interface Campaign {
  id: string;
  targetCompetitor: string;
  ourProduct: string;
  ourProductDescription: string;
  painPoints?: string;
  createdAt: string;
}

export interface DecisionMaker {
  name: string;
  role: string;
  linkedInUrl: string;
}

export interface AccountSignal {
  id: string;
  campaignId: string;
  accountId: string;
  companyName: string;
  competitorUsed?: string;
  intentSignal: string;
  sourceType: "Reddit" | "GitHub" | string;
  confidenceScore: number;
  identifiedDecisionMakers: DecisionMaker[];
  recommendedAction: string;
  draftedEmail: string;
  timestamp: string;
}
