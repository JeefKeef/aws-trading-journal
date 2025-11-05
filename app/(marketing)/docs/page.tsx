"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Clock,
  FileText,
  MessageSquare,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

const pillars = [
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "See expectancy, drawdown, win rate, and R-multiples evolve automatically as you log trades.",
  },
  {
    icon: FileText,
    title: "Guided Journaling",
    description:
      "Structured prompts, tags, and templates keep every trade aligned with your playbook.",
  },
  {
    icon: Brain,
    title: "AI Trade Coach",
    description:
      "Ask natural-language questions and let Signal surface the next best improvement to focus on.",
  },
];

const quickStartSteps = [
  {
    title: "Create Your Workspace",
    body:
      "Sign up, pick the assets you trade, and choose a starter template for your journal entries. Everything can be customized later.",
  },
  {
    title: "Import Recent Trades",
    body:
      "Drop in a CSV from your broker or record trades manually. Signal auto-tags direction, instrument, and basic metrics for you.",
  },
  {
    title: "Run Your First Review",
    body:
      "Open the Review tab to see top metrics, biggest leaks, and an AI-generated synopsis of how you performed.",
  },
];

const journalBuildingBlocks = [
  {
    title: "Smart Entry Forms",
    description:
      "Dynamic fields adapt to the instrument, timeframe, and strategy you select. Focus mode lets you log trades without distractions.",
  },
  {
    title: "Tags & Playbooks",
    description:
      "Attach setups, market conditions, emotions, or mistakes to every trade. Save views to compare performance across tags instantly.",
  },
  {
    title: "Attachments & Voice Notes",
    description:
      "Upload charts, broker statements, or drop a voice memo. Everything stays connected to the trade history and analytics.",
  },
];

const analyticsHighlights = [
  {
    title: "Edge Breakdown",
    points: [
      "Expectancy, payoff ratio, and win rate tracked by setup, market regime, and time of day.",
      "Equity curves overlaid with benchmarks so you can spot regime shifts early.",
      "Heatmaps that expose which weekdays, sessions, or account sizes bleed the most.",
    ],
  },
  {
    title: "Risk Discipline",
    points: [
      "Daily loss guardrails, max consecutive losses, and revenge trading alerts.",
      "Position sizing drift indicators highlight when you scale too fast or too slow.",
      "Variance analysis shows if you obeyed or broke your pre-trade checklist.",
    ],
  },
  {
    title: "Execution Quality",
    points: [
      "Measure slippage, partial exits, and add/remove behavior across trades.",
      "Track decision speed, confirmation bias, and emotional tags over time.",
      "Review scorecards to see how closely each trade matched the ideal playbook criteria.",
    ],
  },
];

const aiCoachCapabilities = [
  "Summarize the last 20 trades and highlight what improved or regressed.",
  "Explain why a specific setup’s expectancy collapsed in plain language.",
  "Draft accountability emails or weekly recaps you can send to coaches or trading partners.",
  "Generate bite-sized drills and review prompts tailored to the weaknesses it finds.",
];

const reviewCadence = [
  {
    label: "Daily",
    description:
      "Run the market close checklist, document emotions, and let Signal auto-generate a recap you can edit or send.",
  },
  {
    label: "Weekly",
    description:
      "Compare performance across setups, review notable screenshots, and update the focus area for the coming week.",
  },
  {
    label: "Monthly",
    description:
      "Use the analytics timeline to evaluate expectancy trends and update risk guardrails before the new month opens.",
  },
  {
    label: "Quarterly",
    description:
      "Export executive summaries for coaches, investors, or accountability partners with one click.",
  },
];

const collaborationHighlights = [
  {
    title: "Coach & Team Sharing",
    description:
      "Invite mentors or trading partners into read-only or comment-ready views of your journal. Threaded feedback keeps context tight.",
    icon: Users,
  },
  {
    title: "Permissions & Workspaces",
    description:
      "Segment journals by strategy or account. Grant granular permissions to analysts, risk managers, or performance coaches.",
    icon: Shield,
  },
  {
    title: "Automation Hooks",
    description:
      "Use webhooks and Zapier to push finished recaps into Notion, Slack, or Discord, or to trigger habit trackers and checklists.",
    icon: Zap,
  },
];

export default function DocsPage() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-16"
    >
      {/* Introduction */}
      <section id="introduction" data-section="introduction" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Welcome to Signal</h1>

        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Signal is the trading journal built for serious operators. It blends disciplined record keeping,
            performance analytics, and an AI coach so you always know where your edge is strongest—and where it is
            slipping.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border bg-muted/40 p-5">
                <pillar.icon className="mb-3 h-6 w-6 text-foreground" />
                <h3 className="mb-1 text-lg font-semibold">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-500/60 dark:bg-blue-500/10">
            <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-200">Why Signal works</h3>
            <p className="text-blue-800 dark:text-blue-200/80">
              Spreadsheets show outcomes. Signal tells you <strong>why</strong> they happened, what you should repeat,
              and what to cut. Your journal turns into a growth engine instead of an archive.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quick-start" data-section="quick-start" className="scroll-mt-20">
        <h2 className="mb-8 text-4xl font-bold tracking-tight">Quick start in three steps</h2>

        <div className="space-y-8">
          {quickStartSteps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border bg-muted/40 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background text-lg font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
              </div>
              <p className="text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border-2 border-green-200 bg-green-50 p-6 dark:border-green-500/60 dark:bg-green-500/10">
          <h3 className="mb-2 font-semibold text-green-900 dark:text-green-200">Done in under 10 minutes</h3>
          <p className="text-green-800 dark:text-green-200/80">
            Once your recent trades are in, Signal immediately surfaces your top setups, biggest drawdowns, and
            high-impact mistakes. The AI coach will already have enough context to give useful feedback.
          </p>
        </div>
      </section>

      {/* Journaling Essentials */}
      <section id="journaling" data-section="journaling" className="scroll-mt-20">
        <h2 className="mb-8 text-4xl font-bold tracking-tight">Journaling essentials</h2>

        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Journaling should improve your execution, not become another chore. Signal keeps entries consistent, rich,
            and easy to review.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {journalBuildingBlocks.map((block) => (
              <div key={block.title} className="rounded-2xl border bg-muted/40 p-6">
                <h3 className="mb-2 text-xl font-semibold">{block.title}</h3>
                <p className="text-sm text-muted-foreground">{block.description}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-muted/40 p-6">
            <h3 className="mb-3 text-xl font-semibold">Recommended prompts</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-foreground">Before the trade</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>What playbook setup is this? What makes it valid right now?</li>
                  <li>How does this trade align with the daily focus you committed to?</li>
                  <li>What needs to happen for this trade to be invalidated immediately?</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">After the trade</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>Did you follow your execution plan? Where did emotions take over?</li>
                  <li>Which tags best describe why the trade worked—or didn&apos;t?</li>
                  <li>What would you coach someone else to do differently next time?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Dashboards */}
      <section id="analytics" data-section="analytics" className="scroll-mt-20">
        <h2 className="mb-8 text-4xl font-bold tracking-tight">Analytics that actually drive change</h2>

        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Every chart in Signal is built to answer a coaching question: What should you double down on? What should
            you stop immediately? How disciplined were you, really?
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {analyticsHighlights.map((highlight) => (
              <div key={highlight.title} className="rounded-2xl border bg-muted/40 p-6">
                <h3 className="mb-3 text-xl font-semibold">{highlight.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {highlight.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-muted/40 p-6">
            <h3 className="mb-3 text-xl font-semibold">Exporting & reporting</h3>
            <p className="text-sm text-muted-foreground">
              Need to send reports to a coach, partner, or capital allocator? Generate PDF and spreadsheet exports with
              your key metrics, tagged insights, and AI commentary in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* AI Coach */}
      <section id="ai-coach" data-section="ai-coach" className="scroll-mt-20">
        <h2 className="mb-8 text-4xl font-bold tracking-tight">AI trade coach</h2>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Signal&apos;s LLM understands your trades, tags, and equity curve. Ask conversational questions and it
              responds like a performance coach who has read your entire journal.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {aiCoachCapabilities.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Sparkles className="mt-1 h-4 w-4 text-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/chat"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:text-muted-foreground"
            >
              Ask the coach to audit a recent session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-6">
            <p className="text-sm font-semibold text-foreground">Example conversation</p>
            <div className="mt-4 space-y-4 text-sm">
              <div className="rounded-xl border bg-background p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">You</p>
                <p>I broke daily max loss twice this month. What triggered it?</p>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Signal</p>
                <p className="text-muted-foreground">
                  Both incidents followed your “Gap & Go” setup after 10:30 AM. Volume was below your playbook minimum,
                  and you sized 40% larger than average. Consider tightening the time-of-day rule and capping risk after
                  two losing trades.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-4">
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Signal (follow up)</p>
                <p className="text-muted-foreground">
                  I created a checklist tweak and scheduled a reminder for tomorrow&apos;s open. Want me to draft a note
                  to your accountability partner?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review cadence */}
      <section id="reviews" data-section="reviews" className="scroll-mt-20">
        <h2 className="mb-8 text-4xl font-bold tracking-tight">Review cadence that sticks</h2>

        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Great traders compound discipline. Use these built-in review cycles to keep momentum without burning out.
          </p>

          <div className="space-y-4">
            {reviewCadence.map((item) => (
              <div key={item.label} className="flex flex-col gap-3 rounded-2xl border bg-muted/40 p-6 md:flex-row md:items-start">
                <Clock className="mt-1 h-6 w-6 shrink-0 text-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration & Security */}
      <section id="collaboration" data-section="collaboration" className="scroll-mt-20">
        <h2 className="mb-8 text-4xl font-bold tracking-tight">Built for teams, coaches, and accountability</h2>

        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Whether you trade solo or run a desk, Signal keeps feedback loops tight and data secure.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {collaborationHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border bg-muted/40 p-6">
                <item.icon className="mb-3 h-6 w-6 text-foreground" />
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section id="next-steps" data-section="next-steps" className="scroll-mt-20">
        <h2 className="mb-6 text-4xl font-bold tracking-tight">Next steps</h2>
        <div className="rounded-2xl border bg-muted/40 p-6">
          <p className="text-muted-foreground">
            Ready to put Signal to work?{" "}
            <Link href="/chat" className="font-semibold text-foreground underline-offset-2 hover:underline">
              Start journaling now
            </Link>{" "}
            or{" "}
            <Link href="/pricing" className="font-semibold text-foreground underline-offset-2 hover:underline">
              explore plans
            </Link>
            . Need a custom workflow for your desk? Reach out to{" "}
            <a href="mailto:sales@signaljournal.ai" className="font-semibold text-foreground underline-offset-2 hover:underline">
              sales@signaljournal.ai
            </a>{" "}
            and we&apos;ll help you design it.
          </p>
        </div>
      </section>
    </motion.article>
  );
}
