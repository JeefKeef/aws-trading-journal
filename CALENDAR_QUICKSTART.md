# Trading Calendar - Quick Reference

## 🚀 Quick Start

Access the calendar by clicking the **Calendar** icon in the sidebar, or navigate to `/calendar`.

## 📅 Calendar Views

### Month View (Default)
- Shows full month in grid layout
- 7 columns (Sun-Sat)
- Each cell displays up to 3 events
- "+X more" indicator for additional events

### Week View (Coming Soon)
- Shows 7-day week view
- Hourly breakdown

### Day View (Coming Soon)
- Single day timeline
- Detailed hour-by-hour events

## 🎯 Event Types

| Icon | Type | Color | Information Shown |
|------|------|-------|-------------------|
| 🟩 | Trade | Green | Ticker, P/L, Entry/Exit, Notes |
| 🟦 | Journal | Blue | Title, Emotions, Summary |
| 🟧 | Earnings | Orange | Company, Ticker, EPS Data |

## 🎮 Navigation Controls

### Date Navigation
- **← Arrow**: Previous month
- **→ Arrow**: Next month
- **Today Button**: Jump to current date
- **Jump to Selector**: Pick any month/year from dropdown

### View Switching
Click the view buttons to switch between Month/Week/Day views.

## 🔍 Filtering Events

1. Click the **Filter** button (top-right)
2. Check/uncheck event types:
   - ✅ Trades
   - ✅ Journal Entries
   - ✅ Earnings / Market Events
3. Calendar updates instantly

**Tip**: Filter settings persist until you change them.

## ➕ Adding Events

1. Click **Add Event** button
2. Fill in the form:
   - **Event Type**: Choose Trade, Journal, or Market Event
   - **Title**: Short description
   - **Date**: Pick from calendar
   - **Description**: Detailed notes
3. Click **Create Event**

## 📊 Event Details

### Viewing Details
Click any event badge to open the detail modal.

### Trade Details
- Date
- P/L (profit/loss)
- Entry Price
- Exit Price
- Notes
- Link to related journal entry (if exists)

### Journal Details
- Date
- Title
- Emotion Tags (colored badges)
- Summary text
- Link to full journal page

### Earnings Details
- Date
- Company Name
- Ticker Symbol
- Time (Before/After Market)
- EPS Forecast
- EPS Actual (if available)

## 💾 Exporting Data

1. Click **Export CSV** button
2. File downloads automatically
3. Filename format: `trading-calendar-YYYY-MM-DD.csv`

**CSV Includes**:
- Date
- Event Type
- Details
- Value (P/L, emotions, or EPS)

**Note**: Export respects active filters (only visible events are exported).

## 🎨 Visual Features

### Today's Date
- Highlighted with blue circle
- Easy to spot in any month

### Event Colors
- **Green**: Winning/positive trades
- **Red**: Losing trades (in P/L display)
- **Blue**: Journal entries and info
- **Orange**: Market events

### Multiple Events
When a day has more than 3 events:
- First 3 events shown as badges
- "+X more" text appears below
- Click the day to see all events

## ⌨️ Pro Tips

### Quick Filters
Use filters to focus on specific event types:
- **Trades only**: Uncheck journals and earnings
- **Journal only**: Uncheck trades and earnings
- **Earnings only**: Uncheck trades and journals

### Export Filtered Data
1. Set your filters first
2. Then click Export CSV
3. Only visible events are exported

### Multi-Event Days
On busy trading days:
- Trades appear at the top (green)
- Journals in the middle (blue)
- Earnings at the bottom (orange)

## 🔗 Integration

### Linked Data
- **Trades** → Links to journal entries (if tagged)
- **Journal Entries** → Links to full journal page
- All dates clickable for quick navigation

### Future Integrations
- Google Calendar sync
- Real-time earnings data
- Trade execution alerts
- Journal auto-creation from trades

## 🐛 Troubleshooting

### No Events Showing
1. Check filter settings (make sure event types are enabled)
2. Verify you're viewing the correct month
3. Ensure events exist in the database

### CSV Won't Download
1. Check browser download permissions
2. Disable ad blockers temporarily
3. Try a different browser

### Event Details Won't Open
1. Make sure you clicked the event badge (not empty space)
2. Check for JavaScript errors in console
3. Try refreshing the page

## 📱 Mobile Usage (Future)

Coming soon:
- Swipe gestures for month navigation
- Vertical list view for small screens
- Bottom sheet for event details
- Simplified controls for touch

## 🎯 Use Cases

### Daily Trading Review
1. Navigate to today
2. View all trades and journals
3. Click events to see details
4. Add new journal reflections

### Weekly Performance Analysis
1. Filter to show only trades
2. Navigate week by week
3. Export CSV for external analysis
4. Review P/L trends

### Earnings Season Planning
1. Filter to show only earnings events
2. View upcoming announcements
3. Plan trade setups around earnings
4. Add journal notes for strategies

### Monthly Reporting
1. View entire month at once
2. Export all data to CSV
3. Import to spreadsheet for analysis
4. Share with accountability partner

## 🎓 Best Practices

### Consistent Logging
- Log trades immediately after closing
- Add journal entries daily
- Tag emotions while they're fresh
- Link trades to journal insights

### Regular Reviews
- Check calendar weekly
- Export monthly for records
- Look for patterns in timing
- Identify best trading days/times

### Preparation
- Review upcoming earnings weekly
- Plan trades around market events
- Set reminders for key dates
- Add notes for future reference

---

**Need Help?** Check the [Full Implementation Guide](./CALENDAR_IMPLEMENTATION.md) for technical details.
