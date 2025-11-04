"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Search, X, Plus, TrendingUp, LineChart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type FilterCategory = {
  name: string;
  options: string[];
};

type FilterTab = "Overview" | "Valuation" | "Financial" | "Ownership" | "Performance" | "Technical" | "ETF" | "ETF Perf" | "Custom" | "Charts" | "Tickers" | "Basic" | "TA" | "News" | "Snapshot" | "Maps" | "Stats" | "Descriptive" | "Fundamental";

type Stock = {
  ticker: string;
  company: string;
  sector: string;
  industry: string;
  country: string;
  exchange: string;
  marketCap: number;
  price: number;
  change: number;
  volume: string;
  relativeVolume: number;
  pe: number;
  forwardPE: number;
  peg: number;
  ps: number;
  pb: number;
  dividend: number;
  roe: number;
  roa: number;
  debtEquity: number;
  currentRatio: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  epsGrowthThisYear: number;
  insiderOwnership: number;
  institutionalOwnership: number;
  perfWeek: number;
  perfMonth: number;
  perfYear: number;
  beta: number;
  rsi: number;
  sma20: number;
  sma50: number;
  sma200: number;
  week52High: number;
  week52Low: number;
};

const filtersByTab: Partial<Record<FilterTab, FilterCategory[]>> = {
  Descriptive: [
    {
      name: "Exchange",
      options: ["Any", "NYSE", "NASDAQ", "AMEX", "OTC"],
    },
    {
      name: "Index",
      options: ["Any", "S&P 500", "DJIA"],
    },
    {
      name: "Sector",
      options: ["Any", "Technology", "Healthcare", "Financial", "Consumer Cyclical", "Industrials", "Energy", "Communication Services", "Basic Materials", "Consumer Defensive", "Real Estate", "Utilities"],
    },
    {
      name: "Industry",
      options: ["Any", "Software", "Semiconductors", "Biotechnology", "Banks", "Oil & Gas", "Pharmaceuticals", "Auto Manufacturers", "Consumer Electronics"],
    },
    {
      name: "Country",
      options: ["Any", "USA", "China", "Japan", "United Kingdom", "Canada", "Germany", "France"],
    },
    {
      name: "Market Cap",
      options: ["Any", "Mega ($200bln+)", "Large ($10bln to $200bln)", "Mid ($2bln to $10bln)", "Small ($300mln to $2bln)", "Micro (<$300mln)"],
    },
    {
      name: "Dividend Yield",
      options: ["Any", "None (0%)", "Positive (>0%)", "High (>5%)", "Very High (>10%)"],
    },
    {
      name: "Short Float",
      options: ["Any", "Low (<5%)", "High (>20%)", "Over 10%", "Over 15%"],
    },
    {
      name: "Analyst Recom.",
      options: ["Any", "Strong Buy (1)", "Buy or better (2)", "Hold or better (3)", "Underperform or better (4)", "Sell"],
    },
    {
      name: "Option/Short",
      options: ["Any", "Optionable", "Shortable", "Optionable & Shortable"],
    },
    {
      name: "Earnings Date",
      options: ["Any", "Today", "Today Before Market Open", "Today After Market Close", "Tomorrow", "Tomorrow Before Market Open", "Tomorrow After Market Close", "This Week", "Next Week", "This Month"],
    },
    {
      name: "Average Volume",
      options: ["Any", "Over 50K", "Over 100K", "Over 500K", "Over 750K", "Over 1M", "Over 2M"],
    },
    {
      name: "Relative Volume",
      options: ["Any", "Over 0.5", "Over 1", "Over 1.5", "Over 2", "Over 3", "Over 4", "Over 5", "Over 10"],
    },
    {
      name: "Current Volume",
      options: ["Any", "Over 0", "Over 50K", "Over 100K", "Over 500K", "Over 1M"],
    },
    {
      name: "Price",
      options: ["Any", "Under $1", "Under $5", "Under $10", "Under $15", "Under $20", "Under $50", "Over $1", "Over $5", "Over $10", "Over $20", "Over $50", "Over $100"],
    },
    {
      name: "Target Price",
      options: ["Any", "50% Above Price", "40% Above Price", "30% Above Price", "20% Above Price", "10% Above Price", "Above Price", "Below Price", "10% Below Price", "20% Below Price", "30% Below Price"],
    },
    {
      name: "IPO Date",
      options: ["Any", "Today", "Yesterday", "In the last week", "In the last month", "In the last quarter", "In the last year", "In the last 2 years", "In the last 5 years", "More than a year ago", "More than 5 years ago", "More than 10 years ago", "More than 15 years ago", "More than 20 years ago", "More than 25 years ago"],
    },
    {
      name: "Shares Outstanding",
      options: ["Any", "Under 1M", "Under 5M", "Under 10M", "Under 20M", "Under 50M", "Under 100M", "Over 1M", "Over 2M", "Over 5M", "Over 10M", "Over 20M", "Over 50M", "Over 100M", "Over 500M", "Over 1000M"],
    },
    {
      name: "Float",
      options: ["Any", "Under 1M", "Under 5M", "Under 10M", "Under 20M", "Under 50M", "Under 100M", "Over 1M", "Over 2M", "Over 5M", "Over 10M", "Over 20M", "Over 50M", "Over 100M", "Over 500M", "Over 1000M"],
    },
  ],
  Fundamental: [
    {
      name: "Exchange",
      options: ["Any", "NYSE", "NASDAQ", "AMEX"],
    },
    {
      name: "Sector",
      options: ["Any", "Technology", "Healthcare", "Financial", "Consumer Cyclical", "Industrials", "Energy", "Communication Services"],
    },
    {
      name: "Industry",
      options: ["Any", "Software", "Semiconductors", "Biotechnology", "Banks", "Oil & Gas", "Pharmaceuticals", "Auto Manufacturers"],
    },
    {
      name: "Country",
      options: ["Any", "USA", "China", "Japan", "United Kingdom", "Canada"],
    },
    {
      name: "Market Cap",
      options: ["Any", "Mega ($200bln+)", "Large ($10bln to $200bln)", "Mid ($2bln to $10bln)", "Small ($300mln to $2bln)"],
    },
  ],
  Valuation: [
    {
      name: "P/E",
      options: ["Any", "Low (<15)", "Profitable (>0)", "High (>50)", "Under 15", "Under 20", "Under 30", "Over 30"],
    },
    {
      name: "Forward P/E",
      options: ["Any", "Low (<15)", "Under 15", "Under 20", "Over 20"],
    },
    {
      name: "PEG",
      options: ["Any", "Low (<1)", "High (>2)", "Under 1", "Under 2", "Over 2"],
    },
    {
      name: "P/S",
      options: ["Any", "Low (<1)", "Under 1", "Under 3", "Over 3", "Over 10"],
    },
    {
      name: "P/B",
      options: ["Any", "Low (<1)", "Under 1", "Under 3", "Over 3", "Over 5"],
    },
  ],
  Financial: [
    {
      name: "Dividend Yield",
      options: ["Any", "None (0%)", "Positive (>0%)", "Over 2%", "Over 3%", "Over 5%"],
    },
    {
      name: "ROE",
      options: ["Any", "Positive (>0%)", "Very Positive (>15%)", "Over 15%", "Over 20%", "Over 30%"],
    },
    {
      name: "ROA",
      options: ["Any", "Positive (>0%)", "Over 10%", "Over 15%"],
    },
    {
      name: "Current Ratio",
      options: ["Any", "Over 1", "Over 1.5", "Over 2"],
    },
    {
      name: "Debt/Equity",
      options: ["Any", "Low (<0.1)", "Under 0.5", "Over 0.5"],
    },
    {
      name: "Gross Margin",
      options: ["Any", "Positive (>0%)", "Over 30%", "Over 50%"],
    },
    {
      name: "Operating Margin",
      options: ["Any", "Positive (>0%)", "Over 10%", "Over 20%"],
    },
    {
      name: "Net Profit Margin",
      options: ["Any", "Positive (>0%)", "Over 10%", "Over 20%"],
    },
  ],
  Ownership: [
    {
      name: "Insider Ownership",
      options: ["Any", "Low (<5%)", "High (>30%)", "Over 10%", "Over 20%", "Over 30%"],
    },
    {
      name: "Institutional Ownership",
      options: ["Any", "Low (<5%)", "High (>90%)", "Over 50%", "Over 70%"],
    },
  ],
  Performance: [
    {
      name: "Performance Week",
      options: ["Any", "Up", "Down", "Up 5%+", "Up 10%+", "Down 5%+", "Down 10%+"],
    },
    {
      name: "Performance Month",
      options: ["Any", "Up", "Down", "Up 10%+", "Up 20%+", "Down 10%+"],
    },
    {
      name: "Performance Year",
      options: ["Any", "Up", "Down", "Up 50%+", "Up 100%+", "Down 50%+"],
    },
    {
      name: "EPS Growth",
      options: ["Any", "Positive (>0%)", "Over 10%", "Over 20%", "Over 25%"],
    },
  ],
  Technical: [
    {
      name: "Price",
      options: ["Any", "Under $10", "Under $20", "Under $50", "Over $10", "Over $50", "Over $100"],
    },
    {
      name: "Volume",
      options: ["Any", "Over 100K", "Over 500K", "Over 1M", "Over 5M"],
    },
    {
      name: "Relative Volume",
      options: ["Any", "Over 0.5", "Over 1", "Over 1.5", "Over 2"],
    },
    {
      name: "Beta",
      options: ["Any", "Under 1", "Under 1.5", "Over 1", "Over 1.5", "Over 2"],
    },
    {
      name: "RSI",
      options: ["Any", "Overbought (>70)", "Oversold (<30)", "Not Overbought (<70)", "Not Oversold (>30)"],
    },
    {
      name: "Change",
      options: ["Any", "Up", "Down", "Up 1%", "Up 5%", "Down 1%", "Down 5%"],
    },
  ],
  ETF: [
    {
      name: "Category",
      options: ["Any", "Equity", "Bond", "Commodity", "Currency", "Hybrid"],
    },
    {
      name: "Issuer",
      options: ["Any", "Vanguard", "iShares", "SPDR", "Invesco", "Schwab"],
    },
    {
      name: "Assets",
      options: ["Any", "Over $1B", "Over $5B", "Over $10B"],
    },
  ],
  "ETF Perf": [
    {
      name: "Performance",
      options: ["Any", "Up Today", "Down Today", "Up Week", "Down Week", "Up Month", "Down Month"],
    },
    {
      name: "Volatility",
      options: ["Any", "Low", "Medium", "High"],
    },
  ],
  Custom: [
    {
      name: "Analyst Recom.",
      options: ["Any", "Strong Buy", "Buy", "Hold", "Underperform", "Sell"],
    },
    {
      name: "Option/Short",
      options: ["Any", "Optionable", "Shortable", "Optionable & Shortable"],
    },
    {
      name: "Earnings Date",
      options: ["Any", "Today", "This Week", "Next Week", "This Month"],
    },
    {
      name: "IPO Date",
      options: ["Any", "Last Year", "Last 2 Years", "Last 5 Years", "More than 5 Years"],
    },
    {
      name: "Target Price",
      options: ["Any", "Above Price", "Below Price", "10% Above", "10% Below"],
    },
  ],
  Charts: [
    {
      name: "Chart Type",
      options: ["Any", "Candlestick", "Line", "Area", "OHLC"],
    },
    {
      name: "Timeframe",
      options: ["Any", "Intraday", "Daily", "Weekly", "Monthly"],
    },
  ],
  Tickers: [
    {
      name: "Display",
      options: ["Any", "Ticker Only", "Ticker + Name", "Name Only"],
    },
  ],
  Basic: [
    {
      name: "View",
      options: ["Any", "Overview", "Valuation", "Financial", "Ownership", "Performance", "Technical"],
    },
  ],
  TA: [
    {
      name: "Pattern",
      options: ["Any", "Head and Shoulders", "Triangle", "Wedge", "Channel", "Double Top", "Double Bottom"],
    },
    {
      name: "Candlestick",
      options: ["Any", "Doji", "Hammer", "Shooting Star", "Engulfing", "Morning Star", "Evening Star"],
    },
    {
      name: "Gap",
      options: ["Any", "Gap Up", "Gap Down", "No Gap"],
    },
  ],
  News: [
    {
      name: "News Type",
      options: ["Any", "All News", "Earnings", "FDA", "Upgrades", "Downgrades"],
    },
  ],
  Snapshot: [
    {
      name: "Snapshot View",
      options: ["Any", "Compact", "Detailed", "Grid"],
    },
  ],
  Maps: [
    {
      name: "Map Type",
      options: ["Any", "Performance", "Market Cap", "Volume"],
    },
    {
      name: "Grouping",
      options: ["Any", "Sector", "Industry", "Country"],
    },
  ],
  Stats: [
    {
      name: "Statistics",
      options: ["Any", "Key Stats", "Trading Info", "Share Stats", "Dividends"],
    },
  ],
};

const allStocks: Stock[] = [
  { ticker: "NVDA", company: "NVIDIA Corp", sector: "Technology", industry: "Semiconductors", country: "USA", exchange: "NASDAQ", marketCap: 2150000000000, price: 874.15, change: 2.45, volume: "45.2M", relativeVolume: 1.2, pe: 68.5, forwardPE: 45.2, peg: 1.8, ps: 28.5, pb: 48.2, dividend: 0.02, roe: 89.2, roa: 45.8, debtEquity: 0.15, currentRatio: 3.8, grossMargin: 72.5, operatingMargin: 48.2, netMargin: 42.5, epsGrowthThisYear: 125.3, insiderOwnership: 4.2, institutionalOwnership: 67.8, perfWeek: 5.2, perfMonth: 12.8, perfYear: 145.2, beta: 1.65, rsi: 68, sma20: 850, sma50: 780, sma200: 650, week52High: 890, week52Low: 400 },
  { ticker: "AAPL", company: "Apple Inc", sector: "Technology", industry: "Consumer Electronics", country: "USA", exchange: "NASDAQ", marketCap: 2850000000000, price: 182.52, change: 1.23, volume: "52.8M", relativeVolume: 1.0, pe: 29.8, forwardPE: 26.5, peg: 2.1, ps: 7.8, pb: 45.2, dividend: 0.48, roe: 147.5, roa: 22.4, debtEquity: 1.78, currentRatio: 0.95, grossMargin: 45.2, operatingMargin: 30.8, netMargin: 25.3, epsGrowthThisYear: 12.5, insiderOwnership: 0.07, institutionalOwnership: 61.2, perfWeek: 2.1, perfMonth: 5.8, perfYear: 32.5, beta: 1.25, rsi: 58, sma20: 180, sma50: 175, sma200: 170, week52High: 198, week52Low: 142 },
  { ticker: "MSFT", company: "Microsoft Corp", sector: "Technology", industry: "Software", country: "USA", exchange: "NASDAQ", marketCap: 3180000000000, price: 428.71, change: 1.15, volume: "28.3M", relativeVolume: 0.9, pe: 35.2, forwardPE: 30.1, peg: 2.3, ps: 12.5, pb: 12.8, dividend: 0.75, roe: 42.8, roa: 18.5, debtEquity: 0.48, currentRatio: 1.75, grossMargin: 69.8, operatingMargin: 42.5, netMargin: 36.2, epsGrowthThisYear: 18.7, insiderOwnership: 0.05, institutionalOwnership: 73.5, perfWeek: 1.8, perfMonth: 4.2, perfYear: 45.8, beta: 0.89, rsi: 62, sma20: 425, sma50: 410, sma200: 385, week52High: 435, week52Low: 320 },
  { ticker: "GOOGL", company: "Alphabet Inc", sector: "Communication Services", industry: "Internet Content", country: "USA", exchange: "NASDAQ", marketCap: 1780000000000, price: 141.83, change: 0.87, volume: "24.5M", relativeVolume: 1.1, pe: 26.4, forwardPE: 22.8, peg: 1.9, ps: 5.8, pb: 6.2, dividend: 0.00, roe: 28.5, roa: 15.2, debtEquity: 0.08, currentRatio: 2.45, grossMargin: 57.2, operatingMargin: 28.5, netMargin: 23.8, epsGrowthThisYear: 22.4, insiderOwnership: 5.8, institutionalOwnership: 65.2, perfWeek: 1.2, perfMonth: 3.5, perfYear: 38.2, beta: 1.05, rsi: 55, sma20: 140, sma50: 135, sma200: 128, week52High: 152, week52Low: 105 },
  { ticker: "AMZN", company: "Amazon.com Inc", sector: "Consumer Cyclical", industry: "Internet Retail", country: "USA", exchange: "NASDAQ", marketCap: 1850000000000, price: 178.25, change: 1.56, volume: "38.7M", relativeVolume: 1.3, pe: 58.3, forwardPE: 42.5, peg: 2.8, ps: 3.2, pb: 8.5, dividend: 0.00, roe: 18.7, roa: 6.8, debtEquity: 0.52, currentRatio: 1.02, grossMargin: 48.2, operatingMargin: 8.5, netMargin: 5.8, epsGrowthThisYear: 35.2, insiderOwnership: 9.8, institutionalOwnership: 58.5, perfWeek: 2.5, perfMonth: 8.2, perfYear: 52.8, beta: 1.15, rsi: 64, sma20: 175, sma50: 165, sma200: 155, week52High: 185, week52Low: 118 },
  { ticker: "META", company: "Meta Platforms", sector: "Communication Services", industry: "Internet Content", country: "USA", exchange: "NASDAQ", marketCap: 1230000000000, price: 485.32, change: 2.11, volume: "15.8M", relativeVolume: 0.85, pe: 28.9, forwardPE: 24.2, peg: 1.5, ps: 8.9, pb: 7.8, dividend: 0.00, roe: 35.2, roa: 19.8, debtEquity: 0.12, currentRatio: 2.85, grossMargin: 81.5, operatingMargin: 38.5, netMargin: 32.8, epsGrowthThisYear: 142.5, insiderOwnership: 13.5, institutionalOwnership: 70.2, perfWeek: 3.8, perfMonth: 15.2, perfYear: 185.4, beta: 1.18, rsi: 72, sma20: 470, sma50: 420, sma200: 350, week52High: 495, week52Low: 215 },
  { ticker: "TSLA", company: "Tesla Inc", sector: "Consumer Cyclical", industry: "Auto Manufacturers", country: "USA", exchange: "NASDAQ", marketCap: 789000000000, price: 248.92, change: -0.82, volume: "95.2M", relativeVolume: 1.8, pe: 72.1, forwardPE: 58.5, peg: 3.2, ps: 8.2, pb: 15.8, dividend: 0.00, roe: 28.5, roa: 8.9, debtEquity: 0.08, currentRatio: 1.75, grossMargin: 18.2, operatingMargin: 9.2, netMargin: 12.5, epsGrowthThisYear: 28.5, insiderOwnership: 13.2, institutionalOwnership: 42.8, perfWeek: -2.5, perfMonth: -5.8, perfYear: 15.2, beta: 2.05, rsi: 42, sma20: 255, sma50: 265, sma200: 220, week52High: 315, week52Low: 152 },
  { ticker: "BRK.B", company: "Berkshire Hathaway", sector: "Financial", industry: "Asset Management", country: "USA", exchange: "NYSE", marketCap: 945000000000, price: 425.18, change: 0.34, volume: "3.2M", relativeVolume: 0.95, pe: 8.5, forwardPE: 10.2, peg: 0.8, ps: 1.5, pb: 1.52, dividend: 0.00, roe: 18.2, roa: 4.8, debtEquity: 0.28, currentRatio: 1.85, grossMargin: 32.5, operatingMargin: 15.8, netMargin: 18.5, epsGrowthThisYear: 8.5, insiderOwnership: 31.2, institutionalOwnership: 42.5, perfWeek: 0.5, perfMonth: 2.8, perfYear: 18.5, beta: 0.88, rsi: 52, sma20: 422, sma50: 415, sma200: 395, week52High: 435, week52Low: 365 },
  { ticker: "JPM", company: "JPMorgan Chase", sector: "Financial", industry: "Banks", country: "USA", exchange: "NYSE", marketCap: 564000000000, price: 195.42, change: -0.15, volume: "12.4M", relativeVolume: 1.05, pe: 11.2, forwardPE: 10.5, peg: 1.2, ps: 3.8, pb: 1.85, dividend: 3.82, roe: 15.8, roa: 1.2, debtEquity: 1.42, currentRatio: 0.85, grossMargin: 58.2, operatingMargin: 38.5, netMargin: 32.5, epsGrowthThisYear: 12.8, insiderOwnership: 0.12, institutionalOwnership: 72.8, perfWeek: -0.5, perfMonth: 1.2, perfYear: 28.5, beta: 1.12, rsi: 48, sma20: 196, sma50: 192, sma200: 180, week52High: 205, week52Low: 152 },
  { ticker: "V", company: "Visa Inc", sector: "Financial", industry: "Credit Services", country: "USA", exchange: "NYSE", marketCap: 583000000000, price: 287.65, change: 0.92, volume: "6.8M", relativeVolume: 0.92, pe: 33.5, forwardPE: 28.2, peg: 1.8, ps: 18.5, pb: 14.8, dividend: 0.84, roe: 48.5, roa: 12.8, debtEquity: 0.68, currentRatio: 1.42, grossMargin: 98.2, operatingMargin: 67.5, netMargin: 52.8, epsGrowthThisYear: 15.2, insiderOwnership: 0.08, institutionalOwnership: 82.5, perfWeek: 1.2, perfMonth: 3.8, perfYear: 22.5, beta: 0.98, rsi: 56, sma20: 285, sma50: 278, sma200: 265, week52High: 295, week52Low: 235 },
  { ticker: "JNJ", company: "Johnson & Johnson", sector: "Healthcare", industry: "Pharmaceuticals", country: "USA", exchange: "NYSE", marketCap: 385000000000, price: 158.25, change: 0.45, volume: "8.2M", relativeVolume: 0.88, pe: 24.2, forwardPE: 16.8, peg: 2.5, ps: 4.2, pb: 5.8, dividend: 2.85, roe: 25.2, roa: 8.5, debtEquity: 0.48, currentRatio: 1.18, grossMargin: 68.5, operatingMargin: 28.2, netMargin: 18.5, epsGrowthThisYear: 5.8, insiderOwnership: 0.05, institutionalOwnership: 71.2, perfWeek: 0.8, perfMonth: 2.2, perfYear: 8.5, beta: 0.52, rsi: 51, sma20: 157, sma50: 155, sma200: 152, week52High: 168, week52Low: 145 },
  { ticker: "XOM", company: "Exxon Mobil", sector: "Energy", industry: "Oil & Gas", country: "USA", exchange: "NYSE", marketCap: 445000000000, price: 108.75, change: -0.68, volume: "18.5M", relativeVolume: 1.15, pe: 12.5, forwardPE: 11.2, peg: 1.1, ps: 1.2, pb: 2.15, dividend: 3.25, roe: 18.5, roa: 9.2, debtEquity: 0.22, currentRatio: 1.35, grossMargin: 42.5, operatingMargin: 18.2, netMargin: 12.8, epsGrowthThisYear: 8.5, insiderOwnership: 0.08, institutionalOwnership: 58.5, perfWeek: -1.2, perfMonth: -3.5, perfYear: -5.2, beta: 0.95, rsi: 38, sma20: 110, sma50: 112, sma200: 105, week52High: 125, week52Low: 95 },
  { ticker: "WMT", company: "Walmart Inc", sector: "Consumer Defensive", industry: "Discount Stores", country: "USA", exchange: "NYSE", marketCap: 525000000000, price: 195.28, change: 0.82, volume: "7.5M", relativeVolume: 0.95, pe: 32.8, forwardPE: 28.5, peg: 3.2, ps: 0.85, pb: 8.2, dividend: 1.28, roe: 22.5, roa: 6.8, debtEquity: 0.68, currentRatio: 0.85, grossMargin: 24.2, operatingMargin: 4.8, netMargin: 3.2, epsGrowthThisYear: 8.2, insiderOwnership: 45.8, institutionalOwnership: 32.5, perfWeek: 1.5, perfMonth: 4.2, perfYear: 28.5, beta: 0.52, rsi: 62, sma20: 192, sma50: 185, sma200: 175, week52High: 198, week52Low: 158 },
  { ticker: "PG", company: "Procter & Gamble", sector: "Consumer Defensive", industry: "Household Products", country: "USA", exchange: "NYSE", marketCap: 385000000000, price: 158.45, change: 0.35, volume: "6.2M", relativeVolume: 0.85, pe: 26.5, forwardPE: 24.2, peg: 3.8, ps: 4.8, pb: 7.8, dividend: 2.45, roe: 32.5, roa: 8.5, debtEquity: 0.52, currentRatio: 0.75, grossMargin: 52.5, operatingMargin: 22.8, netMargin: 18.2, epsGrowthThisYear: 6.5, insiderOwnership: 0.02, institutionalOwnership: 65.8, perfWeek: 0.5, perfMonth: 1.8, perfYear: 12.5, beta: 0.42, rsi: 54, sma20: 157, sma50: 155, sma200: 152, week52High: 165, week52Low: 145 },
  { ticker: "UNH", company: "UnitedHealth Group", sector: "Healthcare", industry: "Healthcare Plans", country: "USA", exchange: "NYSE", marketCap: 485000000000, price: 525.85, change: 1.25, volume: "3.8M", relativeVolume: 1.05, pe: 28.5, forwardPE: 24.8, peg: 2.1, ps: 1.5, pb: 6.2, dividend: 1.68, roe: 28.5, roa: 8.2, debtEquity: 0.68, currentRatio: 0.95, grossMargin: 28.5, operatingMargin: 8.5, netMargin: 6.2, epsGrowthThisYear: 12.8, insiderOwnership: 0.05, institutionalOwnership: 88.5, perfWeek: 2.2, perfMonth: 5.8, perfYear: 32.5, beta: 0.68, rsi: 65, sma20: 515, sma50: 495, sma200: 475, week52High: 535, week52Low: 425 },
];

type Preset = {
  id: string;
  name: string;
  filters: Record<string, string>;
  tab: FilterTab;
};

const defaultPresets: Preset[] = [
  {
    id: "growth-stocks",
    name: "Growth Stocks",
    filters: {
      "Market Cap": "Large ($10bln to $200bln)",
      "EPS Growth": "Over 20%",
      "ROE": "Over 20%",
    },
    tab: "Financial",
  },
  {
    id: "value-stocks",
    name: "Value Stocks",
    filters: {
      "P/E": "Under 15",
      "P/B": "Under 3",
      "Dividend Yield": "Over 2%",
    },
    tab: "Valuation",
  },
  {
    id: "tech-leaders",
    name: "Tech Leaders",
    filters: {
      "Sector": "Technology",
      "Market Cap": "Mega ($200bln+)",
      "ROE": "Over 30%",
    },
    tab: "Overview",
  },
  {
    id: "dividend-kings",
    name: "Dividend Kings",
    filters: {
      "Dividend Yield": "Over 3%",
      "Market Cap": "Large ($10bln to $200bln)",
      "P/E": "Under 20",
    },
    tab: "Valuation",
  },
];

export default function ScreenerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Main screener tab state
  const [mainTab, setMainTab] = useState<"Descriptive" | "Fundamental" | "Technical" | "News" | "ETF" | "All">("Descriptive");
  
  // Get tab from URL or default to Overview
  const tabFromUrl = searchParams.get('tab') as FilterTab | null;
  const [activeTab, setActiveTab] = useState<FilterTab>(tabFromUrl || "Overview");
  
  // Store initial view parameter to preserve it
  const initialViewRef = useRef(searchParams.get('view'));
  
  // Initialize filters from URL parameters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(() => {
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'tab' && key !== 'search') {
        filters[key] = value;
      }
    });
    return filters;
  });
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [myPresets, setMyPresets] = useState<Preset[]>(defaultPresets);
  const [showPresets, setShowPresets] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [backtestModalOpen, setBacktestModalOpen] = useState(false);
  const [selectedStockForBacktest, setSelectedStockForBacktest] = useState<Stock | null>(null);
  const [hoveredStock, setHoveredStock] = useState<string | null>(null);

  // Update URL when filters or tab change
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Preserve the view parameter from initial load
    if (initialViewRef.current) {
      params.set('view', initialViewRef.current);
    }
    
    if (activeTab !== "Overview") {
      params.set('tab', activeTab);
    }
    
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== "Any" && key !== 'view') {
        params.set(key, value);
      }
    });
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [activeTab, selectedFilters, searchQuery, pathname, router]);

  const filteredStocks = useMemo(() => {
    return allStocks.filter((stock) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!stock.ticker.toLowerCase().includes(query) && 
            !stock.company.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Apply all active filters
      for (const [filterName, filterValue] of Object.entries(selectedFilters)) {
        if (!filterValue || filterValue === "Any") continue;

        switch (filterName) {
          case "Exchange":
            if (stock.exchange !== filterValue) return false;
            break;
          case "Sector":
            if (stock.sector !== filterValue) return false;
            break;
          case "Industry":
            if (stock.industry !== filterValue) return false;
            break;
          case "Country":
            if (stock.country !== filterValue) return false;
            break;
          case "Market Cap":
            const mcap = stock.marketCap / 1000000000;
            if (filterValue.includes("Mega") && mcap < 200) return false;
            if (filterValue.includes("Large") && (mcap < 10 || mcap >= 200)) return false;
            if (filterValue.includes("Mid") && (mcap < 2 || mcap >= 10)) return false;
            if (filterValue.includes("Small") && (mcap < 0.3 || mcap >= 2)) return false;
            break;
          case "P/E":
            if (filterValue.includes("Low") && stock.pe >= 15) return false;
            if (filterValue.includes("Profitable") && stock.pe <= 0) return false;
            if (filterValue.includes("High") && stock.pe < 50) return false;
            if (filterValue === "Under 15" && stock.pe >= 15) return false;
            if (filterValue === "Under 20" && stock.pe >= 20) return false;
            if (filterValue === "Under 30" && stock.pe >= 30) return false;
            if (filterValue === "Over 30" && stock.pe < 30) return false;
            break;
          case "Forward P/E":
            if (filterValue.includes("Low") && stock.forwardPE >= 15) return false;
            if (filterValue === "Under 15" && stock.forwardPE >= 15) return false;
            if (filterValue === "Under 20" && stock.forwardPE >= 20) return false;
            if (filterValue === "Over 20" && stock.forwardPE < 20) return false;
            break;
          case "PEG":
            if (filterValue.includes("Low") && stock.peg >= 1) return false;
            if (filterValue.includes("High") && stock.peg < 2) return false;
            if (filterValue === "Under 1" && stock.peg >= 1) return false;
            if (filterValue === "Under 2" && stock.peg >= 2) return false;
            if (filterValue === "Over 2" && stock.peg < 2) return false;
            break;
          case "P/S":
            if (filterValue.includes("Low") && stock.ps >= 1) return false;
            if (filterValue === "Under 1" && stock.ps >= 1) return false;
            if (filterValue === "Under 3" && stock.ps >= 3) return false;
            if (filterValue === "Over 3" && stock.ps < 3) return false;
            if (filterValue === "Over 10" && stock.ps < 10) return false;
            break;
          case "P/B":
            if (filterValue.includes("Low") && stock.pb >= 1) return false;
            if (filterValue === "Under 1" && stock.pb >= 1) return false;
            if (filterValue === "Under 3" && stock.pb >= 3) return false;
            if (filterValue === "Over 3" && stock.pb < 3) return false;
            if (filterValue === "Over 5" && stock.pb < 5) return false;
            break;
          case "Dividend Yield":
            if (filterValue.includes("None") && stock.dividend > 0) return false;
            if (filterValue.includes("Positive") && stock.dividend <= 0) return false;
            if (filterValue === "Over 2%" && stock.dividend < 2) return false;
            if (filterValue === "Over 3%" && stock.dividend < 3) return false;
            if (filterValue === "Over 5%" && stock.dividend < 5) return false;
            break;
          case "ROE":
            if (filterValue.includes("Positive") && !filterValue.includes("Very") && stock.roe <= 0) return false;
            if (filterValue.includes("Very Positive") && stock.roe < 15) return false;
            if (filterValue === "Over 15%" && stock.roe < 15) return false;
            if (filterValue === "Over 20%" && stock.roe < 20) return false;
            if (filterValue === "Over 30%" && stock.roe < 30) return false;
            break;
          case "ROA":
            if (filterValue.includes("Positive") && stock.roa <= 0) return false;
            if (filterValue === "Over 10%" && stock.roa < 10) return false;
            if (filterValue === "Over 15%" && stock.roa < 15) return false;
            break;
          case "Current Ratio":
            if (filterValue === "Over 1" && stock.currentRatio < 1) return false;
            if (filterValue === "Over 1.5" && stock.currentRatio < 1.5) return false;
            if (filterValue === "Over 2" && stock.currentRatio < 2) return false;
            break;
          case "Debt/Equity":
            if (filterValue.includes("Low") && stock.debtEquity >= 0.1) return false;
            if (filterValue === "Under 0.5" && stock.debtEquity >= 0.5) return false;
            if (filterValue === "Over 0.5" && stock.debtEquity < 0.5) return false;
            break;
          case "Gross Margin":
            if (filterValue.includes("Positive") && stock.grossMargin <= 0) return false;
            if (filterValue === "Over 30%" && stock.grossMargin < 30) return false;
            if (filterValue === "Over 50%" && stock.grossMargin < 50) return false;
            break;
          case "Operating Margin":
            if (filterValue.includes("Positive") && stock.operatingMargin <= 0) return false;
            if (filterValue === "Over 10%" && stock.operatingMargin < 10) return false;
            if (filterValue === "Over 20%" && stock.operatingMargin < 20) return false;
            break;
          case "Net Profit Margin":
            if (filterValue.includes("Positive") && stock.netMargin <= 0) return false;
            if (filterValue === "Over 10%" && stock.netMargin < 10) return false;
            if (filterValue === "Over 20%" && stock.netMargin < 20) return false;
            break;
          case "Insider Ownership":
            if (filterValue.includes("Low") && stock.insiderOwnership >= 5) return false;
            if (filterValue.includes("High") && stock.insiderOwnership < 30) return false;
            if (filterValue === "Over 10%" && stock.insiderOwnership < 10) return false;
            if (filterValue === "Over 20%" && stock.insiderOwnership < 20) return false;
            if (filterValue === "Over 30%" && stock.insiderOwnership < 30) return false;
            break;
          case "Institutional Ownership":
            if (filterValue.includes("Low") && stock.institutionalOwnership >= 5) return false;
            if (filterValue.includes("High") && stock.institutionalOwnership < 90) return false;
            if (filterValue === "Over 50%" && stock.institutionalOwnership < 50) return false;
            if (filterValue === "Over 70%" && stock.institutionalOwnership < 70) return false;
            break;
          case "Performance Week":
            if (filterValue === "Up" && stock.perfWeek <= 0) return false;
            if (filterValue === "Down" && stock.perfWeek >= 0) return false;
            if (filterValue === "Up 5%+" && stock.perfWeek < 5) return false;
            if (filterValue === "Up 10%+" && stock.perfWeek < 10) return false;
            if (filterValue === "Down 5%+" && stock.perfWeek > -5) return false;
            if (filterValue === "Down 10%+" && stock.perfWeek > -10) return false;
            break;
          case "Performance Month":
            if (filterValue === "Up" && stock.perfMonth <= 0) return false;
            if (filterValue === "Down" && stock.perfMonth >= 0) return false;
            if (filterValue === "Up 10%+" && stock.perfMonth < 10) return false;
            if (filterValue === "Up 20%+" && stock.perfMonth < 20) return false;
            if (filterValue === "Down 10%+" && stock.perfMonth > -10) return false;
            break;
          case "Performance Year":
            if (filterValue === "Up" && stock.perfYear <= 0) return false;
            if (filterValue === "Down" && stock.perfYear >= 0) return false;
            if (filterValue === "Up 50%+" && stock.perfYear < 50) return false;
            if (filterValue === "Up 100%+" && stock.perfYear < 100) return false;
            if (filterValue === "Down 50%+" && stock.perfYear > -50) return false;
            break;
          case "EPS Growth":
            if (filterValue.includes("Positive") && stock.epsGrowthThisYear <= 0) return false;
            if (filterValue === "Over 10%" && stock.epsGrowthThisYear < 10) return false;
            if (filterValue === "Over 20%" && stock.epsGrowthThisYear < 20) return false;
            if (filterValue === "Over 25%" && stock.epsGrowthThisYear < 25) return false;
            break;
          case "Price":
            if (filterValue === "Under $10" && stock.price >= 10) return false;
            if (filterValue === "Under $20" && stock.price >= 20) return false;
            if (filterValue === "Under $50" && stock.price >= 50) return false;
            if (filterValue === "Over $10" && stock.price < 10) return false;
            if (filterValue === "Over $50" && stock.price < 50) return false;
            if (filterValue === "Over $100" && stock.price < 100) return false;
            break;
          case "Beta":
            if (filterValue === "Under 1" && stock.beta >= 1) return false;
            if (filterValue === "Under 1.5" && stock.beta >= 1.5) return false;
            if (filterValue === "Over 1" && stock.beta < 1) return false;
            if (filterValue === "Over 1.5" && stock.beta < 1.5) return false;
            if (filterValue === "Over 2" && stock.beta < 2) return false;
            break;
          case "RSI":
            if (filterValue.includes("Overbought") && stock.rsi < 70) return false;
            if (filterValue.includes("Oversold") && filterValue.includes("<30") && stock.rsi >= 30) return false;
            if (filterValue.includes("Not Overbought") && stock.rsi >= 70) return false;
            if (filterValue.includes("Not Oversold") && stock.rsi < 30) return false;
            break;
          case "Change":
            if (filterValue === "Up" && stock.change <= 0) return false;
            if (filterValue === "Down" && stock.change >= 0) return false;
            if (filterValue === "Up 1%" && stock.change < 1) return false;
            if (filterValue === "Up 5%" && stock.change < 5) return false;
            if (filterValue === "Down 1%" && stock.change > -1) return false;
            if (filterValue === "Down 5%" && stock.change > -5) return false;
            break;
        }
      }

      return true;
    });
  }, [selectedFilters, searchQuery]);

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category] === option ? "Any" : option
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
  };

  const loadPreset = (preset: Preset) => {
    setActiveTab(preset.tab);
    setSelectedFilters(preset.filters);
    setShowPresets(false);
  };

  const openSaveDialog = () => {
    setPresetName("");
    setShowSaveDialog(true);
  };

  const saveCurrentAsPreset = () => {
    if (!presetName.trim()) return;

    const newPreset: Preset = {
      id: `custom-${Date.now()}`,
      name: presetName.trim(),
      filters: { ...selectedFilters },
      tab: activeTab,
    };

    setMyPresets(prev => [...prev, newPreset]);
    setShowSaveDialog(false);
    setPresetName("");
  };

  const deletePreset = (id: string) => {
    setMyPresets(prev => prev.filter(p => p.id !== id));
  };

  const activeFilterCount = Object.entries(selectedFilters).filter(([key, value]) => {
    return key !== 'view' && value && value !== "Any";
  }).length;

  const allTabs: FilterTab[] = ["Overview", "Valuation", "Financial", "Ownership", "Performance", "Technical", "ETF", "ETF Perf", "Custom", "Charts", "Tickers", "Basic", "TA", "News", "Snapshot", "Maps", "Stats"];

  const addToJournal = (stock: Stock) => {
    toast.success(`${stock.ticker} added to journal`, {
      description: `${stock.company} has been successfully added to your trading journal.`,
      duration: 3000,
    });
  };

  const openBacktestModal = (stock: Stock) => {
    setSelectedStockForBacktest(stock);
    setBacktestModalOpen(true);
  };

  // Generate stable mock chart data for backtest modal
  const generateMockBacktestData = useMemo(() => {
    if (!selectedStockForBacktest) return [];
    return Array.from({ length: 20 }, (_, i) => {
      const seed = i * selectedStockForBacktest.price;
      const pseudoRandom = Math.sin(seed) * 10000;
      const height = 30 + (pseudoRandom - Math.floor(pseudoRandom)) * 70;
      const isPositive = ((i + selectedStockForBacktest.ticker.charCodeAt(0)) % 10) > 3;
      return { height, isPositive };
    });
  }, [selectedStockForBacktest]);

  // Define columns based on active tab
  const getColumnsForTab = () => {
    switch (activeTab) {
      case "Overview":
        return ["No.", "Ticker", "Company", "Sector", "Industry", "Country", "Market Cap", "Price", "Change %", "Volume", "Actions"];
      case "Valuation":
        return ["No.", "Ticker", "Company", "Price", "P/E", "Fwd P/E", "PEG", "P/S", "P/B", "Mkt Cap", "Actions"];
      case "Financial":
        return ["No.", "Ticker", "Company", "Dividend %", "ROE %", "ROA %", "Debt/Eq", "Curr Ratio", "Gross M%", "Oper M%", "Net M%", "Actions"];
      case "Ownership":
        return ["No.", "Ticker", "Company", "Price", "Insider Own%", "Inst Own%", "Float", "Volume", "Actions"];
      case "Performance":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Week %", "Month %", "Year %", "EPS Growth %", "Actions"];
      case "Technical":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Rel Vol", "Beta", "RSI", "SMA20", "SMA50", "SMA200", "Actions"];
      case "ETF":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Mkt Cap", "Actions"];
      case "ETF Perf":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Week %", "Month %", "Year %", "Actions"];
      case "Custom":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Mkt Cap", "P/E", "Actions"];
      case "Charts":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "High", "Low", "Actions"];
      case "Tickers":
        return ["No.", "Ticker", "Company", "Sector", "Price", "Change %", "Volume", "Actions"];
      case "Basic":
        return ["No.", "Ticker", "Company", "Sector", "Price", "Change %", "Volume", "Mkt Cap", "Actions"];
      case "TA":
        return ["No.", "Ticker", "Company", "Price", "Change %", "RSI", "Beta", "Volume", "Actions"];
      case "News":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Actions"];
      case "Snapshot":
        return ["No.", "Ticker", "Company", "Sector", "Price", "Change %", "Volume", "Mkt Cap", "P/E", "Actions"];
      case "Maps":
        return ["No.", "Ticker", "Company", "Sector", "Market Cap", "Change %", "Actions"];
      case "Stats":
        return ["No.", "Ticker", "Company", "Price", "Volume", "Mkt Cap", "P/E", "Beta", "Actions"];
      default:
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Mkt Cap", "Actions"];
    }
  };

  const columns = getColumnsForTab();

  // Generate mock chart data for hover preview
  const generateMockChartData = (stock: Stock) => {
    const basePrice = stock.price;
    const volatility = stock.beta * 3; // Increased for more variation
    const trend = stock.change / 100;
    
    return Array.from({ length: 30 }, (_, i) => {
      // Create a more realistic price movement with larger variations
      const trendEffect = trend * basePrice * (i / 30);
      const waveEffect = Math.sin(i * 0.3) * basePrice * 0.05;
      const noise = Math.sin(i * stock.ticker.charCodeAt(0) * 0.1) * volatility;
      
      const close = basePrice + trendEffect + waveEffect + noise;
      
      // Generate OHLC with realistic intraday movement (2-5% range)
      const dayRange = basePrice * (0.02 + (Math.abs(Math.sin(i * 1.7)) * 0.03));
      const openOffset = Math.sin(i * 2.1) * dayRange * 0.3;
      const open = close + openOffset;
      
      // High and low should extend beyond open/close
      const highExtension = Math.abs(Math.cos(i * 1.3)) * dayRange * 0.5;
      const lowExtension = Math.abs(Math.sin(i * 1.9)) * dayRange * 0.5;
      
      const high = Math.max(open, close) + highExtension;
      const low = Math.min(open, close) - lowExtension;
      
      return { open, high, low, close };
    });
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1000000000000) return `$${(value / 1000000000000).toFixed(2)}T`;
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`;
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  const getCellValue = (stock: Stock, column: string) => {
    switch (column) {
      case "Ticker": return stock.ticker;
      case "Company": return stock.company;
      case "Sector": return stock.sector;
      case "Industry": return stock.industry;
      case "Country": return stock.country;
      case "Market Cap": return formatMarketCap(stock.marketCap);
      case "Price": return `$${stock.price.toFixed(2)}`;
      case "Change %": return `${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}%`;
      case "Volume": return stock.volume;
      case "P/E": return stock.pe.toFixed(1);
      case "Fwd P/E": return stock.forwardPE.toFixed(1);
      case "PEG": return stock.peg.toFixed(2);
      case "P/S": return stock.ps.toFixed(2);
      case "P/B": return stock.pb.toFixed(2);
      case "Dividend %": return stock.dividend > 0 ? `${stock.dividend.toFixed(2)}%` : '-';
      case "ROE %": return `${stock.roe.toFixed(1)}%`;
      case "ROA %": return `${stock.roa.toFixed(1)}%`;
      case "Debt/Eq": return stock.debtEquity.toFixed(2);
      case "Curr Ratio": return stock.currentRatio.toFixed(2);
      case "Gross M%": return `${stock.grossMargin.toFixed(1)}%`;
      case "Oper M%": return `${stock.operatingMargin.toFixed(1)}%`;
      case "Net M%": return `${stock.netMargin.toFixed(1)}%`;
      case "Insider Own%": return `${stock.insiderOwnership.toFixed(1)}%`;
      case "Inst Own%": return `${stock.institutionalOwnership.toFixed(1)}%`;
      case "Float": return stock.volume;
      case "Week %": return `${stock.perfWeek >= 0 ? '+' : ''}${stock.perfWeek.toFixed(1)}%`;
      case "Month %": return `${stock.perfMonth >= 0 ? '+' : ''}${stock.perfMonth.toFixed(1)}%`;
      case "Year %": return `${stock.perfYear >= 0 ? '+' : ''}${stock.perfYear.toFixed(1)}%`;
      case "EPS Growth %": return `${stock.epsGrowthThisYear.toFixed(1)}%`;
      case "Rel Vol": return stock.relativeVolume.toFixed(2);
      case "Beta": return stock.beta.toFixed(2);
      case "RSI": return stock.rsi.toFixed(0);
      case "SMA20": return `$${stock.sma20.toFixed(0)}`;
      case "SMA50": return `$${stock.sma50.toFixed(0)}`;
      case "SMA200": return `$${stock.sma200.toFixed(0)}`;
      case "High": return `$${stock.week52High.toFixed(2)}`;
      case "Low": return `$${stock.week52Low.toFixed(2)}`;
      default: return '';
    }
  };

  const isChangeColumn = (column: string) => {
    return column.includes("%") || column === "Change %" || column === "Week %" || column === "Month %" || column === "Year %";
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 overflow-hidden dark:bg-neutral-950">
      {/* Filters Section */}
      <div className="bg-white border-b border-neutral-200 shrink-0 dark:bg-neutral-900 dark:border-neutral-800">
        {/* Search and Actions Bar */}
        <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ticker or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent"
            />
          </div>

          {/* My Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-100 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-750 transition"
            >
              <span>My Presets</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
            </button>
            
            {showPresets && (
              <>
                <div 
                  className="fixed inset-0 z-150" 
                  onClick={() => setShowPresets(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-200 overflow-hidden">
                  <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-100">My Presets</span>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={openSaveDialog}
                        className="text-xs font-medium text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300"
                      >
                        + Save Current
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {myPresets.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        No presets yet. Apply some filters and save them!
                      </div>
                    ) : (
                      myPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="px-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={() => loadPreset(preset)}
                              className="flex-1 text-left"
                            >
                              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                                {preset.name}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                                Tab: {preset.tab}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(preset.filters).map(([key, value]) => (
                                  value && value !== "Any" && (
                                    <span
                                      key={key}
                                      className="inline-block px-2 py-0.5 text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded"
                                    >
                                      {key}: {value}
                                    </span>
                                  )
                                ))}
                              </div>
                            </button>
                            {!preset.id.startsWith("custom-") ? null : (
                              <button
                                onClick={() => deletePreset(preset.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            >
              <X className="h-3.5 w-3.5" />
              Clear All ({activeFilterCount})
            </button>
          )}
          <button className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition">
            Export Results
          </button>
        </div>

        {/* Main Screener Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="px-4 flex gap-1">
            {["Descriptive", "Fundamental", "Technical", "News", "ETF", "All"].map((tab) => (
              <button
                key={tab}
                onClick={() => setMainTab(tab as typeof mainTab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                  mainTab === tab
                    ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                    : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto">
          <div className="px-4 flex gap-1 min-w-max">
            {allTabs.map((tab) => {
              const tabParams = new URLSearchParams(searchParams.toString());
              if (tab !== "Overview") {
                tabParams.set('tab', tab);
              } else {
                tabParams.delete('tab');
              }
              const tabUrl = tabParams.toString() ? `${pathname}?${tabParams.toString()}` : pathname;
              
              return (
                <Link
                  key={tab}
                  href={tabUrl}
                  scroll={false}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-[11px] font-medium border-b-2 transition whitespace-nowrap ${
                    activeTab === tab
                      ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100"
                      : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  {tab}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Filter Categories */}
        <div className="px-4 py-3 max-h-[30vh] overflow-y-auto relative z-50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {filtersByTab[activeTab]?.map((category) => (
              <FilterDropdown
                key={category.name}
                category={category}
                selectedValue={selectedFilters[category.name]}
                onSelect={(option) => toggleFilter(category.name, option)}
              />
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Active filters:</span>
              {Object.entries(selectedFilters).map(([category, value]) => {
                if (!value || value === "Any" || category === "view") return null;
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
                onClick={openSaveDialog}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-neutral-900 bg-white border dark:text-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 border-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition ml-auto"
              >
                💾 Save as Preset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Preset Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Filter Preset</DialogTitle>
            <DialogDescription>
              Give your preset a name to save your current filter configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                placeholder="e.g., My Custom Strategy"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && presetName.trim()) {
                    saveCurrentAsPreset();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="rounded-lg bg-neutral-50 p-3 space-y-2 dark:bg-neutral-900 dark:border dark:border-neutral-800">
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Current Configuration:</p>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                <div className="mb-1">
                  <span className="font-medium">Tab:</span> {activeTab}
                </div>
                <div>
                  <span className="font-medium">Active Filters:</span> {activeFilterCount}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(selectedFilters).map(([key, value]) => (
                  value && value !== "Any" && (
                    <span
                      key={key}
                      className="inline-block px-2 py-0.5 text-[10px] bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded border border-neutral-200 dark:border-neutral-700"
                    >
                      {key}: {value}
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveCurrentAsPreset}
              disabled={!presetName.trim()}
            >
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Table */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-10">
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column}
                    className={`text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 ${
                      column !== "No." && column !== "Ticker" && column !== "Company" && column !== "Sector" && column !== "Industry" && column !== "Country" ? "text-right" : ""
                    }`}
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-black">
              {filteredStocks.map((stock, index) => (
                <TableRow 
                  key={stock.ticker}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition group"
                >
                  {columns.map((column) => {
                    if (column === "No.") {
                      return <TableCell key={column} className="px-4 py-3 text-xs text-neutral-500 dark:text-neutral-400">{index + 1}</TableCell>;
                    }
                    if (column === "Ticker") {
                      return (
                        <TableCell key={column} className="px-4 py-3 text-sm font-bold text-neutral-900 dark:text-neutral-100 relative">
                          <div
                            onMouseEnter={() => setHoveredStock(stock.ticker)}
                            onMouseLeave={() => setHoveredStock(null)}
                            className="inline-flex items-center gap-1 cursor-pointer"
                          >
                            {stock.ticker}
                            <LineChart className="h-3 w-3 text-neutral-400 opacity-0 group-hover:opacity-100 transition" />
                          </div>
                          {hoveredStock === stock.ticker && (
                            <MiniChartPreview stock={stock} chartData={generateMockChartData(stock)} />
                          )}
                        </TableCell>
                      );
                    }
                    if (column === "Company") {
                      return <TableCell key={column} className="px-4 py-3 text-xs text-neutral-700 dark:text-neutral-300">{stock.company}</TableCell>;
                    }
                    if (column === "Actions") {
                      return (
                        <TableCell key={column} className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToJournal(stock);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
                            >
                              <Plus className="h-3 w-3" />
                              Add to Journal
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openBacktestModal(stock);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-100 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
                            >
                              <TrendingUp className="h-3 w-3" />
                              Backtest
                            </button>
                          </div>
                        </TableCell>
                      );
                    }
                    
                    const value = getCellValue(stock, column);
                    const isChange = isChangeColumn(column) && (column === "Change %" || column === "Week %" || column === "Month %" || column === "Year %");
                    const numValue = isChange ? parseFloat(value) : 0;
                    
                    return (
                      <TableCell 
                        key={column}
                        className={`px-4 py-3 text-right text-xs ${
                          isChange
                            ? numValue >= 0 
                              ? 'font-bold text-emerald-600' 
                              : 'font-bold text-rose-600'
                            : 'text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Results Footer */}
      <div className="border-t border-neutral-200 bg-white px-4 py-3 shrink-0 dark:bg-neutral-900 dark:border-neutral-800">
        <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
          <span>Showing {filteredStocks.length} results</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
              Previous
            </button>
            <span className="px-2">Page 1 of 1</span>
            <button className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Backtest Modal */}
      <Dialog open={backtestModalOpen} onOpenChange={setBacktestModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Backtest Results: {selectedStockForBacktest?.ticker}
            </DialogTitle>
            <DialogDescription>
              {selectedStockForBacktest?.company} - Historical performance simulation
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Mock Backtest Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">Total Return</div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">+47.3%</div>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Win Rate</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">68.5%</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Sharpe Ratio</div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">1.82</div>
              </div>
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Max Drawdown</div>
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">-12.4%</div>
              </div>
            </div>

            {/* Mock Performance Chart */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-3">Performance Over Time</div>
              <div className="h-32 flex items-end gap-1">
                {generateMockBacktestData.map((bar, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${
                      bar.isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ height: `${bar.height}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Mock Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Total Trades:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Avg Win:</span>
                <span className="font-semibold text-emerald-600">+4.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Winning Trades:</span>
                <span className="font-semibold text-emerald-600">87</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Avg Loss:</span>
                <span className="font-semibold text-rose-600">-2.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Losing Trades:</span>
                <span className="font-semibold text-rose-600">40</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Profit Factor:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">2.14</span>
              </div>
            </div>

            {/* Info Note */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> This is a simulated backtest based on historical data. Past performance does not guarantee future results.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setBacktestModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (selectedStockForBacktest) {
                  addToJournal(selectedStockForBacktest);
                }
                setBacktestModalOpen(false);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add to Journal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MiniChartPreview({ 
  stock, 
  chartData 
}: { 
  stock: Stock; 
  chartData: Array<{ open: number; high: number; low: number; close: number }> 
}) {
  // Calculate price range with padding for better visualization
  const allPrices = chartData.flatMap(d => [d.open, d.high, d.low, d.close]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const range = maxPrice - minPrice;
  const padding = range * 0.1; // Add 10% padding
  const paddedMin = minPrice - padding;
  const paddedMax = maxPrice + padding;
  const paddedRange = paddedMax - paddedMin;

  return (
    <div className="absolute left-0 top-full mt-2 z-50 w-64 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl">
      <div className="mb-2">
        <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{stock.ticker}</div>
        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{stock.company}</div>
      </div>
      
      {/* Candlestick Chart */}
      <div className="h-24 relative mb-2 px-1">
        <div className="absolute inset-0 flex items-end gap-0.5">
          {chartData.map((candle, i) => {
            const isUp = candle.close >= candle.open;
            
            // Calculate positions as percentage from bottom (0-100%)
            const highPct = ((candle.high - paddedMin) / paddedRange) * 100;
            const lowPct = ((candle.low - paddedMin) / paddedRange) * 100;
            const openPct = ((candle.open - paddedMin) / paddedRange) * 100;
            const closePct = ((candle.close - paddedMin) / paddedRange) * 100;
            
            const bodyTop = Math.max(openPct, closePct);
            const bodyBottom = Math.min(openPct, closePct);
            const bodyHeight = bodyTop - bodyBottom;
            
            return (
              <div
                key={i}
                className="flex-1 relative"
                style={{ height: '100%' }}
              >
                {/* Lower wick (from bottom to low point) */}
                <div
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-px ${
                    isUp ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-rose-600 dark:bg-rose-500'
                  }`}
                  style={{ 
                    height: `${lowPct}%`
                  }}
                />
                
                {/* Candle body */}
                <div
                  className={`absolute left-0 right-0 ${
                    isUp 
                      ? 'bg-emerald-500 dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500' 
                      : 'bg-rose-500 dark:bg-rose-600 border border-rose-600 dark:border-rose-500'
                  }`}
                  style={{ 
                    bottom: `${bodyBottom}%`,
                    height: bodyHeight > 0.5 ? `${bodyHeight}%` : '2px',
                  }}
                />
                
                {/* Upper wick (from body top to high point) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-px ${
                    isUp ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-rose-600 dark:bg-rose-500'
                  }`}
                  style={{ 
                    bottom: `${bodyTop}%`,
                    height: `${highPct - bodyTop}%`
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <span className="text-neutral-500 dark:text-neutral-400">Price:</span>
          <span className="ml-1 font-semibold text-neutral-900 dark:text-neutral-100">${stock.price.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-neutral-500 dark:text-neutral-400">Change:</span>
          <span className={`ml-1 font-semibold ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
          </span>
        </div>
        <div>
          <span className="text-neutral-500 dark:text-neutral-400">Volume:</span>
          <span className="ml-1 font-semibold text-neutral-900 dark:text-neutral-100">{stock.volume}</span>
        </div>
        <div>
          <span className="text-neutral-500 dark:text-neutral-400">RSI:</span>
          <span className="ml-1 font-semibold text-neutral-900 dark:text-neutral-100">{stock.rsi}</span>
        </div>
      </div>
    </div>
  );
}

function FilterDropdown({ 
  category, 
  selectedValue, 
  onSelect 
}: { 
  category: FilterCategory; 
  selectedValue?: string; 
  onSelect: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const displayValue = selectedValue && selectedValue !== "Any" ? selectedValue : category.name;

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
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border transition ${
            selectedValue && selectedValue !== "Any"
              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
              : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
          }`}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown className={`h-3.5 w-3.5 ml-1 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {isOpen && buttonRect && (
        <>
          <div 
            className="fixed inset-0 z-100" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="fixed min-w-[200px] max-h-60 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-100"
            style={{
              top: `${buttonRect.bottom + 4}px`,
              left: `${buttonRect.left}px`,
              width: `${buttonRect.width}px`,
            }}
          >
            {category.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition ${
                  selectedValue === option ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold' : ''
                }`}
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
