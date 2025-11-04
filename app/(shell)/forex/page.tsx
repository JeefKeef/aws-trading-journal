"use client";

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ForexPage() {
  const pairs = [
    { pair: "EUR/USD", name: "Euro / US Dollar", rate: 1.0842, change: 0.15, bid: 1.0841, ask: 1.0843, volume: "High" },
    { pair: "GBP/USD", name: "British Pound / US Dollar", rate: 1.2615, change: -0.22, bid: 1.2614, ask: 1.2616, volume: "High" },
    { pair: "USD/JPY", name: "US Dollar / Japanese Yen", rate: 149.85, change: 0.45, bid: 149.84, ask: 149.86, volume: "High" },
    { pair: "AUD/USD", name: "Australian Dollar / US Dollar", rate: 0.6512, change: -0.18, bid: 0.6511, ask: 0.6513, volume: "Medium" },
    { pair: "USD/CAD", name: "US Dollar / Canadian Dollar", rate: 1.3625, change: 0.08, bid: 1.3624, ask: 1.3626, volume: "Medium" },
    { pair: "USD/CHF", name: "US Dollar / Swiss Franc", rate: 0.8745, change: 0.12, bid: 0.8744, ask: 0.8746, volume: "Medium" },
    { pair: "NZD/USD", name: "New Zealand Dollar / US Dollar", rate: 0.6125, change: -0.35, bid: 0.6124, ask: 0.6126, volume: "Low" },
    { pair: "EUR/GBP", name: "Euro / British Pound", rate: 0.8595, change: 0.28, bid: 0.8594, ask: 0.8596, volume: "Medium" },
  ];

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="h-full rounded-lg border border-neutral-200 bg-white overflow-auto relative">
        <Table>
          <TableHeader className="bg-neutral-50 sticky top-0 z-10 dark:bg-neutral-900">
            <TableRow>
              <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Pair</TableHead>
              <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Name</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Rate</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Change %</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Bid</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Ask</TableHead>
              <TableHead className="text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500">Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pairs.map((pair) => (
              <TableRow key={pair.pair} className="cursor-pointer">
                <TableCell className="px-4 py-3 text-sm font-bold text-neutral-900">{pair.pair}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-neutral-700">{pair.name}</TableCell>
                <TableCell className="px-4 py-3 text-right text-sm font-semibold text-neutral-900">
                  {pair.rate.toFixed(4)}
                </TableCell>
                <TableCell className={`px-4 py-3 text-right text-sm font-bold ${
                  pair.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600">{pair.bid.toFixed(4)}</TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600">{pair.ask.toFixed(4)}</TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 text-[10px] font-medium rounded ${
                    pair.volume === 'High' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : pair.volume === 'Medium' 
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    {pair.volume}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
