"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";

function OdometerDigit({ value, prevValue }: { value: string; prevValue?: string }) {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const targetIndex = digits.indexOf(value);
  const prevIndex = prevValue ? digits.indexOf(prevValue) : targetIndex;
  
  return (
    <div className="relative inline-block overflow-hidden h-[1em] w-[0.6em]" style={{ clipPath: 'inset(0)' }}>
      <motion.div
        initial={{ y: `-${prevIndex}em` }}
        animate={{ y: `-${targetIndex}em` }}
        transition={{ 
          duration: 1.2,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        className="flex flex-col"
      >
        {digits.map((digit, i) => (
          <span
            key={i}
            className="h-[1em] leading-[1em] flex items-center justify-center"
            style={{ height: '1em', lineHeight: '1em' }}
          >
            {digit}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function AnimatedPrice({ price }: { price: number }) {
  const [prevPrice, setPrevPrice] = useState(price);
  
  useEffect(() => {
    setPrevPrice(price);
  }, [price]);
  
  const priceStr = price.toString();
  const prevPriceStr = prevPrice.toString().padStart(priceStr.length, '0');
  
  return (
    <span className="inline-flex">
      {priceStr.split('').map((digit, i) => (
        <OdometerDigit 
          key={i} 
          value={digit} 
          prevValue={prevPriceStr[i]}
        />
      ))}
    </span>
  );
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const tiers = [
    {
      name: "Starter",
      price: { monthly: 0, yearly: 0 },
      description: "Build the journaling habit and see your core numbers.",
      features: [
        "Unlimited manual journal entries",
        "Core analytics (P&L, win rate, expectancy)",
        "Tags, filters, and saved views",
        "Daily recap & review templates",
        "Community support",
      ],
      cta: "Start Free",
      href: "/chat",
    },
    {
      name: "Edge",
      price: { monthly: 29, yearly: 278 },
      description: "Everything you need to review trades with precision.",
      features: [
        "CSV & broker import automation",
        "Advanced analytics & heatmaps",
        "Emotion & discipline tracking",
        "Custom templates & workflows",
        "Export-ready PDF reports",
        "Automated review reminders",
      ],
      cta: "Start Edge",
      href: "/chat",
    },
    {
      name: "Pro",
      price: { monthly: 79, yearly: 758 },
      description: "AI-assisted feedback for high-volume, active traders.",
      features: [
        "Unlimited AI trade coaching",
        "Risk guardrails & rule tracking",
        "Playbook library & setup scorecards",
        "Coach & accountability sharing",
        "Voice notes & media attachments",
        "Priority support",
      ],
      cta: "Start Pro",
      href: "/chat",
      highlight: true,
    },
    {
      name: "Elite",
      price: { monthly: 179, yearly: 1718 },
      description: "Quant-level insights for teams and prop traders.",
      features: [
        "Multi-account & asset aggregation",
        "Team workspaces with permissions",
        "Custom metrics & dashboards",
        "API & webhooks for automation",
        "White-label client reporting",
        "Dedicated success manager",
      ],
      cta: "Start Elite",
      href: "/chat",
    },
    {
      name: "Teams",
      price: { monthly: null, yearly: null },
      description: "Tailored workflows for prop desks and fund managers.",
      features: [
        "Hands-on onboarding for your desk",
        "Custom data pipelines & integrations",
        "Enterprise security & audit logs",
        "SSO & granular permissions",
        "Bespoke analytics & playbooks",
        "Quarterly performance strategy reviews",
      ],
      cta: "Talk to Sales",
      href: "mailto:sales@signaljournal.ai",
    },
  ];

  const planColumns = [
    { key: "starter", label: "Starter" },
    { key: "edge", label: "Edge" },
    { key: "pro", label: "Pro" },
    { key: "elite", label: "Elite" },
    { key: "teams", label: "Teams" },
  ] as const;

  const featureComparison = [
    {
      category: "Analytics",
      features: [
        { name: "Core metrics (P&L, win rate, expectancy)", starter: true, edge: true, pro: true, elite: true, teams: true },
        { name: "Advanced analytics & heatmaps", starter: false, edge: true, pro: true, elite: true, teams: true },
        { name: "Multi-account performance rollups", starter: false, edge: false, pro: false, elite: true, teams: true },
        { name: "Custom KPI dashboards", starter: false, edge: false, pro: true, elite: true, teams: "Custom" },
      ],
    },
    {
      category: "Journaling",
      features: [
        { name: "Unlimited journal entries", starter: true, edge: true, pro: true, elite: true, teams: true },
        { name: "Custom templates & prompts", starter: false, edge: true, pro: true, elite: true, teams: true },
        { name: "Voice notes & media attachments", starter: false, edge: false, pro: true, elite: true, teams: true },
        { name: "Risk guardrails & rule tracking", starter: false, edge: false, pro: true, elite: true, teams: true },
      ],
    },
    {
      category: "AI Guidance",
      features: [
        { name: "AI trade summaries per day", starter: "5 / day", edge: "20 / day", pro: "Unlimited", elite: "Unlimited", teams: "Unlimited" },
        { name: "AI performance insights", starter: false, edge: true, pro: true, elite: true, teams: true },
        { name: "Automated recap generator", starter: false, edge: true, pro: true, elite: true, teams: true },
      ],
    },
    {
      category: "Collaboration & Support",
      features: [
        { name: "Accountability sharing", starter: false, edge: true, pro: true, elite: true, teams: true },
        { name: "Coach feedback threads", starter: false, edge: false, pro: true, elite: true, teams: true },
        { name: "Team workspaces & permissions", starter: false, edge: false, pro: false, elite: true, teams: true },
        { name: "Dedicated success manager", starter: false, edge: false, pro: false, elite: true, teams: true },
      ],
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="px-6 pb-12 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Simple, transparent pricing
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Start free, upgrade as you grow. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 rounded-lg border bg-muted p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-md px-6 py-2 text-sm font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-md px-6 py-2 text-sm font-semibold transition ${
                billingCycle === "yearly"
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="ml-2 text-xs">Save 20%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {tiers.map((tier, index) => {
              const price = tier.price[billingCycle];
              const monthlyPrice = billingCycle === "yearly" && price ? Math.round(price / 12) : price;

              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col rounded-2xl border bg-card p-6 transition ${
                    tier.highlight
                      ? "scale-105 border-foreground shadow-lg dark:border-foreground/80"
                      : "border-border bg-muted/50 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60"
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    {price !== null && monthlyPrice !== null ? (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">
                            $<AnimatedPrice price={monthlyPrice} />
                          </span>
                          <span className="text-muted-foreground">/mo</span>
                        </div>
                        {billingCycle === "yearly" && (
                          <p className="mt-1 text-sm text-green-600 font-medium">
                            ${price} billed annually
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-4xl font-bold">Custom</span>
                    )}
                  </div>

                  <Link
                    href={tier.href}
                    className={`mb-6 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition ${
                      tier.highlight
                        ? "border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground"
                        : "border-2 hover:bg-muted dark:hover:bg-neutral-900"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <ul className="space-y-3 flex-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="h-5 w-5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison Table */}
      <section className="bg-muted/30 px-6 py-20 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">Compare all features</h2>
            <p className="text-lg text-muted-foreground">
              See what&apos;s included in each plan
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border dark:border-neutral-800">
                  <th className="py-4 px-6 text-left font-semibold">Features</th>
                  {planColumns.map((column) => (
                    <th
                      key={column.key}
                      className={`py-4 px-4 text-center font-semibold ${
                        column.key === "pro" ? "bg-muted/50" : ""
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureComparison.flatMap((category, categoryIndex) => [
                  (
                    <tr key={`header-${categoryIndex}`} className="border-t-2 border-border dark:border-neutral-800">
                      <td colSpan={planColumns.length + 1} className="py-4 px-6 text-sm font-bold uppercase tracking-wide">
                        {category.category}
                      </td>
                    </tr>
                  ),
                  ...category.features.map((feature, featureIndex) => (
                    <motion.tr
                      key={`row-${categoryIndex}-${featureIndex}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                      viewport={{ once: true }}
                      className="border-t hover:bg-muted/20 dark:border-neutral-800 dark:hover:bg-neutral-900/40"
                    >
                      <td className="py-3 px-6 text-sm">{feature.name}</td>
                      {planColumns.map((column) => {
                        const value = feature[column.key];
                        return (
                          <td
                            key={column.key}
                            className={`py-3 px-4 text-center text-sm ${
                              column.key === "pro" ? "bg-muted/30 dark:bg-neutral-900/60" : ""
                            }`}
                          >
                            {typeof value === "boolean" ? (
                              value ? (
                                <Check className="mx-auto h-5 w-5" />
                              ) : (
                                <X className="mx-auto h-5 w-5 text-muted-foreground" />
                              )
                            ) : (
                              value
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  )),
                ])}
              </tbody>
            </table>
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
                q: "Can I change plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and wire transfers for Enterprise plans.",
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "All paid plans come with a 7-day money-back guarantee. Try risk-free!",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer full refunds within 7 days of purchase, no questions asked.",
              },
              {
                q: "Can I get a custom plan?",
                a: "Absolutely! Contact our sales team for custom enterprise solutions.",
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
                <h3 className="mb-2 text-lg font-semibold">{faq.q}</h3>
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
            <h2 className="mb-6 text-4xl font-bold text-foreground">Ready to start trading smarter?</h2>
            <p className="mb-10 text-xl text-muted-foreground">
              Join thousands of traders powered by AI.
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
    </div>
  );
}
