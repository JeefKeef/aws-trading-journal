/**
 * Centralized Mock Data Store
 * 
 * Single source of truth for all dummy/mock data used across the app.
 * This ensures consistency and makes it easy to swap with real Supabase data later.
 * 
 * Usage: Import specific data sets as needed
 * Example: import { mockConversations, mockMessages } from '@/lib/data/mock-data'
 */

import type { MessageRole } from "@/lib/types/chat";

// ============================================================================
// CHAT & CONVERSATIONS
// ============================================================================

export type MockConversation = {
  id: string;
  title: string;
  timestamp: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  model: string;
};

export type MockMessage = {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  status?: "pending" | "error" | "complete";
};

/**
 * Mock conversation history - simulates database table
 * In production, this will be replaced with Supabase queries
 */
export const mockConversations: MockConversation[] = [
  {
    id: "conv-1",
    title: "Market analysis for tech stocks",
    timestamp: "2 hours ago",
    lastMessage: "Here's the sector breakdown for FAANG stocks...",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    model: "signal-pro-v1",
  },
  {
    id: "conv-2",
    title: "Options strategy discussion",
    timestamp: "5 hours ago",
    lastMessage: "Consider a bull call spread with these strikes...",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    model: "signal-core-v1",
  },
  {
    id: "conv-3",
    title: "Risk assessment framework",
    timestamp: "Yesterday",
    lastMessage: "Your portfolio VaR suggests maintaining current hedges...",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    model: "signal-ultra-v1",
  },
  {
    id: "conv-4",
    title: "AWS automation setup",
    timestamp: "Yesterday",
    lastMessage: "Lambda functions deployed. Ready for backtesting...",
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    model: "signal-pro-v1",
  },
  {
    id: "conv-5",
    title: "Portfolio rebalancing ideas",
    timestamp: "2 days ago",
    lastMessage: "Based on your risk tolerance, I recommend...",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    model: "signal-core-v1",
  },
  {
    id: "conv-6",
    title: "Crypto market sentiment analysis",
    timestamp: "3 days ago",
    lastMessage: "BTC/ETH correlation remains strong at 0.87...",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    model: "signal-mini-v1",
  },
  {
    id: "conv-7",
    title: "Earnings season trade prep",
    timestamp: "1 week ago",
    lastMessage: "Tracking 47 positions with earnings in next 2 weeks...",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    model: "signal-pro-v1",
  },
];

/**
 * Mock messages for conversations - simulates message history
 * Keyed by conversationId for efficient lookup
 */
export const mockMessages: Record<string, MockMessage[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      conversationId: "conv-1",
      role: "assistant",
      content: "Welcome back. How can I help move your market workflow forward?",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "complete",
    },
    {
      id: "msg-1-2",
      conversationId: "conv-1",
      role: "user",
      content: "Can you analyze the tech sector for me?",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString(),
      status: "complete",
    },
    {
      id: "msg-1-3",
      conversationId: "conv-1",
      role: "assistant",
      content: "Here's the sector breakdown for FAANG stocks: AAPL showing strong momentum above the 200-day MA, NVDA consolidating after recent rally. MSFT maintaining support levels. Would you like detailed technical levels for any specific name?",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000).toISOString(),
      status: "complete",
    },
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      conversationId: "conv-2",
      role: "assistant",
      content: "Welcome back. How can I help move your market workflow forward?",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: "complete",
    },
    {
      id: "msg-2-2",
      conversationId: "conv-2",
      role: "user",
      content: "What's a good options strategy for a bullish outlook on TSLA?",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 20000).toISOString(),
      status: "complete",
    },
    {
      id: "msg-2-3",
      conversationId: "conv-2",
      role: "assistant",
      content: "Consider a bull call spread with these strikes: Buy the $200 call and sell the $220 call, both expiring in 30 days. This limits your downside to the net debit while capping upside at $20 per share. Current implied volatility is at 45%, which is relatively elevated. Max risk: $350, Max profit: $1,650.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 40000).toISOString(),
      status: "complete",
    },
  ],
  "conv-3": [
    {
      id: "msg-3-1",
      conversationId: "conv-3",
      role: "assistant",
      content: "Welcome back. How can I help move your market workflow forward?",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "complete",
    },
    {
      id: "msg-3-2",
      conversationId: "conv-3",
      role: "user",
      content: "Can you assess my portfolio risk?",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 15000).toISOString(),
      status: "complete",
    },
    {
      id: "msg-3-3",
      conversationId: "conv-3",
      role: "assistant",
      content: "Your portfolio VaR suggests maintaining current hedges. 95% confidence interval shows max 2-day loss of 3.2%. Correlation breakdown: Tech exposure 42%, Financials 18%, Healthcare 15%. Beta to SPY: 1.15. Consider adding put spreads on QQQ to hedge concentration risk.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 35000).toISOString(),
      status: "complete",
    },
  ],
};

// ============================================================================
// SCREENER DATA
// ============================================================================

export type MockStock = {
  symbol: string;
  name: string;
  sector: string;
  price: string;
  change: string;
  volume: string;
};

export const mockScreenerResults: MockStock[] = [
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
    symbol: "TSLA",
    name: "Tesla",
    sector: "Automotive",
    price: "$203.14",
    change: "-0.8%",
    volume: "1.5x avg",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: "$178.32",
    change: "+0.6%",
    volume: "1.0x avg",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    price: "$142.18",
    change: "+1.8%",
    volume: "1.1x avg",
  },
];

// ============================================================================
// HEATMAP DATA
// ============================================================================

export type MockSectorPerformance = {
  label: string;
  performance: number;
};

export const mockHeatmapData: MockSectorPerformance[] = [
  { label: "AI Infrastructure", performance: 4.2 },
  { label: "Cybersecurity", performance: 1.8 },
  { label: "Energy", performance: -1.1 },
  { label: "Financials", performance: -0.4 },
  { label: "Healthcare", performance: 0.6 },
  { label: "Industrials", performance: 2.4 },
  { label: "Consumer Discretionary", performance: 0.3 },
  { label: "Real Estate", performance: -0.9 },
];

// ============================================================================
// NEWS/CATALYST DATA
// ============================================================================

export type MockNewsItem = {
  headline: string;
  source: string;
  timestamp: string;
  summary: string;
};

export const mockNewsData: MockNewsItem[] = [
  {
    headline: "Chipmakers gear up for next-gen data center spend",
    source: "Signal Desk",
    timestamp: "Now",
    summary:
      "Leadership rotation continues toward AI infrastructure as hyperscalers accelerate orders.",
  },
  {
    headline: "Crude slips on unexpected inventory build",
    source: "Macro Pulse",
    timestamp: "3m ago",
    summary:
      "Energy majors underperform services; VWAP alerts triggered across integrated names.",
  },
  {
    headline: "GBP spikes on BOE hawkish tone",
    source: "FX Radar",
    timestamp: "12m ago",
    summary:
      "Governor highlights inflation persistence; rate path repriced with front-end yields higher.",
  },
  {
    headline: "Tech earnings beat expectations",
    source: "Signal Desk",
    timestamp: "1h ago",
    summary:
      "Q4 results show resilient spending on cloud infrastructure despite macro headwinds.",
  },
];

// ============================================================================
// ALERTS/RISK DATA
// ============================================================================

export type MockAlert = {
  title: string;
  detail: string;
  severity: "low" | "medium" | "high";
  time: string;
};

export const mockAlertsData: MockAlert[] = [
  {
    title: "Option skew expansion in SMH",
    detail: "Call skew hitting 95th percentile. Consider gamma scalping adjustments.",
    severity: "high",
    time: "Now",
  },
  {
    title: "AWS data pull scheduled",
    detail:
      "Lambda pipeline ready to ingest options chain every 5 minutes. Awaiting confirmation.",
    severity: "medium",
    time: "2m ago",
  },
  {
    title: "Funding stress monitor",
    detail:
      "Short-term credit spreads widening modestly. Keep liquidity dashboard on standby.",
    severity: "low",
    time: "7m ago",
  },
  {
    title: "VIX spike detected",
    detail: "Volatility index jumped 12% in last hour. Review hedge ratios.",
    severity: "high",
    time: "15m ago",
  },
];

// ============================================================================
// TRADES DATA
// ============================================================================

export type MockTrade = {
  id: string;
  userId?: string;
  ticker: string;
  type: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  setup: string;
  date: string;
  profitLoss?: number;
  profitLossPercentage?: number;
  status: "open" | "closed" | "cancelled";
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Mock trades - simulates trades table
 * Used across: Trades page, Analytics, Calendar, Journal linking
 */
export const mockTrades: MockTrade[] = [
  {
    id: "trade-1",
    ticker: "AAPL",
    type: "LONG",
    entryPrice: 175.5,
    exitPrice: 182.3,
    quantity: 100,
    setup: "Momentum Breakout",
    date: "2025-11-04",
    profitLoss: 680,
    profitLossPercentage: 3.87,
    status: "closed",
    tags: ["Breakout", "Large Cap", "Tech"],
    notes: "Clean breakout above resistance with strong volume",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-2",
    ticker: "TSLA",
    type: "SHORT",
    entryPrice: 255.2,
    exitPrice: 248.9,
    quantity: 50,
    setup: "Reversal",
    date: "2025-11-03",
    profitLoss: 315,
    profitLossPercentage: 2.47,
    status: "closed",
    tags: ["Reversal", "High Volatility"],
    notes: "Overbought on RSI, showing weakness",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-3",
    ticker: "NVDA",
    type: "LONG",
    entryPrice: 850.0,
    exitPrice: 842.5,
    quantity: 25,
    setup: "Support Bounce",
    date: "2025-11-02",
    profitLoss: -187.5,
    profitLossPercentage: -0.88,
    status: "closed",
    tags: ["Support/Resistance", "AI"],
    notes: "Failed support bounce, cut loss quickly",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-4",
    ticker: "MSFT",
    type: "LONG",
    entryPrice: 420.15,
    exitPrice: 428.8,
    quantity: 75,
    setup: "Momentum Continuation",
    date: "2025-11-01",
    profitLoss: 648.75,
    profitLossPercentage: 2.06,
    status: "closed",
    tags: ["Momentum", "Earnings"],
    notes: "Strong earnings momentum continuation",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-5",
    ticker: "GOOGL",
    type: "LONG",
    entryPrice: 138.5,
    exitPrice: 141.9,
    quantity: 150,
    setup: "Gap Fill",
    date: "2025-10-31",
    profitLoss: 510,
    profitLossPercentage: 2.45,
    status: "closed",
    tags: ["Gap", "Tech"],
    notes: "Gap up on news, rode momentum",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-6",
    ticker: "META",
    type: "SHORT",
    entryPrice: 475.0,
    exitPrice: 485.3,
    quantity: 30,
    setup: "Failed Reversal",
    date: "2025-10-30",
    profitLoss: -309,
    profitLossPercentage: -2.17,
    status: "closed",
    tags: ["Reversal", "Loss"],
    notes: "Reversal didn't materialize, stopped out",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-7",
    ticker: "AMZN",
    type: "LONG",
    entryPrice: 172.8,
    exitPrice: 178.3,
    quantity: 100,
    setup: "Earnings Play",
    date: "2025-10-29",
    profitLoss: 550,
    profitLossPercentage: 3.18,
    status: "closed",
    tags: ["Earnings", "Tech"],
    notes: "Post-earnings gap and run",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-8",
    ticker: "SPY",
    type: "LONG",
    entryPrice: 452.5,
    exitPrice: 451.2,
    quantity: 200,
    setup: "Failed Momentum",
    date: "2025-10-28",
    profitLoss: -260,
    profitLossPercentage: -0.29,
    status: "closed",
    tags: ["Index", "Loss"],
    notes: "Market pullback, small loss",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-9",
    ticker: "QQQ",
    type: "LONG",
    entryPrice: 385.2,
    exitPrice: 391.8,
    quantity: 150,
    setup: "Tech Breakout",
    date: "2025-10-27",
    profitLoss: 990,
    profitLossPercentage: 1.71,
    status: "closed",
    tags: ["Breakout", "Index", "Tech"],
    notes: "Tech sector strength, clean trade",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-10",
    ticker: "AMD",
    type: "LONG",
    entryPrice: 128.5,
    exitPrice: 128.5,
    quantity: 80,
    setup: "Support Test",
    date: "2025-10-26",
    profitLoss: 0,
    profitLossPercentage: 0,
    status: "closed",
    tags: ["Breakeven", "Semiconductors"],
    notes: "Exited at entry, no clear direction",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "trade-11",
    ticker: "NFLX",
    type: "LONG",
    entryPrice: 485.0,
    quantity: 40,
    setup: "Earnings Anticipation",
    date: "2025-11-05",
    status: "open",
    tags: ["Earnings", "Media"],
    notes: "Holding through earnings, strong setup",
    createdAt: new Date(Date.now()).toISOString(),
    updatedAt: new Date(Date.now()).toISOString(),
  },
  {
    id: "trade-12",
    ticker: "COIN",
    type: "LONG",
    entryPrice: 215.3,
    quantity: 60,
    setup: "Crypto Momentum",
    date: "2025-11-04",
    status: "open",
    tags: ["Crypto", "Momentum"],
    notes: "BTC strength driving COIN higher",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================================
// USER PREFERENCES (for settings)
// ============================================================================

export type MockUserPreferences = {
  // Display
  theme: "light" | "dark" | "system";
  displayCurrency: "USD" | "EUR" | "GBP";
  
  // AI Assistant
  defaultModel: string;
  temperature: number;
  systemPrompt: string;
  autoSuggest: boolean;
  contextWindow: number;
  
  // Notifications
  notifications: boolean;
  tradingAlerts: boolean;
  priceAlerts: boolean;
  newsAlerts: boolean;
  
  // Workflow
  autoSave: boolean;
  autoLinkTrades: boolean;
  enableKeyboardShortcuts: boolean;
  
  // Risk Management
  maxPositionSize: number;
  defaultStopLoss: number;
  riskPerTrade: number;
};

export const mockUserPreferences: MockUserPreferences = {
  // Display
  theme: "system",
  displayCurrency: "USD",
  
  // AI Assistant
  defaultModel: "signal-pro-v1",
  temperature: 0.7,
  systemPrompt: "You are Signal, an AI trading assistant. Provide concise, actionable market analysis and trade insights. Focus on technical setups, risk management, and data-driven recommendations.",
  autoSuggest: true,
  contextWindow: 8000,
  
  // Notifications
  notifications: true,
  tradingAlerts: true,
  priceAlerts: true,
  newsAlerts: false,
  
  // Workflow
  autoSave: true,
  autoLinkTrades: false,
  enableKeyboardShortcuts: true,
  
  // Risk Management
  maxPositionSize: 10000,
  defaultStopLoss: 2.0,
  riskPerTrade: 1.0,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get conversation by ID
 */
export function getConversationById(id: string): MockConversation | undefined {
  return mockConversations.find((conv) => conv.id === id);
}

/**
 * Get messages for a conversation
 */
export function getMessagesByConversationId(conversationId: string): MockMessage[] {
  return mockMessages[conversationId] || [];
}

/**
 * Get all conversations sorted by most recent
 */
export function getAllConversations(): MockConversation[] {
  return [...mockConversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Get all trades sorted by most recent
 */
export function getAllTrades(): MockTrade[] {
  return [...mockTrades].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get trades by status
 */
export function getTradesByStatus(status: "open" | "closed" | "cancelled"): MockTrade[] {
  return mockTrades.filter((trade) => trade.status === status);
}

/**
 * Get trade by ID
 */
export function getTradeById(id: string): MockTrade | undefined {
  return mockTrades.find((trade) => trade.id === id);
}

/**
 * Get trades by ticker
 */
export function getTradesByTicker(ticker: string): MockTrade[] {
  return mockTrades.filter((trade) => trade.ticker.toLowerCase() === ticker.toLowerCase());
}

/**
 * Create a new trade (simulates database insert)
 */
export function createMockTrade(trade: Omit<MockTrade, "id" | "createdAt" | "updatedAt">): MockTrade {
  const now = new Date().toISOString();
  const newTrade: MockTrade = {
    ...trade,
    id: `trade-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  mockTrades.unshift(newTrade);
  return newTrade;
}

/**
 * Update existing trade (simulates database update)
 */
export function updateMockTrade(id: string, updates: Partial<MockTrade>): MockTrade | null {
  const tradeIndex = mockTrades.findIndex((t) => t.id === id);
  if (tradeIndex === -1) return null;
  
  mockTrades[tradeIndex] = {
    ...mockTrades[tradeIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockTrades[tradeIndex];
}

/**
 * Delete trade (simulates database delete)
 */
export function deleteMockTrade(id: string): boolean {
  const initialLength = mockTrades.length;
  const filtered = mockTrades.filter((t) => t.id !== id);
  if (filtered.length < initialLength) {
    mockTrades.length = 0;
    mockTrades.push(...filtered);
    return true;
  }
  return false;
}

/**
 * Create a new conversation (simulates database insert)
 * In production, this will be a Supabase insert
 */
export function createMockConversation(title: string, model: string): MockConversation {
  const now = new Date().toISOString();
  const newConv: MockConversation = {
    id: `conv-${Date.now()}`,
    title,
    timestamp: "Just now",
    lastMessage: "",
    createdAt: now,
    updatedAt: now,
    model,
  };
  mockConversations.unshift(newConv);
  mockMessages[newConv.id] = [];
  return newConv;
}

/**
 * Add message to conversation (simulates database insert)
 */
export function addMockMessage(
  conversationId: string,
  role: MessageRole,
  content: string
): MockMessage {
  const newMessage: MockMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString(),
    status: "complete",
  };
  
  if (!mockMessages[conversationId]) {
    mockMessages[conversationId] = [];
  }
  
  mockMessages[conversationId].push(newMessage);
  
  // Update conversation's updatedAt and lastMessage
  const conv = mockConversations.find((c) => c.id === conversationId);
  if (conv) {
    conv.updatedAt = newMessage.createdAt;
    conv.lastMessage = content.slice(0, 50) + (content.length > 50 ? "..." : "");
  }
  
  return newMessage;
}
