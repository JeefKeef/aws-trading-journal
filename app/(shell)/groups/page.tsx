"use client";

export default function GroupsPage() {
  const groups = [
    { name: "Magnificent 7", tickers: ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"], avgChange: 1.45 },
    { name: "Semiconductors", tickers: ["NVDA", "AMD", "INTC", "TSM", "AVGO", "QCOM"], avgChange: 2.12 },
    { name: "Banks", tickers: ["JPM", "BAC", "WFC", "C", "GS", "MS"], avgChange: -0.34 },
    { name: "Energy", tickers: ["XOM", "CVX", "COP", "SLB", "EOG", "MPC"], avgChange: -1.23 },
    { name: "Healthcare", tickers: ["UNH", "JNJ", "LLY", "ABBV", "MRK", "PFE"], avgChange: 0.67 },
    { name: "Consumer Staples", tickers: ["WMT", "PG", "KO", "PEP", "COST", "PM"], avgChange: 0.45 },
    { name: "Industrial", tickers: ["CAT", "BA", "HON", "UNP", "GE", "MMM"], avgChange: 0.28 },
    { name: "Utilities", tickers: ["NEE", "DUK", "SO", "D", "AEP", "EXC"], avgChange: -0.15 },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {groups.map((group) => (
          <div key={group.name} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{group.name}</h3>
              <span className={`text-sm font-bold ${
                group.avgChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {group.avgChange >= 0 ? '+' : ''}{group.avgChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.tickers.map((ticker) => (
                <span 
                  key={ticker}
                  className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                >
                  {ticker}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
