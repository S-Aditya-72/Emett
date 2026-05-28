"use client";

import type { AccountSignal } from "@/types";

interface AccountSignalCardProps {
  signal: AccountSignal;
}

export function AccountSignalCard({ signal }: AccountSignalCardProps) {
  const recipientEmail = "prospect@example.com";

  async function handleCopyAndOpenGmail() {
    const subject = encodeURIComponent(`Quick note for ${signal.companyName}`);
    const body = encodeURIComponent(signal.draftedEmail);

    try {
      await navigator.clipboard.writeText(signal.draftedEmail);
    } catch (error) {
      console.error("Failed to copy drafted email:", error);
    }

    window.open(`mailto:${recipientEmail}?subject=${subject}&body=${body}`, "_blank");
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{signal.companyName}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Source: {signal.sourceType}
          </p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {Math.round(signal.confidenceScore)}% confidence
        </span>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm font-medium text-slate-700">Intent Signal</p>
        <p className="text-sm text-slate-600">{signal.intentSignal}</p>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm font-medium text-slate-700">Decision Makers</p>
        {signal.identifiedDecisionMakers.length === 0 ? (
          <p className="text-sm text-slate-500">No decision-makers identified yet.</p>
        ) : (
          <ul className="space-y-1">
            {signal.identifiedDecisionMakers.map((maker) => (
              <li key={`${maker.name}-${maker.role}`} className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">{maker.name}</span> - {maker.role}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-5">
        <p className="mb-1 text-sm font-medium text-slate-700">Drafted Email</p>
        <p className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm text-slate-600">
          {signal.draftedEmail}
        </p>
      </div>

      <button
        type="button"
        onClick={handleCopyAndOpenGmail}
        className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Copy Draft & Open Gmail
      </button>
    </article>
  );
}
