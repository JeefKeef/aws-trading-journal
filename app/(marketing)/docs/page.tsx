"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MessageSquare,
  ChevronRight,
  Users,
  Bell,
  Code2,
  Target
} from "lucide-react";

export default function DocsPage() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-16"
    >
      {/* Introduction */}
      <section data-section="introduction" id="introduction" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Introduction to TraderCloud
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            TraderCloud is an AI-powered trading terminal that helps you find high-probability setups, understand why they work, and backtest strategies instantly.
          </p>
          
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-blue-900">💡 What makes TraderCloud different?</h3>
            <p className="text-blue-800">
              Unlike traditional trading platforms, TraderCloud uses GPT-4o to provide natural language interaction, explainable AI recommendations, and instant backtesting—all in one place.
            </p>
          </div>

          <h3 className="text-2xl font-bold mt-8">Key Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
              <span><strong>Natural Language Queries:</strong> Ask questions in plain English, get instant results</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
              <span><strong>Explainable AI:</strong> Understand the &quot;why&quot; behind every recommendation</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
              <span><strong>Instant Backtesting:</strong> Test strategies on 10+ years of data in seconds</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground" />
              <span><strong>Real-time Alerts:</strong> Never miss a setup with intelligent notifications</span>
            </li>
          </ul>

          <h3 className="text-2xl font-bold mt-8">Who is TraderCloud for?</h3>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Day Traders</h4>
              <p className="text-sm text-muted-foreground">
                Find intraday setups with real-time scanning and instant alerts
              </p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Swing Traders</h4>
              <p className="text-sm text-muted-foreground">
                Identify multi-day opportunities with advanced technical analysis
              </p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Options Traders</h4>
              <p className="text-sm text-muted-foreground">
                Track unusual options activity and flow in real-time
              </p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Algo Traders</h4>
              <p className="text-sm text-muted-foreground">
                Build and backtest strategies with our powerful API
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section data-section="quick-start" id="quick-start" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Quick Start Guide
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Get up and running with TraderCloud in less than 5 minutes.
          </p>

          <div className="space-y-8">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background font-bold">1</div>
                <h3 className="text-2xl font-bold">Create Your Account</h3>
              </div>
              <div className="ml-13 space-y-3">
                <p>Sign up for a free account—no credit card required.</p>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <code className="text-sm">
                    <Link href="/chat" className="text-blue-600 hover:underline">
                      https://tradercloud.ai/chat
                    </Link> → Click &quot;Start Free&quot;
                  </code>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background font-bold">2</div>
                <h3 className="text-2xl font-bold">Make Your First Query</h3>
              </div>
              <div className="ml-13 space-y-3">
                <p>Try asking TraderCloud something in plain English:</p>
                <div className="space-y-2">
                  <div className="rounded-lg border bg-white p-4">
                    <p className="text-sm text-muted-foreground mb-2">Example queries:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span>&quot;Show me tech stocks with unusual volume today&quot;</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span>&quot;Find stocks breaking out of 52-week highs&quot;</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span>&quot;What stocks have bullish MACD crossovers?&quot;</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background font-bold">3</div>
                <h3 className="text-2xl font-bold">Review AI Explanations</h3>
              </div>
              <div className="ml-13 space-y-3">
                <p>Each result comes with a detailed explanation of why it was selected:</p>
                <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                  <p className="text-sm font-semibold mb-2">🤖 AI Analysis Example:</p>
                  <p className="text-sm text-muted-foreground">
                    &quot;AAPL was selected because: (1) Volume is 3.2x the 20-day average, (2) Price broke above resistance at $180, (3) RSI shows momentum at 68, (4) Institutional buying detected via dark pool activity.&quot;
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background font-bold">4</div>
                <h3 className="text-2xl font-bold">Backtest Your Ideas</h3>
              </div>
              <div className="ml-13 space-y-3">
                <p>Test any strategy instantly:</p>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <code className="text-sm">
                    &quot;Backtest buying TSLA when RSI drops below 30&quot;
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get results in under 10 seconds with P&L charts, win rates, and drawdown analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 mt-8">
            <h3 className="mb-2 font-semibold text-green-900">✅ You&apos;re all set!</h3>
            <p className="text-green-800">
              That&apos;s it! You&apos;re now ready to trade smarter with AI. Check out the AI Chat Interface docs for advanced features.
            </p>
          </div>
        </div>
      </section>

      {/* Basic Concepts */}
      <section data-section="basic-concepts" id="basic-concepts" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Basic Concepts
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Understanding the core concepts behind TraderCloud.
          </p>

          <h3 className="text-2xl font-bold mt-8">Natural Language Processing</h3>
          <p>
            TraderCloud uses GPT-4o to understand your queries in plain English. No need to learn complex syntax or programming languages—just ask what you&apos;re looking for.
          </p>
          <div className="rounded-lg border bg-white p-4 mt-4">
            <p className="text-sm font-semibold mb-3">How it works:</p>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>You type a query in natural language</li>
              <li>AI parses your intent and translates it to technical filters</li>
              <li>Our engine scans thousands of stocks in real-time</li>
              <li>Results are ranked by relevance and explained by AI</li>
            </ol>
          </div>

          <h3 className="text-2xl font-bold mt-8">Explainable AI</h3>
          <p>
            Every recommendation comes with a detailed explanation. You&apos;ll never wonder &quot;why did the AI pick this stock?&quot;
          </p>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Technical Rationale</h4>
              <p className="text-sm text-muted-foreground">
                Price action, indicators, volume patterns
              </p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Fundamental Context</h4>
              <p className="text-sm text-muted-foreground">
                Earnings, news, sector trends
              </p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Risk Assessment</h4>
              <p className="text-sm text-muted-foreground">
                Stop loss levels, risk/reward ratios
              </p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Confidence Score</h4>
              <p className="text-sm text-muted-foreground">
                Probability metrics and historical accuracy
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Backtesting Engine</h3>
          <p>
            Test any trading strategy on historical data instantly. Our engine processes 10+ years of data in seconds.
          </p>
          <div className="rounded-lg border bg-white p-4 mt-4">
            <p className="text-sm font-semibold mb-3">What you get:</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 mt-0.5" />
                <span><strong>P&L Chart:</strong> Visual representation of cumulative returns</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 mt-0.5" />
                <span><strong>Win Rate:</strong> Percentage of profitable trades</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 mt-0.5" />
                <span><strong>Max Drawdown:</strong> Largest peak-to-trough decline</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 mt-0.5" />
                <span><strong>Sharpe Ratio:</strong> Risk-adjusted returns</span>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold mt-8">Real-time Data</h3>
          <p>
            All market data is real-time (or delayed by 15 minutes for free accounts). Pro plans get full real-time access to:
          </p>
          <ul className="space-y-2 mt-4">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span>Stock prices and volume</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span>Options flow and unusual activity</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span>Dark pool prints and large block trades</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span>Level 2 market depth (Ultra+ plans)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* AI Chat */}
      <section data-section="ai-chat" id="ai-chat" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          AI Chat Interface
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Learn how to get the most out of TraderCloud&apos;s AI chat interface.
          </p>

          <h3 className="text-2xl font-bold">How to Ask Better Questions</h3>
          <p>The more specific your query, the better the results. Here are some tips:</p>
          
          <div className="space-y-4 mt-4">
            <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
              <p className="font-semibold text-green-900 mb-2">✅ Good Query</p>
              <code className="text-sm text-green-800">&quot;Show me tech stocks above $50 with RSI under 30 and volume above 1M&quot;</code>
            </div>
            <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
              <p className="font-semibold text-red-900 mb-2">❌ Vague Query</p>
              <code className="text-sm text-red-800">&quot;Show me good stocks&quot;</code>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Supported Query Types</h3>
          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-4">
              <h4 className="font-semibold mb-2">Technical Filters</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Price, volume, indicators, patterns
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                &quot;Stocks with bullish MACD crossover and RSI between 50-70&quot;
              </code>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h4 className="font-semibold mb-2">Fundamental Filters</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Earnings, PE ratio, market cap, sector
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                &quot;Healthcare stocks under 15 PE ratio with positive earnings&quot;
              </code>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h4 className="font-semibold mb-2">Pattern Recognition</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Chart patterns, support/resistance
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                &quot;Find stocks forming cup and handle patterns&quot;
              </code>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h4 className="font-semibold mb-2">Options Analysis</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Unusual activity, high IV, flow
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                &quot;Show unusual call option activity above 10,000 contracts&quot;
              </code>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Follow-up Questions</h3>
          <p>
            The AI maintains context, so you can ask follow-up questions:
          </p>
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3 mt-4">
            <div>
              <p className="text-sm font-semibold">You:</p>
              <p className="text-sm text-muted-foreground">&quot;Show me tech stocks with high volume&quot;</p>
            </div>
            <div>
              <p className="text-sm font-semibold">AI:</p>
              <p className="text-sm text-muted-foreground">[Returns 50 tech stocks...]</p>
            </div>
            <div>
              <p className="text-sm font-semibold">You:</p>
              <p className="text-sm text-muted-foreground">&quot;Filter these to only show ones above $100&quot;</p>
            </div>
            <div>
              <p className="text-sm font-semibold">AI:</p>
              <p className="text-sm text-muted-foreground">[Returns filtered list...]</p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 mt-8">
            <h3 className="mb-2 font-semibold text-blue-900">💡 Pro Tip</h3>
            <p className="text-blue-800">
              Save your favorite queries as &quot;Saved Screens&quot; to run them instantly later. Available on Pro+ plans.
            </p>
          </div>
        </div>
      </section>

      {/* Stock Screener */}
      <section data-section="stock-screener" id="stock-screener" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Stock Screener
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Advanced stock screening powered by AI.
          </p>

          <h3 className="text-2xl font-bold">Available Filters</h3>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {[
              { category: "Price & Volume", items: ["Current price", "Price change %", "Volume", "Avg volume", "Dollar volume"] },
              { category: "Technical Indicators", items: ["RSI", "MACD", "Moving averages", "Bollinger Bands", "Stochastic"] },
              { category: "Fundamentals", items: ["Market cap", "P/E ratio", "EPS", "Revenue growth", "Profit margin"] },
              { category: "Advanced", items: ["Dark pool activity", "Short interest", "Institutional ownership", "Insider trading"] },
            ].map((section, i) => (
              <div key={i} className="rounded-lg border bg-white p-4">
                <h4 className="font-semibold mb-3">{section.category}</h4>
                <ul className="space-y-1">
                  {section.items.map((item, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold mt-8">Custom Columns</h3>
          <p>
            Customize which columns appear in your results table. Pro+ users can add unlimited custom columns.
          </p>

          <h3 className="text-2xl font-bold mt-8">Export Results</h3>
          <p>
            Export your screener results to CSV for further analysis in Excel or other tools.
          </p>
          <div className="rounded-lg border bg-muted/50 p-4 mt-4">
            <code className="text-sm">
              Simply click the &quot;Export to CSV&quot; button in the top right of any results table.
            </code>
          </div>
        </div>
      </section>

      {/* Backtesting */}
      <section data-section="backtesting" id="backtesting" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Backtesting
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Test your trading strategies on historical data instantly.
          </p>

          <h3 className="text-2xl font-bold">How to Run a Backtest</h3>
          <p>
            Simply describe your strategy in plain English:
          </p>
          <div className="space-y-2 mt-4">
            <div className="rounded-lg border bg-white p-4">
              <code className="text-sm">&quot;Backtest buying SPY when RSI drops below 30 and selling when it goes above 70&quot;</code>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <code className="text-sm">&quot;Test buying tech stocks on MACD golden cross&quot;</code>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <code className="text-sm">&quot;Backtest shorting stocks breaking below 50-day MA&quot;</code>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Backtest Results</h3>
          <p>
            Each backtest provides comprehensive performance metrics:
          </p>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Total Return</h4>
              <p className="text-sm text-muted-foreground">Cumulative percentage gain/loss</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Win Rate</h4>
              <p className="text-sm text-muted-foreground">Percentage of profitable trades</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Max Drawdown</h4>
              <p className="text-sm text-muted-foreground">Largest peak-to-trough decline</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Sharpe Ratio</h4>
              <p className="text-sm text-muted-foreground">Risk-adjusted returns</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Avg Trade Duration</h4>
              <p className="text-sm text-muted-foreground">How long positions are held</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Profit Factor</h4>
              <p className="text-sm text-muted-foreground">Gross profit / gross loss</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Advanced Parameters</h3>
          <p>
            Pro+ users can specify advanced parameters:
          </p>
          <ul className="space-y-2 mt-4">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span><strong>Time Period:</strong> Specify date range for backtest</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span><strong>Position Sizing:</strong> Fixed dollar amount or percentage of portfolio</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span><strong>Stop Loss:</strong> Automatic stop loss levels</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span><strong>Commission:</strong> Include trading fees in calculations</span>
            </li>
          </ul>

          <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-6 mt-8">
            <h3 className="mb-2 font-semibold text-yellow-900">⚠️ Important</h3>
            <p className="text-yellow-800">
              Past performance does not guarantee future results. Always validate backtests with forward testing before risking real capital.
            </p>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section data-section="alerts" id="alerts" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Alerts & Notifications
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Never miss a trading opportunity with intelligent alerts.
          </p>

          <h3 className="text-2xl font-bold">Setting Up Alerts</h3>
          <p>
            Create alerts for any condition in natural language:
          </p>
          <div className="space-y-2 mt-4">
            <div className="rounded-lg border bg-white p-4">
              <code className="text-sm">&quot;Alert me when AAPL crosses above $180&quot;</code>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <code className="text-sm">&quot;Notify me when SPY volume exceeds 100M&quot;</code>
            </div>
            <div className="rounded-lg border bg-white p-4">
              <code className="text-sm">&quot;Alert me when any tech stock gets unusual call buying&quot;</code>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Notification Channels</h3>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="rounded-lg border bg-white p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Email
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Instant email notifications
              </p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">All plans</span>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Discord
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Post alerts to your Discord server
              </p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Pro+ and up</span>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Webhooks
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Send alerts to any custom endpoint
              </p>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Pro+ and up</span>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-5 w-5" />
                SMS
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Text message alerts for urgent setups
              </p>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Ultra only</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Alert Frequency</h3>
          <p>
            Control how often you receive notifications:
          </p>
          <ul className="space-y-2 mt-4">
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span><strong>Instant:</strong> Triggered immediately when condition is met</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span><strong>Once per day:</strong> Get a daily digest at market open/close</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="h-4 w-4 mt-0.5" />
              <span><strong>Custom schedule:</strong> Set specific times for alerts</span>
            </li>
          </ul>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 mt-8">
            <h3 className="mb-2 font-semibold text-blue-900">💡 Pro Tip</h3>
            <p className="text-blue-800">
              Combine multiple conditions in one alert: &quot;Alert me when TSLA crosses $200 AND volume is above average AND RSI is oversold&quot;
            </p>
          </div>
        </div>
      </section>

      {/* API */}
      <section data-section="api" id="api" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          API Reference
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Integrate TraderCloud into your own applications with our RESTful API.
          </p>

          <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6">
            <h3 className="mb-2 font-semibold text-purple-900">🔑 API Access</h3>
            <p className="text-purple-800">
              API access is available on Pro+ plans and above. Generate your API key in Settings → API.
            </p>
          </div>

          <h3 className="text-2xl font-bold mt-8">Authentication</h3>
          <div className="rounded-lg border bg-gray-900 text-gray-100 p-4 mt-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`curl -X GET "https://api.tradercloud.ai/v1/stocks" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
            </pre>
          </div>

          <h3 className="text-2xl font-bold mt-8">Endpoints</h3>
          <div className="space-y-4 mt-4">
            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded">GET</span>
                <code className="text-sm font-mono">/v1/stocks</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Get list of stocks matching your filters
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded">GET</span>
                <code className="text-sm font-mono">/v1/stocks/:symbol</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Get detailed information for a specific stock
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">POST</span>
                <code className="text-sm font-mono">/v1/backtest</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Run a backtest with custom parameters
              </p>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">POST</span>
                <code className="text-sm font-mono">/v1/alerts</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Create a new alert
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Rate Limits</h3>
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold">100/min</p>
              <p className="text-sm text-muted-foreground">Pro+ Plan</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold">Unlimited</p>
              <p className="text-sm text-muted-foreground">Ultra Plan</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <p className="text-2xl font-bold">Custom</p>
              <p className="text-sm text-muted-foreground">Enterprise</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold mt-8">Example Response</h3>
          <div className="rounded-lg border bg-gray-900 text-gray-100 p-4 mt-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "data": [
    {
      "symbol": "AAPL",
      "price": 180.50,
      "change": 2.45,
      "volume": 58234000,
      "rsi": 65.3,
      "explanation": "Strong momentum with RSI in bullish zone..."
    }
  ],
  "meta": {
    "count": 1,
    "page": 1
  }
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section data-section="integrations" id="integrations" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Integrations
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Connect TraderCloud with your favorite trading tools and platforms.
          </p>

          <h3 className="text-2xl font-bold">Available Integrations</h3>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {[
              { name: "TradingView", description: "Export watchlists and alerts to TradingView", plan: "Pro+" },
              { name: "Discord", description: "Post alerts and updates to Discord channels", plan: "Pro+" },
              { name: "Slack", description: "Receive notifications in Slack", plan: "Pro+" },
              { name: "Telegram", description: "Get alerts via Telegram bot", plan: "Ultra" },
              { name: "Interactive Brokers", description: "Auto-execute trades (coming soon)", plan: "Enterprise" },
              { name: "Zapier", description: "Connect to 3,000+ apps via Zapier", plan: "Pro+" },
            ].map((integration, i) => (
              <div key={i} className="rounded-lg border bg-white p-4">
                <h4 className="font-semibold mb-2">{integration.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{integration.plan}</span>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold mt-8">Webhook Integration</h3>
          <p>
            Send alerts to any custom webhook URL. Perfect for building your own integrations.
          </p>
          <div className="rounded-lg border bg-gray-900 text-gray-100 p-4 mt-4">
            <pre className="text-sm overflow-x-auto">
              <code>{`{
  "event": "alert_triggered",
  "symbol": "AAPL",
  "condition": "price > 180",
  "timestamp": "2025-11-03T14:30:00Z",
  "data": {
    "price": 180.50,
    "volume": 58234000
  }
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Custom Models */}
      <section data-section="custom-models" id="custom-models" className="scroll-mt-20">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">
          Custom AI Models
        </h1>
        
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Train custom AI models on your own trading strategies (Pro+ and above).
          </p>

          <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-6">
            <h3 className="mb-2 font-semibold text-purple-900">🎯 Advanced Feature</h3>
            <p className="text-purple-800">
              Custom AI models allow you to train the AI on your specific trading style and preferences.
            </p>
          </div>

          <h3 className="text-2xl font-bold mt-8">How It Works</h3>
          <ol className="space-y-4 mt-4">
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-bold">1</div>
              <div>
                <h4 className="font-semibold mb-1">Upload Historical Trades</h4>
                <p className="text-sm text-muted-foreground">
                  Import your past trades with entry/exit prices and reasons
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-bold">2</div>
              <div>
                <h4 className="font-semibold mb-1">AI Learns Your Patterns</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes what made your winners successful
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-bold">3</div>
              <div>
                <h4 className="font-semibold mb-1">Get Personalized Recommendations</h4>
                <p className="text-sm text-muted-foreground">
                  Receive alerts for setups matching your proven strategy
                </p>
              </div>
            </li>
          </ol>

          <h3 className="text-2xl font-bold mt-8">Model Performance</h3>
          <p>
            Track how well your custom model performs over time with detailed analytics:
          </p>
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Accuracy Score</h4>
              <p className="text-sm text-muted-foreground">
                Percentage of correct predictions
              </p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold mb-2">Confidence Levels</h4>
              <p className="text-sm text-muted-foreground">
                How certain the model is about each pick
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-6 mt-8">
            <h3 className="mb-2 font-semibold text-yellow-900">⚠️ Note</h3>
            <p className="text-yellow-800">
              Custom models require at least 50 historical trades to train effectively. The more data you provide, the better the results.
            </p>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <div className="mt-16 rounded-xl border-2 bg-muted/30 p-8">
        <h3 className="mb-4 text-xl font-bold">Need more help?</h3>
        <div className="flex gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-background hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Ask our AI assistant
          </Link>
          <Link
            href="https://discord.gg/tradercloud"
            className="inline-flex items-center gap-2 rounded-lg border-2 px-6 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <Users className="h-4 w-4" />
            Join Discord community
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
