import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emett",
  description: "B2B AI Intelligence platform"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-[#e2e2e2] ${inter.className}`}>
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
            <Link href="/">
              <img src="/logo.png" alt="Emett Logo" className="h-8" />
            </Link>
            <nav>
              <a href="/dashboard" className="text-[#0A2463] font-medium">
                Dashboard
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
