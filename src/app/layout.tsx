import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
