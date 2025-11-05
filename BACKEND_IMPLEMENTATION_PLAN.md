# Backend Implementation Plan - Signal Trading Terminal

**Date:** November 5, 2025  
**Status:** UI 80% Complete - Ready for Backend Integration  
**Priority:** Implement Supabase Auth → Database Schema → API Security → Data Migration

---

## 📊 Current Architecture Overview

### Route Structure
```
app/
├── (marketing)/          # Public routes - NO AUTH REQUIRED
│   ├── page.tsx         # Landing page
│   ├── pricing/         # Pricing tiers
│   ├── features/        # Feature showcase
│   ├── docs/            # Documentation
│   ├── privacy/         # Privacy policy
│   └── terms/           # Terms of service
│
├── (auth)/              # Authentication routes - PUBLIC
│   ├── login/           # Email/password + OAuth
│   ├── signup/          # User registration
│   └── onboarding/      # Post-signup flow
│
└── (shell)/             # Main app - REQUIRES AUTH
    ├── dashboard/       # Performance overview
    ├── chat/            # AI assistant (conversational)
    ├── trades/          # Trade log/management
    ├── journal/         # Rich text notes + file system
    ├── analytics/       # Charts & performance metrics
    ├── calendar/        # Trade/earnings calendar
    ├── settings/        # User preferences
    └── (market)/        # Market data views
        ├── screener/    # Stock screener
        ├── charts/      # Technical charts
        ├── forex/       # Forex pairs
        ├── crypto/      # Crypto markets
        └── futures/     # Futures contracts
```

---

## 🔐 Authentication Requirements

### Supabase Auth Setup

**Required Providers:**
- ✅ **Email/Password** (primary)
- ✅ **Google OAuth** (recommended)
- ✅ **GitHub OAuth** (developer-friendly)
- 🔄 Magic Links (optional, future)

**User Schema:**
```typescript
// auth.users (Supabase managed)
{
  id: UUID (primary key)
  email: string
  created_at: timestamp
  updated_at: timestamp
}

// public.user_profiles (custom table)
{
  id: UUID (references auth.users.id)
  full_name: string?
  avatar_url: string?
  subscription_tier: 'free' | 'core' | 'pro' | 'ultra'
  stripe_customer_id: string?
  onboarding_completed: boolean
  preferences: jsonb
  created_at: timestamp
  updated_at: timestamp
}
```

**RLS Policies:**
```sql
-- user_profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

**Protected Routes:**
- All routes under `(shell)/*` require `auth.uid()` verification
- Middleware: Check Supabase session on every request
- Redirect unauthenticated users to `/login`

**Session Management:**
- Use `@supabase/ssr` for server-side session handling
- Client-side: `createBrowserClient()` for client components
- Server-side: `createServerClient()` for server components/API routes

---

## 🗄️ Database Schema (Supabase PostgreSQL)

### Core Tables

#### 1. **conversations** (Chat History)
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  model TEXT NOT NULL, -- e.g., 'signal-pro-v1'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- RLS
  CONSTRAINT title_not_empty CHECK (char_length(title) > 0)
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
```

**Mock Data Location:** `lib/data/mock-data.ts` → `mockConversations[]`

**API Endpoints Needed:**
- `GET /api/conversations` - List user's conversations
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/:id` - Delete conversation
- `PATCH /api/conversations/:id` - Update title/model

**RLS Policies:**
```sql
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
  ON conversations FOR DELETE
  USING (auth.uid() = user_id);
```

---

#### 2. **messages** (Chat Messages)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  status TEXT DEFAULT 'complete' CHECK (status IN ('pending', 'complete', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT content_not_empty CHECK (char_length(content) > 0)
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

**Mock Data Location:** `lib/data/mock-data.ts` → `mockMessages{}`

**API Endpoints Needed:**
- `GET /api/conversations/:id/messages` - Get messages for conversation
- `POST /api/conversations/:id/messages` - Add message (user or assistant)

**RLS Policies:**
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );
```

---

#### 3. **trades** (Trade Log)
```sql
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('LONG', 'SHORT')),
  entry_price DECIMAL(10, 2) NOT NULL,
  exit_price DECIMAL(10, 2),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
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

CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_ticker ON trades(ticker);
CREATE INDEX idx_trades_date ON trades(date DESC);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_tags ON trades USING GIN(tags);
```

**Mock Data Location:** `lib/data/mock-data.ts` → `mockTrades[]`

**Used By Pages:**
- `/dashboard` - Performance metrics
- `/trades` - Trade log table
- `/analytics` - Charts and stats
- `/calendar` - Trade events on calendar

**API Endpoints Needed:**
- `GET /api/trades` - List trades (with filters: status, date range, ticker)
- `POST /api/trades` - Create trade
- `PATCH /api/trades/:id` - Update trade (edit cells, close position)
- `DELETE /api/trades/:id` - Delete trade
- `GET /api/trades/stats` - Get aggregated stats for dashboard/analytics

**RLS Policies:**
```sql
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trades"
  ON trades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trades"
  ON trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades"
  ON trades FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades"
  ON trades FOR DELETE
  USING (auth.uid() = user_id);
```

---

#### 4. **journal_folders** (Journal File Tree)
```sql
-- ALREADY EXISTS in supabase-journal-schema.sql
-- See full schema in that file
```

**Mock Data Location:** `components/journal/file-tree.tsx` → `initialTree` state

**Used By Pages:**
- `/journal` - Hierarchical file system for notes

**API Endpoints Needed:**
- `GET /api/journal/folders` - Get folder tree
- `POST /api/journal/folders` - Create folder
- `PATCH /api/journal/folders/:id` - Rename/move folder
- `DELETE /api/journal/folders/:id` - Delete folder (cascade notes)

**Client Functions:** Already implemented in `lib/supabase/journal-client.ts`
- `getFolders()`
- `createFolder()`
- `updateFolder()`
- `deleteFolder()`

---

#### 5. **journal_notes** (Rich Text Notes)
```sql
-- ALREADY EXISTS in supabase-journal-schema.sql
-- Includes full-text search index and trade linking
```

**Mock Data Location:** `components/journal/note-editor-enhanced.tsx` → `mockNotes{}`

**Used By Pages:**
- `/journal` - Note editor with rich text (TipTap)
- `/trades` - Link trades to journal entries
- `/calendar` - Show journal entries on calendar

**API Endpoints Needed:**
- `GET /api/journal/notes` - List notes (with folder filter, search)
- `GET /api/journal/notes/:id` - Get single note
- `POST /api/journal/notes` - Create note
- `PATCH /api/journal/notes/:id` - Update note content/metadata
- `DELETE /api/journal/notes/:id` - Delete note
- `POST /api/journal/notes/:id/link-trade` - Link trade to note
- `GET /api/journal/search` - Full-text search across notes

**Client Functions:** Already implemented in `lib/supabase/journal-client.ts`
- `getNotes()`
- `getNoteById()`
- `createNote()`
- `updateNote()`
- `deleteNote()`
- `linkTradeToNote()`
- `searchNotes()`

---

#### 6. **user_preferences** (Settings)
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Display
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  display_currency TEXT DEFAULT 'USD' CHECK (display_currency IN ('USD', 'EUR', 'GBP')),
  
  -- AI Assistant
  default_model TEXT DEFAULT 'signal-pro-v1',
  temperature DECIMAL(2, 1) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 1),
  system_prompt TEXT,
  auto_suggest BOOLEAN DEFAULT TRUE,
  context_window INTEGER DEFAULT 8000,
  
  -- Notifications
  notifications BOOLEAN DEFAULT TRUE,
  trading_alerts BOOLEAN DEFAULT TRUE,
  price_alerts BOOLEAN DEFAULT TRUE,
  news_alerts BOOLEAN DEFAULT FALSE,
  
  -- Workflow
  auto_save BOOLEAN DEFAULT TRUE,
  auto_link_trades BOOLEAN DEFAULT FALSE,
  enable_keyboard_shortcuts BOOLEAN DEFAULT TRUE,
  
  -- Risk Management
  max_position_size DECIMAL(10, 2) DEFAULT 10000,
  default_stop_loss DECIMAL(5, 2) DEFAULT 2.0,
  risk_per_trade DECIMAL(5, 2) DEFAULT 1.0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

**Mock Data Location:** `lib/data/mock-data.ts` → `mockUserPreferences`

**Used By Pages:**
- `/settings` - Settings UI
- `/chat` - AI model selection, temperature
- All pages - Theme, currency display

**API Endpoints Needed:**
- `GET /api/preferences` - Get user preferences (or use defaults)
- `PATCH /api/preferences` - Update preferences (bulk update)

**RLS Policies:**
```sql
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

#### 7. **notifications** (Notification History)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trade_alert', 'price_alert', 'news_alert', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB, -- { trade_id, ticker, price, etc. }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT title_not_empty CHECK (char_length(title) > 0)
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

**Mock Data Location:** `components/layout/top-nav.tsx` → `notifications` state

**Used By Pages:**
- `TopNav` component - Notification dropdown

**API Endpoints Needed:**
- `GET /api/notifications` - List user notifications (unread count, recent)
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/read-all` - Mark all as read

**Real-time:** Use Supabase Realtime subscriptions for live notifications

**RLS Policies:**
```sql
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
```

---

#### 8. **calendar_events** (Calendar Integration)
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trade', 'journal', 'earnings', 'custom')),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  description TEXT,
  
  -- Foreign keys (nullable for different event types)
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  journal_note_id UUID REFERENCES journal_notes(id) ON DELETE CASCADE,
  
  -- Earnings-specific fields
  ticker TEXT,
  eps_forecast DECIMAL(10, 2),
  eps_actual DECIMAL(10, 2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT title_not_empty CHECK (char_length(title) > 0)
);

CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_date ON calendar_events(date);
CREATE INDEX idx_calendar_events_type ON calendar_events(type);
CREATE INDEX idx_calendar_events_trade_id ON calendar_events(trade_id);
```

**Mock Data Location:** `app/(shell)/calendar/calendar-content.tsx` → `mockEvents[]`

**Used By Pages:**
- `/calendar` - Calendar view with events

**API Endpoints Needed:**
- `GET /api/calendar/events?start=2025-11-01&end=2025-11-30` - Get events for date range
- `POST /api/calendar/events` - Create custom event
- `DELETE /api/calendar/events/:id` - Delete event
- `GET /api/calendar/earnings?date=2025-11-05` - Fetch earnings data (external API proxy)

**External Integration:**
- Earnings data from Financial Modeling Prep or similar API
- Cache earnings data to avoid rate limits

**RLS Policies:**
```sql
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calendar events"
  ON calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calendar events"
  ON calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar events"
  ON calendar_events FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 🔒 API Security Architecture

### Middleware Pattern (Next.js 16)

**File:** `middleware.ts` (root level)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // Protect all (shell) routes
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/chat') ||
      request.nextUrl.pathname.startsWith('/trades') ||
      request.nextUrl.pathname.startsWith('/journal') ||
      request.nextUrl.pathname.startsWith('/analytics') ||
      request.nextUrl.pathname.startsWith('/calendar') ||
      request.nextUrl.pathname.startsWith('/settings')) {
    
    if (!user) {
      // Redirect to login with return URL
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (user && (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

### API Route Security Pattern

**Every API route must:**
1. Verify user authentication via Supabase
2. Validate request body with Zod schemas
3. Use RLS policies (never bypass with service role in user-facing APIs)
4. Sanitize errors (no sensitive data in responses)
5. Rate limit (implement with Upstash or similar)

**Example:** `/api/trades/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const createTradeSchema = z.object({
  ticker: z.string().min(1).max(10),
  type: z.enum(['LONG', 'SHORT']),
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive().optional(),
  quantity: z.number().int().positive(),
  setup: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Query with RLS (user_id is implicit via RLS policies)
    let query = supabase
      .from('trades')
      .select('*')
      .order('date', { ascending: false })

    if (status) query = query.eq('status', status)
    if (startDate) query = query.gte('date', startDate)
    if (endDate) query = query.lte('date', endDate)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ trades: data })
  } catch (error) {
    console.error('GET /api/trades error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const validatedData = createTradeSchema.parse(body)

    // Calculate P&L if exit price provided
    let profitLoss = null
    let profitLossPercentage = null
    let status = 'open'

    if (validatedData.exitPrice) {
      status = 'closed'
      const diff = validatedData.type === 'LONG'
        ? validatedData.exitPrice - validatedData.entryPrice
        : validatedData.entryPrice - validatedData.exitPrice
      
      profitLoss = diff * validatedData.quantity
      profitLossPercentage = (diff / validatedData.entryPrice) * 100
    }

    // Insert with RLS (user_id is automatically set via auth.uid())
    const { data, error } = await supabase
      .from('trades')
      .insert({
        ...validatedData,
        profit_loss: profitLoss,
        profit_loss_percentage: profitLossPercentage,
        status,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ trade: data }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('POST /api/trades error:', error)
    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 }
    )
  }
}
```

---

### Chat API Security (`/api/chat/route.ts`)

**Current Issues:**
- ✅ API key is server-side only (good)
- ❌ No authentication check (anyone can use if they know the endpoint)
- ❌ No rate limiting (potential abuse)
- ❌ No user context (can't personalize responses)
- ❌ No conversation persistence

**Secure Implementation:**

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const chatRequestSchema = z.object({
  model: z.string(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  conversationId: z.string().uuid().optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // 1. Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // 2. Check user's subscription tier (for model access)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    // 3. Validate request
    const body = await request.json()
    const { model, messages, conversationId } = chatRequestSchema.parse(body)

    // 4. Check if user has access to this model
    const modelTierMap: Record<string, string[]> = {
      'signal-mini-v1': ['free', 'core', 'pro', 'ultra'],
      'signal-core-v1': ['core', 'pro', 'ultra'],
      'signal-pro-v1': ['pro', 'ultra'],
      'signal-ultra-v1': ['ultra'],
    }

    const allowedTiers = modelTierMap[model] || []
    if (!allowedTiers.includes(profile?.subscription_tier || 'free')) {
      return NextResponse.json(
        { error: 'Upgrade required for this model' },
        { status: 403 }
      )
    }

    // 5. Rate limit check (implement with Upstash or similar)
    // TODO: Check if user exceeded their daily message quota

    // 6. Get or create conversation
    let conversation
    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()
      conversation = data
    } else {
      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          title: messages[0]?.content.slice(0, 50) || 'New conversation',
          model,
        })
        .select()
        .single()
      
      if (error) throw error
      conversation = data
    }

    // 7. Store user message
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: messages[messages.length - 1].content,
      })

    // 8. Call OpenAI API
    const apiKey = process.env.OPENAI_API_KEY!
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      throw new Error('OpenAI API error')
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message

    // 9. Store assistant message
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: assistantMessage.content,
      })

    // 10. Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation.id)

    return NextResponse.json({
      message: assistantMessage,
      conversationId: conversation.id,
    })

  } catch (error) {
    console.error('POST /api/chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
```

---

## 📡 API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/user` - Get current user
- `GET /api/auth/session` - Check session validity

### Conversations & Messages
- `GET /api/conversations` - List user's conversations
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/:id` - Delete conversation
- `PATCH /api/conversations/:id` - Update title/model
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/chat` - Send message (creates conversation if needed)

### Trades
- `GET /api/trades` - List trades (filters: status, date range, ticker)
- `POST /api/trades` - Create trade
- `GET /api/trades/:id` - Get single trade
- `PATCH /api/trades/:id` - Update trade
- `DELETE /api/trades/:id` - Delete trade
- `GET /api/trades/stats` - Aggregated stats (dashboard/analytics)

### Journal
- `GET /api/journal/folders` - Get folder tree
- `POST /api/journal/folders` - Create folder
- `PATCH /api/journal/folders/:id` - Rename/move folder
- `DELETE /api/journal/folders/:id` - Delete folder
- `GET /api/journal/notes` - List notes (with filters)
- `GET /api/journal/notes/:id` - Get single note
- `POST /api/journal/notes` - Create note
- `PATCH /api/journal/notes/:id` - Update note
- `DELETE /api/journal/notes/:id` - Delete note
- `POST /api/journal/notes/:id/link-trade` - Link trade
- `GET /api/journal/search?q=query` - Full-text search
- `POST /api/journal/upload` - Upload image (Supabase Storage)

### User Preferences
- `GET /api/preferences` - Get preferences
- `PATCH /api/preferences` - Update preferences

### Notifications
- `GET /api/notifications` - List notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/read-all` - Mark all as read

### Calendar
- `GET /api/calendar/events?start=YYYY-MM-DD&end=YYYY-MM-DD` - Get events
- `POST /api/calendar/events` - Create custom event
- `DELETE /api/calendar/events/:id` - Delete event
- `GET /api/calendar/earnings?date=YYYY-MM-DD` - Fetch earnings data (external API)

### Market Data (Future - External API Proxies)
- `GET /api/market/screener` - Stock screener results
- `GET /api/market/quote/:ticker` - Real-time quote
- `GET /api/market/chart/:ticker` - Historical chart data
- `GET /api/market/news` - Market news feed

---

## 🔐 Environment Variables (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # NEVER expose to client

# OpenAI / AI Provider
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1 # Optional, for proxies like OpenRouter

# Stripe (Future)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# External APIs (Future)
FINANCIAL_MODELING_PREP_API_KEY=xxx # For earnings data
POLYGON_API_KEY=xxx # For market data
ALPHA_VANTAGE_API_KEY=xxx # Backup market data

# Rate Limiting (Optional)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Monitoring (Production)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
VERCEL_URL=signal-ai.vercel.app
```

---

## 🚀 Implementation Roadmap

### Phase 1: Authentication (Week 1)
**Priority:** Critical - Blocks all other work

**Tasks:**
1. ✅ Set up Supabase project
2. ✅ Configure auth providers (Email, Google, GitHub)
3. ✅ Create `user_profiles` table with RLS
4. ✅ Implement middleware for route protection
5. ✅ Build login/signup UI (already exists in `/login` and `/signup`)
6. ✅ Implement auth context/hooks
7. ✅ Add "Sign Out" to TopNav dropdown
8. ✅ Test auth flow end-to-end

**Files to Update:**
- Create `middleware.ts`
- Create `lib/supabase/server.ts` (server client factory)
- Create `lib/supabase/client.ts` (browser client factory)
- Create `lib/contexts/auth-context.tsx`
- Update `app/(auth)/login/page.tsx` (wire up Supabase)
- Update `app/(auth)/signup/page.tsx` (wire up Supabase)
- Update `components/layout/top-nav.tsx` (add auth state, sign out)

---

### Phase 2: Database Schema (Week 2)
**Priority:** Critical - Foundation for all features

**Tasks:**
1. ✅ Run `supabase-journal-schema.sql` (already exists for journal)
2. ✅ Create `conversations` table
3. ✅ Create `messages` table
4. ✅ Create `trades` table
5. ✅ Create `user_preferences` table
6. ✅ Create `notifications` table
7. ✅ Create `calendar_events` table
8. ✅ Set up RLS policies for all tables
9. ✅ Create indexes for performance
10. ✅ Test queries with sample data

**SQL Files to Create:**
- `supabase-schema-conversations.sql`
- `supabase-schema-trades.sql`
- `supabase-schema-preferences.sql`
- `supabase-schema-notifications.sql`
- `supabase-schema-calendar.sql`

---

### Phase 3: Core API Routes (Week 3-4)
**Priority:** High - Enable data persistence

**Implementation Order:**
1. **Trades API** (simplest, high impact)
   - `GET /api/trades`
   - `POST /api/trades`
   - `PATCH /api/trades/:id`
   - `DELETE /api/trades/:id`
   - `GET /api/trades/stats`

2. **Chat API** (already exists, needs auth)
   - Update `POST /api/chat` with auth + persistence

3. **Conversations API**
   - `GET /api/conversations`
   - `POST /api/conversations`
   - `DELETE /api/conversations/:id`
   - `GET /api/conversations/:id/messages`

4. **Preferences API**
   - `GET /api/preferences`
   - `PATCH /api/preferences`

5. **Journal API** (client functions already exist)
   - Create API routes if not using client SDK directly
   - Test with existing `lib/supabase/journal-client.ts`

6. **Notifications API**
   - `GET /api/notifications`
   - `PATCH /api/notifications/:id/read`
   - `DELETE /api/notifications/:id`

7. **Calendar API**
   - `GET /api/calendar/events`
   - `POST /api/calendar/events`
   - `GET /api/calendar/earnings` (external API proxy)

---

### Phase 4: Frontend Data Integration (Week 5-6)
**Priority:** High - Replace mock data with real APIs

**Pages to Update (in order of priority):**

1. **Dashboard** (`/dashboard/page.tsx`)
   - Replace `getTradesByStatus()` mock calls with API fetch
   - Add loading states
   - Add error handling

2. **Trades** (`/trades/trades-content.tsx`)
   - Replace `initialTrades` mock with API fetch
   - Wire up CRUD operations to API
   - Add optimistic updates

3. **Chat** (`/chat/page.tsx`)
   - Update to use authenticated chat API
   - Wire up conversation switching
   - Add conversation persistence

4. **Settings** (`/settings/page.tsx`)
   - Fetch preferences from API
   - Save to API instead of mock
   - Add success/error toasts

5. **Journal** (`/journal/page.tsx`)
   - Already has Supabase client integration
   - Test and verify functionality
   - Add error handling

6. **Analytics** (`/analytics/analytics-content.tsx`)
   - Replace `mockTrades` with API fetch
   - Add date range filtering via API

7. **Calendar** (`/calendar/calendar-content.tsx`)
   - Replace `mockEvents` with API fetch
   - Integrate earnings data from external API
   - Add caching for performance

8. **TopNav Notifications** (`components/layout/top-nav.tsx`)
   - Replace mock `notifications` state with API
   - Add Supabase Realtime subscription for live updates

---

### Phase 5: Real-time Features (Week 7)
**Priority:** Medium - Enhanced UX

**Tasks:**
1. ✅ Set up Supabase Realtime subscriptions
2. ✅ Live notifications in TopNav
3. ✅ Live trade updates (if using multi-device)
4. ✅ Live chat message sync (if conversation open on multiple devices)

**Example:** Realtime Notifications

```typescript
// In TopNav component
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${user.id}`,
    }, (payload) => {
      setNotifications((prev) => [payload.new, ...prev])
      toast.info(payload.new.title)
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user.id])
```

---

### Phase 6: External Integrations (Week 8+)
**Priority:** Low - Nice to have

**Tasks:**
1. ✅ Integrate earnings calendar API (Financial Modeling Prep)
2. ✅ Add market data API (Polygon.io or Alpha Vantage)
3. ✅ Implement caching layer (Upstash Redis)
4. ✅ Add rate limiting (Upstash or similar)
5. ✅ Stripe integration for subscriptions (Future)

---

## 🔍 Data Migration Strategy

### Mock Data → Supabase Migration

**Current Mock Data Locations:**
- `lib/data/mock-data.ts` - Centralized mock store
- `components/journal/file-tree.tsx` - Journal tree state
- `components/journal/note-editor-enhanced.tsx` - Note content
- `app/(shell)/trades/trades-content.tsx` - Trades table
- `app/(shell)/analytics/analytics-content.tsx` - Analytics data
- `app/(shell)/calendar/calendar-content.tsx` - Calendar events
- `components/layout/top-nav.tsx` - Notifications

**Migration Steps:**

1. **Keep mock data initially** - Don't delete `mock-data.ts` yet
2. **Create API routes** - Build all API endpoints
3. **Add feature flags** - Allow toggling between mock and real data
4. **Update components one by one** - Replace mock calls with API calls
5. **Add loading/error states** - Show spinners, handle errors gracefully
6. **Test thoroughly** - Verify CRUD operations work correctly
7. **Remove mock data** - Delete `mock-data.ts` after all pages migrated

**Example Feature Flag:**

```typescript
// lib/config.ts
export const config = {
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
}

// In component
const { data, error, isLoading } = config.useMockData
  ? { data: mockTrades, error: null, isLoading: false }
  : useQuery(['trades'], fetchTrades)
```

---

## 🛡️ Security Checklist

### ✅ Authentication
- [ ] Supabase Auth configured with email/password
- [ ] Google OAuth enabled
- [ ] GitHub OAuth enabled
- [ ] Middleware protecting all (shell) routes
- [ ] Session refresh handling
- [ ] Proper logout flow

### ✅ Database Security (RLS)
- [ ] All tables have RLS enabled
- [ ] SELECT policies check `auth.uid() = user_id`
- [ ] INSERT policies enforce `auth.uid() = user_id`
- [ ] UPDATE policies check ownership
- [ ] DELETE policies check ownership
- [ ] Test RLS policies with different users

### ✅ API Security
- [ ] All API routes verify `auth.getUser()`
- [ ] Request body validation with Zod
- [ ] No service role key in client code
- [ ] Error messages don't leak sensitive data
- [ ] Rate limiting implemented (Upstash)
- [ ] CORS properly configured

### ✅ Environment Variables
- [ ] `.env.local` in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Vercel environment variables configured
- [ ] Separate dev/prod Supabase projects

### ✅ Data Privacy
- [ ] Users can only see their own data
- [ ] No cross-user data leakage
- [ ] Deleted data cascades properly
- [ ] Soft delete option for trades/notes

### ✅ Frontend Security
- [ ] No API keys in client code
- [ ] XSS protection (React escapes by default)
- [ ] CSRF protection (Supabase handles this)
- [ ] Secure cookie settings

---

## 📊 Performance Optimization

### Database Indexing
✅ Already implemented in schema files:
- `user_id` indexes on all user-scoped tables
- Composite indexes for common queries
- GIN indexes for array columns (tags)
- Full-text search indexes on notes

### Caching Strategy
- **React Query** - Client-side cache for API responses
- **Supabase Cache** - Built-in edge caching
- **Upstash Redis** - Server-side cache for expensive queries
- **Static Generation** - Marketing pages pre-rendered

### Code Splitting
- **Route-based** - Next.js automatic code splitting
- **Component-level** - Lazy load heavy components (TipTap, Recharts)
- **Dynamic imports** - `next/dynamic` for modals, dialogs

---

## 🧪 Testing Strategy

### Unit Tests
- API route handlers (request/response)
- Utility functions (date formatting, calculations)
- RLS policy validation

### Integration Tests
- Auth flow (signup → login → logout)
- CRUD operations (create trade → read → update → delete)
- API endpoint security (unauthenticated requests rejected)

### E2E Tests (Playwright)
- User journey: Signup → Create trade → View dashboard → Log out
- Chat: Send message → See response → Switch conversation
- Journal: Create folder → Create note → Link trade

---

## 📝 Documentation Needs

### Developer Docs
- [ ] API reference (OpenAPI/Swagger)
- [ ] Database schema diagram (ERD)
- [ ] Authentication flow diagram
- [ ] Local development setup guide
- [ ] Deployment guide (Vercel)

### User Docs
- [ ] Getting started guide
- [ ] Feature tutorials (how to use journal, analytics, etc.)
- [ ] Keyboard shortcuts reference
- [ ] FAQ

---

## 🚨 Critical Next Steps

1. **THIS WEEK:**
   - Set up Supabase project
   - Configure auth providers
   - Implement middleware
   - Create user_profiles table
   - Test auth flow

2. **NEXT WEEK:**
   - Run all SQL schema files
   - Create API routes for trades
   - Update dashboard to use trades API
   - Test RLS policies

3. **WEEK 3:**
   - Implement chat API with auth
   - Create conversations/messages tables
   - Update chat page to persist history

4. **WEEK 4:**
   - Implement remaining API routes
   - Update all pages to use real data
   - Remove mock data dependencies

---

## 🎯 Success Metrics

### Technical
- ✅ 100% of routes protected by auth
- ✅ All API endpoints have auth + validation
- ✅ RLS policies tested and working
- ✅ Zero hardcoded secrets in repo
- ✅ API response times < 500ms (p95)
- ✅ No data leakage between users

### User Experience
- ✅ Seamless login/signup flow
- ✅ Data persists across sessions
- ✅ Real-time notifications working
- ✅ No data loss (all CRUD ops work)
- ✅ Fast page loads (< 2s initial load)

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js 16 Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Zod Validation](https://zod.dev)
- [React Query](https://tanstack.com/query/latest)

---

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Next Review:** After Phase 1 completion
