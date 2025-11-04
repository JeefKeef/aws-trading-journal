"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
        </div>
      </nav>

      {/* Content */}
      <div className="pt-20 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg max-w-none"
          >
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: November 3, 2025
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using TraderCloud (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  TraderCloud provides AI-powered trading analysis tools, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Stock screening and analysis</li>
                  <li>AI-powered trading recommendations</li>
                  <li>Backtesting capabilities</li>
                  <li>Real-time alerts and notifications</li>
                  <li>Market data and insights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Important Disclaimers</h2>
                <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-6">
                  <h3 className="font-semibold text-yellow-900 mb-3">⚠️ Investment Risk Warning</h3>
                  <ul className="list-disc pl-6 space-y-2 text-yellow-800">
                    <li>TraderCloud does NOT provide investment advice</li>
                    <li>All analysis and recommendations are for informational purposes only</li>
                    <li>Trading stocks and options involves substantial risk of loss</li>
                    <li>Past performance does not guarantee future results</li>
                    <li>You are solely responsible for your trading decisions</li>
                    <li>We are not registered investment advisors</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To use certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Not share your account with others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Subscription and Payments</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We offer both free and paid subscription plans:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>You can cancel anytime from your account settings</li>
                  <li>Refunds are provided within 7 days of purchase</li>
                  <li>Prices are subject to change with 30 days notice</li>
                  <li>Payment processing is handled by secure third-party providers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree NOT to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Use the Service for any illegal purpose</li>
                  <li>Attempt to reverse engineer or hack the Service</li>
                  <li>Share or resell access to the Service</li>
                  <li>Scrape or copy data without permission</li>
                  <li>Interfere with other users&apos; use of the Service</li>
                  <li>Use automated tools to access the Service (except via our API)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Data Accuracy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive to provide accurate data, we cannot guarantee that all information is error-free, complete, or current. Market data may be delayed. You should verify all information before making trading decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content, features, and functionality of the Service are owned by TraderCloud and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of the Service without our written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, TraderCloud shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or trading losses, arising from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. API Usage</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you use our API:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>You must comply with rate limits for your plan</li>
                  <li>You may not abuse or overload our systems</li>
                  <li>We may terminate API access for violations</li>
                  <li>API features may change with reasonable notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through the Service. Your continued use after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms are governed by the laws of the United States. Any disputes will be resolved in the courts of Delaware.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">14. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                  <p className="font-medium">Email: legal@tradercloud.ai</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    We typically respond within 2-3 business days
                  </p>
                </div>
              </section>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
