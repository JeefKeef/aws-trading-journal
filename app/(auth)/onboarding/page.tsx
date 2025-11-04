"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, Zap, Target, DollarSign, Activity, BarChart3, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1: Trading Persona
  const [experience, setExperience] = useState("");
  const [tradingStyle, setTradingStyle] = useState("");
  const [marketType, setMarketType] = useState("");
  
  // Step 2: Market Focus
  const [sectors, setSectors] = useState<string[]>([]);
  const [indices, setIndices] = useState<string[]>([]);
  const [marketCap, setMarketCap] = useState("");
  
  // Step 3: AI Screening Goals
  const [screeningGoals, setScreeningGoals] = useState<string[]>([]);
  
  // Step 4: Save First Scan
  const [scanName, setScanName] = useState("");

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      router.push("/chat");
    }
  };

  const toggleSector = (sector: string) => {
    setSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const toggleIndex = (index: string) => {
    setIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const toggleScreeningGoal = (goal: string) => {
    setScreeningGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : [...prev, goal]
    );
  };

  const canProceed = () => {
    if (step === 1) return experience !== "" && tradingStyle !== "" && marketType !== "";
    if (step === 2) return sectors.length > 0 || indices.length > 0 || marketCap !== "";
    if (step === 3) return screeningGoals.length > 0;
    if (step === 4) return scanName.trim() !== "";
    return false;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 dark:border-neutral-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold">TraderCloud</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-foreground"
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-3">
                Define Your Trading Persona
              </h2>
              <p className="text-muted-foreground mb-8">
                Help us understand your trading profile
              </p>

              <div className="space-y-6">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium mb-3">Experience Level</label>
                  <div className="grid gap-3">
                    {[
                      { value: "beginner", label: "Beginner", desc: "Less than 1 year trading" },
                      { value: "intermediate", label: "Intermediate", desc: "1-3 years experience" },
                      { value: "advanced", label: "Advanced", desc: "3-5 years experience" },
                      { value: "professional", label: "Professional", desc: "5+ years or full-time" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setExperience(option.value)}
                        className={`text-left p-4 rounded-lg border-2 transition ${
                          experience === option.value
                            ? "border-foreground bg-muted/50"
                            : "border-gray-200 hover:border-gray-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                        }`}
                      >
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trading Style */}
                <div>
                  <label className="block text-sm font-medium mb-3">Trading Style</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { value: "day-trading", label: "Day Trading", icon: Zap },
                      { value: "swing-trading", label: "Swing Trading", icon: TrendingUp },
                      { value: "position-trading", label: "Position Trading", icon: Target },
                      { value: "scalping", label: "Scalping", icon: Activity },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTradingStyle(option.value)}
                        className={`text-left p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                          tradingStyle === option.value
                            ? "border-foreground bg-muted/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <option.icon className="h-5 w-5" />
                        <span className="font-semibold">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Market Type */}
                <div>
                  <label className="block text-sm font-medium mb-3">Primary Market</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { value: "stocks", label: "Stocks" },
                      { value: "options", label: "Options" },
                      { value: "crypto", label: "Crypto" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMarketType(option.value)}
                        className={`p-4 rounded-lg border-2 transition font-semibold ${
                          marketType === option.value
                            ? "border-foreground bg-muted/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-3">
                Choose Your Market Focus
              </h2>
              <p className="text-muted-foreground mb-8">
                Select the sectors, indices, and market caps you want to track
              </p>

              <div className="space-y-6">
                {/* Sectors */}
                <div>
                  <label className="block text-sm font-medium mb-3">Sectors (select multiple)</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      "Technology",
                      "Healthcare",
                      "Financial Services",
                      "Consumer Cyclical",
                      "Energy",
                      "Industrials",
                      "Consumer Defensive",
                      "Real Estate",
                    ].map((sector) => (
                      <button
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className={`text-left p-3 rounded-lg border-2 transition text-sm ${
                          sectors.includes(sector)
                            ? "border-foreground bg-muted/50 font-medium"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Indices */}
                <div>
                  <label className="block text-sm font-medium mb-3">Track Indices (optional)</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      "S&P 500",
                      "NASDAQ",
                      "Dow Jones",
                      "Russell 2000",
                      "QQQ",
                      "SPY",
                    ].map((index) => (
                      <button
                        key={index}
                        onClick={() => toggleIndex(index)}
                        className={`p-3 rounded-lg border-2 transition text-sm font-semibold ${
                          indices.includes(index)
                            ? "border-foreground bg-muted/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {index}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Market Cap */}
                <div>
                  <label className="block text-sm font-medium mb-3">Market Cap Preference</label>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {[
                      { value: "mega", label: "Mega Cap", desc: "$200B+" },
                      { value: "large", label: "Large Cap", desc: "$10B-$200B" },
                      { value: "mid", label: "Mid Cap", desc: "$2B-$10B" },
                      { value: "small", label: "Small Cap", desc: "Under $2B" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMarketCap(option.value)}
                        className={`text-left p-3 rounded-lg border-2 transition ${
                          marketCap === option.value
                            ? "border-foreground bg-muted/50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-semibold text-sm">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-3">
                Set AI Screening Goals
              </h2>
              <p className="text-muted-foreground mb-8">
                What setups or patterns should the AI look for?
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Breakout Patterns", icon: TrendingUp },
                  { label: "High Volume Spikes", icon: BarChart3 },
                  { label: "Support/Resistance Levels", icon: Target },
                  { label: "Moving Average Crossovers", icon: Activity },
                  { label: "RSI Oversold/Overbought", icon: Zap },
                  { label: "MACD Signals", icon: Activity },
                  { label: "Unusual Options Activity", icon: Target },
                  { label: "Dark Pool Prints", icon: DollarSign },
                  { label: "Gap Up/Down Plays", icon: TrendingUp },
                  { label: "Earnings Momentum", icon: BarChart3 },
                  { label: "Institutional Buying", icon: DollarSign },
                  { label: "Short Squeeze Candidates", icon: Zap },
                ].map((goal) => (
                  <button
                    key={goal.label}
                    onClick={() => toggleScreeningGoal(goal.label)}
                    className={`text-left p-4 rounded-lg border-2 transition flex items-center gap-3 ${
                      screeningGoals.includes(goal.label)
                        ? "border-foreground bg-muted/50 font-medium"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <goal.icon className="h-5 w-5" />
                    <span>{goal.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold mb-3">
                Save Your First AI Scan
              </h2>
              <p className="text-muted-foreground mb-8">
                Give your personalized scan preset a name so you can run it anytime
              </p>

              <div className="space-y-6">
                {/* Scan Summary */}
                <div className="rounded-xl border-2 bg-muted/30 p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Your Scan Configuration
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Experience: </span>
                      <span className="font-medium capitalize">{experience}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Style: </span>
                      <span className="font-medium capitalize">{tradingStyle.replace('-', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Market: </span>
                      <span className="font-medium capitalize">{marketType}</span>
                    </div>
                    {sectors.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Sectors: </span>
                        <span className="font-medium">{sectors.join(", ")}</span>
                      </div>
                    )}
                    {marketCap && (
                      <div>
                        <span className="text-muted-foreground">Market Cap: </span>
                        <span className="font-medium capitalize">{marketCap}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Goals: </span>
                      <span className="font-medium">{screeningGoals.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label htmlFor="scanName" className="block text-sm font-medium mb-2">
                    Scan Preset Name
                  </label>
                  <div className="relative">
                    <Save className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      id="scanName"
                      type="text"
                      value={scanName}
                      onChange={(e) => setScanName(e.target.value)}
                      placeholder="e.g., My Tech Breakouts, Daily Momentum Plays..."
                      className="w-full rounded-lg border-2 bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    You can create more scans later, but let&apos;s start with your first one
                  </p>
                </div>

                {/* Quick Examples */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Quick examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "My Daily Momentum",
                      "Tech Breakouts",
                      "Swing Trade Setups",
                      "High Volume Plays",
                    ].map((example) => (
                      <button
                        key={example}
                        onClick={() => setScanName(example)}
                        className="text-xs px-3 py-1.5 rounded-full border hover:bg-muted transition"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:bg-background hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground disabled:hover:text-background"
          >
            {step === totalSteps ? "Get Started" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Skip */}
        {step < totalSteps && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/chat")}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Skip for now
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
