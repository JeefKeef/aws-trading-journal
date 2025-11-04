# Trading Calendar - Database Migration Guide

## Overview

This guide walks through replacing mock data with real Supabase queries and external API integrations.

## Prerequisites

- Supabase project set up
- Tables created: `trades`, `journal`
- Supabase client configured in `lib/supabase/`
- Environment variables set

## Step 1: Supabase Client Setup

### Create Supabase Client (if not exists)

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Environment Variables

Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# For earnings data
POLYGON_API_KEY=your_polygon_api_key_here
# OR
FINNHUB_API_KEY=your_finnhub_api_key_here
```

## Step 2: Database Schema

### Trades Table

```sql
CREATE TABLE trades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  ticker text NOT NULL,
  pl numeric NOT NULL,
  entry_price numeric NOT NULL,
  exit_price numeric NOT NULL,
  trade_date date NOT NULL,
  notes text,
  journal_id uuid REFERENCES journal_entries(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Add RLS policies
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trades"
  ON trades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades"
  ON trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades"
  ON trades FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trades"
  ON trades FOR DELETE
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX trades_user_id_idx ON trades(user_id);
CREATE INDEX trades_trade_date_idx ON trades(trade_date);
CREATE INDEX trades_ticker_idx ON trades(ticker);
```

### Journal Table

```sql
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  emotion_tags text[],
  summary text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Add RLS policies
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal entries"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX journal_entries_user_id_idx ON journal_entries(user_id);
CREATE INDEX journal_entries_created_at_idx ON journal_entries(created_at);
```

## Step 3: Create API Route for Earnings Data

Create `app/api/earnings/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('start');
  const endDate = searchParams.get('end');

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing start or end date' },
      { status: 400 }
    );
  }

  try {
    // Option 1: Polygon.io
    const apiKey = process.env.POLYGON_API_KEY;
    const response = await fetch(
      `https://api.polygon.io/v3/reference/earnings?date.gte=${startDate}&date.lte=${endDate}&apiKey=${apiKey}`
    );

    // Option 2: Finnhub
    // const apiKey = process.env.FINNHUB_API_KEY;
    // const response = await fetch(
    //   `https://finnhub.io/api/v1/calendar/earnings?from=${startDate}&to=${endDate}&token=${apiKey}`
    // );

    if (!response.ok) {
      throw new Error('Failed to fetch earnings data');
    }

    const data = await response.json();

    // Transform to our event format
    const earnings = data.results.map((item: any) => ({
      id: `e-${item.ticker}-${item.fiscal_quarter}`,
      type: 'earnings',
      date: new Date(item.earnings_date),
      company: item.company_name,
      ticker: item.ticker,
      epsForecast: item.eps_consensus,
      epsActual: item.eps_actual,
      time: item.time_of_day === 'bmo' ? 'Before Market Open' : 'After Market Close',
    }));

    return NextResponse.json({ earnings });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings data' },
      { status: 500 }
    );
  }
}
```

## Step 4: Update Calendar Component

### Replace Mock Data with Real Queries

Update `app/(shell)/calendar/calendar-content.tsx`:

```typescript
"use client";

import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
// ...existing imports...

export function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ...existing state...

  // Fetch events when month changes
  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  async function fetchEvents() {
    setIsLoading(true);
    setError(null);

    try {
      // Calculate date range for current month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      // Fetch trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('trades')
        .select('*')
        .gte('trade_date', startDate.toISOString().split('T')[0])
        .lte('trade_date', endDate.toISOString().split('T')[0])
        .order('trade_date', { ascending: true });

      if (tradesError) throw tradesError;

      // Fetch journal entries
      const { data: journalsData, error: journalsError } = await supabase
        .from('journal_entries')
        .select('id, title, emotion_tags, content, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: true });

      if (journalsError) throw journalsError;

      // Fetch earnings data from our API route
      const earningsResponse = await fetch(
        `/api/earnings?start=${startDate.toISOString().split('T')[0]}&end=${endDate.toISOString().split('T')[0]}`
      );
      const { earnings: earningsData } = await earningsResponse.json();

      // Transform to CalendarEvent format
      const tradeEvents: TradeEvent[] = (tradesData || []).map(trade => ({
        id: trade.id,
        type: 'trade',
        date: new Date(trade.trade_date),
        ticker: trade.ticker,
        pl: trade.pl,
        entry: trade.entry_price,
        exit: trade.exit_price,
        notes: trade.notes,
        journalId: trade.journal_id,
      }));

      const journalEvents: JournalEvent[] = (journalsData || []).map(journal => ({
        id: journal.id,
        type: 'journal',
        date: new Date(journal.created_at),
        title: journal.title,
        emotionTags: journal.emotion_tags || [],
        summary: journal.content?.substring(0, 200) || '',
      }));

      const earningsEvents: EarningsEvent[] = earningsData || [];

      // Combine all events
      setEvents([...tradeEvents, ...journalEvents, ...earningsEvents]);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }

  // Replace filteredEvents useMemo with:
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (event.type === "trade" && !eventFilters.trades) return false;
      if (event.type === "journal" && !eventFilters.journals) return false;
      if (event.type === "earnings" && !eventFilters.earnings) return false;
      return true;
    });
  }, [events, eventFilters]);

  // Add loading and error states to the render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ...rest of existing render code...
}
```

## Step 5: Update Add Event Function

Replace the mock `handleAddEvent` with real database insertion:

```typescript
const handleAddEvent = async () => {
  setIsLoading(true);

  try {
    if (newEvent.type === 'trade') {
      // Insert trade
      const { error } = await supabase
        .from('trades')
        .insert({
          ticker: newEvent.title,
          pl: 0, // User should fill this in
          entry_price: 0,
          exit_price: 0,
          trade_date: newEvent.date,
          notes: newEvent.description,
        });

      if (error) throw error;
    } else if (newEvent.type === 'journal') {
      // Insert journal entry
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          title: newEvent.title,
          content: newEvent.description,
          emotion_tags: [],
        });

      if (error) throw error;
    }

    toast.success('Event added', { description: `New ${newEvent.type} event created` });
    setIsAddEventDialogOpen(false);
    setNewEvent({
      title: '',
      type: 'trade',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });

    // Refresh events
    await fetchEvents();
  } catch (error) {
    console.error('Error adding event:', error);
    toast.error('Failed to add event', { description: 'Please try again' });
  } finally {
    setIsLoading(false);
  }
};
```

## Step 6: Add Empty States

Update the calendar grid to show empty states:

```typescript
// In the calendar render
{calendar.map((week, weekIndex) => (
  <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
    {week.map((date, dayIndex) => {
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const isToday = date.toDateString() === new Date().toDateString();
      const events = getEventsForDate(date);

      return (
        <div key={dayIndex} className={/* ...existing classes... */}>
          <div className={/* ...existing classes... */}>
            {date.getDate()}
          </div>

          {/* Events */}
          <div className="space-y-1">
            {events.length === 0 && isCurrentMonth ? (
              <div className="text-xs text-neutral-400 dark:text-neutral-600 italic">
                No events
              </div>
            ) : (
              <>
                {events.slice(0, 3).map((event) => (
                  <EventBadge
                    key={event.id}
                    event={event}
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsEventDialogOpen(true);
                    }}
                  />
                ))}
                {events.length > 3 && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-500 pl-1">
                    +{events.length - 3} more
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    })}
  </div>
))}
```

## Step 7: Testing

### Test with Mock Data First
1. Keep mock data initially
2. Verify UI works perfectly
3. Test all interactions

### Test with Real Data
1. Add a few real trades to database
2. Create some journal entries
3. Verify calendar loads them correctly
4. Test filtering
5. Test CSV export

### Test Edge Cases
1. Month with no events
2. Day with many events (10+)
3. Events at month boundaries
4. Leap year (February)
5. API failures (disconnect internet)

## Step 8: Performance Optimization

### Add Caching
```typescript
// Cache adjacent months for faster navigation
const [cachedMonths, setCachedMonths] = useState<Map<string, CalendarEvent[]>>(new Map());

async function fetchEvents() {
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  
  // Check cache first
  if (cachedMonths.has(monthKey)) {
    setEvents(cachedMonths.get(monthKey)!);
    return;
  }

  // Fetch and cache
  // ...existing fetch code...
  
  setCachedMonths(prev => new Map(prev).set(monthKey, allEvents));
}
```

### Add Prefetching
```typescript
// Prefetch next/previous months
useEffect(() => {
  prefetchAdjacentMonths();
}, [currentDate]);

async function prefetchAdjacentMonths() {
  const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
  
  // Prefetch in background
  fetchEventsForMonth(prevMonth);
  fetchEventsForMonth(nextMonth);
}
```

## Step 9: Error Handling

Add comprehensive error handling:

```typescript
try {
  // Database operations
} catch (error) {
  if (error.code === 'PGRST301') {
    // Row level security violation
    toast.error('Permission denied');
  } else if (error.message.includes('network')) {
    // Network error
    toast.error('Network error', { description: 'Check your connection' });
  } else {
    // Generic error
    toast.error('Something went wrong', { description: error.message });
  }
}
```

## Step 10: Migration Checklist

### Pre-Migration
- [ ] Database schema created
- [ ] RLS policies configured
- [ ] Supabase client set up
- [ ] Environment variables set
- [ ] API routes created

### During Migration
- [ ] Replace mock data with real queries
- [ ] Test each event type separately
- [ ] Verify user filtering works
- [ ] Test error states
- [ ] Test loading states

### Post-Migration
- [ ] Load test with 100+ events
- [ ] Test on different devices
- [ ] Monitor API performance
- [ ] Check error logs
- [ ] Get user feedback

## Rollback Plan

If issues occur, revert to mock data:

1. Comment out Supabase queries
2. Uncomment mock data array
3. Remove `useEffect` for fetching
4. Keep UI as-is

Mock data serves as a permanent fallback for development.

## Support

If you encounter issues:
1. Check Supabase logs in dashboard
2. Verify RLS policies are correct
3. Test queries in Supabase SQL editor
4. Check browser console for errors
5. Review environment variables

---

**Status**: Ready for migration  
**Estimated Time**: 2-4 hours  
**Risk Level**: Low (fallback to mock data available)
