import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppSidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Signal Copilot",
    template: "%s · Signal Copilot",
  },
  description:
    "An AI-native workspace for trading research, market insights, and AWS-powered automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-neutral-100 text-neutral-900 antialiased`}
      >
        <TooltipProvider delayDuration={0}>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <TopNav />
              <main className="flex-1 overflow-hidden min-h-0">
                {children}
              </main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
