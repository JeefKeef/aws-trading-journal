"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Search, X } from "lucide-react";
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

type FilterCategory = {
  name: string;
  options: string[];
};

type FilterTab = "Overview" | "Valuation" | "Financial" | "Ownership" | "Performance" | "Technical" | "ETF" | "ETF Perf" | "Custom" | "Charts" | "Tickers" | "Basic" | "TA" | "News" | "Snapshot" | "Maps" | "Stats";

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

const filtersByTab: Record<FilterTab, FilterCategory[]> = {
  Overview: [
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
  const [activeTab, setActiveTab] = useState<FilterTab>("Overview");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [myPresets, setMyPresets] = useState<Preset[]>(defaultPresets);
  const [showPresets, setShowPresets] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");

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
  }, [allStocks, selectedFilters, searchQuery]);

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

  const activeFilterCount = Object.values(selectedFilters).filter(v => v && v !== "Any").length;

  const allTabs: FilterTab[] = ["Overview", "Valuation", "Financial", "Ownership", "Performance", "Technical", "ETF", "ETF Perf", "Custom", "Charts", "Tickers", "Basic", "TA", "News", "Snapshot", "Maps", "Stats"];

  // Define columns based on active tab
  const getColumnsForTab = () => {
    switch (activeTab) {
      case "Overview":
        return ["No.", "Ticker", "Company", "Sector", "Industry", "Country", "Market Cap", "Price", "Change %", "Volume"];
      case "Valuation":
        return ["No.", "Ticker", "Company", "Price", "P/E", "Fwd P/E", "PEG", "P/S", "P/B", "Mkt Cap"];
      case "Financial":
        return ["No.", "Ticker", "Company", "Dividend %", "ROE %", "ROA %", "Debt/Eq", "Curr Ratio", "Gross M%", "Oper M%", "Net M%"];
      case "Ownership":
        return ["No.", "Ticker", "Company", "Price", "Insider Own%", "Inst Own%", "Float", "Volume"];
      case "Performance":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Week %", "Month %", "Year %", "EPS Growth %"];
      case "Technical":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Rel Vol", "Beta", "RSI", "SMA20", "SMA50", "SMA200"];
      case "ETF":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Mkt Cap"];
      case "ETF Perf":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Week %", "Month %", "Year %"];
      case "Custom":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Mkt Cap", "P/E"];
      case "Charts":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "High", "Low"];
      case "Tickers":
        return ["No.", "Ticker", "Company", "Sector", "Price", "Change %", "Volume"];
      case "Basic":
        return ["No.", "Ticker", "Company", "Sector", "Price", "Change %", "Volume", "Mkt Cap"];
      case "TA":
        return ["No.", "Ticker", "Company", "Price", "Change %", "RSI", "Beta", "Volume"];
      case "News":
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume"];
      case "Snapshot":
        return ["No.", "Ticker", "Company", "Sector", "Price", "Change %", "Volume", "Mkt Cap", "P/E"];
      case "Maps":
        return ["No.", "Ticker", "Company", "Sector", "Market Cap", "Change %"];
      case "Stats":
        return ["No.", "Ticker", "Company", "Price", "Volume", "Mkt Cap", "P/E", "Beta"];
      default:
        return ["No.", "Ticker", "Company", "Price", "Change %", "Volume", "Mkt Cap"];
    }
  };

  const columns = getColumnsForTab();

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
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            />
          </div>

          {/* My Presets Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition"
            >
              <span>My Presets</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
            </button>
            
            {showPresets && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowPresets(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-3 py-2 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-700">My Presets</span>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={openSaveDialog}
                        className="text-xs font-medium text-neutral-900 hover:text-neutral-700"
                      >
                        + Save Current
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {myPresets.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs text-neutral-500">
                        No presets yet. Apply some filters and save them!
                      </div>
                    ) : (
                      myPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="px-3 py-2.5 border-b border-neutral-100 hover:bg-neutral-50 transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={() => loadPreset(preset)}
                              className="flex-1 text-left"
                            >
                              <div className="text-sm font-medium text-neutral-900 mb-1">
                                {preset.name}
                              </div>
                              <div className="text-xs text-neutral-500 mb-1">
                                Tab: {preset.tab}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(preset.filters).map(([key, value]) => (
                                  value && value !== "Any" && (
                                    <span
                                      key={key}
                                      className="inline-block px-2 py-0.5 text-[10px] bg-neutral-100 text-neutral-600 rounded"
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
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition"
            >
              <X className="h-3.5 w-3.5" />
              Clear All ({activeFilterCount})
            </button>
          )}
          <button className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition">
            Export Results
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-neutral-200 overflow-x-auto">
          <div className="px-4 flex gap-1 min-w-max">
            {allTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-[11px] font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab
                    ? "border-neutral-900 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Categories */}
        <div className="px-4 py-3 max-h-[30vh] overflow-y-auto relative z-50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {filtersByTab[activeTab].map((category) => (
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
          <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-medium text-neutral-500">Active filters:</span>
              {Object.entries(selectedFilters).map(([category, value]) => {
                if (!value || value === "Any") return null;
                return (
                  <button
                    key={category}
                    onClick={() => toggleFilter(category, value)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition"
                  >
                    {category}: {value}
                    <X className="h-3 w-3" />
                  </button>
                );
              })}
              <button
                onClick={openSaveDialog}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-neutral-900 bg-white border dark:text-neutral-100 dark:bg-neutral-800 dark:border-neutral-700 border-neutral-300 rounded-full hover:bg-neutral-100 transition ml-auto"
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
              <p className="text-xs font-medium text-neutral-700">Current Configuration:</p>
              <div className="text-xs text-neutral-600">
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
                      className="inline-block px-2 py-0.5 text-[10px] bg-white text-neutral-600 rounded border border-neutral-200"
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
            <TableHeader className="sticky top-0 bg-neutral-100 border-b border-neutral-200 z-10">
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={column}
                    className={`text-[10px] font-semibold uppercase tracking-wider text-neutral-600 ${
                      column !== "No." && column !== "Ticker" && column !== "Company" && column !== "Sector" && column !== "Industry" && column !== "Country" ? "text-right" : ""
                    }`}
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-neutral-900 ">
              {filteredStocks.map((stock, index) => (
                <TableRow 
                  key={stock.ticker}
                  className="cursor-pointer hover:bg-neutral-50 transition"
                >
                  {columns.map((column) => {
                    if (column === "No.") {
                      return <TableCell key={column} className="px-4 py-3 text-xs text-neutral-500">{index + 1}</TableCell>;
                    }
                    if (column === "Ticker") {
                      return <TableCell key={column} className="px-4 py-3 text-sm font-bold text-neutral-900">{stock.ticker}</TableCell>;
                    }
                    if (column === "Company") {
                      return <TableCell key={column} className="px-4 py-3 text-xs text-neutral-700">{stock.company}</TableCell>;
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
                            : 'text-neutral-600'
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
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <span>Showing {filteredStocks.length} results</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-neutral-200 rounded hover:bg-neutral-50 transition">
              Previous
            </button>
            <span className="px-2">Page 1 of 1</span>
            <button className="px-3 py-1.5 border border-neutral-200 rounded hover:bg-neutral-50 transition">
              Next
            </button>
          </div>
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
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
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
            className="fixed min-w-[200px] max-h-60 overflow-y-auto bg-white border border-neutral-200 rounded-lg shadow-lg z-100"
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
                className={`w-full px-3 py-2 text-left text-xs hover:bg-neutral-50 transition ${
                  selectedValue === option ? 'bg-neutral-100 font-semibold' : ''
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
