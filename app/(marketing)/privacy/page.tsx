"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Database, Eye, Lock, Shield, Sparkles } from "lucide-react";

const infoCollection = [
  {
    title: "Information you provide",
    items: [
      "Name, email address, and authentication details.",
      "Billing information processed securely by our payment providers.",
      "Journal entries, tags, attachments, and analytics preferences.",
      "Support requests, feedback, and survey responses.",
    ],
    icon: Database,
  },
  {
    title: "Information we collect automatically",
    items: [
      "Session metadata (browser, device, operating system).",
      "IP address and approximate location for security and analytics.",
      "Usage data such as features accessed, query volume, and performance metrics.",
      "Cookies and similar technologies that help remember preferences and maintain secure sessions.",
    ],
    icon: Eye,
  },
];

const usagePurposes = [
  {
    title: "Operate the Service",
    bullets: ["Authenticate you, process subscriptions, and deliver journal features.", "Generate analytics dashboards, AI insights, and exports on your behalf.", "Provide customer support, notifications, and product updates."],
  },
  {
    title: "Improve the Service",
    bullets: ["Analyze usage trends to enhance performance and stability.", "Develop new journaling, analytics, and AI capabilities.", "Train machine learning models using de-identified or aggregated data."],
  },
  {
    title: "Protect the Platform",
    bullets: ["Detect fraud, abuse, and security threats.", "Enforce our Terms of Service and other policies.", "Comply with legal obligations and respond to lawful requests."],
  },
];

const thirdParties = [
  {
    title: "Service providers",
    details: "Trusted vendors who assist with hosting, analytics, customer support, and billing (for example, Stripe, Vercel, Supabase). They access data only to perform services on our behalf and must maintain confidentiality.",
  },
  {
    title: "Legal disclosures",
    details: "We may disclose information if required by law or if we believe it is necessary to protect Signal, our users, or the public from harm.",
  },
  {
    title: "Business transfers",
    details: "If Signal is involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction. We will notify you before it happens.",
  },
];

const rights = [
  {
    title: "Access & correction",
    description: "You can view and update profile information from your account settings. Contact us if you need assistance with data you cannot edit directly.",
  },
  {
    title: "Export",
    description: "You can export journal entries, analytics, and attachments at any time. Email us to request a comprehensive data export.",
  },
  {
    title: "Deletion",
    description: "You may delete individual entries or request full account deletion. We will honor verified requests within a reasonable timeframe, subject to legal requirements.",
  },
  {
    title: "Opt‑out of communications",
    description: "You can unsubscribe from marketing emails via the link in each message. Transactional communications (such as billing or security notices) will still be sent when necessary.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground">
      <nav className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <Sparkles className="h-4 w-4" />
            Signal
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </nav>

      <div className="px-6 pb-24 pt-28">
        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-4xl"
        >
          <header className="mb-10">
            <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
            <p className="mt-2 text-sm text-muted-foreground">Effective as of November 3, 2025</p>
          </header>

          <div className="rounded-2xl border border-blue-200/70 bg-blue-50/70 p-6 text-sm text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-100">
            <h2 className="mb-2 text-base font-semibold">Our promise</h2>
            <p>
              Signal is your journal and your edge. We treat it that way—protecting your data, respecting your privacy, and giving you control over what happens next.
            </p>
          </div>

          <section className="mt-10 space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">1. Information we collect</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {infoCollection.map(({ title, items, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-muted/40 p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon className="h-4 w-4" />
                    {title}
                  </div>
                  <ul className="space-y-2 pl-4 text-sm leading-6">
                    {items.map((item) => (
                      <li key={item} className="list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">2. How we use your information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {usagePurposes.map(({ title, bullets }) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-muted/40 p-5">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
                  <ul className="space-y-2 pl-4 text-sm leading-6">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">3. When we share data</h2>
            <div className="space-y-5">
              {thirdParties.map(({ title, details }) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-muted/40 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
                  <p>{details}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">4. Security</h2>
            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-6 text-sm text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-100">
              <h3 className="mb-2 flex items-center gap-2 text-base font-semibold">
                <Lock className="h-4 w-4" />
                How we safeguard your data
              </h3>
              <ul className="space-y-2 pl-5">
                <li className="list-disc">All data in transit is protected with TLS 1.2+ encryption.</li>
                <li className="list-disc">Sensitive data at rest is encrypted using industry-standard algorithms.</li>
                <li className="list-disc">Access to production systems is limited to trained personnel with multi-factor authentication.</li>
                <li className="list-disc">We maintain audit logs, least-privilege access, and regular security reviews.</li>
              </ul>
            </div>
          </section>

          <section className="mt-12 space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">5. Your rights & choices</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {rights.map(({ title, description }) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-muted/40 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">6. International transfers</h2>
            <p>
              Signal Journal Inc. operates primarily in the United States. If you access the Service from outside the United States, you consent to the transfer, storage, and processing of your information in the United States and other jurisdictions where we or our service providers operate.
            </p>
          </section>

          <section className="mt-12 space-y-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">7. Updates to this policy</h2>
            <p>
              We may update this Privacy Policy to reflect changes to the Service or legal requirements. If updates are material, we will provide notice via email or through the product before the changes take effect.
            </p>
          </section>

          <section className="mt-12 space-y-4 rounded-2xl border border-border/60 bg-muted/40 p-6 text-sm leading-7 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">8. Contact us</h2>
            <p>Signal Journal Inc.</p>
            <p>99 Hudson Street, Floor 3</p>
            <p>New York, NY 10013</p>
            <p>
              Email:{" "}
              <a className="font-semibold text-foreground underline-offset-2 hover:underline" href="mailto:privacy@signaljournal.ai">
                privacy@signaljournal.ai
              </a>
            </p>
            <p>
              Data Protection Officer:{" "}
              <a className="font-semibold text-foreground underline-offset-2 hover:underline" href="mailto:dpo@signaljournal.ai">
                dpo@signaljournal.ai
              </a>
            </p>
          </section>

          <footer className="mt-16 rounded-2xl border border-border/60 bg-muted/40 p-6">
            <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground">
              <Shield className="h-4 w-4" />
              Questions about privacy?
            </h3>
            <p className="text-sm text-muted-foreground">
              We’re happy to help. Reach out to{" "}
              <a className="font-semibold text-foreground underline-offset-2 hover:underline" href="mailto:privacy@signaljournal.ai">
                privacy@signaljournal.ai
              </a>{" "}
              for anything related to your personal data.
            </p>
          </footer>
        </motion.article>
      </div>
    </div>
  );
}
