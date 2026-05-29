"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { AccountSignalCard } from "@/components/AccountSignalCard";
import { subscribeToCampaignSignals } from "@/lib/firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { AccountSignal } from "@/types";

interface CampaignDetailsPageProps {
  params: {
    campaignId: string;
  };
}

export default function CampaignDetailsPage({ params }: CampaignDetailsPageProps) {
  const [signals, setSignals] = useState<AccountSignal[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [targetCompetitor, setTargetCompetitor] = useState("");
  const [ourProduct, setOurProduct] = useState("");
  const [ourProductDescription, setOurProductDescription] = useState("");
  const [painPoints, setPainPoints] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToCampaignSignals(params.campaignId, (nextSignals) => {
      setSignals(nextSignals);
    });

    return unsubscribe;
  }, [params.campaignId]);

  useEffect(() => {
    async function loadCampaignContext() {
      try {
        const campaignRef = doc(db, "campaigns", params.campaignId);
        const snapshot = await getDoc(campaignRef);
        const data = snapshot.data() as {
          targetCompetitor?: string;
          ourProduct?: string;
          ourProductDescription?: string;
          painPoints?: string;
        } | undefined;
        setTargetCompetitor(data?.targetCompetitor ?? "");
        setOurProduct(data?.ourProduct ?? "");
        setOurProductDescription(data?.ourProductDescription ?? "");
        setPainPoints(data?.painPoints ?? "");
      } catch (error) {
        console.error("Failed to load campaign details:", error);
      }
    }

    void loadCampaignContext();
  }, [params.campaignId]);

  async function handleRunAgent() {
    setIsAgentRunning(true);

    try {
      await fetch("/api/trigger-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          campaignId: params.campaignId,
          competitor: targetCompetitor,
          painPoints,
          ourProduct,
          ourProductDescription
        })
      });
    } catch (error) {
      console.error("Failed to trigger Emett agent:", error);
      setIsAgentRunning(false);
      return;
    }

    window.setTimeout(() => {
      setIsAgentRunning(false);
    }, 4500);
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Campaign Intelligence Feed</h1>
          <p className="mt-1 text-sm text-slate-600">Campaign ID: {params.campaignId}</p>
        </div>
        <button
          type="button"
          onClick={handleRunAgent}
          disabled={isAgentRunning}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAgentRunning ? "Running..." : "Run Emett Agent"}
        </button>
      </div>

      {isAgentRunning ? (
        <p className="animate-pulse text-sm font-medium text-blue-700">
          Emett is scanning signals and generating GTM intelligence...
        </p>
      ) : null}

      {signals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          No account signals yet. Trigger the Emett agent to populate this feed.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {signals.map((signal) => (
            <AccountSignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </main>
  );
}
