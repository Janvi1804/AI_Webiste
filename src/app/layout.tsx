import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opervia AI — Intelligent business operations",
  description: "Run projects, customers, workflows, and decisions from one intelligent workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
