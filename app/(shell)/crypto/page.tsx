"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CryptoPage() {
  const cryptos = [
    { symbol: "BTC", name: "Bitcoin", price: 43250.50, change: 2.15, high24h: 43800.00, low24h: 42100.25, volume: "28.5B", marketCap: "845B" },
    { symbol: "ETH", name: "Ethereum", price: 2285.75, change: 3.42, high24h: 2320.50, low24h: 2205.00, volume: "15.2B", marketCap: "275B" },
    { symbol: "BNB", name: "Binance Coin", price: 315.25, change: -0.85, high24h: 320.50, low24h: 312.00, volume: "1.8B", marketCap: "48B" },
    { symbol: "SOL", name: "Solana", price: 98.50, change: 5.22, high24h: 102.75, low24h: 93.25, volume: "2.5B", marketCap: "42B" },
    { symbol: "XRP", name: "Ripple", price: 0.5245, change: -1.15, high24h: 0.5350, low24h: 0.5180, volume: "1.2B", marketCap: "28B" },
    { symbol: "ADA", name: "Cardano", price: 0.4850, change: 1.85, high24h: 0.4925, low24h: 0.4750, volume: "485M", marketCap: "17B" },
    { symbol: "AVAX", name: "Avalanche", price: 35.25, change: 4.15, high24h: 36.50, low24h: 33.75, volume: "625M", marketCap: "13B" },
    { symbol: "DOT", name: "Polkadot", price: 6.85, change: -2.25, high24h: 7.05, low24h: 6.75, volume: "285M", marketCap: "8.5B" },
  ];

  return (
    <div className="p-4 h-full overflow-hidden">
      <div className="h-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-auto relative">
        <Table>
          <TableHeader className="bg-neutral-50 sticky top-0 z-10 dark:bg-neutral-900">
            <TableRow>
              <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Symbol</TableHead>
              <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Name</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Price</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Change %</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">24h High</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">24h Low</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Volume</TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Mkt Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptos.map((crypto) => (
              <TableRow key={crypto.symbol} className="cursor-pointer">
                <TableCell className="px-4 py-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">{crypto.symbol}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-neutral-700 dark:text-neutral-300">{crypto.name}</TableCell>
                <TableCell className="px-4 py-3 text-right text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  ${crypto.price.toLocaleString()}
                </TableCell>
                <TableCell className={`px-4 py-3 text-right text-sm font-bold ${
                  crypto.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600 dark:text-neutral-400">
                  ${crypto.high24h.toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600 dark:text-neutral-400">
                  ${crypto.low24h.toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600 dark:text-neutral-400">{crypto.volume}</TableCell>
                <TableCell className="px-4 py-3 text-right text-xs text-neutral-600 dark:text-neutral-400">{crypto.marketCap}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
