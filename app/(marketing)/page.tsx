"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Zap, Target, Users, Twitter, Youtube } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">TraderCloud</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-muted-foreground transition hover:text-foreground">
              Pricing
            </Link>
            <Link href="/affiliate" className="text-sm text-muted-foreground transition hover:text-foreground">
              Affiliate
            </Link>
            <Link
              href="/chat"
              className="rounded-lg border-2 border-foreground px-4 py-2 text-sm font-semibold transition hover:bg-foreground hover:text-background"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-7xl px-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm"
            >
              <Sparkles className="h-4 w-4" />
              The AI Trading Terminal for Serious Traders
            </motion.div>
            
            <h1 className="mb-6 text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              Trade Smarter.
              <br />
              Not Harder.
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
              The world&apos;s first AI trading terminal that finds setups, explains them, and backtests instantly.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-8 py-4 text-lg font-semibold text-background transition hover:bg-background hover:text-foreground"
              >
                Start Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg border-2 px-8 py-4 text-lg font-semibold transition hover:bg-muted"
              >
                See Pricing
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Simple Feature Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Your trading edge, powered by AI</h2>
            <p className="text-lg text-muted-foreground">
              Institutional-grade tools that anyone can use
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Chat to Screen",
                description: "Ask AI for filters → live table populates instantly",
                icon: Sparkles,
              },
              {
                title: "Explainable Ideas",
                description: "GPT-4o rationale with every pick",
                icon: Target,
              },
              {
                title: "Instant Backtests",
                description: "Daily PnL chart in seconds",
                icon: TrendingUp,
              },
              {
                title: "Realtime Alerts",
                description: "Email/Discord/Webhook triggers",
                icon: Zap,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border bg-muted/50 p-8"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border-2">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-5xl font-bold">Your edge starts here.</h2>
            <p className="mb-10 text-xl text-muted-foreground">
              Join thousands of traders already powered by AI.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-8 py-4 text-lg font-semibold text-background transition hover:bg-background hover:text-foreground"
            >
              Start Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">TraderCloud</span>
            </Link>
            
            <p className="text-sm text-muted-foreground">
              Made for traders, by traders. © 2025 TraderCloud
            </p>
            
            <div className="flex items-center gap-4">
              <Link href="https://twitter.com/TraderCloudAI" className="text-muted-foreground transition hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com/@TraderCloudAI" className="text-muted-foreground transition hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="https://discord.gg/tradercloud" className="text-muted-foreground transition hover:text-foreground">
                <Users className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
