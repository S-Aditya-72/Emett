import Link from "next/link";
import { Radar, User, Activity, ShieldCheck, Mail } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative mx-auto min-h-screen max-w-5xl px-6 pt-20 pb-12">
      <section className="relative z-10 mx-auto max-w-5xl rounded-3xl bg-transparent px-4 py-12 text-center sm:px-6">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex rounded-full bg-[#247BA0]/10 px-3 py-1 text-sm font-semibold text-[#247BA0]">
            Live web GTM intelligence
          </span>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-[#0A2463]">
            Turn public signals into verified GTM intelligence.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Emett monitors competitor mentions, developer complaints, and market movement to surface account-level buying intent before it appears in traditional tools.
          </p>
          <div className="mt-10">
            <Link
              href="/dashboard"
              className="inline-block rounded-2xl bg-[#0A2463] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0A2463]/90"
            >
              Start tracking signals
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 mt-12 px-0">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#247BA0]/10 text-[#247BA0]">
            <Radar className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-[#0A2463]">Hidden Intent Detection</h2>
          <p className="mt-3 text-[#605F5E]">
            Monitor public developer communities, competitor mentions, and market discussions to detect early signs of account-level pain.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#247BA0]/10 text-[#247BA0]">
            <User className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-[#0A2463]">Account Context Enrichment</h2>
          <p className="mt-3 text-[#605F5E]">
            Connect signals to company-level context, confidence scores, and recommended GTM actions without deanonymizing individuals.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#247BA0]/10 text-[#247BA0]">
            <Activity className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-[#0A2463]">Real-Time Signal Feed</h2>
          <p className="mt-3 text-[#605F5E]">
            Watch verified signals appear live as the agent searches, extracts, scores, and structures web intelligence.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#247BA0]/10 text-[#247BA0]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-[#0A2463]">Privacy-Safe Outreach Guidance</h2>
          <p className="mt-3 text-[#605F5E]">
            Generate account-level messaging angles and recommended next steps while avoiding creepy personal targeting.
          </p>
        </div>
      </section>
    </main>
  );
}
