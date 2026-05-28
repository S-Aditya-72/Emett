"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { saveCampaign } from "@/lib/firebase/firestore";

export function CampaignForm() {
  const router = useRouter();
  const [targetCompetitor, setTargetCompetitor] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!targetCompetitor.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const campaignId = await saveCampaign({
        targetCompetitor: targetCompetitor.trim(),
        painPoints
      });
      router.push(`/dashboard/${campaignId}`);
    } catch (error) {
      console.error("Failed to submit campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="targetCompetitor" className="text-sm font-medium text-slate-700">
          Target Competitor
        </label>
        <input
          id="targetCompetitor"
          type="text"
          required
          value={targetCompetitor}
          onChange={(event) => setTargetCompetitor(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="e.g. Acme Analytics"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="painPoints" className="text-sm font-medium text-slate-700">
          Pain Points (Optional)
        </label>
        <input
          id="painPoints"
          type="text"
          value={painPoints}
          onChange={(event) => setPainPoints(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="e.g. Cold starts, pricing (Leave blank to find all negative feedback)"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Campaign"}
      </button>
    </form>
  );
}
