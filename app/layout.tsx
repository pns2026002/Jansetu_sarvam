import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JANSETU AI — Multilingual Crisis-to-Action Command Centre",
  description:
    "Every voice becomes a signal. Every signal becomes an action. Next-generation crisis intelligence powered by Sarvam AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
