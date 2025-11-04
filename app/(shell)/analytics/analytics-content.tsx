"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Download,
  ChevronDown,
  X,
  Filter as FilterIcon,
  MoreVertical,
  Maximize2,
  Table as TableIcon,
  FileDown,
  SlidersHorizontal,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  Cell,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data
const mockTrades = [
  { date: "2025-10-05", ticker: "AAPL", pl: 680, volume: 100, strategy: "Breakout", status: "WIN" },
  { date: "2025-10-06", ticker: "TSLA", pl: -187, volume: 50, strategy: "Reversal", status: "LOSS" },
  { date: "2025-10-07", ticker: "MSFT", pl: 648, volume: 75, strategy: "Momentum", status: "WIN" },
  { date: "2025-10-08", ticker: "GOOGL", pl: 510, volume: 150, strategy: "Gap Fill", status: "WIN" },
  { date: "2025-10-09", ticker: "META", pl: -309, volume: 30, strategy: "Reversal", status: "LOSS" },
  { date: "2025-10-10", ticker: "AMZN", pl: 550, volume: 100, strategy: "Earnings Play", status: "WIN" },
  { date: "2025-10-11", ticker: "SPY", pl: -260, volume: 200, strategy: "Momentum", status: "LOSS" },
  { date: "2025-10-12", ticker: "QQQ", pl: 990, volume: 150, strategy: "Breakout", status: "WIN" },
  { date: "2025-10-13", ticker: "AMD", pl: -120, volume: 80, strategy: "Support/Resistance", status: "LOSS" },
  { date: "2025-10-14", ticker: "NVDA", pl: 780, volume: 25, strategy: "Gap Fill", status: "WIN" },
  { date: "2025-10-15", ticker: "AAPL", pl: 450, volume: 100, strategy: "Momentum", status: "WIN" },
  { date: "2025-10-16", ticker: "TSLA", pl: -95, volume: 50, strategy: "Breakout", status: "LOSS" },
  { date: "2025-10-17", ticker: "MSFT", pl: 320, volume: 75, strategy: "Breakout", status: "WIN" },
  { date: "2025-10-18", ticker: "GOOGL", pl: 890, volume: 150, strategy: "Momentum", status: "WIN" },
  { date: "2025-10-21", ticker: "META", pl: 420, volume: 30, strategy: "Gap Fill", status: "WIN" },
  { date: "2025-10-22", ticker: "AMZN", pl: -180, volume: 100, strategy: "Reversal", status: "LOSS" },
  { date: "2025-10-23", ticker: "SPY", pl: 275, volume: 200, strategy: "Momentum", status: "WIN" },
  { date: "2025-10-24", ticker: "QQQ", pl: 540, volume: 150, strategy: "Breakout", status: "WIN" },
  { date: "2025-10-25", ticker: "AMD", pl: -210, volume: 80, strategy: "Earnings Play", status: "LOSS" },
  { date: "2025-10-26", ticker: "NVDA", pl: 920, volume: 25, strategy: "Gap Fill", status: "WIN" },
  { date: "2025-10-27", ticker: "AAPL", pl: 380, volume: 100, strategy: "Momentum", status: "WIN" },
  { date: "2025-10-28", ticker: "TSLA", pl: 640, volume: 50, strategy: "Breakout", status: "WIN" },
  { date: "2025-10-29", ticker: "MSFT", pl: -145, volume: 75, strategy: "Reversal", status: "LOSS" },
  { date: "2025-10-30", ticker: "GOOGL", pl: 710, volume: 150, strategy: "Momentum", status: "WIN" },
  { date: "2025-10-31", ticker: "META", pl: 490, volume: 30, strategy: "Gap Fill", status: "WIN" },
  { date: "2025-11-01", ticker: "AMZN", pl: -95, volume: 100, strategy: "Support/Resistance", status: "LOSS" },
  { date: "2025-11-02", ticker: "SPY", pl: 330, volume: 200, strategy: "Momentum", status: "WIN" },
  { date: "2025-11-03", ticker: "QQQ", pl: 820, volume: 150, strategy: "Breakout", status: "WIN" },
  { date: "2025-11-04", ticker: "AMD", pl: 560, volume: 80, strategy: "Momentum", status: "WIN" },
];

type AnalyticsTab = "Overview" | "Detailed" | "Win vs Loss Days" | "Drawdown" | "Compare" | "Tag Breakdown" | "Advanced";

type FilterCategory = {
  name: string;
  options: string[];
};

const filters: FilterCategory[] = [
  { name: "Symbol", options: ["Any", "AAPL", "TSLA", "MSFT", "GOOGL", "META", "AMZN", "SPY", "QQQ", "AMD", "NVDA", "NFLX", "DIS", "BA", "UBER"] },
  { name: "Tags", options: ["Any", "Breakout", "Reversal", "Momentum", "Support/Resistance", "Gap Fill", "Earnings Play", "Scalp", "Swing"] },
  { name: "Side", options: ["Any", "Long", "Short"] },
  { name: "Duration", options: ["Any", "Intraday", "Multiday", "< 1 Hour", "1-4 Hours", "4-8 Hours", "> 8 Hours"] },
];

type SubTab = "dt" | "ipv" | "ins" | "mkt" | "wl" | "liq";

export default function AnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const activeTab = (searchParams.get("tab") as AnalyticsTab) || "Overview";
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedButtonRect, setAdvancedButtonRect] = useState<DOMRect | null>(null);

  const setActiveTab = (tab: AnalyticsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    // Daily P/L for last 30 days
    const last30Days = mockTrades.slice(-30);
    const dailyPL = last30Days.map((trade) => ({
      date: new Date(trade.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      pl: trade.pl,
    }));

    // Cumulative P/L
    const cumulativePL = last30Days.reduce((acc, trade, index) => {
      const prevTotal = index > 0 ? acc[index - 1].total : 0;
      acc.push({
        date: new Date(trade.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total: prevTotal + trade.pl,
      });
      return acc;
    }, [] as Array<{ date: string; total: number }>);

    // Daily volume
    const dailyVolume = last30Days.map((trade) => ({
      date: new Date(trade.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      volume: trade.volume,
    }));

    // Win percentage by day
    const winsByDay = last30Days.reduce((acc, trade) => {
      const date = new Date(trade.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!acc[date]) {
        acc[date] = { wins: 0, total: 0 };
      }
      acc[date].total += 1;
      if (trade.status === "WIN") acc[date].wins += 1;
      return acc;
    }, {} as Record<string, { wins: number; total: number }>);

    const winPercentageData = Object.entries(winsByDay).map(([date, data]) => ({
      date,
      winRate: (data.wins / data.total) * 100,
    }));

    // Trade Distribution by Year
    const tradesByYear = mockTrades.reduce((acc, trade) => {
      const year = new Date(trade.date).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = { wins: 0, losses: 0, total: 0, pl: 0 };
      }
      acc[year].total += 1;
      acc[year].pl += trade.pl;
      if (trade.status === "WIN") acc[year].wins += 1;
      if (trade.status === "LOSS") acc[year].losses += 1;
      return acc;
    }, {} as Record<string, { wins: number; losses: number; total: number; pl: number }>);

    const tradeDistributionByYear = Object.entries(tradesByYear).map(([year, data]) => ({
      year,
      wins: data.wins,
      losses: -data.losses, // Negative for stacked bar
    }));

    const performanceByYear = Object.entries(tradesByYear).map(([year, data]) => ({
      year,
      pl: data.pl,
    }));

    // Trade Distribution by Month
    const tradesByMonth = mockTrades.reduce((acc, trade) => {
      const month = new Date(trade.date).toLocaleDateString("en-US", { month: "short" });
      if (!acc[month]) {
        acc[month] = { wins: 0, losses: 0, total: 0, pl: 0 };
      }
      acc[month].total += 1;
      acc[month].pl += trade.pl;
      if (trade.status === "WIN") acc[month].wins += 1;
      if (trade.status === "LOSS") acc[month].losses += 1;
      return acc;
    }, {} as Record<string, { wins: number; losses: number; total: number; pl: number }>);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const tradeDistributionByMonth = months.map((month) => ({
      month,
      wins: tradesByMonth[month]?.wins || 0,
      losses: -(tradesByMonth[month]?.losses || 0),
    }));

    const performanceByMonth = months.map((month) => ({
      month,
      pl: tradesByMonth[month]?.pl || 0,
    }));

    // Trade Distribution by Day of Month
    const tradesByDay = mockTrades.reduce((acc, trade) => {
      const day = new Date(trade.date).getDate();
      if (!acc[day]) {
        acc[day] = { wins: 0, losses: 0, total: 0, pl: 0 };
      }
      acc[day].total += 1;
      acc[day].pl += trade.pl;
      if (trade.status === "WIN") acc[day].wins += 1;
      if (trade.status === "LOSS") acc[day].losses += 1;
      return acc;
    }, {} as Record<number, { wins: number; losses: number; total: number; pl: number }>);

    const tradeDistributionByDay = Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return {
        day: day.toString(),
        wins: tradesByDay[day]?.wins || 0,
        losses: -(tradesByDay[day]?.losses || 0),
      };
    });

    const performanceByDay = Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return {
        day: day.toString(),
        pl: tradesByDay[day]?.pl || 0,
      };
    });

    // Trade Distribution by Day of Week
    const tradesByDayOfWeek = mockTrades.reduce((acc, trade) => {
      const dayOfWeek = new Date(trade.date).toLocaleDateString("en-US", { weekday: "short" });
      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = { wins: 0, losses: 0, total: 0, pl: 0 };
      }
      acc[dayOfWeek].total += 1;
      acc[dayOfWeek].pl += trade.pl;
      if (trade.status === "WIN") acc[dayOfWeek].wins += 1;
      if (trade.status === "LOSS") acc[dayOfWeek].losses += 1;
      return acc;
    }, {} as Record<string, { wins: number; losses: number; total: number; pl: number }>);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const tradeDistributionByDayOfWeek = daysOfWeek.map((day) => ({
      day,
      wins: tradesByDayOfWeek[day]?.wins || 0,
      losses: -(tradesByDayOfWeek[day]?.losses || 0),
    }));

    const performanceByDayOfWeek = daysOfWeek.map((day) => ({
      day,
      pl: tradesByDayOfWeek[day]?.pl || 0,
    }));

    // Trade Distribution by Hour of Day (mock data)
    const tradeDistributionByHour = [
      { hour: "6:00", wins: 1, losses: -1 },
      { hour: "7:00", wins: 2, losses: -1 },
      { hour: "8:00", wins: 3, losses: -2 },
      { hour: "9:00", wins: 5, losses: -2 },
      { hour: "10:00", wins: 4, losses: -3 },
      { hour: "11:00", wins: 3, losses: -1 },
      { hour: "12:00", wins: 2, losses: -2 },
      { hour: "13:00", wins: 4, losses: -1 },
      { hour: "14:00", wins: 5, losses: -2 },
      { hour: "15:00", wins: 4, losses: -3 },
      { hour: "16:00", wins: 3, losses: -2 },
      { hour: "17:00", wins: 2, losses: -1 },
      { hour: "18:00", wins: 1, losses: -1 },
      { hour: "19:00", wins: 1, losses: 0 },
      { hour: "20:00", wins: 0, losses: -1 },
    ];

    const performanceByHour = [
      { hour: "6:00", pl: 150 },
      { hour: "7:00", pl: 320 },
      { hour: "8:00", pl: 480 },
      { hour: "9:00", pl: 890 },
      { hour: "10:00", pl: 420 },
      { hour: "11:00", pl: 680 },
      { hour: "12:00", pl: -120 },
      { hour: "13:00", pl: 540 },
      { hour: "14:00", pl: 760 },
      { hour: "15:00", pl: 310 },
      { hour: "16:00", pl: 220 },
      { hour: "17:00", pl: 180 },
      { hour: "18:00", pl: -80 },
      { hour: "19:00", pl: 90 },
      { hour: "20:00", pl: -150 },
    ];

    // Trade Distribution by Duration
    const tradeDistributionByDuration = [
      { duration: "Intraday", wins: 15, losses: -8 },
      { duration: "Multiday", wins: 10, losses: -4 },
    ];

    const performanceByDuration = [
      { duration: "Intraday", pl: 5240 },
      { duration: "Multiday", pl: 3420 },
    ];

    // Trade Distribution by Intraday Duration
    const tradeDistributionByIntradayDuration = [
      { duration: "< 1:00", wins: 2, losses: -3 },
      { duration: "1:00 - 1:59", wins: 3, losses: -2 },
      { duration: "2:00 - 4:59", wins: 5, losses: -1 },
      { duration: "5:00 - 9:59", wins: 4, losses: -2 },
      { duration: "10:00 - 19:59", wins: 6, losses: -3 },
      { duration: "20:00 - 39:59", wins: 3, losses: -1 },
      { duration: "40:00 - 59:59", wins: 2, losses: -2 },
      { duration: "1:00:00 - 1:59:59", wins: 4, losses: -1 },
      { duration: "2:00:00 - 3:59:59", wins: 3, losses: -2 },
      { duration: "4:00:00 >", wins: 1, losses: -1 },
    ];

    const performanceByIntradayDuration = [
      { duration: "< 1:00", pl: -180 },
      { duration: "1:00 - 1:59", pl: 240 },
      { duration: "2:00 - 4:59", pl: 820 },
      { duration: "5:00 - 9:59", pl: 640 },
      { duration: "10:00 - 19:59", pl: 1120 },
      { duration: "20:00 - 39:59", pl: 680 },
      { duration: "40:00 - 59:59", pl: 320 },
      { duration: "1:00:00 - 1:59:59", pl: 890 },
      { duration: "2:00:00 - 3:59:59", pl: 560 },
      { duration: "4:00:00 >", pl: 180 },
    ];

    // Instrument data (mock data for now)
    const topSymbols = mockTrades
      .reduce((acc, trade) => {
        const existing = acc.find(t => t.symbol === trade.ticker);
        if (existing) {
          existing.pl += trade.pl;
        } else {
          acc.push({ symbol: trade.ticker, pl: trade.pl });
        }
        return acc;
      }, [] as Array<{ symbol: string; pl: number }>)
      .sort((a, b) => b.pl - a.pl)
      .slice(0, 20);

    const bottomSymbols = mockTrades
      .reduce((acc, trade) => {
        const existing = acc.find(t => t.symbol === trade.ticker);
        if (existing) {
          existing.pl += trade.pl;
        } else {
          acc.push({ symbol: trade.ticker, pl: trade.pl });
        }
        return acc;
      }, [] as Array<{ symbol: string; pl: number }>)
      .sort((a, b) => a.pl - b.pl)
      .slice(0, 20);

    const volumeDistribution = [
      { range: "0-1M", wins: 3, losses: -2 },
      { range: "1-5M", wins: 5, losses: -3 },
      { range: "5-10M", wins: 8, losses: -4 },
      { range: "10-25M", wins: 6, losses: -2 },
      { range: "25-50M", wins: 4, losses: -1 },
      { range: "50M+", wins: 3, losses: -1 },
    ];

    const volumePerformance = [
      { range: "0-1M", pl: 420 },
      { range: "1-5M", pl: 1280 },
      { range: "5-10M", pl: 2340 },
      { range: "10-25M", pl: 1680 },
      { range: "25-50M", pl: 980 },
      { range: "50M+", pl: 760 },
    ];

    const smaDistribution = [
      { range: "> 5%", wins: 4, losses: -3 },
      { range: "2% - 5%", wins: 5, losses: -2 },
      { range: "0% - 2%", wins: 6, losses: -3 },
      { range: "-2% - 0%", wins: 4, losses: -2 },
      { range: "-5% - -2%", wins: 3, losses: -1 },
      { range: "< -5%", wins: 2, losses: -2 },
    ];

    const smaPerformance = [
      { range: "> 5%", pl: 680 },
      { range: "2% - 5%", pl: 1240 },
      { range: "0% - 2%", pl: 1580 },
      { range: "-2% - 0%", pl: 920 },
      { range: "-5% - -2%", pl: 560 },
      { range: "< -5%", pl: -320 },
    ];

    const relVol50Distribution = [
      { range: "< 0.5", wins: 2, losses: -2 },
      { range: "0.5 - 1.0", wins: 4, losses: -3 },
      { range: "1.0 - 1.5", wins: 6, losses: -2 },
      { range: "1.5 - 2.0", wins: 5, losses: -2 },
      { range: "2.0 - 3.0", wins: 4, losses: -1 },
      { range: "> 3.0", wins: 3, losses: -1 },
    ];

    const relVol50Performance = [
      { range: "< 0.5", pl: -120 },
      { range: "0.5 - 1.0", pl: 540 },
      { range: "1.0 - 1.5", pl: 1480 },
      { range: "1.5 - 2.0", pl: 1260 },
      { range: "2.0 - 3.0", pl: 890 },
      { range: "> 3.0", pl: 620 },
    ];

    const priorDayDistribution = [
      { range: "< -3%", wins: 2, losses: -2 },
      { range: "-3% - -1%", wins: 4, losses: -2 },
      { range: "-1% - 0%", wins: 5, losses: -3 },
      { range: "0% - 1%", wins: 6, losses: -2 },
      { range: "1% - 3%", wins: 5, losses: -2 },
      { range: "> 3%", wins: 3, losses: -1 },
    ];

    const priorDayPerformance = [
      { range: "< -3%", pl: -80 },
      { range: "-3% - -1%", pl: 640 },
      { range: "-1% - 0%", pl: 980 },
      { range: "0% - 1%", pl: 1420 },
      { range: "1% - 3%", pl: 1180 },
      { range: "> 3%", pl: 720 },
    ];

    const insMovDistribution = [
      { range: "< -2%", wins: 2, losses: -3 },
      { range: "-2% - -1%", wins: 3, losses: -2 },
      { range: "-1% - 0%", wins: 4, losses: -2 },
      { range: "0% - 1%", wins: 6, losses: -2 },
      { range: "1% - 2%", wins: 5, losses: -1 },
      { range: "> 2%", wins: 4, losses: -1 },
    ];

    const insMovPerformance = [
      { range: "< -2%", pl: -240 },
      { range: "-2% - -1%", pl: 380 },
      { range: "-1% - 0%", pl: 820 },
      { range: "0% - 1%", pl: 1560 },
      { range: "1% - 2%", pl: 1280 },
      { range: "> 2%", pl: 940 },
    ];

    const openGapDistribution = [
      { range: "< -2%", wins: 2, losses: -2 },
      { range: "-2% - -1%", wins: 3, losses: -2 },
      { range: "-1% - 0%", wins: 5, losses: -3 },
      { range: "0% - 1%", wins: 6, losses: -2 },
      { range: "1% - 2%", wins: 5, losses: -2 },
      { range: "> 2%", wins: 4, losses: -1 },
    ];

    const openGapPerformance = [
      { range: "< -2%", pl: -160 },
      { range: "-2% - -1%", pl: 420 },
      { range: "-1% - 0%", pl: 960 },
      { range: "0% - 1%", pl: 1640 },
      { range: "1% - 2%", pl: 1320 },
      { range: "> 2%", pl: 880 },
    ];

    const dayTypeDistribution = [
      { range: "Inside", wins: 5, losses: -3 },
      { range: "Outside", wins: 4, losses: -2 },
      { range: "Up", wins: 8, losses: -3 },
      { range: "Down", wins: 3, losses: -2 },
    ];

    const dayTypePerformance = [
      { range: "Inside", pl: 920 },
      { range: "Outside", pl: 740 },
      { range: "Up", pl: 2180 },
      { range: "Down", pl: 420 },
    ];

    const avgTRDistribution = [
      { range: "< $1", wins: 3, losses: -2 },
      { range: "$1 - $2", wins: 5, losses: -3 },
      { range: "$2 - $3", wins: 6, losses: -2 },
      { range: "$3 - $5", wins: 5, losses: -2 },
      { range: "$5 - $10", wins: 4, losses: -2 },
      { range: "> $10", wins: 2, losses: -1 },
    ];

    const avgTRPerformance = [
      { range: "< $1", pl: 480 },
      { range: "$1 - $2", pl: 1120 },
      { range: "$2 - $3", pl: 1680 },
      { range: "$3 - $5", pl: 1340 },
      { range: "$5 - $10", pl: 860 },
      { range: "> $10", pl: 420 },
    ];

    const entryATRDistribution = [
      { range: "< 0.5x", wins: 4, losses: -3 },
      { range: "0.5x - 1x", wins: 6, losses: -2 },
      { range: "1x - 1.5x", wins: 5, losses: -2 },
      { range: "1.5x - 2x", wins: 4, losses: -2 },
      { range: "2x - 3x", wins: 3, losses: -1 },
      { range: "> 3x", wins: 2, losses: -1 },
    ];

    const entryATRPerformance = [
      { range: "< 0.5x", pl: 640 },
      { range: "0.5x - 1x", pl: 1540 },
      { range: "1x - 1.5x", pl: 1260 },
      { range: "1.5x - 2x", pl: 880 },
      { range: "2x - 3x", pl: 620 },
      { range: "> 3x", pl: 340 },
    ];

    const relVolATRDistribution = [
      { range: "< 1%", wins: 3, losses: -2 },
      { range: "1% - 2%", wins: 5, losses: -3 },
      { range: "2% - 3%", wins: 6, losses: -2 },
      { range: "3% - 5%", wins: 5, losses: -2 },
      { range: "5% - 7%", wins: 4, losses: -1 },
      { range: "> 7%", wins: 2, losses: -1 },
    ];

    const relVolATRPerformance = [
      { range: "< 1%", pl: 380 },
      { range: "1% - 2%", pl: 1020 },
      { range: "2% - 3%", pl: 1580 },
      { range: "3% - 5%", pl: 1280 },
      { range: "5% - 7%", pl: 840 },
      { range: "> 7%", pl: 460 },
    ];

    return { 
      dailyPL, 
      cumulativePL, 
      dailyVolume, 
      winPercentageData,
      tradeDistributionByYear,
      performanceByYear,
      tradeDistributionByMonth,
      performanceByMonth,
      tradeDistributionByDay,
      performanceByDay,
      tradeDistributionByDayOfWeek,
      performanceByDayOfWeek,
      tradeDistributionByHour,
      performanceByHour,
      tradeDistributionByDuration,
      performanceByDuration,
      tradeDistributionByIntradayDuration,
      performanceByIntradayDuration,
      topSymbols,
      bottomSymbols,
      volumeDistribution,
      volumePerformance,
      smaDistribution,
      smaPerformance,
      relVol50Distribution,
      relVol50Performance,
      priorDayDistribution,
      priorDayPerformance,
      insMovDistribution,
      insMovPerformance,
      openGapDistribution,
      openGapPerformance,
      dayTypeDistribution,
      dayTypePerformance,
      avgTRDistribution,
      avgTRPerformance,
      entryATRDistribution,
      entryATRPerformance,
      relVolATRDistribution,
      relVolATRPerformance,
    };
  }, []);

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category] === option ? "Any" : option,
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({ "Date Range": "Last 30 Days" });
  };

  const activeFilterCount = Object.entries(selectedFilters).filter(
    ([key, v]) => v && v !== "Any" && key !== "Date Range"
  ).length;

  const exportData = () => {
    toast.success("Data exported", { description: "Analytics data downloaded as CSV" });
  };

  const tabs: AnalyticsTab[] = ["Overview", "Detailed", "Win vs Loss Days", "Drawdown", "Compare", "Tag Breakdown", "Advanced"];

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-950">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 shrink-0">
        {/* Title and Export */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Comprehensive performance analysis and insights
            </p>
          </div>
          <Button onClick={exportData} className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6 py-0 border-b border-neutral-100 dark:border-neutral-800">
          <nav className="flex items-center gap-1 -mb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap",
                    isActive
                      ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-300 dark:hover:border-neutral-600"
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filters Section */}
        <Accordion type="single" collapsible className="border-b border-neutral-200 dark:border-neutral-800">
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="px-6 py-3 text-sm font-semibold hover:no-underline hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-6 py-3 space-y-4">
                <div className="flex items-start gap-3">
                  {/* Main Filters */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {filters.map((filter) => (
                      <FilterDropdown
                        key={filter.name}
                        filter={filter}
                        selectedValue={selectedFilters[filter.name]}
                        onSelect={(option) => toggleFilter(filter.name, option)}
                      />
                    ))}
                  </div>

                  {/* Advanced Filter Button */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setAdvancedButtonRect(rect);
                        setShowAdvancedFilters(!showAdvancedFilters);
                      }}
                      className="gap-2 whitespace-nowrap h-10"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Advanced
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          showAdvancedFilters ? "rotate-180" : ""
                        }`}
                      />
                    </Button>

                    {/* Advanced Filter Dropdown */}
                    {showAdvancedFilters && advancedButtonRect && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-150"
                          onClick={() => setShowAdvancedFilters(false)}
                        />
                        {/* Dropdown Content */}
                        <div 
                          className="fixed w-96 max-h-[600px] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-200"
                          style={{
                            top: `${advancedButtonRect.bottom + 8}px`,
                            right: `${window.innerWidth - advancedButtonRect.right}px`,
                          }}
                        >
                          <Accordion type="multiple" className="w-full">
                            {/* Days/Time Section */}
                            <AccordionItem value="days-time">
                              <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                                Days/Time
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3 space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Day of The Week:</Label>
                                  <Input placeholder="All" className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Time of Day:</Label>
                                  <div className="flex gap-2">
                                    <Input placeholder="min(hh:mm)" className="h-9 text-sm" />
                                    <Input placeholder="max(hh:mm)" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Month:</Label>
                                  <Input placeholder="All" className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Duration:</Label>
                                  <div className="flex gap-2">
                                    <Input placeholder="min (hh:mm:ss)" className="h-9 text-sm" />
                                    <Input placeholder="max (hh:mm:ss)" className="h-9 text-sm" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Price/Volume Section */}
                            <AccordionItem value="price-volume">
                              <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                                Price/Volume
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3 space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Price ($):</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Volume Traded:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">In-trade Price Range:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Execution Count:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Instrument Section */}
                            <AccordionItem value="instrument">
                              <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                                Instrument
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3 space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Gap %:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Volume:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">RVOL:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">ATR:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Day Type:</Label>
                                  <Input placeholder="All" className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Entry % of ATR:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">% Move Intra-day:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Prior Day RVOL:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Win/Loss Trades Section */}
                            <AccordionItem value="win-loss">
                              <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                                Win/Loss Trades
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3 space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Trade Result:</Label>
                                  <Input placeholder="All" className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Day Result:</Label>
                                  <Input placeholder="All" className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">P&L % Gain:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">P&L (R):</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">P&L ($):</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Tags Section */}
                            <AccordionItem value="tags">
                              <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                                Tags
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3 space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Tag Win %:</Label>
                                  <Input type="number" step="0.01" placeholder="% minimum" className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Excluded Tags:</Label>
                                  <Input placeholder="Select tags" className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Tag Profit Factor:</Label>
                                  <Input type="number" step="0.01" placeholder="(positive)" className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Tag P&L:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Tag avg. pos. MFE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Tag Count:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Tag avg. pos. MAE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Tag Volume:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Entry Distance to Daily SMA Section */}
                            <AccordionItem value="sma">
                              <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                                Entry Distance to Daily SMA
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3 space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">5 SMA:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">10 SMA:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">20 SMA:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">50 SMA:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">100 SMA:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">200 SMA:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {/* Statistics Section */}
                            <AccordionItem value="statistics">
                              <AccordionTrigger className="px-4 py-3 text-sm font-semibold">
                                Statistics
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-3 space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Best Exit P&L ($):</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Best Exit P&L (R):</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Position MAE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Position MFE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Price MAE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Price MFE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Time to pos. MAE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Time to pos. MFE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Time to Price MAE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Time to Price MFE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Initial Risk:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="1" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="1" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Exit Efficiency (%):</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">Commissions & Fees:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">P&L % of MAE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs">P&L % of MFE:</Label>
                                  <div className="flex gap-2">
                                    <Input type="number" step="0.01" placeholder="% min" className="h-9 text-sm" />
                                    <Input type="number" step="0.01" placeholder="% max" className="h-9 text-sm" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="px-6 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      Active filters:
                    </span>
                    {Object.entries(selectedFilters).map(([category, value]) => {
                      if (!value || value === "Any") return null;
                      return (
                        <button
                          key={category}
                          onClick={() => toggleFilter(category, value)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
                        >
                          {category}: {value}
                          <X className="h-3 w-3" />
                        </button>
                      );
                    })}
                    <button
                      onClick={clearAllFilters}
                      className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300 underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "Overview" && <OverviewTab data={analyticsData} />}
        {activeTab === "Detailed" && <DetailedTab />}
        {activeTab === "Win vs Loss Days" && <WinLossDaysTab />}
        {activeTab === "Drawdown" && <DrawdownTab />}
        {activeTab === "Compare" && <CompareTab />}
        {activeTab === "Tag Breakdown" && <TagBreakdownTab />}
        {activeTab === "Advanced" && <AdvancedTab />}
      </div>
    </div>
  );
}

// Helper Components
function ChartCard({ title, children, data }: { title: string; children: React.ReactNode; data?: unknown }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);

  const handleExportCSV = () => {
    if (!data) {
      toast.error("No data available to export");
      return;
    }
    
    // Convert data to CSV
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    // Get headers from first object
    const headers = Object.keys(dataArray[0] as Record<string, unknown>);
    const csvContent = [
      headers.join(','),
      ...dataArray.map((row: Record<string, unknown>) => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Chart data exported", { description: `${title} downloaded as CSV` });
  };

  const handleShowDataTable = () => {
    if (!data) {
      toast.error("No data available");
      return;
    }
    setShowDataTable(true);
  };

  const handleExpandFullscreen = () => {
    setIsFullscreen(true);
  };

  // Get data as array for table display
  const dataArray = data ? (Array.isArray(data) ? data : [data]) : [];
  const tableHeaders = dataArray.length > 0 ? Object.keys(dataArray[0] as Record<string, unknown>) : [];

  return (
    <>
      <div 
        className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between mb-4 min-h-5">
          <h3 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 tracking-wider">
            {title}
          </h3>
          <div className="w-8 h-8 flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-opacity",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={handleExpandFullscreen} className="cursor-pointer">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Expand Fullscreen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShowDataTable} className="cursor-pointer">
                  <TableIcon className="h-4 w-4 mr-2" />
                  Show Data Table
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export to CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {children}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-6">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[80vh]">
            {children}
          </div>
        </DialogContent>
      </Dialog>

      {/* Data Table Modal */}
      <Dialog open={showDataTable} onOpenChange={setShowDataTable}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{title} - Data Table</DialogTitle>
          </DialogHeader>
          {dataArray.length > 0 ? (
            <div className="rounded-md border border-neutral-200 dark:border-neutral-800">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tableHeaders.map((header) => (
                      <TableHead key={header} className="font-semibold">
                        {header.charAt(0).toUpperCase() + header.slice(1)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataArray.map((row: Record<string, unknown>, index: number) => (
                    <TableRow key={index}>
                      {tableHeaders.map((header) => (
                        <TableCell key={header}>
                          {typeof row[header] === 'number' 
                            ? row[header].toLocaleString() 
                            : String(row[header])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              No data available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper function to get theme-aware chart colors  
function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return {
    grid: isDark ? '#404040' : '#e5e7eb',
    text: isDark ? '#a3a3a3' : '#6b7280',
    background: isDark ? '#171717' : '#ffffff',
    tooltipBg: isDark ? '#262626' : '#ffffff',
    tooltipBorder: isDark ? '#404040' : '#e5e7eb',
  };
}

// Common chart tooltip style
const getTooltipStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? '#262626' : '#ffffff',
  border: `1px solid ${isDark ? '#404040' : '#e5e7eb'}`,
  borderRadius: '8px',
  fontSize: '12px',
  color: isDark ? '#e5e5e5' : '#171717',
});

function FilterDropdown({
  filter,
  selectedValue,
  onSelect
}: {
  filter: FilterCategory;
  selectedValue: string;
  onSelect: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const displayValue = selectedValue && selectedValue !== "Any" ? selectedValue : filter.name;

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <div className="relative">
        <button
          onClick={handleButtonClick}
          className={cn(
            "w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg border transition",
            selectedValue && selectedValue !== "Any"
              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
              : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          )}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown className={cn("h-4 w-4 ml-2 shrink-0 transition-transform", isOpen && "rotate-180")} />
        </button>
      </div>
      
      {isOpen && buttonRect && (
        <>
          <div 
            className="fixed inset-0 z-100" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed min-w-[200px] max-h-64 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-100"
            style={{
              top: `${buttonRect.bottom + 8}px`,
              left: `${buttonRect.left}px`,
              width: `${buttonRect.width}px`,
            }}
          >
            {filter.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition",
                  selectedValue === option 
                    ? "bg-neutral-100 dark:bg-neutral-800 font-semibold" 
                    : "text-neutral-700 dark:text-neutral-300"
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

// Overview Tab Component
function OverviewTab({ data }: { 
  data: {
    dailyPL: Array<{ date: string; pl: number }>;
    cumulativePL: Array<{ date: string; total: number }>;
    dailyVolume: Array<{ date: string; volume: number }>;
    winPercentageData: Array<{ date: string; winRate: number }>;
    tradeDistributionByYear: Array<{ year: string; wins: number; losses: number }>;
    performanceByYear: Array<{ year: string; pl: number }>;
    tradeDistributionByMonth: Array<{ month: string; wins: number; losses: number }>;
    performanceByMonth: Array<{ month: string; pl: number }>;
    tradeDistributionByDay: Array<{ day: string; wins: number; losses: number }>;
    performanceByDay: Array<{ day: string; pl: number }>;
  } 
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [selectedYear] = useState("2025");
  const activeSubTab = (searchParams.get("subtab") as SubTab) || "dt";

  const setActiveSubTab = (subtab: SubTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("subtab", subtab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sub-tabs */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 shrink-0">
        <div className="flex flex-wrap gap-2">
          <SubTabButton
            active={activeSubTab === "dt"}
            onClick={() => setActiveSubTab("dt")}
            label="Days/Times"
          />
          <SubTabButton
            active={activeSubTab === "ipv"}
            onClick={() => setActiveSubTab("ipv")}
            label="Price/Volume"
          />
          <SubTabButton
            active={activeSubTab === "ins"}
            onClick={() => setActiveSubTab("ins")}
            label="Instrument"
          />
          <SubTabButton
            active={activeSubTab === "mkt"}
            onClick={() => setActiveSubTab("mkt")}
            label="Market Behavior"
          />
          <SubTabButton
            active={activeSubTab === "wl"}
            onClick={() => setActiveSubTab("wl")}
            label="Win/Loss/Expectation"
          />
          <SubTabButton
            active={activeSubTab === "liq"}
            onClick={() => setActiveSubTab("liq")}
            label="Liquidity"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeSubTab === "dt" && <DaysTimesOverviewContent data={data} selectedYear={selectedYear} />}
        {activeSubTab === "ipv" && <PriceVolumeContent />}
        {activeSubTab === "ins" && <InstrumentContent />}
        {activeSubTab === "mkt" && <MarketBehaviorContent />}
        {activeSubTab === "wl" && <WinLossExpectationContent />}
        {activeSubTab === "liq" && <LiquidityContent />}
      </div>
    </div>
  );
}

function SubTabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-lg transition",
        active
          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      )}
    >
      {label}
    </button>
  );
}

function DaysTimesOverviewContent({ data, selectedYear }: {
  data: {
    dailyPL: Array<{ date: string; pl: number }>;
    cumulativePL: Array<{ date: string; total: number }>;
    dailyVolume: Array<{ date: string; volume: number }>;
    winPercentageData: Array<{ date: string; winRate: number }>;
    tradeDistributionByYear: Array<{ year: string; wins: number; losses: number }>;
    performanceByYear: Array<{ year: string; pl: number }>;
    tradeDistributionByMonth: Array<{ month: string; wins: number; losses: number }>;
    performanceByMonth: Array<{ month: string; pl: number }>;
    tradeDistributionByDay: Array<{ day: string; wins: number; losses: number }>;
    performanceByDay: Array<{ day: string; pl: number }>;
  };
  selectedYear: string;
}) {
  const chartColors = useChartColors();
  
  const daysTimesData = useMemo(() => {
    // Trade Distribution by Day of Week
    const tradesByDayOfWeek = mockTrades.reduce((acc, trade) => {
      const dayOfWeek = new Date(trade.date).toLocaleDateString("en-US", { weekday: "short" });
      if (!acc[dayOfWeek]) {
        acc[dayOfWeek] = { wins: 0, losses: 0, total: 0, pl: 0 };
      }
      acc[dayOfWeek].total += 1;
      acc[dayOfWeek].pl += trade.pl;
      if (trade.status === "WIN") acc[dayOfWeek].wins += 1;
      if (trade.status === "LOSS") acc[dayOfWeek].losses += 1;
      return acc;
    }, {} as Record<string, { wins: number; losses: number; total: number; pl: number }>);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const tradeDistributionByDayOfWeek = daysOfWeek.map((day) => ({
      day,
      wins: tradesByDayOfWeek[day]?.wins || 0,
      losses: -(tradesByDayOfWeek[day]?.losses || 0),
    }));

    const performanceByDayOfWeek = daysOfWeek.map((day) => ({
      day,
      pl: tradesByDayOfWeek[day]?.pl || 0,
    }));

    // Trade Distribution by Hour of Day (mock data)
    const tradeDistributionByHour = [
      { hour: "6:00", wins: 1, losses: -1 },
      { hour: "7:00", wins: 2, losses: -1 },
      { hour: "8:00", wins: 3, losses: -2 },
      { hour: "9:00", wins: 5, losses: -2 },
      { hour: "10:00", wins: 4, losses: -3 },
      { hour: "11:00", wins: 3, losses: -1 },
      { hour: "12:00", wins: 2, losses: -2 },
      { hour: "13:00", wins: 4, losses: -1 },
      { hour: "14:00", wins: 5, losses: -2 },
      { hour: "15:00", wins: 4, losses: -3 },
      { hour: "16:00", wins: 3, losses: -2 },
      { hour: "17:00", wins: 2, losses: -1 },
      { hour: "18:00", wins: 1, losses: -1 },
      { hour: "19:00", wins: 1, losses: 0 },
      { hour: "20:00", wins: 0, losses: -1 },
    ];

    const performanceByHour = [
      { hour: "6:00", pl: 150 },
      { hour: "7:00", pl: 320 },
      { hour: "8:00", pl: 480 },
      { hour: "9:00", pl: 890 },
      { hour: "10:00", pl: 420 },
      { hour: "11:00", pl: 680 },
      { hour: "12:00", pl: -120 },
      { hour: "13:00", pl: 540 },
      { hour: "14:00", pl: 760 },
      { hour: "15:00", pl: 310 },
      { hour: "16:00", pl: 220 },
      { hour: "17:00", pl: 180 },
      { hour: "18:00", pl: -80 },
      { hour: "19:00", pl: 90 },
      { hour: "20:00", pl: -150 },
    ];

    // Trade Distribution by Duration
    const tradeDistributionByDuration = [
      { duration: "Intraday", wins: 15, losses: -8 },
      { duration: "Multiday", wins: 10, losses: -4 },
    ];

    const performanceByDuration = [
      { duration: "Intraday", pl: 5240 },
      { duration: "Multiday", pl: 3420 },
    ];

    // Trade Distribution by Intraday Duration
    const tradeDistributionByIntradayDuration = [
      { duration: "< 1:00", wins: 2, losses: -3 },
      { duration: "1:00 - 1:59", wins: 3, losses: -2 },
      { duration: "2:00 - 4:59", wins: 5, losses: -1 },
      { duration: "5:00 - 9:59", wins: 4, losses: -2 },
      { duration: "10:00 - 19:59", wins: 6, losses: -3 },
      { duration: "20:00 - 39:59", wins: 3, losses: -1 },
      { duration: "40:00 - 59:59", wins: 2, losses: -2 },
      { duration: "1:00:00 - 1:59:59", wins: 4, losses: -1 },
      { duration: "2:00:00 - 3:59:59", wins: 3, losses: -2 },
      { duration: "4:00:00 >", wins: 1, losses: -1 },
    ];

    const performanceByIntradayDuration = [
      { duration: "< 1:00", pl: -180 },
      { duration: "1:00 - 1:59", pl: 240 },
      { duration: "2:00 - 4:59", pl: 820 },
      { duration: "5:00 - 9:59", pl: 640 },
      { duration: "10:00 - 19:59", pl: 1120 },
      { duration: "20:00 - 39:59", pl: 680 },
      { duration: "40:00 - 59:59", pl: 320 },
      { duration: "1:00:00 - 1:59:59", pl: 890 },
      { duration: "2:00:00 - 3:59:59", pl: 560 },
      { duration: "4:00:00 >", pl: 180 },
    ];

    return {
      tradeDistributionByDayOfWeek,
      performanceByDayOfWeek,
      tradeDistributionByHour,
      performanceByHour,
      tradeDistributionByDuration,
      performanceByDuration,
      tradeDistributionByIntradayDuration,
      performanceByIntradayDuration,
    };
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* First Row - 30 Day Charts */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">30-Day Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gross Daily P&L */}
          <ChartCard title="GROSS DAILY P&L (30 Days)" data={data.dailyPL}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.dailyPL}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                />
                <Bar
                  dataKey="pl"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Gross Cumulative P&L */}
          <ChartCard title="GROSS CUMULATIVE P&L (30 Days)" data={data.cumulativePL}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.cumulativePL}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Daily Volume */}
          <ChartCard title="DAILY VOLUME (30 Days)" data={data.dailyVolume}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.dailyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                />
                <Bar
                  dataKey="volume"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Win % */}
          <ChartCard title="WIN % (30 Days)" data={data.winPercentageData}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.winPercentageData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} domain={[0, 100]} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                />
                <Line
                  type="monotone"
                  dataKey="winRate"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Second Row - Yearly Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Yearly Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY YEAR" data={data.tradeDistributionByYear}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.tradeDistributionByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY YEAR" data={data.performanceByYear}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.performanceByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar
                  dataKey="pl"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Third Row - Monthly Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Monthly Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY MONTH" data={data.tradeDistributionByMonth}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.tradeDistributionByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY MONTH" data={data.performanceByMonth}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.performanceByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar
                  dataKey="pl"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Fourth Row - Daily Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          Daily Analysis ({selectedYear})
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY DAY OF MONTH" data={data.tradeDistributionByDay}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.tradeDistributionByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  stroke={chartColors.text}
                  interval={1}
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY DAY OF MONTH" data={data.performanceByDay}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.performanceByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  stroke={chartColors.text}
                  interval={1}
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar
                  dataKey="pl"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Day of Week */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Day of Week Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY DAY OF WEEK" data={daysTimesData.tradeDistributionByDayOfWeek}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysTimesData.tradeDistributionByDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY DAY OF WEEK" data={daysTimesData.performanceByDayOfWeek}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysTimesData.performanceByDayOfWeek}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Hour of Day */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Hour of Day Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY HOUR OF DAY" data={daysTimesData.tradeDistributionByHour}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysTimesData.tradeDistributionByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY HOUR OF DAY" data={daysTimesData.performanceByHour}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysTimesData.performanceByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Month of Year */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Month of Year Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY MONTH OF YEAR" data={data.tradeDistributionByMonth}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.tradeDistributionByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY MONTH OF YEAR" data={data.performanceByMonth}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.performanceByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar
                  dataKey="pl"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Duration */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Duration Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY DURATION" data={daysTimesData.tradeDistributionByDuration}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysTimesData.tradeDistributionByDuration}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="duration" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY DURATION" data={daysTimesData.performanceByDuration}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysTimesData.performanceByDuration}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="duration" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Intraday Duration */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Intraday Duration Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY INTRADAY DURATION" data={daysTimesData.tradeDistributionByIntradayDuration}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysTimesData.tradeDistributionByIntradayDuration}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="duration" tick={{ fontSize: 9, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY INTRADAY DURATION" data={daysTimesData.performanceByIntradayDuration}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={daysTimesData.performanceByIntradayDuration}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="duration" tick={{ fontSize: 9, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function DetailedTab() {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Detailed Analytics
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Coming soon: In-depth trade analysis and metrics
        </p>
      </div>
    </div>
  );
}

function PriceVolumeContent() {
  const chartColors = useChartColors();
  const priceVolumeData = useMemo(() => {
    // Trade Distribution by Price
    const tradeDistributionByPrice = [
      { range: "$5 - $9.99", wins: 2, losses: -1 },
      { range: "$10 - $19.99", wins: 5, losses: -3 },
      { range: "$20 - $49.99", wins: 8, losses: -4 },
      { range: "$50 - $99.99", wins: 6, losses: -2 },
      { range: "$100 - $199.99", wins: 4, losses: -2 },
      { range: "$200 - $499.99", wins: 3, losses: -1 },
    ];

    const performanceByPrice = [
      { range: "$5 - $9.99", pl: 280 },
      { range: "$10 - $19.99", pl: 1240 },
      { range: "$20 - $49.99", pl: 2180 },
      { range: "$50 - $99.99", pl: 1850 },
      { range: "$100 - $199.99", pl: 1320 },
      { range: "$200 - $499.99", pl: 890 },
    ];

    // In-Trade Price Range
    const inTradePriceDistribution = [
      { range: "$0.00 - $0.49", wins: 4, losses: -2 },
      { range: "$0.50 - $0.99", wins: 6, losses: -3 },
      { range: "$1.00 - $1.99", wins: 8, losses: -4 },
      { range: "$2.00 - $4.99", wins: 5, losses: -2 },
      { range: "$5.00 - $9.99", wins: 3, losses: -1 },
      { range: "$10.00+", wins: 2, losses: -1 },
    ];

    const inTradePricePerformance = [
      { range: "$0.00 - $0.49", pl: 520 },
      { range: "$0.50 - $0.99", pl: 1380 },
      { range: "$1.00 - $1.99", pl: 2240 },
      { range: "$2.00 - $4.99", pl: 1650 },
      { range: "$5.00 - $9.99", pl: 980 },
      { range: "$10.00+", pl: 890 },
    ];

    // Distribution by Volume Traded
    const distributionByVolume = [
      { range: "20 - 49", wins: 3, losses: -2 },
      { range: "50 - 99", wins: 5, losses: -3 },
      { range: "100 - 500", wins: 10, losses: -4 },
      { range: "500 - 999", wins: 6, losses: -2 },
      { range: "1,000 - 1,999", wins: 3, losses: -1 },
      { range: "2,000 - 2,999", wins: 2, losses: -1 },
    ];

    const performanceByVolume = [
      { range: "20 - 49", pl: 420 },
      { range: "50 - 99", pl: 1180 },
      { range: "100 - 500", pl: 3240 },
      { range: "500 - 999", pl: 2150 },
      { range: "1,000 - 1,999", pl: 1420 },
      { range: "2,000 - 2,999", pl: 1250 },
    ];

    return {
      tradeDistributionByPrice,
      performanceByPrice,
      inTradePriceDistribution,
      inTradePricePerformance,
      distributionByVolume,
      performanceByVolume,
    };
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Price Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Price Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY PRICE" data={priceVolumeData.tradeDistributionByPrice}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceVolumeData.tradeDistributionByPrice}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY PRICE" data={priceVolumeData.performanceByPrice}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceVolumeData.performanceByPrice}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Volume Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Volume Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY VOLUME TRADED" data={priceVolumeData.distributionByVolume}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceVolumeData.distributionByVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY VOLUME TRADED" data={priceVolumeData.performanceByVolume}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceVolumeData.performanceByVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* In-Trade Price Range Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">In-Trade Price Range Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY IN-TRADE PRICE RANGE" data={priceVolumeData.inTradePriceDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceVolumeData.inTradePriceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY IN-TRADE PRICE RANGE" data={priceVolumeData.inTradePricePerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceVolumeData.inTradePricePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function MarketBehaviorContent() {
  const chartColors = useChartColors();
  const [selectedMarket, setSelectedMarket] = useState("SPY");

  const marketData = useMemo(() => {
    // Trade Distribution by Market Movement
    const tradeDistByMovement = [
      { range: "less than -2%", wins: 3, losses: -2 },
      { range: "-1% to -2%", wins: 4, losses: -3 },
      { range: "0 to -1%", wins: 6, losses: -4 },
      { range: "0 to +1%", wins: 8, losses: -5 },
      { range: "+1% to +2%", wins: 7, losses: -3 },
      { range: "> +2%", wins: 5, losses: -2 },
    ];

    const perfByMovement = [
      { range: "less than -2%", pl: 420 },
      { range: "-1% to -2%", pl: 680 },
      { range: "0 to -1%", pl: 1240 },
      { range: "0 to +1%", pl: 1850 },
      { range: "+1% to +2%", pl: 1620 },
      { range: "> +2%", pl: 1180 },
    ];

    // Trade Distribution by Opening Gap
    const tradeDistByGap = [
      { range: "less than -2%", wins: 2, losses: -2 },
      { range: "-1% to -2%", wins: 4, losses: -3 },
      { range: "0 to -1%", wins: 6, losses: -4 },
      { range: "0 to +1%", wins: 9, losses: -5 },
      { range: "+1% to +2%", wins: 6, losses: -2 },
      { range: "> +2%", wins: 4, losses: -1 },
    ];

    const perfByGap = [
      { range: "less than -2%", pl: 280 },
      { range: "-1% to -2%", pl: 720 },
      { range: "0 to -1%", pl: 1380 },
      { range: "0 to +1%", pl: 2140 },
      { range: "+1% to +2%", pl: 1560 },
      { range: "> +2%", pl: 1240 },
    ];

    // Trade Distribution by Day Type
    const tradeDistByDayType = [
      { type: "Inside range", wins: 7, losses: -4 },
      { type: "Outside range", wins: 5, losses: -3 },
      { type: "Trend up", wins: 9, losses: -3 },
      { type: "Trend down", wins: 4, losses: -5 },
    ];

    const perfByDayType = [
      { type: "Inside range", pl: 1680 },
      { type: "Outside range", pl: 1120 },
      { type: "Trend up", pl: 2450 },
      { type: "Trend down", pl: 420 },
    ];

    return {
      tradeDistByMovement,
      perfByMovement,
      tradeDistByGap,
      perfByGap,
      tradeDistByDayType,
      perfByDayType,
    };
  }, []);

  const marketOptions = [
    { value: "SPY", label: "SPY" },
    { value: "QQQ", label: "QQQ" },
    { value: "IWM", label: "IWM" },
    { value: "DIA", label: "DIA" },
    { value: "VIX", label: "VIX" },
    { value: "XLF", label: "XLF" },
    { value: "GLD", label: "GLD" },
    { value: "USO", label: "USO" },
    { value: "UNG", label: "UNG" },
    { value: "VXX", label: "VXX" },
    { value: "VXXB", label: "VXXB" },
    { value: "TLT", label: "TLT" },
    { value: "IEF", label: "IEF" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Market Symbol Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Market Behavior Analysis
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            SELECT MARKET SYMBOL
          </label>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select market" />
            </SelectTrigger>
            <SelectContent>
              {marketOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Trade Distribution and Performance by Market Movement */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {selectedMarket} Movement Analysis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={`TRADE DISTRIBUTION BY ${selectedMarket} MOVEMENT`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData.tradeDistByMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 9, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={`PERFORMANCE BY ${selectedMarket} MOVEMENT`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData.perfByMovement}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 9, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Trade Distribution and Performance by Opening Gap */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {selectedMarket} Opening Gap Analysis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={`TRADE DISTRIBUTION BY ${selectedMarket} OPENING GAP`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData.tradeDistByGap}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 9, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={`PERFORMANCE BY ${selectedMarket} OPENING GAP`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData.perfByGap}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 9, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Trade Distribution and Performance by Day Type */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {selectedMarket} Day Type Analysis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={`TRADE DISTRIBUTION BY ${selectedMarket} DAY TYPE`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData.tradeDistByDayType}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="type" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={`PERFORMANCE BY ${selectedMarket} DAY TYPE`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={marketData.perfByDayType}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="type" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function WinLossExpectationContent() {
  const chartColors = useChartColors();
  const winLossData = useMemo(() => {
    // Calculate win/loss statistics from mock trades
    const wins = mockTrades.filter(t => t.status === "WIN");
    const losses = mockTrades.filter(t => t.status === "LOSS");
    
    const totalWins = wins.length;
    const totalLosses = losses.length;
    const totalWinPL = wins.reduce((sum, t) => sum + t.pl, 0);
    const totalLossPL = Math.abs(losses.reduce((sum, t) => sum + t.pl, 0));
    const avgWin = totalWins > 0 ? totalWinPL / totalWins : 0;
    const avgLoss = totalLosses > 0 ? totalLossPL / totalLosses : 0;
    const winRate = totalWins / (totalWins + totalLosses);
    const expectation = (winRate * avgWin) - ((1 - winRate) * avgLoss);

    // Win/Loss Ratio data
    const winLossRatio = [
      { type: "Win", count: totalWins },
      { type: "Loss", count: totalLosses },
    ];

    // Win/Loss P&L Comparison
    const plComparison = [
      { type: "Gain", value: totalWinPL },
      { type: "Loss", value: -totalLossPL },
    ];

    // Trade Expectation
    const expectationData = [
      { metric: "Expectation", value: expectation },
    ];

    // Cumulative P&L over time
    const cumulativePLData = mockTrades.reduce((acc, trade) => {
      const prevTotal = acc.length > 0 ? acc[acc.length - 1].value : 0;
      acc.push({
        date: trade.date,
        value: prevTotal + trade.pl,
      });
      return acc;
    }, [] as Array<{ date: string; value: number }>);

    // Cumulative Drawdown
    const cumulativeDrawdown = mockTrades.reduce((acc, trade) => {
      const runningTotal = acc.length > 0 ? acc[acc.length - 1].runningPL : 0;
      const newTotal = runningTotal + trade.pl;
      const currentPeak = acc.length > 0 ? Math.max(acc[acc.length - 1].peak, newTotal) : newTotal;
      const drawdown = currentPeak - newTotal;
      
      acc.push({
        date: trade.date,
        drawdown: -drawdown,
        runningPL: newTotal,
        peak: currentPeak,
      });
      
      return acc;
    }, [] as Array<{ date: string; drawdown: number; runningPL: number; peak: number }>);

    return {
      winLossRatio,
      plComparison,
      expectationData,
      cumulativePLData,
      cumulativeDrawdown,
      totalWins,
      totalLosses,
      totalWinPL,
      totalLossPL,
      avgWin,
      avgLoss,
      winRate,
      expectation,
    };
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">WIN RATE</div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {(winLossData.winRate * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">AVG WIN</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${winLossData.avgWin.toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">AVG LOSS</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${winLossData.avgLoss.toFixed(2)}
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
          <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">EXPECTATION</div>
          <div className={cn(
            "text-2xl font-bold",
            winLossData.expectation >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            ${winLossData.expectation.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Win/Loss Ratio and P&L Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="WIN/LOSS RATIO" data={winLossData.winLossRatio}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={winLossData.winLossRatio}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <Tooltip
                contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
              >
                {winLossData.winLossRatio.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.type === "Win" ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="WIN/LOSS P&L COMPARISON" data={winLossData.plComparison}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={winLossData.plComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="type" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <Tooltip
                contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                formatter={(value: number) => [`$${Math.abs(value).toFixed(2)}`, "P/L"]}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
              >
                {winLossData.plComparison.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.type === "Gain" ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Trade Expectation */}
      <div>
        <ChartCard title="TRADE EXPECTATION" data={winLossData.expectationData}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={winLossData.expectationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="metric" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <Tooltip
                contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Expected Value"]}
              />
              <Bar 
                dataKey="value" 
                fill={winLossData.expectation >= 0 ? "#10b981" : "#ef4444"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Cumulative P&L and Drawdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="CUMULATIVE P&L" data={winLossData.cumulativePLData}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={winLossData.cumulativePLData}>
              <defs>
                <linearGradient id="colorCumPL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 9, fill: chartColors.text }} 
                stroke={chartColors.text} 
                angle={-45} 
                textAnchor="end" 
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <Tooltip
                contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Cumulative P/L"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCumPL)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="CUMULATIVE DRAWDOWN" data={winLossData.cumulativeDrawdown}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={winLossData.cumulativeDrawdown}>
              <defs>
                <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 9, fill: chartColors.text }} 
                stroke={chartColors.text} 
                angle={-45} 
                textAnchor="end" 
                height={60}
              />
              <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <Tooltip
                contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                formatter={(value: number) => [`$${Math.abs(value).toFixed(2)}`, "Drawdown"]}
              />
              <Area
                type="monotone"
                dataKey="drawdown"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDrawdown)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function LiquidityContent() {
  const chartColors = useChartColors();
  const liquidityData = useMemo(() => {
    // Trade Distribution by Liquidity (general)
    const tdLiquidity = [
      { range: "< 100K", wins: 2, losses: -3 },
      { range: "100K - 500K", wins: 4, losses: -2 },
      { range: "500K - 1M", wins: 6, losses: -3 },
      { range: "1M - 5M", wins: 8, losses: -4 },
      { range: "5M - 10M", wins: 5, losses: -2 },
      { range: "> 10M", wins: 4, losses: -1 },
    ];

    // Trade Distribution by Entry Liquidity
    const tdEntryLiquidity = [
      { range: "< 100K", wins: 3, losses: -2 },
      { range: "100K - 500K", wins: 5, losses: -3 },
      { range: "500K - 1M", wins: 7, losses: -4 },
      { range: "1M - 5M", wins: 6, losses: -3 },
      { range: "5M - 10M", wins: 4, losses: -2 },
      { range: "> 10M", wins: 3, losses: -1 },
    ];

    // Trade Distribution by Exit Liquidity
    const tdExitLiquidity = [
      { range: "< 100K", wins: 2, losses: -2 },
      { range: "100K - 500K", wins: 4, losses: -3 },
      { range: "500K - 1M", wins: 8, losses: -4 },
      { range: "1M - 5M", wins: 7, losses: -3 },
      { range: "5M - 10M", wins: 5, losses: -2 },
      { range: "> 10M", wins: 3, losses: -1 },
    ];

    // Performance by Liquidity
    const perfLiquidity = [
      { range: "< 100K", pl: -180 },
      { range: "100K - 500K", pl: 840 },
      { range: "500K - 1M", pl: 1520 },
      { range: "1M - 5M", pl: 2240 },
      { range: "5M - 10M", pl: 1680 },
      { range: "> 10M", pl: 1420 },
    ];

    // Performance by Entry Liquidity
    const perfEntryLiquidity = [
      { range: "< 100K", pl: 280 },
      { range: "100K - 500K", pl: 1120 },
      { range: "500K - 1M", pl: 1890 },
      { range: "1M - 5M", pl: 2040 },
      { range: "5M - 10M", pl: 1420 },
      { range: "> 10M", pl: 980 },
    ];

    // Performance by Exit Liquidity
    const perfExitLiquidity = [
      { range: "< 100K", pl: 120 },
      { range: "100K - 500K", pl: 780 },
      { range: "500K - 1M", pl: 2140 },
      { range: "1M - 5M", pl: 1980 },
      { range: "5M - 10M", pl: 1560 },
      { range: "> 10M", pl: 1240 },
    ];

    return {
      tdLiquidity,
      tdEntryLiquidity,
      tdExitLiquidity,
      perfLiquidity,
      perfEntryLiquidity,
      perfExitLiquidity,
    };
  }, []);

  return (
    <div className="p-6 space-y-8">


      {/* General Liquidity */}
      <div>
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          Overall Liquidity
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY LIQUIDITY" data={liquidityData.tdLiquidity}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={liquidityData.tdLiquidity}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY LIQUIDITY" data={liquidityData.perfLiquidity}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={liquidityData.perfLiquidity}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Entry Liquidity */}
      <div>
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          Entry Liquidity
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY ENTRY LIQUIDITY" data={liquidityData.tdEntryLiquidity}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={liquidityData.tdEntryLiquidity}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY ENTRY LIQUIDITY" data={liquidityData.perfEntryLiquidity}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={liquidityData.perfEntryLiquidity}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Exit Liquidity */}
      <div>
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          Exit Liquidity
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="TRADE DISTRIBUTION BY EXIT LIQUIDITY" data={liquidityData.tdExitLiquidity}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={liquidityData.tdExitLiquidity}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY EXIT LIQUIDITY" data={liquidityData.perfExitLiquidity}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={liquidityData.perfExitLiquidity}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 10, fill: chartColors.text }} 
                  stroke={chartColors.text} 
                  angle={-45} 
                  textAnchor="end" 
                  height={80} 
                />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function InstrumentContent() {
  const chartColors = useChartColors();
  const [selectedSMA, setSelectedSMA] = useState("50");

  const instrumentData = useMemo(() => {
    // Performance by Symbol - Top 20
    const topSymbols = [
      { symbol: "NVDA", pl: 2840 },
      { symbol: "TSLA", pl: 2320 },
      { symbol: "AAPL", pl: 1890 },
      { symbol: "GOOGL", pl: 1650 },
      { symbol: "MSFT", pl: 1520 },
      { symbol: "META", pl: 1380 },
      { symbol: "AMZN", pl: 1240 },
      { symbol: "AMD", pl: 1120 },
      { symbol: "QQQ", pl: 980 },
      { symbol: "SPY", pl: 850 },
      { symbol: "NFLX", pl: 720 },
      { symbol: "DIS", pl: 680 },
      { symbol: "BA", pl: 590 },
      { symbol: "UBER", pl: 540 },
      { symbol: "SQ", pl: 480 },
      { symbol: "COIN", pl: 420 },
      { symbol: "SHOP", pl: 380 },
      { symbol: "ROKU", pl: 340 },
      { symbol: "ZM", pl: 290 },
      { symbol: "SNAP", pl: 250 },
    ];

    // Performance by Symbol - Bottom 20
    const bottomSymbols = [
      { symbol: "GME", pl: -850 },
      { symbol: "AMC", pl: -780 },
      { symbol: "BBBY", pl: -720 },
      { symbol: "CLOV", pl: -680 },
      { symbol: "WISH", pl: -640 },
      { symbol: "PLTR", pl: -590 },
      { symbol: "SOFI", pl: -540 },
      { symbol: "LCID", pl: -490 },
      { symbol: "RIVN", pl: -450 },
      { symbol: "TLRY", pl: -420 },
      { symbol: "SNDL", pl: -380 },
      { symbol: "BB", pl: -340 },
      { symbol: "NOK", pl: -310 },
      { symbol: "SPCE", pl: -280 },
      { symbol: "WKHS", pl: -250 },
      { symbol: "RIDE", pl: -220 },
      { symbol: "SKLZ", pl: -190 },
      { symbol: "HOOD", pl: -160 },
      { symbol: "DKNG", pl: -130 },
      { symbol: "ABNB", pl: -100 },
    ];

    // Distribution by Instrument Volume
    const volumeDistribution = [
      { range: "500K - 1M", wins: 8, losses: -4 },
      { range: "1M - 2.49M", wins: 12, losses: -5 },
      { range: "2.5M - 4.99M", wins: 6, losses: -3 },
      { range: "5M - 9.99M", wins: 4, losses: -2 },
      { range: "10M+", wins: 3, losses: -1 },
    ];

    const volumePerformance = [
      { range: "500K - 1M", pl: 1840 },
      { range: "1M - 2.49M", pl: 3250 },
      { range: "2.5M - 4.99M", pl: 2180 },
      { range: "5M - 9.99M", pl: 1620 },
      { range: "10M+", pl: 980 },
    ];

    // Trade Distribution by Entry Price vs SMA
    const smaDistribution = [
      { range: "less than -5%", wins: 2, losses: -3 },
      { range: "-1% to -5%", wins: 5, losses: -2 },
      { range: "0 to -1%", wins: 7, losses: -3 },
      { range: "0 to +1%", wins: 8, losses: -4 },
      { range: "+1% to +5%", wins: 6, losses: -2 },
      { range: "> +5%", wins: 3, losses: -1 },
    ];

    const smaPerformance = [
      { range: "less than -5%", pl: -280 },
      { range: "-1% to -5%", pl: 840 },
      { range: "0 to -1%", pl: 1520 },
      { range: "0 to +1%", pl: 1890 },
      { range: "+1% to +5%", pl: 1640 },
      { range: "> +5%", pl: 920 },
    ];

    // Relative Volume 50-day
    const relVol50Distribution = [
      { range: "< 0.5x", wins: 3, losses: -2 },
      { range: "0.5x - 1.0x", wins: 5, losses: -3 },
      { range: "1.0x - 1.5x", wins: 7, losses: -4 },
      { range: "1.5x - 2.0x", wins: 6, losses: -2 },
      { range: "> 2.0x", wins: 4, losses: -2 },
    ];

    const relVol50Performance = [
      { range: "< 0.5x", pl: 420 },
      { range: "0.5x - 1.0x", pl: 1240 },
      { range: "1.0x - 1.5x", pl: 2180 },
      { range: "1.5x - 2.0x", pl: 1850 },
      { range: "> 2.0x", pl: 1320 },
    ];

    // Prior Day Performance
    const priorDayDistribution = [
      { range: "Down > 2%", wins: 4, losses: -3 },
      { range: "Down 1-2%", wins: 5, losses: -2 },
      { range: "Flat ±1%", wins: 8, losses: -4 },
      { range: "Up 1-2%", wins: 6, losses: -2 },
      { range: "Up > 2%", wins: 5, losses: -3 },
    ];

    const priorDayPerformance = [
      { range: "Down > 2%", pl: 680 },
      { range: "Down 1-2%", pl: 1120 },
      { range: "Flat ±1%", pl: 2340 },
      { range: "Up 1-2%", pl: 1680 },
      { range: "Up > 2%", pl: 890 },
    ];

    // Instrument Movement (Entry to Close)
    const insMovDistribution = [
      { range: "Down > 3%", wins: 2, losses: -4 },
      { range: "Down 1-3%", wins: 4, losses: -3 },
      { range: "Flat ±1%", wins: 9, losses: -3 },
      { range: "Up 1-3%", wins: 7, losses: -2 },
      { range: "Up > 3%", wins: 6, losses: -1 },
    ];

    const insMovPerformance = [
      { range: "Down > 3%", pl: -280 },
      { range: "Down 1-3%", pl: 480 },
      { range: "Flat ±1%", pl: 2120 },
      { range: "Up 1-3%", pl: 1840 },
      { range: "Up > 3%", pl: 2240 },
    ];

    // Opening Gap
    const openGapDistribution = [
      { range: "Gap Down > 1%", wins: 3, losses: -3 },
      { range: "Gap Down < 1%", wins: 5, losses: -2 },
      { range: "No Gap", wins: 10, losses: -5 },
      { range: "Gap Up < 1%", wins: 6, losses: -2 },
      { range: "Gap Up > 1%", wins: 4, losses: -1 },
    ];

    const openGapPerformance = [
      { range: "Gap Down > 1%", pl: 320 },
      { range: "Gap Down < 1%", pl: 980 },
      { range: "No Gap", pl: 2450 },
      { range: "Gap Up < 1%", pl: 1680 },
      { range: "Gap Up > 1%", pl: 1420 },
    ];

    // Instrument Day Type
    const dayTypeDistribution = [
      { range: "Inside Day", wins: 6, losses: -3 },
      { range: "Outside Day", wins: 4, losses: -2 },
      { range: "Higher High", wins: 8, losses: -3 },
      { range: "Lower Low", wins: 5, losses: -4 },
      { range: "Neutral", wins: 5, losses: -2 },
    ];

    const dayTypePerformance = [
      { range: "Inside Day", pl: 1240 },
      { range: "Outside Day", pl: 890 },
      { range: "Higher High", pl: 2180 },
      { range: "Lower Low", pl: 420 },
      { range: "Neutral", pl: 1320 },
    ];

    // Average True Range (ATR)
    const avgTRDistribution = [
      { range: "< $0.50", wins: 4, losses: -2 },
      { range: "$0.50 - $1.00", wins: 6, losses: -3 },
      { range: "$1.00 - $2.00", wins: 8, losses: -4 },
      { range: "$2.00 - $5.00", wins: 5, losses: -2 },
      { range: "> $5.00", wins: 3, losses: -2 },
    ];

    const avgTRPerformance = [
      { range: "< $0.50", pl: 680 },
      { range: "$0.50 - $1.00", pl: 1420 },
      { range: "$1.00 - $2.00", pl: 2340 },
      { range: "$2.00 - $5.00", pl: 1680 },
      { range: "> $5.00", pl: 980 },
    ];

    // Entry Price vs ATR
    const entryATRDistribution = [
      { range: "< 0.5 ATR", wins: 5, losses: -3 },
      { range: "0.5 - 1.0 ATR", wins: 7, losses: -3 },
      { range: "1.0 - 2.0 ATR", wins: 6, losses: -4 },
      { range: "2.0 - 3.0 ATR", wins: 4, losses: -2 },
      { range: "> 3.0 ATR", wins: 3, losses: -1 },
    ];

    const entryATRPerformance = [
      { range: "< 0.5 ATR", pl: 1240 },
      { range: "0.5 - 1.0 ATR", pl: 1890 },
      { range: "1.0 - 2.0 ATR", pl: 1420 },
      { range: "2.0 - 3.0 ATR", pl: 980 },
      { range: "> 3.0 ATR", pl: 820 },
    ];

    // Relative Volatility (ATR %)
    const relVolATRDistribution = [
      { range: "< 2%", wins: 4, losses: -2 },
      { range: "2% - 4%", wins: 6, losses: -3 },
      { range: "4% - 6%", wins: 8, losses: -4 },
      { range: "6% - 8%", wins: 5, losses: -2 },
      { range: "> 8%", wins: 3, losses: -2 },
    ];

    const relVolATRPerformance = [
      { range: "< 2%", pl: 820 },
      { range: "2% - 4%", pl: 1540 },
      { range: "4% - 6%", pl: 2280 },
      { range: "6% - 8%", pl: 1420 },
      { range: "> 8%", pl: 980 },
    ];

    return {
      topSymbols,
      bottomSymbols,
      volumeDistribution,
      volumePerformance,
      smaDistribution,
      smaPerformance,
      relVol50Distribution,
      relVol50Performance,
      priorDayDistribution,
      priorDayPerformance,
      insMovDistribution,
      insMovPerformance,
      openGapDistribution,
      openGapPerformance,
      dayTypeDistribution,
      dayTypePerformance,
      avgTRDistribution,
      avgTRPerformance,
      entryATRDistribution,
      entryATRPerformance,
      relVolATRDistribution,
      relVolATRPerformance,
    };
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* Top 20 Symbols */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Top Performers</h2>
        <ChartCard title="PERFORMANCE BY SYMBOL - TOP 20" data={instrumentData.topSymbols}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.topSymbols} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis type="number" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <YAxis dataKey="symbol" type="category" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} width={60} />
              <Tooltip
                contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
              />
              <Bar dataKey="pl" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom 20 Symbols */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Bottom Performers</h2>
        <ChartCard title="PERFORMANCE BY SYMBOL - BOTTOM 20" data={instrumentData.bottomSymbols}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.bottomSymbols} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis type="number" tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
              <YAxis dataKey="symbol" type="category" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} width={60} />
              <Tooltip
                contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
              />
              <Bar dataKey="pl" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Instrument Volume Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Instrument Volume Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY INSTRUMENT VOLUME" data={instrumentData.volumeDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.volumeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY INSTRUMENT VOLUME" data={instrumentData.volumePerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.volumePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* SMA Analysis */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Entry Price vs {selectedSMA}-Day SMA
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              SELECT SMA
            </label>
            <Select value={selectedSMA} onValueChange={setSelectedSMA}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select SMA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20-Day</SelectItem>
                <SelectItem value="50">50-Day</SelectItem>
                <SelectItem value="100">100-Day</SelectItem>
                <SelectItem value="200">200-Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={`TRADE DISTRIBUTION BY ENTRY PRICE VS ${selectedSMA}-DAY SMA`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.smaDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 9, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={`PERFORMANCE BY ENTRY PRICE VS ${selectedSMA}-DAY SMA`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.smaPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 9, fill: chartColors.text }} stroke={chartColors.text} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Relative Volume 50-day Analysis */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Relative Volume Analysis (50-day)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY RELATIVE VOLUME (50-day)" data={instrumentData.relVol50Distribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.relVol50Distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY RELATIVE VOLUME (50-day)" data={instrumentData.relVol50Performance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.relVol50Performance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Prior Day Performance */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Prior Day Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY PRIOR DAY PERFORMANCE" data={instrumentData.priorDayDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.priorDayDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY PRIOR DAY" data={instrumentData.priorDayPerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.priorDayPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Instrument Movement */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Instrument Movement (Entry to Close)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY INSTRUMENT MOVEMENT" data={instrumentData.insMovDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.insMovDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY INSTRUMENT MOVEMENT" data={instrumentData.insMovPerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.insMovPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Opening Gap */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Opening Gap Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY OPENING GAP" data={instrumentData.openGapDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.openGapDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY OPENING GAP" data={instrumentData.openGapPerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.openGapPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Instrument Day Type */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Instrument Day Type</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY INSTRUMENT DAY TYPE" data={instrumentData.dayTypeDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.dayTypeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY INSTRUMENT DAY TYPE" data={instrumentData.dayTypePerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.dayTypePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Average True Range */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Average True Range (ATR)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY AVERAGE TRUE RANGE" data={instrumentData.avgTRDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.avgTRDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY AVERAGE TRUE RANGE" data={instrumentData.avgTRPerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.avgTRPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Entry Price vs ATR */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Entry Price vs ATR</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY ENTRY PRICE VS ATR" data={instrumentData.entryATRDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.entryATRDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY ENTRY PRICE VS ATR" data={instrumentData.entryATRPerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.entryATRPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Relative Volatility (ATR %) */}
      <div>
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Relative Volatility (ATR %)</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="DISTRIBUTION BY RELATIVE VOLATILITY (ATR %)" data={instrumentData.relVolATRDistribution}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.relVolATRDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number, name: string) => [
                    Math.abs(value),
                    name === "wins" ? "Wins" : "Losses"
                  ]}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="PERFORMANCE BY RELATIVE VOLATILITY (ATR %)" data={instrumentData.relVolATRPerformance}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentData.relVolATRPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="range" tick={{ fontSize: 10, fill: chartColors.text }} stroke={chartColors.text} />
                <YAxis tick={{ fontSize: 11, fill: chartColors.text }} stroke={chartColors.text} />
                <Tooltip
                  contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
                  cursor={{ fill: chartColors.grid === '#404040' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "P/L"]}
                />
                <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function AdvancedTab() {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Advanced Analytics
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Coming soon: Advanced analytics and machine learning insights
        </p>
      </div>
    </div>
  );
}

function CompareTab() {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Compare Trades
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Coming soon: Compare trades and strategies
        </p>
      </div>
    </div>
  );
}

function TagBreakdownTab() {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Tag Breakdown
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Coming soon: Tag-based performance analysis
        </p>
      </div>
    </div>
  );
}

function WinLossDaysTab() {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Win/Loss Days Analysis
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Coming soon: Win/Loss days analysis and metrics
        </p>
      </div>
    </div>
  );
}

function DrawdownTab() {
  return (
    <div className="p-6">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-12 text-center">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Drawdown Analysis
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Coming soon: Drawdown analysis and recovery metrics
        </p>
      </div>
    </div>
  );
}
