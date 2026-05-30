"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { saveCampaign } from "@/lib/firebase/firestore";

export function CampaignForm() {
  const router = useRouter();
  const [ourProduct, setOurProduct] = useState("");
  const [ourProductDescription, setOurProductDescription] = useState("");
  const [targetCompetitor, setTargetCompetitor] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ourProduct.trim() || !ourProductDescription.trim() || !targetCompetitor.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const campaignId = await saveCampaign({
        ourProduct: ourProduct.trim(),
        ourProductDescription: ourProductDescription.trim(),
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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="ourProduct" className="text-sm font-medium text-slate-700">
            Our Product
          </label>
          <input
            id="ourProduct"
            type="text"
            required
            value={ourProduct}
            onChange={(event) => setOurProduct(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#247BA0] focus:ring-2 focus:ring-[#247BA0]/20"
            placeholder="e.g., Cloudflare Workers"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="ourProductDescription" className="text-sm font-medium text-slate-700">
            Product Description
          </label>
          <textarea
            id="ourProductDescription"
            required
            rows={3}
            value={ourProductDescription}
            onChange={(event) => setOurProductDescription(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#247BA0] focus:ring-2 focus:ring-[#247BA0]/20"
            placeholder="e.g., Zero cold starts, global edge network, predictable flat-rate pricing."
          />
        </div>

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
            className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#247BA0] focus:ring-2 focus:ring-[#247BA0]/20"
            placeholder="e.g. Vercel"
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
            className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#247BA0] focus:ring-2 focus:ring-[#247BA0]/20"
            placeholder="e.g. Cold starts, pricing (Leave blank to find all negative feedback)"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center rounded-full bg-[#247BA0] px-6 py-2.5 text-sm font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Campaign"}
      </button>
    </form>
  );
}
