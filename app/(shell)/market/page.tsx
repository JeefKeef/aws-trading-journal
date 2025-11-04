"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const marketChartData = [
  { time: "09:30", value: 5100, volume: 180 },
  { time: "10:00", value: 5115, volume: 220 },
  { time: "10:30", value: 5108, volume: 195 },
  { time: "11:00", value: 5125, volume: 240 },
  { time: "11:30", value: 5118, volume: 210 },
  { time: "12:00", value: 5128, volume: 185 },
  { time: "12:30", value: 5122, volume: 175 },
  { time: "13:00", value: 5135, volume: 230 },
  { time: "13:30", value: 5140, volume: 250 },
  { time: "14:00", value: 5145, volume: 265 },
];

const sectorPerformanceData = [
  { sector: "Tech", performance: 2.4 },
  { sector: "Comm", performance: 1.8 },
  { sector: "Consumer", performance: 1.2 },
  { sector: "Industrial", performance: 0.6 },
  { sector: "Health", performance: 0.3 },
  { sector: "Financial", performance: -0.2 },
  { sector: "Materials", performance: -0.7 },
  { sector: "Energy", performance: -1.4 },
];

const chartConfig = {
  value: {
    label: "Price",
    color: "#171717",
  },
  volume: {
    label: "Volume",
    color: "#737373",
  },
  performance: {
    label: "Performance",
    color: "#10b981",
  },
};

export default function MarketOverviewPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Top Row - Charts as Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* S&P 500 Chart Tile */}
        <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-xs font-semibold text-neutral-900 mb-2 dark:text-neutral-100">S&P 500 Intraday</h3>
          <ChartContainer config={chartConfig} className="h-32 w-full">
            <AreaChart data={marketChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
              <XAxis dataKey="time" className="text-[9px]" tick={{ fontSize: 9 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#171717" 
                fill="#f5f5f5" 
                strokeWidth={1.5}
              />
            </AreaChart>
          </ChartContainer>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-neutral-500">5,145.20</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <TrendingUp className="h-3 w-3" />
              +0.88%
            </span>
          </div>
        </div>

        {/* Sector Performance Chart Tile */}
        <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-xs font-semibold text-neutral-900 mb-2 dark:text-neutral-100">Sector Performance</h3>
          <ChartContainer config={chartConfig} className="h-32 w-full">
            <BarChart data={sectorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
              <XAxis dataKey="sector" className="text-[9px]" tick={{ fontSize: 9 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="performance" radius={[2, 2, 0, 0]}>
                {sectorPerformanceData.map((entry, index) => (
                  <Bar
                    key={`bar-${index}`}
                    dataKey="performance"
                    fill={entry.performance >= 0 ? "#10b981" : "#f43f5e"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Market Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "S&P 500", value: "5,145.20", change: "+0.88%", positive: true },
          { label: "DOW", value: "38,512.32", change: "+0.52%", positive: true },
          { label: "NASDAQ", value: "16,523.45", change: "+1.15%", positive: true },
          { label: "VIX", value: "14.82", change: "-0.45", positive: false },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
            <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {stat.label}
            </p>
            <p className="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">
              {stat.value}
            </p>
            <p className={`text-xs font-semibold ${stat.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Top Movers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Gainers */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 dark:text-neutral-400">
            Top Gainers
          </h3>
          <div className="space-y-2">
            {[
              { symbol: "NVDA", name: "NVIDIA Corp", price: "$874.15", change: "+4.8%" },
              { symbol: "AMD", name: "Advanced Micro Devices", price: "$182.34", change: "+3.2%" },
              { symbol: "TSLA", name: "Tesla Inc", price: "$203.14", change: "+2.9%" },
            ].map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">{stock.symbol}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">{stock.price}</p>
                  <p className="text-xs font-medium text-emerald-600">{stock.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 dark:text-neutral-400">
            Top Losers
          </h3>
          <div className="space-y-2">
            {[
              { symbol: "XOM", name: "Exxon Mobil", price: "$118.22", change: "-2.4%" },
              { symbol: "CVX", name: "Chevron Corp", price: "$154.87", change: "-1.9%" },
              { symbol: "BA", name: "Boeing Co", price: "$189.45", change: "-1.6%" },
            ].map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-900">{stock.symbol}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-neutral-900">{stock.price}</p>
                  <p className="text-xs font-medium text-rose-600">{stock.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
