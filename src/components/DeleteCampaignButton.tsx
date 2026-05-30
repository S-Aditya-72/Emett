"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteCampaign } from "@/lib/firebase/firestore";

export function DeleteCampaignButton({ campaignId }: { campaignId: string }) {
  const router = useRouter();

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this campaign? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCampaign(campaignId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-red-500"
      aria-label="Delete campaign"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  );
}
