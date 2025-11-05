"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DollarSign, Users, TrendingUp, Zap, ArrowRight } from "lucide-react";

export default function AffiliatePage(): React.JSX.Element {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="px-6 pb-20 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
            <Users className="h-4 w-4" />
            Partner Program
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Earn 30% recurring commission
          </h1>
          <p className="mb-10 text-xl text-muted-foreground">
            Join hundreds of creators building passive income by sharing Signal—the trading journal built for serious operators.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="mailto:partners@signaljournal.ai"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-8 py-4 text-lg font-semibold text-background transition hover:bg-background hover:text-foreground"
            >
              Become a Partner
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-lg border-2 px-8 py-4 text-lg font-semibold transition hover:bg-muted"
            >
              Learn More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Recurring Commission", value: "30%", icon: DollarSign },
              { label: "Cookie Duration", value: "90 days", icon: Zap },
              { label: "Average Payout", value: "$1,200/mo", icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border bg-muted/50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border dark:border-neutral-700">
                  <stat.icon className="h-6 w-6 text-foreground" />
                </div>
                <p className="mb-2 text-4xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Why partner with Signal?</h2>
            <p className="text-lg text-muted-foreground">
              Best-in-class commission structure designed for creators
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "High Converting Product",
                description: "Industry-leading conversion rates mean more earnings per click",
              },
              {
                title: "Recurring Revenue",
                description: "Earn 30% monthly as long as your referrals stay subscribed",
              },
              {
                title: "Real-time Dashboard",
                description: "Track clicks, conversions, and earnings in real-time",
              },
              {
                title: "Marketing Assets",
                description: "Get access to banners, videos, and copy optimized for conversion",
              },
              {
                title: "Fast Payouts",
                description: "Monthly payouts via PayPal, Stripe, or wire transfer",
              },
              {
                title: "Dedicated Support",
                description: "Direct line to our partnerships team for questions and strategy",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border bg-muted/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <h3 className="mb-2 text-xl font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-20 bg-muted/30 dark:bg-neutral-900/50">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">How it works</h2>
            <p className="text-lg text-muted-foreground">
              Start earning in three simple steps
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Apply to join",
                description:
                  "Fill out a quick application telling us about your audience. We typically respond within 24 hours.",
              },
              {
                step: "2",
                title: "Get your unique link",
                description:
                  "Once approved, you'll get a custom referral link and access to our marketing asset library.",
              },
              {
                step: "3",
                title: "Share and earn",
                description:
                  "Share your link with your audience. Earn 30% recurring commission on every paid subscription.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-border text-2xl font-bold dark:border-neutral-700">
                  {item.step}
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Who can become an affiliate?",
                a: "Anyone with an audience interested in trading and investing. This includes YouTubers, bloggers, Twitter influencers, Discord community owners, and course creators.",
              },
              {
                q: "How do I get paid?",
                a: "We pay out monthly via PayPal, Stripe, or wire transfer for balances over $100. Payments are sent within 5 business days of month-end.",
              },
              {
                q: "How long does the cookie last?",
                a: "Our cookie lasts 90 days. If someone clicks your link and signs up within 90 days, you get credit for the referral.",
              },
              {
                q: "Can I promote Signal if I don't use it?",
                a: "We prefer partners who actively journal with Signal. Authentic recommendations convert far better than generic endorsements.",
              },
              {
                q: "Do you have marketing materials I can use?",
                a: "Yes! Once approved, you'll get access to banners, social media templates, email copy, and product screenshots.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border bg-muted/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <h3 className="mb-2 text-lg font-semibold text-foreground">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold text-foreground">Ready to start earning?</h2>
            <p className="mb-10 text-xl text-muted-foreground">
              Join our partner program and turn your audience into recurring revenue.
            </p>
            <Link
              href="mailto:partners@signaljournal.ai"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-8 py-4 text-lg font-semibold text-background transition hover:bg-background hover:text-foreground dark:hover:border-foreground"
            >
              Apply Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
