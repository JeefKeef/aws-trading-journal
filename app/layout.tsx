import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/contexts/auth-context";

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
    default: "Signal - AI Trading Terminal",
    template: "%s · Signal",
  },
  description:
    "The AI Trading Terminal for Serious Traders. Find setups, get explanations, and backtest instantly with institutional-grade tools.",
  keywords: [
    "trading",
    "AI trading",
    "trading terminal",
    "stock market",
    "forex",
    "crypto",
    "futures",
    "technical analysis",
    "trading signals",
    "price alerts",
    "market news",
  ],
  authors: [{ name: "Signal" }],
  creator: "Signal",
  publisher: "Signal",
  metadataBase: new URL("https://signal.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://signal.com",
    title: "Signal - AI Trading Terminal",
    description:
      "The AI Trading Terminal for Serious Traders. Find setups, get explanations, and backtest instantly with institutional-grade tools.",
    siteName: "Signal",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Signal - AI Trading Terminal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Signal - AI Trading Terminal",
    description:
      "The AI Trading Terminal for Serious Traders. Find setups, get explanations, and backtest instantly with institutional-grade tools.",
    images: ["/og-image.jpg"],
    creator: "@signal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TooltipProvider delayDuration={0}>
              {children}
            </TooltipProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
