import Link from "next/link";

import { getCampaigns } from "@/lib/firebase/firestore";

export default async function DashboardPage() {
  const campaigns = await getCampaigns();

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Campaign Dashboard</h1>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Create New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
          No campaigns found yet. Create your first campaign to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/${campaign.id}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <h2 className="text-lg font-semibold text-slate-900">{campaign.targetCompetitor}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {campaign.painPoints || "All negative feedback"}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Created: {new Date(campaign.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
