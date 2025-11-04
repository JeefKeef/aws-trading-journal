"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function FuturesPage() {
  const futures = [
    { symbol: "ES", name: "S&P 500 Futures", price: 5145.25, change: 0.88, volume: "2.1M", open: 5120.50, high: 5148.75, low: 5115.00 },
    { symbol: "NQ", name: "NASDAQ Futures", price: 16525.50, change: 1.15, volume: "1.8M", open: 16480.25, high: 16540.00, low: 16475.50 },
    { symbol: "YM", name: "Dow Futures", price: 38515.00, change: 0.52, volume: "845K", open: 38450.00, high: 38525.00, low: 38440.00 },
    { symbol: "RTY", name: "Russell 2000 Futures", price: 2125.75, change: -0.32, volume: "625K", open: 2130.25, high: 2135.00, low: 2122.50 },
    { symbol: "CL", name: "Crude Oil", price: 78.25, change: -1.45, volume: "3.2M", open: 79.50, high: 79.85, low: 78.10 },
    { symbol: "GC", name: "Gold", price: 2045.80, change: 0.65, volume: "1.5M", open: 2038.50, high: 2048.20, low: 2036.00 },
    { symbol: "SI", name: "Silver", price: 24.35, change: 0.82, volume: "892K", open: 24.15, high: 24.42, low: 24.08 },
    { symbol: "NG", name: "Natural Gas", price: 2.85, change: -2.15, volume: "1.2M", open: 2.91, high: 2.94, low: 2.83 },
  ];

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="h-full rounded-lg border border-neutral-200 bg-white overflow-auto relative">
        <Table>
          <TableHeader className="bg-neutral-50 sticky top-0 z-10">
            <TableRow>
              <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Symbol</TableHead>
              <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Name</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Price</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Change %</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Open</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">High</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Low</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {futures.map((future) => (
              <TableRow key={future.symbol} className="cursor-pointer">
                <TableCell className="px-4 py-3 text-sm font-bold text-neutral-900">{future.symbol}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-neutral-700">{future.name}</TableCell>
                <TableCell className="px-4 py-3 text-right text-sm font-semibold text-neutral-900">
                  ${future.price.toFixed(2)}
                </TableCell>
                <TableCell className={`px-4 py-3 text-right text-sm font-bold ${
                  future.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {future.change >= 0 ? '+' : ''}{future.change.toFixed(2)}%
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600">${future.open.toFixed(2)}</TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600">${future.high.toFixed(2)}</TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600">${future.low.toFixed(2)}</TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600">{future.volume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
