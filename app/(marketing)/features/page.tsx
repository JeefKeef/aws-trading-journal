"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Target,
  Zap,
  BarChart3,
  LineChart,
  Brain,
  FileText,
  Shield,
  Bell,
} from "lucide-react";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Every trade, setup, and session visualized automatically.",
      details: [
        "Win rate, profit factor, expectancy, and drawdown tracked in real time",
        "Segment performance by market, strategy, time of day, or custom tags",
        "Overlay equity curves with benchmarks to spot regime shifts instantly",
        "Export-ready insights for monthly reviews and accountability partners",
      ],
      gradient: "from-emerald-500 to-emerald-700",
    },
    {
      icon: FileText,
      title: "Guided Trade Journaling",
      description: "Capture context in seconds with structured, repeatable templates.",
      details: [
        "Smart entry forms that adapt to the instrument and strategy you trade",
        "Tag trades, emotions, mistakes, and playbook setups for powerful filtering",
        "Attach screenshots, voice notes, and broker confirmations in one click",
        "Auto-generated session summaries keep your review cadence consistent",
      ],
      gradient: "from-sky-500 to-blue-600",
    },
    {
      icon: Brain,
      title: "AI Trade Coach",
      description: "Your personal LLM mentor trained on your own trading data.",
      details: [
        "Ask why performance slipped, which setups are bleeding, or what to focus on next",
        "Let the AI surface habit drift, sizing mistakes, and risk leaks automatically",
        "Generate trade recaps, accountability emails, or journal prompts in natural language",
        "Use conversational queries instead of spreadsheets to find answers fast",
      ],
      gradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: MessageSquare,
      title: "Session & Recap Builder",
      description: "Turn chaotic trading days into concise, actionable reviews.",
      details: [
        "Automatically pull in your top wins, lessons, and emotional markers",
        "Generate morning prep notes and evening recaps with one prompt",
        "Share polished recaps with coaches, teams, or accountability partners",
        "Build a searchable archive of aha moments and mindset breakthroughs",
      ],
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Shield,
      title: "Risk Discipline",
      description: "Define rules, monitor adherence, and prevent account blowups.",
      details: [
        "Pre-trade checklists ensure every entry matches your playbook criteria",
        "Risk dashboards highlight variance from max loss, R multiples, and tilt days",
        "Automated guardrails alert you when you break daily limits or revenge trade",
        "Store operating procedures so your future self never guesses on the fly",
      ],
      gradient: "from-rose-500 to-red-600",
    },
    {
      icon: Target,
      title: "Goal Tracking & Playbooks",
      description: "Design the trader you want to become and measure real progress.",
      details: [
        "Set quarterly focus areas and tie them to measurable behavior metrics",
        "Track discipline scores, execution quality, and adherence to trade criteria",
        "Build playbooks for each setup with examples, rules, and ideal market conditions",
        "Use AI to suggest next best actions based on your current edge profile",
      ],
      gradient: "from-neutral-900 to-neutral-600",
    },
  ];

  const additionalFeatures = [
    {
      icon: LineChart,
      title: "Heatmaps & Trendlines",
      description: "Visualize performance trends by weekday, market regime, or emotion.",
    },
    {
      icon: Zap,
      title: "Instant Imports",
      description: "Bring in trades from brokers, spreadsheets, or CSVs without friction.",
    },
    {
      icon: Bell,
      title: "Review Cadence Reminders",
      description: "Stay disciplined with automated nudges for daily and weekly reviews.",
    },
    {
      icon: MessageSquare,
      title: "Shared Journals",
      description: "Invite coaches or trading partners to leave comments and feedback.",
    },
    {
      icon: FileText,
      title: "Playbook Library",
      description: "Organize strategies, criteria, and best examples for instant reference.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade encryption and audit logs keep every note protected.",
    },
  ];

  return (
    <div className="bg-background text-foreground">

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm font-medium dark:border-neutral-700/60 dark:bg-neutral-900/70 dark:text-neutral-200"
          >
            <Sparkles className="h-4 w-4" />
            Everything you need to journal like a pro
          </motion.div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Features built for
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-300 dark:to-purple-400">
              consistent traders
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Signal combines a disciplined trade journal, institutional-grade analytics, and an AI coach so you always know exactly what to improve next.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/chat"
              className="group inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-8 py-4 text-lg font-semibold text-background transition hover:bg-background hover:text-foreground"
            >
              Start Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border-2 px-8 py-4 text-lg font-semibold transition hover:bg-muted dark:hover:bg-neutral-900"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Main Features - Detailed */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-32">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid gap-12 lg:grid-cols-2 items-center"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h2 className="mb-4 text-4xl font-bold">{feature.title}</h2>
                  <p className="mb-6 text-xl text-muted-foreground">{feature.description}</p>
                  
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    href="/chat"
                    className="mt-8 inline-flex items-center gap-2 text-foreground font-semibold hover:gap-3 transition-all"
                  >
                    Try it now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                
                <div className={`relative rounded-2xl border-2 bg-gradient-to-br ${feature.gradient} p-1 ${index % 2 === 1 ? "lg:order-1" : ""} dark:border-neutral-800`}>
                  <div className="flex min-h-[400px] items-center justify-center rounded-xl bg-white p-8 dark:bg-neutral-950">
                    <div className="text-center">
                      <feature.icon className="mx-auto mb-4 h-24 w-24 text-muted-foreground/20 dark:text-neutral-600" />
                      <p className="text-sm font-medium text-muted-foreground">[Feature Demo]</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="bg-muted/30 px-6 py-20 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-foreground">More ways Signal keeps you accountable</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need in one powerful platform
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group rounded-2xl border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-colors group-hover:border-foreground dark:border-neutral-700">
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-foreground">Fits into your workflow</h2>
            <p className="mb-12 text-xl text-muted-foreground">
              Import executions, share notes, and automate reviews with the platforms you already use.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {[
                "TradingView",
                "ThinkOrSwim",
                "Interactive Brokers",
                "Tradovate",
                "Discord",
                "Notion",
                "Slack",
                "Zapier",
              ].map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center rounded-xl border-2 bg-muted/50 p-6 transition-colors hover:bg-muted dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:bg-neutral-900"
                >
                  <span className="font-semibold text-sm">{integration}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-muted/30 px-6 py-20 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
              Why traders choose Signal over spreadsheets
            </h2>
            
            <div className="overflow-hidden rounded-2xl border-2 bg-white dark:border-neutral-800 dark:bg-neutral-950">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-border dark:border-neutral-800">
                    <th className="py-4 px-6 font-semibold">Feature</th>
                    <th className="bg-foreground py-4 px-4 text-center font-semibold text-background">Signal</th>
                    <th className="py-4 px-4 text-center font-semibold text-muted-foreground">Traditional Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Automatic performance analytics", us: true, them: "Manual spreadsheets" },
                    { feature: "AI coaching on your trades", us: true, them: false },
                    { feature: "Guided journaling templates", us: true, them: "DIY" },
                    { feature: "Emotion & discipline tracking", us: true, them: false },
                    { feature: "Risk limit guardrails", us: true, them: false },
                    { feature: "Accountability-ready recaps", us: true, them: "Manual" },
                    { feature: "Setup-level scorecards", us: true, them: "Limited" },
                    { feature: "Collaboration with coaches", us: true, them: "Email threads" },
                  ].map((row, index) => (
                    <tr key={index} className="border-t border-border dark:border-neutral-800">
                      <td className="py-4 px-6 font-medium text-foreground">{row.feature}</td>
                      <td className="bg-green-50 py-4 px-4 text-center dark:bg-green-500/20">
                        {typeof row.us === "boolean" ? (
                          row.us ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs text-white dark:bg-green-400 dark:text-neutral-900">
                              ✓
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="font-semibold text-green-700 dark:text-green-300">{row.us}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.them === "boolean" ? (
                          row.them ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs text-white dark:bg-gray-400 dark:text-neutral-900">
                              ✓
                            </span>
                          ) : (
                            <span className="text-muted-foreground">✗</span>
                          )
                        ) : (
                          <span className="text-muted-foreground">{row.them}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-5xl font-bold text-foreground">Ready to run a professional trading journal?</h2>
            <p className="mb-10 text-xl text-muted-foreground">
              Join thousands of disciplined traders who review faster, learn faster, and compound faster with Signal.
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <Link
                href="/chat"
                className="group inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-8 py-4 text-lg font-semibold text-background transition hover:bg-background hover:text-foreground"
              >
                Start Free - No Credit Card
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <p className="text-sm text-muted-foreground">
                ✓ Free forever plan &nbsp;•&nbsp; ✓ Cancel anytime &nbsp;•&nbsp; ✓ Setup in 2 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
