# Trading Calendar Implementation Guide

## Overview

The Trading Calendar is an interactive full-page calendar view that displays trade events, journal entries, and market events in a unified timeline. Users can view, filter, and interact with all their trading-related events in daily, weekly, and monthly views.

## Features Implemented

### ✅ Calendar Views
- **Month View**: Full calendar grid showing all days of the month
- **Week View**: Coming soon (extensible architecture in place)
- **Day View**: Coming soon (extensible architecture in place)

### ✅ Event Types
The calendar supports three types of events, each with distinct visual styling:

1. **🟩 Trade Events** (Green)
   - Displays: Ticker, P/L
   - Details: Entry/Exit prices, notes, link to related journal
   - Source: `trades` table

2. **🟦 Journal Entries** (Blue)
   - Displays: Title
   - Details: Emotion tags, summary, link to full journal page
   - Source: `journal` table

3. **🟧 Earnings/Market Events** (Orange)
   - Displays: Company ticker
   - Details: Company name, EPS forecast/actual, time
   - Source: Mock data (ready for external API integration)

### ✅ Navigation Controls
- **Arrow Buttons**: Navigate previous/next month
- **Today Button**: Jump to current date
- **Date Range Selector**: Quick jump to any month/year
- **View Switcher**: Toggle between Month/Week/Day views

### ✅ Interactive Features
- **Event Click**: Opens detailed modal with full event information
- **Event Hover**: Visual feedback on hover
- **Multiple Events per Day**: Shows up to 3 events, with "+X more" indicator
- **Current Day Highlight**: Blue circle on today's date
- **Current Month Context**: Dimmed styling for previous/next month days

### ✅ Event Management
- **Add Event Button**: Opens dialog to create custom events
- **Event Form Fields**:
  - Event Type (Trade/Journal/Market Event)
  - Title
  - Date picker
  - Description (textarea)

### ✅ Filtering & Export
- **Filter Dropdown**: Show/hide event types
  - Toggle Trades
  - Toggle Journal Entries
  - Toggle Earnings/Market Events
- **Export to CSV**: Download all visible events as CSV file
  - Includes: Date, Type, Details, Value
  - Filename: `trading-calendar-YYYY-MM-DD.csv`

## File Structure

```
app/(shell)/calendar/
├── page.tsx                    # Route entry point
└── calendar-content.tsx        # Main calendar component with all logic
```

## Component Architecture

### Main Components

#### `CalendarContent`
- Main calendar container and state management
- Handles view switching, date navigation, filtering
- Manages event dialogs and CSV export

#### `EventBadge`
- Renders individual event badges in calendar cells
- Color-coded by event type
- Truncates text with hover tooltip

#### `EventDetails`
- Modal content showing full event details
- Conditional rendering based on event type
- Links to related pages (journal, trades)

## Data Structure

### Event Types

```typescript
type TradeEvent = {
  id: string;
  type: "trade";
  date: Date;
  ticker: string;
  pl: number;
  entry: number;
  exit: number;
  notes?: string;
  journalId?: string;  // Link to related journal entry
};

type JournalEvent = {
  id: string;
  type: "journal";
  date: Date;
  title: string;
  emotionTags: string[];
  summary: string;
};

type EarningsEvent = {
  id: string;
  type: "earnings";
  date: Date;
  company: string;
  ticker: string;
  epsForecast: number;
  epsActual?: number;
  time: string;
};

type CalendarEvent = TradeEvent | JournalEvent | EarningsEvent;
```

## Mock Data

Currently uses hardcoded mock data for demonstration:
- 5 trade events across November 2025
- 3 journal entries with emotion tags
- 2 earnings events (one with actual results, one upcoming)

**Next Steps**: Replace with Supabase queries to `trades` and `journal` tables.

## Styling & Design

### Color Scheme
- **Trades**: Green (`bg-green-100`, `text-green-700`)
- **Journals**: Blue (`bg-blue-100`, `text-blue-700`)
- **Earnings**: Orange (`bg-orange-100`, `text-orange-700`)
- **Today**: Blue circle background (`bg-blue-600`)

### Layout
- Full page width/height
- Fixed header with controls
- Scrollable calendar grid
- 7-column grid (Sunday-Saturday)
- Min height per cell: 120px
- Border-separated cells

### Dark Mode
- Automatic theme-aware colors using Tailwind dark variants
- Neutral palette for backgrounds
- Maintained contrast for accessibility

## Integration Points

### Supabase Integration (To Do)

Replace mock data with database queries:

```typescript
// Fetch trades
const { data: trades } = await supabase
  .from('trades')
  .select('*')
  .gte('date', startDate)
  .lte('date', endDate);

// Fetch journal entries
const { data: journals } = await supabase
  .from('journal')
  .select('*')
  .gte('created_at', startDate)
  .lte('created_at', endDate);
```

### External Market Data API

For earnings events, integrate with financial API:
- [Polygon.io](https://polygon.io) - Real-time market data
- [Alpha Vantage](https://www.alphavantage.co) - Earnings calendar
- [Finnhub](https://finnhub.io) - Company earnings

Example integration:
```typescript
const response = await fetch(
  `https://api.polygon.io/v3/reference/earnings?ticker=AAPL&date.gte=${startDate}`
);
const { results } = await response.json();
```

## Usage Examples

### Basic Usage
```tsx
import { CalendarContent } from './calendar-content';

export default function CalendarPage() {
  return <CalendarContent />;
}
```

### Filtering Events
Users can toggle event types via the Filter dropdown:
- Uncheck "Trades" to hide all trade events
- Uncheck "Journals" to hide journal entries
- Uncheck "Earnings" to hide market events

### Exporting Data
Click "Export CSV" button to download:
- All visible events (respects active filters)
- Formatted with headers: Date, Type, Details, Value
- Automatic filename with current date

### Adding Custom Events
1. Click "Add Event" button
2. Select event type from dropdown
3. Fill in title, date, and description
4. Click "Create Event"
5. Toast confirmation appears

## Keyboard Shortcuts (Future Enhancement)

Potential shortcuts to implement:
- `←` / `→` - Navigate months
- `T` - Jump to today
- `N` - New event
- `F` - Open filter
- `E` - Export CSV
- `Esc` - Close dialogs

## Responsive Design

Current implementation:
- Optimized for desktop (1024px+)
- Full calendar grid visible
- Sidebar hover functionality

Future mobile enhancements:
- Vertical list view for mobile
- Swipe gestures for month navigation
- Bottom sheet for event details
- Collapsed header controls

## Performance Considerations

### Optimizations Implemented
- `useMemo` for calendar grid calculation
- `useMemo` for filtered events
- Conditional rendering (max 3 events per cell)
- Lazy dialog content loading

### Future Optimizations
- Virtual scrolling for large date ranges
- Pagination for events (load on-demand)
- Debounced filter changes
- Web Worker for CSV generation

## Accessibility

### Current Features
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation in dialogs
- Sufficient color contrast ratios

### Future Enhancements
- Full keyboard navigation in calendar grid
- Screen reader announcements for date changes
- Focus management in modals
- High contrast mode support

## Testing Checklist

### Manual Testing
- [ ] Navigate between months
- [ ] Jump to today
- [ ] Click on different event types
- [ ] View event details in modal
- [ ] Add new event via dialog
- [ ] Toggle event filters
- [ ] Export calendar to CSV
- [ ] Test in dark mode
- [ ] Test with no events
- [ ] Test with many events per day

### Edge Cases
- [ ] Months with 28, 29, 30, 31 days
- [ ] Leap years
- [ ] Events at month boundaries
- [ ] Same event multiple times per day
- [ ] Long event titles (truncation)
- [ ] Special characters in descriptions

## Known Limitations

1. **View Switching**: Week and Day views not yet implemented
2. **Real Data**: Using mock data, needs Supabase integration
3. **Event Editing**: No edit/delete functionality yet
4. **Recurring Events**: No support for repeating events
5. **Event Colors**: No custom color selection
6. **Time Zones**: No timezone handling (assumes local time)

## Future Enhancements

### High Priority
- [ ] Supabase integration for real trade/journal data
- [ ] Week and Day view implementations
- [ ] Event editing and deletion
- [ ] Drag-and-drop event rescheduling

### Medium Priority
- [ ] Event search functionality
- [ ] Calendar sharing/export (iCal format)
- [ ] Event reminders/notifications
- [ ] Integration with Google Calendar

### Low Priority
- [ ] Recurring event support
- [ ] Custom event colors
- [ ] Event categories/tags
- [ ] Calendar print view

## Related Documentation

- [Analytics Implementation](./ANALYTICS_COMPLETE.md)
- [Journal Implementation](./JOURNAL_IMPLEMENTATION_GUIDE.md)
- [Dual Panel Architecture](./DUAL_PANEL_ARCHITECTURE.md)
- [Copilot Instructions](./.github/copilot-instructions.md)

## Questions & Support

For implementation questions or feature requests:
1. Check existing documentation
2. Review the codebase structure
3. Test with mock data first
4. Plan Supabase schema integration

---

**Status**: ✅ Core functionality implemented and ready for testing  
**Last Updated**: November 4, 2025  
**Version**: 1.0
