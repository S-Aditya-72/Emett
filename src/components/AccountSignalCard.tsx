"use client";

import type { AccountSignal } from "@/types";

interface AccountSignalCardProps {
  signal: AccountSignal;
}

export function AccountSignalCard({ signal }: AccountSignalCardProps) {
  const recipientEmail = signal.prospectEmail?.trim() ?? "";

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
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">{signal.companyName}</h2>
          <span className="mt-2 inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
            Current Stack: {signal.competitorUsed || "Unknown"}
          </span>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Source: {signal.sourceType}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {Math.round(signal.confidenceScore)}% confidence
        </span>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm font-medium text-slate-700">Intent Signal</p>
        <p className="text-sm leading-relaxed text-slate-600">{signal.intentSignal}</p>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Decision Makers</p>
        {signal.identifiedDecisionMakers.length === 0 ? (
          <p className="text-sm text-slate-500">No decision-makers identified yet.</p>
        ) : (
          <ul className="space-y-2">
            {signal.identifiedDecisionMakers.map((maker) => (
              <li
                key={`${maker.name}-${maker.role}`}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">{maker.name}</span>
                  <span className="text-slate-400">—</span>
                  <span className="text-sm text-slate-600">{maker.role}</span>
                </div>
                {recipientEmail ? (
                  <p className="mt-1 text-xs text-blue-700">{recipientEmail}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {signal.identifiedDecisionMakers.length === 0 && recipientEmail ? (
          <p className="mt-2 text-xs text-blue-700">{recipientEmail}</p>
        ) : null}
      </div>

      <div className="mb-5">
        <p className="mb-1 text-sm font-medium text-slate-700">Drafted Email</p>
        <p className="whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          {signal.draftedEmail}
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopyAndOpenGmail}
        className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Copy Draft & Open Gmail
      </button>
    </article>
  );
}
