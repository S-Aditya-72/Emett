"use client";

import type { AccountSignal } from "@/types";
import { deleteAccountSignal } from "@/lib/firebase/firestore";
import { X } from "lucide-react";

interface AccountSignalCardProps {
  signal: AccountSignal;
}

export function AccountSignalCard({ signal }: AccountSignalCardProps) {
  const recipientEmail = signal.prospectEmail?.trim() ?? "";

  async function handleDeleteSignal() {
    try {
      await deleteAccountSignal(signal.id);
    } catch (error) {
      console.error("Failed to delete account signal:", error);
    }
  }

  async function handleCopyAndOpenGmail() {
    const subject = encodeURIComponent(`Quick note for ${signal.companyName}`);
    const body = encodeURIComponent(signal.draftedEmail);

    try {
      await navigator.clipboard.writeText(signal.draftedEmail);
    } catch (error) {
      console.error("Failed to copy drafted email:", error);
    }

    const mailto = recipientEmail
      ? `mailto:${recipientEmail}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`;

    window.open(mailto, "_blank");
  }

  return (
    <article className="relative bg-white rounded-3xl p-6 shadow-lg border-l-4 border-[#247BA0]">
      <button
        type="button"
        onClick={handleDeleteSignal}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-red-500"
        aria-label="Delete signal"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#0A2463]">{signal.companyName}</h2>
          <span className="mt-2 inline-flex items-center rounded-full bg-[#247BA0]/10 px-2.5 py-1 text-xs font-medium text-[#247BA0]">
            Current Stack: {signal.competitorUsed || "Unknown"}
          </span>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[#605F5E]">Source: {signal.sourceType}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm font-medium text-[#605F5E]">Intent Signal</p>
        <p className="text-sm leading-relaxed text-[#605F5E]">{signal.intentSignal}</p>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-[#605F5E]">Decision Makers</p>
        {signal.identifiedDecisionMakers.length === 0 ? (
          <p className="text-sm text-[#605F5E]">No decision-makers identified yet.</p>
        ) : (
          <ul className="space-y-2">
            {signal.identifiedDecisionMakers.map((maker) => (
              <li key={`${maker.name}-${maker.role}`} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-[#0A2463]">{maker.name}</span>
                  <span className="text-slate-400">—</span>
                  <span className="text-sm text-[#605F5E]">{maker.role}</span>
                </div>
                {recipientEmail ? <p className="mt-1 text-xs text-[#247BA0]">{recipientEmail}</p> : null}
              </li>
            ))}
          </ul>
        )}
        {signal.identifiedDecisionMakers.length === 0 && recipientEmail ? (
          <p className="mt-2 text-xs text-[#247BA0]">{recipientEmail}</p>
        ) : null}
      </div>

      <div className="mb-5">
        <p className="mb-1 text-sm font-medium text-[#605F5E]">Drafted Email</p>
        <p className="whitespace-pre-wrap rounded-2xl bg-[#e2e2e2]/50 p-4 text-sm leading-relaxed text-[#605F5E]">
          {signal.draftedEmail}
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopyAndOpenGmail}
        className="inline-flex w-full items-center justify-center rounded-full bg-[#247BA0] px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-105"
      >
        Email
      </button>
    </article>
  );
}
