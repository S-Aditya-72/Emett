import Link from "next/link";

import { CampaignForm } from "@/components/CampaignForm";

export default function NewCampaignPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Create New Campaign</h1>
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
      <CampaignForm />
    </main>
  );
}
