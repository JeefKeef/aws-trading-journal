"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">
              Last Updated: November 3, 2025
            </p>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3">🔒 Your Privacy Matters</h3>
              <p className="text-blue-800">
                TraderCloud is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Information You Provide
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li>Name and email address when you create an account</li>
                  <li>Payment information (processed securely by Stripe)</li>
                  <li>Trading preferences and settings</li>
                  <li>Communications with our support team</li>
                  <li>Feedback and survey responses</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Information We Collect Automatically
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Device information (browser, OS, device type)</li>
                  <li>IP address and location data</li>
                  <li>Usage data (features used, time spent)</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Query history and search terms</li>
                  <li>API usage and performance metrics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use your information to:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="font-semibold mb-2">Provide the Service</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Process your account and subscriptions</li>
                      <li>• Deliver AI recommendations</li>
                      <li>• Send alerts and notifications</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="font-semibold mb-2">Improve the Service</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Analyze usage patterns</li>
                      <li>• Fix bugs and improve performance</li>
                      <li>• Develop new features</li>
                      <li>• Train and improve AI models</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="font-semibold mb-2">Marketing</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Send product updates</li>
                      <li>• Share educational content</li>
                      <li>• Promote new features</li>
                      <li>• You can opt-out anytime</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <h4 className="font-semibold mb-2">Security & Compliance</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Prevent fraud and abuse</li>
                      <li>• Comply with legal obligations</li>
                      <li>• Protect user safety</li>
                      <li>• Enforce our Terms of Service</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lock className="h-6 w-6" />
                  3. How We Protect Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement industry-standard security measures:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Secure HTTPS connections for all traffic</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Two-factor authentication available</li>
                  <li>Limited employee access to user data</li>
                  <li>Secure data centers with physical security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Sharing Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do NOT sell your personal information. We may share data with:
                </p>
                <div className="space-y-4">
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="font-semibold mb-2">Service Providers</h4>
                    <p className="text-sm text-muted-foreground">
                      Third-party companies that help us operate (hosting, analytics, payment processing, customer support)
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="font-semibold mb-2">Legal Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      When required by law, court order, or to protect rights and safety
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="font-semibold mb-2">Business Transfers</h4>
                    <p className="text-sm text-muted-foreground">
                      In connection with a merger, acquisition, or sale of assets (you will be notified)
                    </p>
                  </div>
                  <div className="rounded-lg border bg-white p-4">
                    <h4 className="font-semibold mb-2">Aggregated Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Anonymous, aggregated statistics that cannot identify you personally
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  <li>Keep you logged in</li>
                  <li>Remember your preferences</li>
                  <li>Analyze usage and improve the Service</li>
                  <li>Provide personalized recommendations</li>
                  <li>Measure marketing effectiveness</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  You can control cookies through your browser settings, but some features may not work properly if disabled.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  6. Your Privacy Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    "Access your personal data",
                    "Correct inaccurate data",
                    "Request data deletion",
                    "Export your data",
                    "Opt-out of marketing emails",
                    "Disable cookies",
                    "Close your account",
                    "Object to data processing",
                  ].map((right, i) => (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-foreground" />
                      <span>{right}</span>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise these rights, email us at privacy@tradercloud.ai
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for legal and business purposes (audit logs, legal disputes, fraud prevention) for up to 7 years.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Children&apos;s Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  TraderCloud is not intended for users under 18. We do not knowingly collect information from children. If you believe we have collected data from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. International Users</h2>
                <p className="text-muted-foreground leading-relaxed">
                  TraderCloud is based in the United States. If you access the Service from outside the US, your information may be transferred to and stored in the US. By using the Service, you consent to this transfer.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We integrate with third-party services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Google Analytics (analytics)</li>
                  <li>Stripe (payment processing)</li>
                  <li>SendGrid (email delivery)</li>
                  <li>Discord/Slack (notifications)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  These services have their own privacy policies. We are not responsible for their practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the Service. Your continued use after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Questions about privacy? We&apos;re here to help:
                </p>
                <div className="rounded-lg border bg-muted/30 p-6">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <p className="text-sm text-muted-foreground">privacy@tradercloud.ai</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Data Protection Officer</p>
                      <p className="text-sm text-muted-foreground">dpo@tradercloud.ai</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mt-4">
                        We typically respond within 48 hours
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
