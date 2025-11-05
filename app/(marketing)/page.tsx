"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Zap, Shield, ArrowRight, CheckCircle2, BarChart3, Brain, Users, Star } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const hasSession = false;
      
      if (hasSession) {
        router.replace("/dashboard");
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 dark:border-neutral-800 dark:border-t-neutral-100 mx-auto"></div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              {/* Social Proof Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-600 dark:border-neutral-700/60 dark:bg-neutral-900/80 dark:text-neutral-300">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>
                  Trusted by{" "}
                  <strong className="text-neutral-900 dark:text-white">10,000+</strong> profitable traders
                </span>
              </div>

              <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl lg:text-7xl">
                Stop Guessing.
                <br />
                <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent dark:from-neutral-100 dark:to-neutral-300">
                  Start Winning.
                </span>
              </h1>

              <p className="mb-4 text-xl text-neutral-600 dark:text-neutral-300 sm:text-2xl">
                The only trading journal that shows you{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">why you&apos;re losing</span> and{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">how to fix it</span>.
              </p>

              <p className="mb-10 text-base text-neutral-500 dark:text-neutral-400">
                Track every trade. Spot your mistakes. Build consistency. Finally become profitable.
              </p>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-neutral-800 hover:shadow-xl dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-neutral-200 bg-white px-8 py-4 text-base font-semibold text-neutral-900 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 sm:w-auto"
                >
                  See How It Works
                </Link>
              </div>

              <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Problem-Solution Section */}
        <section className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/40">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">
                Most traders lose because they don&apos;t track their data
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
                You can&apos;t improve what you don&apos;t measure. Signal automatically tracks every metric that matters.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Without Signal */}
              <div className="rounded-2xl border-2 border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">Without Signal</h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-300">The painful reality of untracked trading</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-rose-100 p-1 dark:bg-rose-500/20">
                      <div className="h-full w-full rounded-full bg-rose-500 dark:bg-rose-400"></div>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">Repeating the same costly mistakes without realizing it</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-rose-100 p-1 dark:bg-rose-500/20">
                      <div className="h-full w-full rounded-full bg-rose-500 dark:bg-rose-400"></div>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">No idea which strategies actually work for you</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-rose-100 p-1 dark:bg-rose-500/20">
                      <div className="h-full w-full rounded-full bg-rose-500 dark:bg-rose-400"></div>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">Emotional trading based on gut feelings instead of data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-rose-100 p-1 dark:bg-rose-500/20">
                      <div className="h-full w-full rounded-full bg-rose-500 dark:bg-rose-400"></div>
                    </div>
                    <span className="text-neutral-700 dark:text-neutral-300">Blowing accounts because you don&apos;t see the patterns</span>
                  </li>
                </ul>
              </div>

              {/* With Signal */}
              <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 dark:border-emerald-500/60 dark:from-emerald-950/50 dark:to-neutral-900/50">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">With Signal</h3>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-300">Data-driven trading that compounds profits</p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-neutral-700 dark:text-neutral-200">Instantly see your biggest leaks and plug them</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-neutral-700 dark:text-neutral-200">Know exactly which setups are profitable for your style</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-neutral-700 dark:text-neutral-200">Make decisions backed by your personal performance data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-neutral-700 dark:text-neutral-200">Build a profitable system through proven pattern recognition</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">
              From chaos to clarity in 3 steps
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
              Stop winging it. Start building a repeatable system that prints money.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-2xl font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">Log Every Trade</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Capture entry, exit, size, and emotion in seconds. Manual or auto-import from your broker.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-2xl font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">See Your Patterns</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                AI analyzes your trades and shows you exactly what&apos;s working and what&apos;s bleeding money.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-2xl font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">Fix & Profit</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Double down on winners, eliminate losers. Watch your win rate climb month over month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">
              Everything you need to trade like a pro
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-8 transition hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20">
                <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Real-Time Analytics</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Win rate, profit factor, best setups, worst mistakes—all calculated automatically.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-8 transition hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/20">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">AI Pattern Detection</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Let AI find the patterns you&apos;re missing. Get personalized insights unique to your trading.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-8 transition hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-500/20">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Performance Dashboard</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                See your edge at a glance. Daily P&L, streaks, equity curve, and detailed breakdowns.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-8 transition hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20">
                <Zap className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Trade Calendar</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Visual timeline of all your trades. Spot your best days and avoid your worst patterns.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-8 transition hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-500/20">
                <Shield className="h-6 w-6 text-rose-600 dark:text-rose-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Risk Management</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Track position sizing, stop losses, and risk/reward. Never blow up your account again.
              </p>
            </div>

            <div className="group rounded-2xl border-2 border-neutral-200 bg-white p-8 transition hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/20">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-neutral-900 dark:text-white">Trade Notes & Tags</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Document your thesis, emotions, and lessons. Build a knowledge base of what works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">
              Join thousands of profitable traders
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Real results from real traders
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border-2 border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400 dark:text-amber-300" />
                ))}
              </div>
              <p className="mb-6 text-neutral-700 dark:text-neutral-200">
                &ldquo;Signal helped me identify that I was overtrading. Cutting my trades in half <strong>doubled my monthly profit</strong>.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 font-semibold dark:bg-neutral-800 dark:text-neutral-200">
                  MK
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">Mike K.</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Day Trader</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400 dark:text-amber-300" />
                ))}
              </div>
              <p className="mb-6 text-neutral-700 dark:text-neutral-200">
                &ldquo;The AI insights showed me I was taking profits too early. <strong>My average win went from $200 to $450</strong>.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 font-semibold dark:bg-neutral-800 dark:text-neutral-200">
                  SC
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">Sarah C.</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Swing Trader</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400 dark:text-amber-300" />
                ))}
              </div>
              <p className="mb-6 text-neutral-700 dark:text-neutral-200">
                &ldquo;Finally consistent after 3 years of losses. <strong>Up 40% this quarter</strong> by following the data.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 font-semibold dark:bg-neutral-800 dark:text-neutral-200">
                  JR
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white">James R.</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Options Trader</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b border-neutral-200 bg-neutral-900 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl dark:text-neutral-100">
            Ready to stop losing and start winning?
          </h2>
          <p className="mb-10 text-xl text-neutral-300 dark:text-neutral-400">
            Join 10,000+ traders who turned their performance around with data-driven insights.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-neutral-900 shadow-xl transition hover:bg-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
          >
            Start Your Free Trial
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="mt-6 text-sm text-neutral-400 dark:text-neutral-500">
            14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}
