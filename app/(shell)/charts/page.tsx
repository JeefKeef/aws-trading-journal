"use client";

import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis } from "recharts";
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

const chartConfig = {
  value: {
    label: "Price",
    color: "#171717",
  },
  volume: {
    label: "Volume",
    color: "#737373",
  },
};

export default function ChartsPage() {
  return (
    <div className="p-4 space-y-4">
      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volume Chart Tile */}
        <div className="rounded-lg border border-neutral-200 bg-white p-3">
          <h3 className="text-xs font-semibold text-neutral-900 mb-2">Market Volume</h3>
          <ChartContainer config={chartConfig} className="h-32 w-full">
            <BarChart data={marketChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
              <XAxis dataKey="time" className="text-[9px]" tick={{ fontSize: 9 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="volume" fill="#737373" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Price Trend Tile */}
        <div className="rounded-lg border border-neutral-200 bg-white p-3">
          <h3 className="text-xs font-semibold text-neutral-900 mb-2">Price Trend</h3>
          <ChartContainer config={chartConfig} className="h-32 w-full">
            <LineChart data={marketChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
              <XAxis dataKey="time" className="text-[9px]" tick={{ fontSize: 9 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#171717" 
                strokeWidth={1.5}
                dot={{ fill: '#171717', r: 2 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* Additional Chart Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-3">
          <h3 className="text-xs font-semibold text-neutral-900 mb-2">NASDAQ Composite</h3>
          <ChartContainer config={chartConfig} className="h-28 w-full">
            <LineChart data={marketChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
              <XAxis dataKey="time" className="text-[9px]" tick={{ fontSize: 9 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-3">
          <h3 className="text-xs font-semibold text-neutral-900 mb-2">DOW Jones</h3>
          <ChartContainer config={chartConfig} className="h-28 w-full">
            <LineChart data={marketChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
              <XAxis dataKey="time" className="text-[9px]" tick={{ fontSize: 9 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-3">
          <h3 className="text-xs font-semibold text-neutral-900 mb-2">Russell 2000</h3>
          <ChartContainer config={chartConfig} className="h-28 w-full">
            <LineChart data={marketChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200" />
              <XAxis dataKey="time" className="text-[9px]" tick={{ fontSize: 9 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
