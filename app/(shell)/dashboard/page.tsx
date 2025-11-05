"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Target, Percent, ArrowUpRight, ArrowDownRight, Activity, Clock } from "lucide-react";
import { getTradesByStatus } from "@/lib/data/mock-data";
import { useMemo } from "react";

export default function DashboardPage() {
  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const closedTrades = getTradesByStatus("closed");
    const openTrades = getTradesByStatus("open");
    
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
    const winningTrades = closedTrades.filter((t) => (t.profitLoss || 0) > 0);
    const losingTrades = closedTrades.filter((t) => (t.profitLoss || 0) < 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    const avgWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / winningTrades.length 
      : 0;
    
    const avgLoss = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / losingTrades.length)
      : 0;

    const profitFactor = avgLoss > 0 ? (avgWin * winningTrades.length) / (avgLoss * losingTrades.length) : 0;
    const riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : 0;

    // Recent trades (last 10 closed)
    const recentTrades = closedTrades.slice(0, 10);

    // Calculate streaks
    let currentStreak = 0;
    let streakType: 'win' | 'loss' | null = null;
    for (let i = 0; i < closedTrades.length; i++) {
      const pnl = closedTrades[i].profitLoss || 0;
      if (i === 0) {
        streakType = pnl > 0 ? 'win' : 'loss';
        currentStreak = 1;
      } else {
        const isWin = pnl > 0;
        if ((isWin && streakType === 'win') || (!isWin && streakType === 'loss')) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Best and worst trades
    const bestTrade = closedTrades.reduce((max, trade) => 
      (trade.profitLoss || 0) > (max.profitLoss || 0) ? trade : max, 
      closedTrades[0]
    );
    const worstTrade = closedTrades.reduce((min, trade) => 
      (trade.profitLoss || 0) < (min.profitLoss || 0) ? trade : min, 
      closedTrades[0]
    );

    // Daily performance (simulated - group by date)
    const dailyPerformance = closedTrades.reduce((acc, trade) => {
      const date = new Date(trade.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { pnl: 0, trades: 0 };
      }
      acc[date].pnl += trade.profitLoss || 0;
      acc[date].trades += 1;
      return acc;
    }, {} as Record<string, { pnl: number; trades: number }>);

    const avgDailyPnL = Object.keys(dailyPerformance).length > 0
      ? Object.values(dailyPerformance).reduce((sum, day) => sum + day.pnl, 0) / Object.keys(dailyPerformance).length
      : 0;

    return {
      totalPnL,
      winRate,
      totalTrades: closedTrades.length,
      openPositions: openTrades.length,
      avgWin,
      avgLoss,
      profitFactor,
      riskRewardRatio,
      recentTrades,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      currentStreak,
      streakType,
      bestTrade,
      worstTrade,
      avgDailyPnL,
      activeDays: Object.keys(dailyPerformance).length,
    };
  }, []);

  return (
    <div className="h-full overflow-auto bg-neutral-50 dark:bg-neutral-950">
      <div className="p-4 space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">Performance Dashboard</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {metrics.activeDays} trading days · {metrics.totalTrades} closed positions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={metrics.totalPnL >= 0 ? "default" : "destructive"} className="text-xs font-mono">
              {metrics.totalPnL >= 0 ? '+' : ''}{metrics.totalPnL.toFixed(2)} USD
            </Badge>
          </div>
        </div>

        {/* Compact Metrics Grid - 6 columns */}
        <div className="grid grid-cols-6 gap-2">
          {/* Win Rate */}
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Win Rate</span>
                <Percent className="h-3 w-3 text-neutral-400" />
              </div>
              <div className="text-xl font-bold text-neutral-900 dark:text-white">
                {metrics.winRate.toFixed(0)}%
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {metrics.winningTrades}W-{metrics.losingTrades}L
              </p>
            </CardContent>
          </Card>

          {/* Profit Factor */}
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">P-Factor</span>
                <Target className="h-3 w-3 text-neutral-400" />
              </div>
              <div className={`text-xl font-bold ${metrics.profitFactor >= 2 ? 'text-emerald-600 dark:text-emerald-400' : metrics.profitFactor >= 1 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {metrics.profitFactor > 0 ? metrics.profitFactor.toFixed(2) : '0.00'}
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {metrics.profitFactor >= 2 ? 'Excellent' : metrics.profitFactor >= 1 ? 'Good' : 'Poor'}
              </p>
            </CardContent>
          </Card>

          {/* R:R Ratio */}
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">R:R</span>
                <Activity className="h-3 w-3 text-neutral-400" />
              </div>
              <div className="text-xl font-bold text-neutral-900 dark:text-white">
                {metrics.riskRewardRatio > 0 ? metrics.riskRewardRatio.toFixed(2) : '0.00'}
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Risk/Reward
              </p>
            </CardContent>
          </Card>

          {/* Avg Daily P&L */}
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Avg Day</span>
                <Clock className="h-3 w-3 text-neutral-400" />
              </div>
              <div className={`text-xl font-bold ${metrics.avgDailyPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {metrics.avgDailyPnL >= 0 ? '+' : ''}{metrics.avgDailyPnL.toFixed(0)}
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Per day
              </p>
            </CardContent>
          </Card>

          {/* Avg Win */}
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Avg Win</span>
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                +{metrics.avgWin.toFixed(0)}
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {metrics.winningTrades} trades
              </p>
            </CardContent>
          </Card>

          {/* Avg Loss */}
          <Card className="border-neutral-200 dark:border-neutral-800">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Avg Loss</span>
                <ArrowDownRight className="h-3 w-3 text-rose-500" />
              </div>
              <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
                -{metrics.avgLoss.toFixed(0)}
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {metrics.losingTrades} trades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Recent Trades - Spans 2 columns */}
          <Card className="col-span-2 border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-3 px-4 pt-4">
              <CardTitle className="text-sm font-semibold">Recent Trades</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="text-left py-2 px-4 font-medium text-neutral-500 dark:text-neutral-400">Ticker</th>
                      <th className="text-left py-2 px-4 font-medium text-neutral-500 dark:text-neutral-400">Type</th>
                      <th className="text-left py-2 px-4 font-medium text-neutral-500 dark:text-neutral-400">Setup</th>
                      <th className="text-right py-2 px-4 font-medium text-neutral-500 dark:text-neutral-400">Entry</th>
                      <th className="text-right py-2 px-4 font-medium text-neutral-500 dark:text-neutral-400">Exit</th>
                      <th className="text-right py-2 px-4 font-medium text-neutral-500 dark:text-neutral-400">P&L</th>
                      <th className="text-right py-2 px-4 font-medium text-neutral-500 dark:text-neutral-400">Return</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {metrics.recentTrades.map((trade) => (
                      <tr key={trade.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition">
                        <td className="py-2 px-4 font-semibold text-neutral-900 dark:text-white">{trade.ticker}</td>
                        <td className="py-2 px-4">
                          <Badge variant={trade.type === 'LONG' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                            {trade.type}
                          </Badge>
                        </td>
                        <td className="py-2 px-4 text-neutral-600 dark:text-neutral-400">{trade.setup}</td>
                        <td className="py-2 px-4 text-right font-mono text-neutral-600 dark:text-neutral-400">
                          ${trade.entryPrice.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-neutral-600 dark:text-neutral-400">
                          ${trade.exitPrice?.toFixed(2)}
                        </td>
                        <td className={`py-2 px-4 text-right font-mono font-semibold ${
                          (trade.profitLoss || 0) >= 0 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {(trade.profitLoss || 0) >= 0 ? '+' : ''}{(trade.profitLoss || 0).toFixed(2)}
                        </td>
                        <td className={`py-2 px-4 text-right font-mono text-xs ${
                          (trade.profitLossPercentage || 0) >= 0 
                            ? 'text-emerald-600 dark:text-emerald-400' 
                            : 'text-rose-600 dark:text-rose-400'
                        }`}>
                          {(trade.profitLossPercentage || 0) >= 0 ? '+' : ''}{(trade.profitLossPercentage || 0).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Stats Column */}
          <div className="space-y-4">
            {/* Current Streak */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Current Streak</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="flex items-center gap-2">
                  {metrics.streakType === 'win' ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/20">
                      <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                  )}
                  <div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {metrics.currentStreak}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {metrics.streakType === 'win' ? 'Winning' : 'Losing'} trades
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Trade */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Best Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                {metrics.bestTrade ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {metrics.bestTrade.ticker}
                      </span>
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                        {metrics.bestTrade.type}
                      </Badge>
                    </div>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      +${(metrics.bestTrade.profitLoss || 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {metrics.bestTrade.setup}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">No trades yet</p>
                )}
              </CardContent>
            </Card>

            {/* Worst Trade */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  Worst Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                {metrics.worstTrade ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {metrics.worstTrade.ticker}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {metrics.worstTrade.type}
                      </Badge>
                    </div>
                    <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
                      ${(metrics.worstTrade.profitLoss || 0).toFixed(2)}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {metrics.worstTrade.setup}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">No trades yet</p>
                )}
              </CardContent>
            </Card>

            {/* Open Positions */}
            <Card className="border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2 px-4 pt-3">
                <CardTitle className="text-sm font-semibold">Open Positions</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">
                      {metrics.openPositions}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Active trades
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
