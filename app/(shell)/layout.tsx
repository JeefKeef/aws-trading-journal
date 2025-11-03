"use client";

import type { ReactNode } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  RightPaneProvider,
  useRightPane,
} from "@/components/layout/right-pane-context";
import type { ToolState } from "@/components/layout/right-pane-context";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <RightPaneProvider>
      <div className="flex h-full w-full flex-col">
        <div className="hidden h-full w-full md:flex">
          <ResizablePanelGroup direction="horizontal" className="h-full w-full">
            <ResizablePanel defaultSize={30} minSize={25}>
              <section className="flex h-full min-h-0 flex-col bg-white">
                {children}
              </section>
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-neutral-200" />
            <ResizablePanel defaultSize={70} minSize={40}>
              <RightPane />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="flex h-full w-full flex-col md:hidden">
          <section className="flex h-full min-h-0 flex-col border-b border-neutral-200 bg-white">
            {children}
          </section>
          <RightPane />
        </div>
      </div>
    </RightPaneProvider>
  );
}

function RightPane() {
  const { state } = useRightPane();
  return (
    <aside className="flex h-full min-h-[50vh] flex-col border-neutral-200 bg-white md:border-l">
      <div className="border-b border-neutral-200 px-6 py-5">
        <p className="text-sm font-semibold text-neutral-900">
          {state.heading}
        </p>
        {state.description ? (
          <p className="text-xs text-neutral-500">{state.description}</p>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
        {renderToolContent(state)}
      </div>
    </aside>
  );
}

function renderToolContent(state: ToolState) {
  switch (state.mode) {
    case "screener":
      return <ScreenerView data={state.payload} />;
    case "heatmap":
      return <HeatmapView data={state.payload} />;
    case "news":
      return <NewsView data={state.payload} />;
    case "alerts":
      return <AlertsView data={state.payload} />;
    case "overview":
    default:
      return <OverviewCards data={state.payload} />;
  }
}

function OverviewCards({ data }: { data: unknown }) {
  const cards =
    (Array.isArray(data) ? data : overviewFallbackData) as Array<{
      label: string;
      value: string;
      delta: string;
    }>;

  return cards.map((card) => (
    <div
      key={card.label}
      className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
        {card.label}
      </p>
      <p className="mt-3 text-xl font-semibold text-neutral-900">
        {card.value}
      </p>
      <p className="mt-2 text-xs text-emerald-600">{card.delta}</p>
    </div>
  ));
}

const overviewFallbackData = [
  {
    label: "Market breadth",
    value: "63% advancers",
    delta: "+7.4% vs. 5-day avg",
  },
  {
    label: "Volatility",
    value: "VIX 15.21",
    delta: "-0.8 pts intraday",
  },
  {
    label: "Rotation",
    value: "Tech → Energy",
    delta: "Momentum leadership pivoting",
  },
];

function ScreenerView({ data }: { data: unknown }) {
  const rows =
    (Array.isArray(data) ? data : screenerFallback) as Array<{
      symbol: string;
      name: string;
      sector: string;
      price: string;
      change: string;
      volume: string;
    }>;

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-6 gap-3 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
        <span>Symbol</span>
        <span>Name</span>
        <span>Sector</span>
        <span>Price</span>
        <span>Change</span>
        <span>Volume</span>
      </div>
      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div
            key={row.symbol}
            className="grid grid-cols-6 gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-sm text-neutral-700"
          >
            <span className="font-semibold text-neutral-900">
              {row.symbol}
            </span>
            <span>{row.name}</span>
            <span>{row.sector}</span>
            <span>{row.price}</span>
            <span className={row.change.startsWith("+") ? "text-emerald-600" : "text-rose-500"}>
              {row.change}
            </span>
            <span>{row.volume}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const screenerFallback = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    sector: "Semiconductors",
    price: "$874.15",
    change: "+2.4%",
    volume: "1.2x avg",
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    sector: "Software",
    price: "$428.71",
    change: "+1.1%",
    volume: "0.9x avg",
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil",
    sector: "Energy",
    price: "$118.22",
    change: "-0.6%",
    volume: "1.4x avg",
  },
];

function HeatmapView({ data }: { data: unknown }) {
  const tiles =
    (Array.isArray(data) ? data : heatmapFallback) as Array<{
      label: string;
      performance: number;
    }>;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {tiles.map((tile) => {
        const positive = tile.performance >= 0;
        return (
          <div
            key={tile.label}
            className={`rounded-2xl px-4 py-6 text-center text-sm font-semibold text-white shadow-inner ${
              positive
                ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                : "bg-gradient-to-br from-rose-400 to-rose-600"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/80">
              {tile.label}
            </p>
            <p className="mt-3 text-2xl">
              {tile.performance > 0 ? "+" : ""}
              {tile.performance.toFixed(1)}%
            </p>
          </div>
        );
      })}
    </div>
  );
}

const heatmapFallback = [
  { label: "Semis", performance: 3.2 },
  { label: "Cloud", performance: 1.6 },
  { label: "Energy", performance: -0.9 },
  { label: "Biotech", performance: -1.4 },
  { label: "Consumer", performance: 0.7 },
  { label: "Materials", performance: 2.1 },
];

function NewsView({ data }: { data: unknown }) {
  const stories =
    (Array.isArray(data) ? data : newsFallback) as Array<{
      headline: string;
      source: string;
      timestamp: string;
      summary: string;
    }>;

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <article
          key={story.headline}
          className="rounded-2xl border border-neutral-200 bg-white px-4 py-4"
        >
          <header className="flex items-center justify-between text-xs text-neutral-500">
            <span>{story.source}</span>
            <span>{story.timestamp}</span>
          </header>
          <h3 className="mt-2 text-sm font-semibold text-neutral-900">
            {story.headline}
          </h3>
          <p className="mt-2 text-xs text-neutral-600">{story.summary}</p>
        </article>
      ))}
    </div>
  );
}

const newsFallback = [
  {
    headline: "Semiconductor leaders consolidate on AI tailwinds",
    source: "Signal Desk",
    timestamp: "08:45 ET",
    summary:
      "NVDA, AMD, and AVGO print fresh highs as hyperscale demand accelerates. Analysts flag cyclical risk but flows remain constructive.",
  },
  {
    headline: "Energy complex reprices as crude slips 2%",
    source: "Macro Pulse",
    timestamp: "09:10 ET",
    summary:
      "Brent cools on supply build, while refiners outperform majors. Options skew implying another 3% move into week-end.",
  },
  {
    headline: "FOMC minutes hint at data-dependent pivot",
    source: "Rates Radar",
    timestamp: "09:32 ET",
    summary:
      "Language softens around balance sheet runoff. 2s10s steepens 8 bps with growth cyclicals catching a bid.",
  },
];

function AlertsView({ data }: { data: unknown }) {
  const alerts =
    (Array.isArray(data) ? data : alertsFallback) as Array<{
      title: string;
      detail: string;
      severity: "high" | "medium" | "low";
      time: string;
    }>;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.title}
          className={`rounded-2xl border px-4 py-3 ${
            alert.severity === "high"
              ? "border-rose-200 bg-rose-50"
              : alert.severity === "medium"
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <header className="flex items-center justify-between text-xs text-neutral-500">
            <span className="uppercase tracking-[0.3em]">{alert.severity}</span>
            <span>{alert.time}</span>
          </header>
          <h4 className="mt-2 text-sm font-semibold text-neutral-900">
            {alert.title}
          </h4>
          <p className="mt-1 text-xs text-neutral-700">{alert.detail}</p>
        </div>
      ))}
    </div>
  );
}

const alertsFallback = [
  {
    title: "Intraday momentum trigger for NVDA",
    detail: "Price rejected 875 level twice. Watch for breakout confirmation with >1.5x volume.",
    severity: "high",
    time: "09:20 ET",
  },
  {
    title: "Crude volatility expansion",
    detail: "OVX prints 3-sigma move. Evaluate hedge structure on energy exposures.",
    severity: "medium",
    time: "09:05 ET",
  },
  {
    title: "EURUSD data check",
    detail: "ECB speaker at 11:00 ET may shift rate expectations. Prep FX playbook.",
    severity: "low",
    time: "08:55 ET",
  },
];
