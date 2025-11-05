"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Sparkles } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using Signal (“Service”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree, you must discontinue use immediately.",
      "We may update these Terms from time to time. Continued use of the Service after changes take effect constitutes acceptance of the revised Terms.",
    ],
  },
  {
    title: "2. What Signal Provides",
    intro: "Signal is a trading journal and performance analytics platform designed to help traders review, learn, and improve. The Service includes:",
    list: [
      "Trade journaling tools with tagging, attachments, and custom templates.",
      "Analytics dashboards that surface performance metrics and risk discipline.",
      "AI-assisted summaries, coaching insights, and automation features.",
      "Team and coach collaboration tools, permission controls, and exports.",
    ],
    outro:
      "Signal does not execute trades, route orders, provide brokerage services, or guarantee investment results.",
  },
  {
    title: "3. No Investment Advice",
    component: (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 dark:border-amber-400/40 dark:bg-amber-500/10">
        <h3 className="mb-3 font-semibold text-amber-900 dark:text-amber-200">Important disclaimers</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-amber-900 dark:text-amber-100">
          <li>Signal is an educational and productivity tool. It does not issue investment advice or recommendations.</li>
          <li>You are solely responsible for evaluating trades, managing risk, and complying with applicable regulations.</li>
          <li>Past performance surfaced by the Service does not guarantee future results.</li>
          <li>We are not registered investment advisors, broker-dealers, or futures commission merchants.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "4. Accounts & Security",
    list: [
      "Provide accurate account details and keep them up to date.",
      "Maintain the confidentiality of your login credentials.",
      "Notify us promptly if you suspect unauthorized access.",
      "You are responsible for all activity that occurs under your account.",
      "Account sharing is prohibited unless expressly approved for team workspaces.",
    ],
  },
  {
    title: "5. Subscriptions & Billing",
    list: [
      "Paid plans renew automatically unless you cancel before the renewal date.",
      "Fees are billed in advance for the applicable subscription period.",
      "Refunds are handled in accordance with the plan-specific refund policy disclosed at checkout.",
      "We may adjust pricing with reasonable prior notice. Continued use after price changes constitutes acceptance.",
    ],
  },
  {
    title: "6. Acceptable Use",
    list: [
      "Use the Service only for lawful purposes and in accordance with these Terms.",
      "Do not attempt to reverse engineer, copy, or misappropriate the Service or AI models.",
      "Do not upload malicious code, attempt unauthorized access, or interfere with platform stability.",
      "Respect the privacy and intellectual property rights of other users and third parties.",
    ],
  },
  {
    title: "7. Data Rights & Privacy",
    body: [
      "Our handling of personal data is governed by the Signal Privacy Policy. By using the Service, you consent to those practices.",
      "You retain ownership of the journal entries, analytics exports, and files you upload. You grant us a limited license to process that data solely to operate and improve the Service.",
    ],
  },
  {
    title: "8. Intellectual Property",
    body: [
      "Signal, including its software, branding, analytics, AI models, and content, is owned by Signal Journal Inc. and protected by intellectual property laws.",
      "You may not copy, modify, distribute, or create derivative works from the Service without prior written consent.",
    ],
  },
  {
    title: "9. Termination",
    body: [
      "We may suspend or terminate access if you violate these Terms or engage in abusive, fraudulent, or unlawful behavior.",
      "You may cancel your account at any time. Termination does not relieve you of outstanding payment obligations.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, Signal Journal Inc. will not be liable for indirect, incidental, special, consequential, or punitive damages, or for any trading losses arising from use of the Service.",
      "Our aggregate liability for direct damages will not exceed the amount you paid to use the Service in the twelve months preceding the claim.",
    ],
  },
  {
    title: "11. Governing Law & Disputes",
    body: [
      "These Terms are governed by the laws of the State of Delaware, USA, without regard to conflict of law principles.",
      "Any disputes shall be resolved through binding arbitration in New York County, New York, unless another venue is mutually agreed.",
    ],
  },
  {
    title: "12. Contact",
    component: (
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Signal Journal Inc.</p>
        <p>99 Hudson Street, Floor 3</p>
        <p>New York, NY 10013</p>
        <p>
          Email:{" "}
          <a className="font-semibold text-foreground underline-offset-2 hover:underline" href="mailto:legal@signaljournal.ai">
            legal@signaljournal.ai
          </a>
        </p>
      </div>
    ),
  },
];

export default function TermsPage() {
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
            <h1 className="text-4xl font-semibold tracking-tight">Terms of Service</h1>
            <p className="mt-2 text-sm text-muted-foreground">Effective as of November 3, 2025</p>
          </header>

          <div className="space-y-10 text-sm leading-7 text-muted-foreground">
            {sections.map(({ title, body, list, intro, outro, component }) => (
              <section key={title} className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
                {body?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {intro && <p>{intro}</p>}
                {list && (
                  <ul className="list-disc space-y-2 pl-5">
                    {list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {outro && <p>{outro}</p>}
                {component}
              </section>
            ))}
          </div>

          <footer className="mt-16 rounded-2xl border border-border/60 bg-muted/40 p-6">
            <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground">
              <Shield className="h-4 w-4" />
              Need clarification?
            </h3>
            <p className="text-sm text-muted-foreground">
              We’re here to help. Email us at{" "}
              <a className="font-semibold text-foreground underline-offset-2 hover:underline" href="mailto:legal@signaljournal.ai">
                legal@signaljournal.ai
              </a>{" "}
              with any questions about these Terms.
            </p>
          </footer>
        </motion.article>
      </div>
    </div>
  );
}
