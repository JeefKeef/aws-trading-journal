"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  LineChart, 
  Brain, 
  Database, 
  Bell, 
  Code2, 
  Search, 
  FileText, 
  Globe, 
  Shield,
  Users,
  Twitter,
  Youtube
} from "lucide-react";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: MessageSquare,
      title: "AI-Powered Chat Interface",
      description: "Chat with your trading terminal like you're talking to a pro trader",
      details: [
        "Natural language queries - just ask what you're looking for",
        "GPT-4o powered analysis and explanations",
        "Context-aware responses based on market conditions",
        "Follow-up questions for deeper insights",
      ],
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: Search,
      title: "Intelligent Stock Screener",
      description: "Find high-probability setups in seconds, not hours",
      details: [
        "Custom filters with plain English commands",
        "Real-time scanning across thousands of stocks",
        "Technical and fundamental screening combined",
        "Save and share your favorite screens",
      ],
      gradient: "from-green-500 to-teal-600",
    },
    {
      icon: TrendingUp,
      title: "Instant Backtesting",
      description: "Test any strategy on years of data in under 10 seconds",
      details: [
        "Historical data going back 10+ years",
        "P&L charts, win rates, and drawdown analysis",
        "Multi-timeframe backtesting",
        "Export results to CSV for further analysis",
      ],
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: Target,
      title: "Explainable AI",
      description: "Know exactly why each trade setup was recommended",
      details: [
        "Detailed rationale for every pick",
        "Technical pattern recognition explained",
        "Risk/reward analysis for each setup",
        "Confidence scores and probability metrics",
      ],
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Never miss a trade opportunity with intelligent notifications",
      details: [
        "Email, Discord, and webhook integrations",
        "Customizable alert conditions",
        "Price, volume, and technical indicator alerts",
        "Mobile notifications for urgent setups",
      ],
      gradient: "from-pink-500 to-rose-600",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Institutional-grade data analysis tools for everyone",
      details: [
        "Options flow and unusual activity tracking",
        "Dark pool data and large block trades",
        "Sentiment analysis from social media",
        "Insider trading and SEC filings monitoring",
      ],
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  const additionalFeatures = [
    {
      icon: Database,
      title: "Real-time Market Data",
      description: "Live quotes, Level 2 data, and institutional-grade feeds",
    },
    {
      icon: LineChart,
      title: "Technical Indicators",
      description: "50+ indicators with custom parameter settings",
    },
    {
      icon: Brain,
      title: "Custom AI Models",
      description: "Train your own models on your trading strategy",
    },
    {
      icon: Code2,
      title: "Developer API",
      description: "RESTful API for custom integrations and automation",
    },
    {
      icon: FileText,
      title: "Trade Journaling",
      description: "Automatic logging and performance tracking",
    },
    {
      icon: Globe,
      title: "Multi-asset Support",
      description: "Stocks, options, futures, crypto, and forex",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and SOC 2 compliance",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second query responses and real-time updates",
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
            <Link href="/features" className="text-sm font-medium text-foreground transition hover:text-foreground">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground transition hover:text-foreground">
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
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
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
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4" />
            Everything you need to trade smarter
          </motion.div>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Features built for
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">serious traders</span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            From AI-powered screening to instant backtesting, TraderCloud gives you the edge you need to win in the markets.
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
              className="inline-flex items-center gap-2 rounded-lg border-2 px-8 py-4 text-lg font-semibold transition hover:bg-muted"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Main Features - Detailed */}
      <section className="py-20 px-6">
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
                
                <div className={`relative rounded-2xl border-2 bg-gradient-to-br ${feature.gradient} p-1 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="rounded-xl bg-white p-8 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <feature.icon className="h-24 w-24 mx-auto mb-4 text-muted-foreground/20" />
                      <p className="text-sm text-muted-foreground font-medium">[Feature Demo]</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">And there's more...</h2>
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
                className="group rounded-2xl border bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 group-hover:border-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">Works with your favorite tools</h2>
            <p className="mb-12 text-xl text-muted-foreground">
              Seamless integrations with the platforms you already use
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              {[
                "TradingView",
                "ThinkOrSwim",
                "Interactive Brokers",
                "Discord",
                "Slack",
                "Telegram",
                "Zapier",
                "Webhooks",
              ].map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center rounded-xl border-2 bg-muted/50 p-6 hover:bg-muted transition-colors"
                >
                  <span className="font-semibold text-sm">{integration}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-12 text-center text-4xl font-bold">
              Why traders choose TraderCloud
            </h2>
            
            <div className="overflow-hidden rounded-2xl border-2 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="py-4 px-6 text-left font-semibold">Feature</th>
                    <th className="py-4 px-4 text-center font-semibold bg-foreground text-background">TraderCloud</th>
                    <th className="py-4 px-4 text-center font-semibold text-muted-foreground">Traditional Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "AI-Powered Analysis", us: true, them: false },
                    { feature: "Natural Language Queries", us: true, them: false },
                    { feature: "Instant Backtesting", us: true, them: "Manual" },
                    { feature: "Explainable Recommendations", us: true, them: false },
                    { feature: "Real-time Alerts", us: true, them: "Limited" },
                    { feature: "Custom Integrations", us: true, them: "Expensive" },
                    { feature: "Learning Curve", us: "Minutes", them: "Weeks" },
                    { feature: "Mobile Access", us: true, them: "Limited" },
                  ].map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-4 px-6 font-medium">{row.feature}</td>
                      <td className="py-4 px-4 text-center bg-green-50">
                        {typeof row.us === "boolean" ? (
                          row.us ? (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white text-xs">✓</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="font-semibold text-green-700">{row.us}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {typeof row.them === "boolean" ? (
                          row.them ? (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-600 text-white text-xs">✓</span>
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
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-5xl font-bold">Ready to level up your trading?</h2>
            <p className="mb-10 text-xl text-muted-foreground">
              Join 10,000+ traders already using AI to find better setups.
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

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">TraderCloud</span>
            </Link>
            
            <p className="text-sm text-muted-foreground">
              Made for traders, by traders. © 2025 TraderCloud
            </p>
            
            <div className="flex items-center gap-4">
              <Link href="https://twitter.com/TraderCloudAI" className="text-muted-foreground transition hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com/@TraderCloudAI" className="text-muted-foreground transition hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="https://discord.gg/tradercloud" className="text-muted-foreground transition hover:text-foreground">
                <Users className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
