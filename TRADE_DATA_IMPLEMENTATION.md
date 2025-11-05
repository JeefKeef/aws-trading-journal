# Trade Data & Settings - Implementation Guide

## Overview

This document covers the comprehensive trade data system and redesigned AI settings panel. All data flows through a centralized mock-data store for consistency across the entire application.

## 🎯 Key Features Implemented

### 1. Centralized Trade Data (`lib/data/mock-data.ts`)
- ✅ 12 sample trades (10 closed, 2 open positions)
- ✅ Complete trade metadata (entry, exit, P/L, setup, tags, notes)
- ✅ Helper functions for CRUD operations
- ✅ Type-safe data structures
- ✅ Ready for Supabase migration

### 2. Redesigned Settings Panel
- ✅ AI Assistant customization (model, temperature, system prompt)
- ✅ Notification preferences (trading, price, news alerts)
- ✅ Workflow settings (auto-save, keyboard shortcuts)
- ✅ Risk management (position sizing, stop losses)
- ✅ Real-time save/reset functionality

## 📊 Trade Data Structure

### Type Definition

```typescript
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
```

### Sample Trades

**Closed Trades (10):**
1. AAPL - Long, +$680 (+3.87%) - Momentum Breakout
2. TSLA - Short, +$315 (+2.47%) - Reversal
3. NVDA - Long, -$187.5 (-0.88%) - Failed Support
4. MSFT - Long, +$648.75 (+2.06%) - Earnings
5. GOOGL - Long, +$510 (+2.45%) - Gap Fill
6. META - Short, -$309 (-2.17%) - Failed Reversal
7. AMZN - Long, +$550 (+3.18%) - Earnings Play
8. SPY - Long, -$260 (-0.29%) - Market Pullback
9. QQQ - Long, +$990 (+1.71%) - Tech Breakout
10. AMD - Long, $0 (0%) - Breakeven

**Open Positions (2):**
11. NFLX - Long, $485.00 - Earnings Anticipation
12. COIN - Long, $215.30 - Crypto Momentum

### Trade Tags

Consistent tagging across trades for filtering/analysis:
- **Setup Types**: Breakout, Reversal, Momentum, Support/Resistance, Gap, Earnings
- **Sectors**: Tech, AI, Semiconductors, Index, Crypto, Media
- **Outcomes**: Large Cap, High Volatility, Loss, Breakeven

## 🔧 Helper Functions

### Query Functions

```typescript
// Get all trades sorted by date
getAllTrades(): MockTrade[]

// Get trades by status
getTradesByStatus(status: "open" | "closed" | "cancelled"): MockTrade[]

// Get specific trade
getTradeById(id: string): MockTrade | undefined

// Get trades for a ticker
getTradesByTicker(ticker: string): MockTrade[]
```

### CRUD Operations

```typescript
// Create new trade
createMockTrade(trade: Omit<MockTrade, "id" | "createdAt" | "updatedAt">): MockTrade

// Update existing trade
updateMockTrade(id: string, updates: Partial<MockTrade>): MockTrade | null

// Delete trade
deleteMockTrade(id: string): boolean
```

## ⚙️ Settings Panel Implementation

### AI Assistant Settings

**Model Selection:**
- Signal Mini (Fastest) - `signal-mini-v1`
- Signal Core (Balanced) - `signal-core-v1`
- Signal Pro (Recommended) - `signal-pro-v1`
- Signal Ultra (Most Capable) - `signal-ultra-v1`

**Temperature Control:**
- Range: 0.0 (Precise) to 1.0 (Creative)
- Default: 0.7 (Balanced)
- Live slider with visual feedback

**Context Window:**
- Range: 2,000 - 32,000 tokens
- Default: 8,000 tokens
- Determines conversation memory

**System Prompt:**
- Fully customizable AI personality
- Default: Trading-focused assistant
- Multiline textarea editor

**Auto-suggest:**
- Toggle inline AI suggestions
- Default: Enabled

### Notification Settings

**Master Toggle:**
- Enable/disable all notifications
- Controls desktop alerts

**Individual Alerts:**
- Trading Alerts (position updates, fills)
- Price Alerts (targets, stop losses)
- News Alerts (market events, catalysts)
- Each can be toggled independently

### Workflow Settings

**Auto-save:**
- Automatically save notes and changes
- Default: Enabled

**Auto-link Trades:**
- Automatically link trades to journal entries
- Default: Disabled

**Keyboard Shortcuts:**
- Enable fast keyboard navigation
- Default: Enabled

**Display Currency:**
- USD ($), EUR (€), GBP (£)
- Default: USD

### Risk Management

**Max Position Size:**
- Dollar amount cap per position
- Default: $10,000

**Default Stop Loss:**
- Percentage from entry
- Default: 2.0%

**Risk Per Trade:**
- Portfolio percentage to risk
- Default: 1.0%

## 🔄 Data Flow Architecture

### Current (UI Development)
```
mock-data.ts
    ↓
[Component imports mockTrades]
    ↓
Render UI with local state
```

### Future (Supabase Integration)
```
Supabase trades table
    ↓
API query functions
    ↓
Component receives real data
    ↓
Same UI rendering
```

## 📍 Integration Points

### Where Trade Data is Used

1. **Trades Page** (`/trades`)
   - Full table view with filtering/sorting
   - Import: `import { mockTrades } from '@/lib/data/mock-data'`

2. **Analytics Page** (`/analytics`)
   - Performance metrics and charts
   - Import: `import { mockTrades } from '@/lib/data/mock-data'`

3. **Calendar Page** (`/calendar`)
   - Trade events on calendar
   - Import: `import { mockTrades } from '@/lib/data/mock-data'`

4. **Journal Notes** (`/journal`)
   - Link trades to journal entries
   - Import: `import { getTradesByTicker, getTradeById } from '@/lib/data/mock-data'`

5. **AI Chat** (`/chat`)
   - Context for AI analysis
   - Future: Pass trade data to AI for analysis

### Where Settings are Used

1. **Settings Page** (`/settings`)
   - Main configuration UI
   - Import: `import { mockUserPreferences } from '@/lib/data/mock-data'`

2. **Chat Page** (`/chat`)
   - Apply model selection, temperature
   - Read from `mockUserPreferences.defaultModel`

3. **Shell Layout** (`(shell)/layout.tsx`)
   - Apply keyboard shortcuts, theme
   - Access via Context API (future enhancement)

4. **All Pages**
   - Currency formatting
   - Notification handling
   - Auto-save behavior

## 🚀 Usage Examples

### Adding a New Trade

```typescript
import { createMockTrade } from '@/lib/data/mock-data';

const newTrade = createMockTrade({
  ticker: "AAPL",
  type: "LONG",
  entryPrice: 180.50,
  exitPrice: 185.25,
  quantity: 100,
  setup: "Breakout",
  date: new Date().toISOString().split('T')[0],
  profitLoss: 475,
  profitLossPercentage: 2.63,
  status: "closed",
  tags: ["Breakout", "Tech"],
  notes: "Clean breakout above key resistance"
});
```

### Filtering Open Positions

```typescript
import { getTradesByStatus } from '@/lib/data/mock-data';

const openTrades = getTradesByStatus("open");
// Returns: [NFLX trade, COIN trade]
```

### Calculating Total P/L

```typescript
import { getAllTrades } from '@/lib/data/mock-data';

const allTrades = getAllTrades();
const totalPL = allTrades.reduce((sum, trade) => 
  sum + (trade.profitLoss || 0), 0
);
// Returns: $3,337.25
```

### Updating Settings

```typescript
import { mockUserPreferences } from '@/lib/data/mock-data';

// In component
const [preferences, setPreferences] = useState(mockUserPreferences);

// Update temperature
setPreferences(prev => ({
  ...prev,
  temperature: 0.9
}));

// Save to Supabase (future)
// await updateUserPreferences(userId, preferences);
```

## 🎨 UI Components Used

### Settings Panel
- `Switch` - Toggle controls
- `Slider` - Temperature/range inputs
- `Select` - Dropdown menus
- `Input` - Number/text inputs
- `Textarea` - System prompt editor
- `Button` - Save/Reset actions
- `Label` - Form labels

### Trade Display
- `Table` - Trade list view
- `Badge` - Status indicators
- `Card` - Trade cards
- `Dialog` - Trade details modal

## 🔐 Data Validation

### Trade Validation Rules

```typescript
// Required fields
ticker: string (length > 0)
type: "LONG" | "SHORT"
entryPrice: number (> 0)
quantity: number (> 0)
date: string (ISO format)
status: "open" | "closed" | "cancelled"

// Conditional requirements
if status === "closed":
  exitPrice: number (> 0)
  profitLoss: number
  profitLossPercentage: number
```

### Settings Validation

```typescript
// Temperature: 0.0 - 1.0
temperature: number (min: 0, max: 1, step: 0.1)

// Context Window: 2000 - 32000
contextWindow: number (min: 2000, max: 32000, step: 1000)

// Position Size: > 0
maxPositionSize: number (min: 0)

// Stop Loss: 0 - 100%
defaultStopLoss: number (min: 0, max: 100)

// Risk Per Trade: 0 - 10%
riskPerTrade: number (min: 0, max: 10)
```

## 📊 Performance Metrics

### Trade Statistics (from sample data)

```
Total Trades: 12
Closed: 10
Open: 2

Win Rate: 70% (7 wins, 3 losses)
Total P/L: +$3,337.25
Average Win: +$626.39
Average Loss: -$252.17
Profit Factor: 2.47

Best Trade: QQQ +$990 (+1.71%)
Worst Trade: META -$309 (-2.17%)

Current Open Positions:
- NFLX: $485.00 (Earnings Play)
- COIN: $215.30 (Crypto Momentum)
```

## 🔄 Migration Path to Supabase

### Step 1: Create Trades Table

```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('LONG', 'SHORT')),
  entry_price DECIMAL(10, 2) NOT NULL,
  exit_price DECIMAL(10, 2),
  quantity INTEGER NOT NULL,
  setup TEXT NOT NULL,
  date DATE NOT NULL,
  profit_loss DECIMAL(10, 2),
  profit_loss_percentage DECIMAL(10, 2),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 2: Replace Helper Functions

```typescript
// Before (mock)
import { getAllTrades } from '@/lib/data/mock-data';
const trades = getAllTrades();

// After (Supabase)
import { supabase } from '@/lib/supabase/client';
const { data: trades } = await supabase
  .from('trades')
  .select('*')
  .order('date', { ascending: false });
```

### Step 3: Update CRUD Operations

Replace all `createMockTrade`, `updateMockTrade`, `deleteMockTrade` calls with Supabase mutations.

### Step 4: User Settings Table

```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  default_model TEXT DEFAULT 'signal-pro-v1',
  temperature DECIMAL(2, 1) DEFAULT 0.7,
  system_prompt TEXT,
  auto_suggest BOOLEAN DEFAULT true,
  context_window INTEGER DEFAULT 8000,
  notifications BOOLEAN DEFAULT true,
  -- ... all other settings
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🧪 Testing Checklist

### Trade Data
- [ ] All 12 trades display correctly
- [ ] Open vs closed trades filter properly
- [ ] P/L calculations are accurate
- [ ] Tags work for filtering
- [ ] Trade linking to journal works
- [ ] Calendar shows trade events

### Settings Panel
- [ ] All settings load with defaults
- [ ] Slider updates temperature value
- [ ] Model dropdown shows all options
- [ ] Save button enables when changed
- [ ] Reset button reverts to defaults
- [ ] Toast notifications show on save
- [ ] Settings persist across page loads (when backend connected)

### Integration
- [ ] Chat uses selected model from settings
- [ ] Trades page displays all mock trades
- [ ] Analytics calculates metrics from trades
- [ ] Calendar shows trade events
- [ ] Journal can link to trades

## 💡 Pro Tips

1. **Consistent Data**: Always import from `@/lib/data/mock-data` - never duplicate data
2. **Type Safety**: Use TypeScript types (`MockTrade`, `MockUserPreferences`)
3. **Helper Functions**: Use provided CRUD functions for consistency
4. **Future-Proof**: Data structure matches Supabase schema exactly
5. **AI Context**: Pass trade data to AI for personalized analysis

## 🎯 Next Steps

1. **Connect AI to Trades**: Use trade data in chat context
2. **Real-time Updates**: Add Supabase Realtime for live trade updates
3. **Trade Import**: Build CSV/API import functionality
4. **Advanced Filters**: Tag-based filtering, date ranges
5. **Performance Charts**: Visualize trade statistics over time

## 📝 Notes

- All data is currently in-memory (lost on refresh)
- Settings changes trigger unsaved state
- Trade operations are synchronous (instant feedback)
- Ready for backend integration without UI changes
- Trade data seamlessly flows to AI for analysis

---

**Last Updated**: November 4, 2025  
**Status**: ✅ Complete - UI Development Phase  
**Next**: Backend Integration with Supabase
