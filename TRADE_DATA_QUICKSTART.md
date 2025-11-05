# Trade Data & Settings - Quick Reference

## 🚀 Quick Start

### Import Trade Data

```typescript
import { 
  mockTrades, 
  getAllTrades, 
  getTradesByStatus,
  createMockTrade 
} from '@/lib/data/mock-data';
```

### Import Settings

```typescript
import { mockUserPreferences } from '@/lib/data/mock-data';
```

## 📊 Common Operations

### Get All Trades
```typescript
const trades = getAllTrades(); // Sorted by most recent
```

### Filter Open Positions
```typescript
const openTrades = getTradesByStatus("open");
// Returns: NFLX, COIN trades
```

### Get Closed Trades
```typescript
const closedTrades = getTradesByStatus("closed");
// Returns: 10 completed trades
```

### Find Specific Trade
```typescript
const trade = getTradeById("trade-1");
// Returns: AAPL trade
```

### Get Trades by Ticker
```typescript
const aaplTrades = getTradesByTicker("AAPL");
// Returns all Apple trades
```

### Add New Trade
```typescript
const newTrade = createMockTrade({
  ticker: "MSFT",
  type: "LONG",
  entryPrice: 420.50,
  exitPrice: 428.25,
  quantity: 100,
  setup: "Breakout",
  date: "2025-11-05",
  profitLoss: 775,
  profitLossPercentage: 1.84,
  status: "closed",
  tags: ["Breakout", "Tech"],
  notes: "Clean breakout with volume"
});
```

### Update Trade
```typescript
updateMockTrade("trade-11", {
  exitPrice: 492.50,
  profitLoss: 300,
  profitLossPercentage: 1.55,
  status: "closed"
});
```

### Delete Trade
```typescript
deleteMockTrade("trade-1"); // Returns true if deleted
```

## ⚙️ Settings Access

### Load User Preferences
```typescript
const [prefs, setPrefs] = useState(mockUserPreferences);
```

### Update Single Setting
```typescript
setPrefs(prev => ({
  ...prev,
  temperature: 0.9
}));
```

### Access Specific Settings
```typescript
const model = mockUserPreferences.defaultModel; // "signal-pro-v1"
const temp = mockUserPreferences.temperature;   // 0.7
const autoSave = mockUserPreferences.autoSave;  // true
```

## 📈 Calculate Statistics

### Total P/L
```typescript
const totalPL = getAllTrades().reduce(
  (sum, t) => sum + (t.profitLoss || 0), 0
);
// Returns: 3337.25
```

### Win Rate
```typescript
const closed = getTradesByStatus("closed");
const wins = closed.filter(t => (t.profitLoss || 0) > 0).length;
const winRate = (wins / closed.length) * 100;
// Returns: 70%
```

### Average Win/Loss
```typescript
const winners = closed.filter(t => (t.profitLoss || 0) > 0);
const losers = closed.filter(t => (t.profitLoss || 0) < 0);

const avgWin = winners.reduce((s, t) => s + (t.profitLoss || 0), 0) / winners.length;
const avgLoss = losers.reduce((s, t) => s + (t.profitLoss || 0), 0) / losers.length;
```

## 🎨 UI Components

### Display Trade Status Badge
```tsx
<Badge variant={trade.status === "open" ? "default" : "secondary"}>
  {trade.status.toUpperCase()}
</Badge>
```

### Format P/L with Color
```tsx
<span className={cn(
  "font-semibold",
  (trade.profitLoss || 0) >= 0 
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"
)}>
  {(trade.profitLoss || 0) >= 0 ? '+' : ''}
  ${trade.profitLoss?.toFixed(2)}
</span>
```

### Settings Toggle
```tsx
<Switch
  checked={preferences.autoSave}
  onCheckedChange={(checked) => 
    updatePreference("autoSave", checked)
  }
/>
```

## 📍 Where Data is Used

| Page | Import | Usage |
|------|--------|-------|
| `/trades` | `mockTrades` | Full trade table |
| `/analytics` | `getAllTrades()` | Performance metrics |
| `/calendar` | `mockTrades` | Trade events |
| `/journal` | `getTradesByTicker()` | Link trades to notes |
| `/chat` | `getAllTrades()` | AI trade context |
| `/settings` | `mockUserPreferences` | User configuration |

## 🔧 Helper Functions Reference

### Query Functions
- `getAllTrades()` - All trades sorted by date
- `getTradesByStatus(status)` - Filter by open/closed/cancelled
- `getTradeById(id)` - Get single trade
- `getTradesByTicker(ticker)` - All trades for a symbol

### CRUD Operations
- `createMockTrade(data)` - Add new trade
- `updateMockTrade(id, updates)` - Update existing trade
- `deleteMockTrade(id)` - Remove trade

### Conversation (existing)
- `getAllConversations()` - Chat history
- `getConversationById(id)` - Single conversation
- `getMessagesByConversationId(id)` - Messages
- `createMockConversation(title, model)` - New chat
- `addMockMessage(convId, role, content)` - Add message

## 🎯 Sample Data Summary

**Trades**: 12 total (10 closed, 2 open)
- Total P/L: **+$3,337.25**
- Win Rate: **70%** (7W / 3L)
- Best: QQQ +$990
- Worst: META -$309

**Open Positions**:
- NFLX @ $485.00 (Earnings Play)
- COIN @ $215.30 (Crypto Momentum)

**Settings Defaults**:
- Model: Signal Pro
- Temperature: 0.7
- Context: 8000 tokens
- Auto-save: Enabled
- Max Position: $10,000

## 💡 Quick Tips

1. **Always use helper functions** - Don't access `mockTrades` array directly for mutations
2. **Type safety** - Import types: `MockTrade`, `MockUserPreferences`
3. **Consistent imports** - Single source from `@/lib/data/mock-data`
4. **Future-proof** - Data structure matches Supabase schema
5. **AI-ready** - Trade data can be passed to AI for analysis

## 🚨 Common Gotchas

- ❌ Don't mutate `mockTrades` array directly
- ❌ Don't create duplicate trade data elsewhere
- ❌ Don't forget to handle `profitLoss` as optional
- ✅ Use helper functions for all operations
- ✅ Check `status` before accessing `exitPrice`
- ✅ Validate data before creating trades

## 📝 Next Steps

1. Use trade data in chat AI context
2. Display trades in Analytics charts
3. Link trades to journal entries
4. Add trade filters by tag/setup
5. Connect to Supabase backend

---

**Quick Access**: `/settings` for AI configuration  
**Trade Data**: 12 sample trades with full metadata  
**Status**: ✅ Ready for UI development
