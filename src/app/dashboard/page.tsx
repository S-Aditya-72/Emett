import Link from "next/link";

import { getCampaigns } from "@/lib/firebase/firestore";
import { DeleteCampaignButton } from "../../components/DeleteCampaignButton";

export default async function DashboardPage() {
  const campaigns = await getCampaigns();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#0A2463]">Campaign Dashboard</h1>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center rounded-full bg-[#247BA0] px-4 py-2 text-sm font-medium text-white transition hover:brightness-105"
        >
          Create New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-[#605F5E] shadow-md">
          No campaigns found yet. Create your first campaign to get started.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition hover:shadow-lg"
            >
              <DeleteCampaignButton campaignId={campaign.id} />
              <Link href={`/dashboard/${campaign.id}`} className="block p-6">
                <h2 className="text-lg font-semibold text-[#0A2463]">{campaign.ourProduct}</h2>
                <p className="mt-1 text-sm text-[#605F5E]">vs {campaign.targetCompetitor}</p>
                <p className="mt-2 text-sm text-[#605F5E]">
                  {campaign.painPoints || "All negative feedback"}
                </p>
                <p className="mt-3 text-xs text-[#605F5E]">
                  Created: {new Date(campaign.createdAt).toLocaleString()}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
