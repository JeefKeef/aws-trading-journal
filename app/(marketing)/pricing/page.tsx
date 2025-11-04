"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, X } from "lucide-react";
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
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for getting started",
      features: [
        "Basic stock screener",
        "5 AI queries per day",
        "Community support",
        "Basic market data",
        "Mobile access",
      ],
      cta: "Start Free",
      href: "/chat",
    },
    {
      name: "Pro",
      price: { monthly: 19, yearly: 182 },
      description: "For active traders",
      features: [
        "Advanced screener with custom filters",
        "Unlimited AI queries",
        "Real-time market data",
        "Email alerts",
        "Priority support",
        "Export to CSV",
        "Technical indicators",
      ],
      cta: "Start Pro",
      href: "/chat",
    },
    {
      name: "Pro+",
      price: { monthly: 69, yearly: 662 },
      description: "Most popular for serious traders",
      features: [
        "Everything in Pro",
        "Advanced backtesting engine",
        "Discord + Webhook alerts",
        "Options flow analysis",
        "Custom AI models",
        "API access (100 req/min)",
        "Dark pool data",
        "Institutional indicators",
      ],
      cta: "Start Pro+",
      href: "/chat",
      highlight: true,
    },
    {
      name: "Ultra",
      price: { monthly: 199, yearly: 1910 },
      description: "For power users",
      features: [
        "Everything in Pro+",
        "Unlimited API access",
        "Real-time options data",
        "Level 2 market data",
        "Custom integrations",
        "White-label options",
        "Dedicated account manager",
        "SLA guarantee",
      ],
      cta: "Start Ultra",
      href: "/chat",
    },
    {
      name: "Enterprise",
      price: { monthly: null, yearly: null },
      description: "Custom solutions for teams",
      features: [
        "Everything in Ultra",
        "Custom data sources",
        "On-premise deployment",
        "SSO & team management",
        "Custom SLA",
        "Dedicated support team",
        "Training & onboarding",
        "Custom development",
      ],
      cta: "Contact Sales",
      href: "mailto:sales@tradercloud.ai",
    },
  ];

  const featureComparison = [
    {
      category: "AI & Analysis",
      features: [
        { name: "AI queries per day", free: "5", pro: "Unlimited", proPlus: "Unlimited", ultra: "Unlimited", enterprise: "Unlimited" },
        { name: "GPT-4 access", free: false, pro: true, proPlus: true, ultra: true, enterprise: true },
        { name: "Custom AI models", free: false, pro: false, proPlus: true, ultra: true, enterprise: true },
        { name: "Advanced backtesting", free: false, pro: false, proPlus: true, ultra: true, enterprise: true },
      ],
    },
    {
      category: "Data & Screeners",
      features: [
        { name: "Basic stock screener", free: true, pro: true, proPlus: true, ultra: true, enterprise: true },
        { name: "Advanced custom filters", free: false, pro: true, proPlus: true, ultra: true, enterprise: true },
        { name: "Real-time market data", free: false, pro: true, proPlus: true, ultra: true, enterprise: true },
        { name: "Options flow analysis", free: false, pro: false, proPlus: true, ultra: true, enterprise: true },
        { name: "Dark pool data", free: false, pro: false, proPlus: true, ultra: true, enterprise: true },
        { name: "Level 2 market data", free: false, pro: false, proPlus: false, ultra: true, enterprise: true },
      ],
    },
    {
      category: "Alerts & Integrations",
      features: [
        { name: "Email alerts", free: false, pro: true, proPlus: true, ultra: true, enterprise: true },
        { name: "Discord alerts", free: false, pro: false, proPlus: true, ultra: true, enterprise: true },
        { name: "Webhook alerts", free: false, pro: false, proPlus: true, ultra: true, enterprise: true },
        { name: "API access", free: false, pro: false, proPlus: "100/min", ultra: "Unlimited", enterprise: "Unlimited" },
        { name: "Custom integrations", free: false, pro: false, proPlus: false, ultra: true, enterprise: true },
      ],
    },
    {
      category: "Support & Services",
      features: [
        { name: "Community support", free: true, pro: true, proPlus: true, ultra: true, enterprise: true },
        { name: "Priority support", free: false, pro: true, proPlus: true, ultra: true, enterprise: true },
        { name: "Dedicated account manager", free: false, pro: false, proPlus: false, ultra: true, enterprise: true },
        { name: "SLA guarantee", free: false, pro: false, proPlus: false, ultra: true, enterprise: "Custom" },
        { name: "Training & onboarding", free: false, pro: false, proPlus: false, ultra: false, enterprise: true },
      ],
    },
  ];

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
            <Link href="/features" className="text-sm text-muted-foreground transition hover:text-foreground">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-foreground transition hover:text-foreground">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground transition hover:text-foreground">
              Docs
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

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
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
                  className={`relative flex flex-col rounded-2xl border p-6 transition ${
                    tier.highlight
                      ? "border-foreground shadow-lg scale-105"
                      : "bg-muted/50 hover:shadow-md"
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
                        : "border-2 hover:bg-muted"
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
      <section className="py-20 px-6 bg-muted/30">
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
                <tr className="border-b-2">
                  <th className="py-4 px-6 text-left font-semibold">Features</th>
                  <th className="py-4 px-4 text-center font-semibold">Free</th>
                  <th className="py-4 px-4 text-center font-semibold">Pro</th>
                  <th className="py-4 px-4 text-center font-semibold bg-muted/50">Pro+</th>
                  <th className="py-4 px-4 text-center font-semibold">Ultra</th>
                  <th className="py-4 px-4 text-center font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.flatMap((category, categoryIndex) => [
                  (
                    <tr key={`header-${categoryIndex}`} className="border-t-2">
                      <td colSpan={6} className="py-4 px-6 font-bold text-sm uppercase tracking-wide">
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
                      className="border-t hover:bg-muted/20"
                    >
                      <td className="py-3 px-6 text-sm">{feature.name}</td>
                      <td className="py-3 px-4 text-center text-sm">
                        {typeof feature.free === "boolean" ? (
                          feature.free ? (
                            <Check className="h-5 w-5 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 mx-auto text-muted-foreground" />
                          )
                        ) : (
                          feature.free
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? (
                            <Check className="h-5 w-5 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 mx-auto text-muted-foreground" />
                          )
                        ) : (
                          feature.pro
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm bg-muted/30">
                        {typeof feature.proPlus === "boolean" ? (
                          feature.proPlus ? (
                            <Check className="h-5 w-5 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 mx-auto text-muted-foreground" />
                          )
                        ) : (
                          feature.proPlus
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {typeof feature.ultra === "boolean" ? (
                          feature.ultra ? (
                            <Check className="h-5 w-5 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 mx-auto text-muted-foreground" />
                          )
                        ) : (
                          feature.ultra
                        )}
                      </td>
                      <td className="py-3 px-4 text-center text-sm">
                        {typeof feature.enterprise === "boolean" ? (
                          feature.enterprise ? (
                            <Check className="h-5 w-5 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 mx-auto text-muted-foreground" />
                          )
                        ) : (
                          feature.enterprise
                        )}
                      </td>
                    </motion.tr>
                  )),
                ])}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
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
                className="rounded-2xl border bg-muted/50 p-6"
              >
                <h3 className="mb-2 text-lg font-semibold">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
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
            <h2 className="mb-6 text-4xl font-bold">Ready to start trading smarter?</h2>
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
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition">
                Terms
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
                Privacy
              </Link>
              <p className="text-muted-foreground">
                © 2025 TraderCloud
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
