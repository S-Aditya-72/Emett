import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Emett</h1>
      <p className="text-slate-600">
        B2B AI Intelligence workspace for campaign signal discovery.
      </p>
      <Link href="/dashboard" className="text-blue-600 underline">
        Open Dashboard
      </Link>
    </main>
  );
}
