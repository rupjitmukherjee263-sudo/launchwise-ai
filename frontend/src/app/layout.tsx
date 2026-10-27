import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchWise AI — Product Launch Intelligence Agent",
  description: "Evidence-based product launch feasibility, localized competitor intelligence, and deterministic financial modeling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
