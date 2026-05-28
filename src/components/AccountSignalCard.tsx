import type { AccountSignal } from "@/types";

interface AccountSignalCardProps {
  signal: AccountSignal;
}

export function AccountSignalCard({ signal }: AccountSignalCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{signal.companyName}</h3>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          {Math.round(signal.confidenceScore)}% confidence
        </span>
      </div>

      <p className="mb-2 text-sm font-medium text-slate-700">Intent Signal</p>
      <p className="mb-4 text-sm text-slate-600">{signal.intentSignal}</p>

      <p className="mb-2 text-sm font-medium text-slate-700">Drafted Email</p>
      <p className="whitespace-pre-wrap text-sm text-slate-600">{signal.draftedEmail}</p>
    </article>
  );
}
