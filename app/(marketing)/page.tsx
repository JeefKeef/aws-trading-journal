"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Zap, Target, Users, Twitter, Youtube, Star, CheckCircle2, Play } from "lucide-react";

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

      {/* Hero Section - High Converting */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-7xl"
        >
          <div className="text-center">
            {/* Social Proof Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-green-50 px-4 py-2 text-sm font-medium text-green-700"
            >
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-600" />
                <div className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-green-500 to-teal-600" />
                <div className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-orange-500 to-red-600" />
              </div>
              Trusted by 10,000+ active traders
            </motion.div>
            
            {/* Main Headline - Problem + Solution */}
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Stop Losing Money to
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bad Trading Decisions</span>
            </h1>
            
            {/* Clear Value Prop */}
            <p className="mx-auto mb-4 max-w-2xl text-xl text-gray-600">
              AI that finds high-probability setups, explains exactly why they work, and backtests them in seconds.
            </p>
            
            {/* Results-Focused Sub-headline */}
            <p className="mx-auto mb-10 max-w-xl text-base font-semibold text-foreground">
              ✅ No more guessing &nbsp;•&nbsp; ✅ No more FOMO &nbsp;•&nbsp; ✅ Just data-driven trades
            </p>
            
            {/* Strong CTA with Urgency */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-8 py-4 text-lg font-semibold text-background transition hover:bg-background hover:text-foreground"
              >
                Start Free - No Credit Card
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-lg border-2 px-8 py-4 text-lg font-semibold transition hover:bg-muted">
                <Play className="h-5 w-5" />
                Watch 60s Demo
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof - Critical for Conversion */}
      <section className="py-12 px-6 border-y bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Traders</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50M+</div>
              <div className="text-sm text-muted-foreground">Backtests Run</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">4.9/5 from 2,500+ reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution (Story-driven) */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl font-bold">The Problem Every Trader Faces</h2>
            <p className="text-lg text-muted-foreground">
              You&apos;re drowning in data but starving for actionable insights
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            {[
              "Spend hours scanning charts manually",
              "Miss profitable setups while you sleep",
              "Can't backtest ideas fast enough",
              "No clue if your strategy actually works",
            ].map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-lg border bg-red-50"
              >
                <div className="text-2xl">❌</div>
                <div>
                  <p className="font-medium text-foreground">{problem}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 text-3xl font-bold">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-foreground" />
              <span>TraderCloud Fixes This</span>
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Features as Benefits (Not Technical Specs) */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">How It Actually Works</h2>
            <p className="text-lg text-muted-foreground">
              The same tools hedge funds use, now for everyone
            </p>
          </div>

          <div className="grid gap-12 lg:gap-20">
            {[
              {
                title: "Just Ask. AI Screens Thousands of Stocks Instantly.",
                description: "Type what you're looking for in plain English. 'Show me tech stocks with unusual volume near support' → boom, live results in 2 seconds.",
                benefit: "Save 5+ hours per day on manual screening",
                icon: Sparkles,
              },
              {
                title: "Every Pick Comes With An Explanation",
                description: "GPT-4o tells you exactly WHY each stock made the cut. No more guessing if a setup is legit or a trap.",
                benefit: "Trade with confidence, not FOMO",
                icon: Target,
              },
              {
                title: "Backtest Any Strategy in Under 10 Seconds",
                description: "Wonder if your strategy works? Test it on 10 years of data instantly. See the P&L chart, win rate, everything.",
                benefit: "Stop losing money on strategies that don't work",
                icon: TrendingUp,
              },
              {
                title: "Get Alerted the Second Opportunities Appear",
                description: "Email, Discord, webhook—however you want it. Your AI assistant watches the markets 24/7 so you don't have to.",
                benefit: "Never miss a trade setup again",
                icon: Zap,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="grid gap-8 lg:grid-cols-2 items-center"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-2 bg-white">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                  <p className="mb-4 text-muted-foreground text-lg">{feature.description}</p>
                  <div className="inline-flex items-start gap-2 rounded-lg bg-green-50 px-4 py-3 border border-green-200">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <span className="text-sm font-semibold text-green-700">{feature.benefit}</span>
                  </div>
                </div>
                <div className={`rounded-2xl border-2 bg-gradient-to-br p-8 min-h-[300px] flex items-center justify-center ${index % 2 === 1 ? "lg:order-1" : ""} ${index % 4 === 0 ? "from-blue-50 to-purple-50" : index % 4 === 1 ? "from-green-50 to-teal-50" : index % 4 === 2 ? "from-orange-50 to-red-50" : "from-violet-50 to-pink-50"}`}>
                  <div className="text-center text-muted-foreground font-medium">
                    [Demo Video/Screenshot]
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Overcome Objections */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-4xl font-bold">But Is This Actually For Me?</h2>
          
          <div className="space-y-6">
            {[
              {
                q: "I'm a beginner trader. Is this too complex?",
                a: "Nope. TraderCloud makes professional-grade analysis accessible to everyone. If you can type a question, you can use TraderCloud. Start with our free plan and upgrade when you're ready.",
              },
              {
                q: "I already use TradingView/ThinkOrSwim. Why switch?",
                a: "You don't have to switch! Most traders use TraderCloud alongside their existing tools. We're the AI layer that makes everything else 10x faster. Think of us as your AI trading assistant, not a replacement.",
              },
              {
                q: "Does this work for day trading AND swing trading?",
                a: "Yes! Our AI adapts to your style. Day traders love the real-time alerts. Swing traders love the multi-day backtests. Options traders love the flow analysis. It's built for all strategies.",
              },
              {
                q: "What if I hate it?",
                a: "Start with our forever-free plan. Zero risk. If you upgrade and it's not for you, cancel anytime. No questions asked. Plus we have a 7-day money-back guarantee on all paid plans.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border-2 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="mb-3 text-lg font-bold text-foreground">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Urgency + Scarcity */}
      <section className="py-20 px-6 bg-foreground text-background">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-4 py-2 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              347 traders joined in the last 24 hours
            </div>
            
            <h2 className="mb-6 text-5xl font-bold">Start Trading Smarter Today</h2>
            <p className="mb-10 text-xl opacity-90">
              Join 10,000+ traders who stopped guessing and started winning with AI.
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 rounded-lg border-2 border-background bg-background px-8 py-4 text-lg font-semibold text-foreground transition hover:bg-transparent hover:text-background"
              >
                Start Free Now - No Credit Card Required
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <p className="text-sm opacity-75">
                ✓ Free forever plan &nbsp;•&nbsp; ✓ Setup in 2 minutes &nbsp;•&nbsp; ✓ Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-white">
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
