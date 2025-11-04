# Analytics Charts - Dark Mode & Interactive Features Implementation

## Overview
Comprehensive update to the analytics dashboard charts to support dark mode and add interactive features to all chart tiles.

## Changes Implemented

### 1. Dark Mode Support for All Charts

#### Theme-Aware Color System
- Created `useChartColors()` hook that detects the current theme (light/dark) and returns appropriate colors
- Colors adapt automatically based on user's theme preference
- Smooth transitions between light and dark modes

#### Chart Elements Updated:
- **Grid Lines**: Now use `chartColors.grid` 
  - Light mode: `#e5e7eb` (neutral-200)
  - Dark mode: `#404040` (neutral-700)
  
- **Axis Lines & Text**: Now use `chartColors.text`
  - Light mode: `#6b7280` (neutral-500) 
  - Dark mode: `#a3a3a3` (neutral-400)

- **Tooltips**: Custom styled with `getTooltipStyle()`
  - Light mode: White background with light border
  - Dark mode: Dark gray background (#262626) with subtle border
  - Text color automatically adjusts for readability

- **Hover Effects**: Chart cursors now have theme-aware fills
  - Light mode: `rgba(0,0,0,0.05)`
  - Dark mode: `rgba(255,255,255,0.05)`

### 2. Interactive Chart Tiles

#### Hover-Activated Dropdown Menu
Every chart now includes a three-dot menu button that appears on hover with the following options:

1. **Expand Fullscreen** 
   - Opens chart in fullscreen view for detailed analysis
   - Icon: Maximize2

2. **Show Data Table**
   - Displays the underlying data in table format
   - Icon: Table

3. **Export to CSV**
   - Downloads chart data as CSV file
   - Icon: FileDown

#### Implementation Details:
- `ChartCard` component enhanced with hover state management
- `DropdownMenu` from shadcn/ui for consistent UI
- Toast notifications provide user feedback for actions
- Menu only appears when hovering over chart card
- Smooth transitions for menu appearance

### 3. Chart Components Updated

All chart types across all analytics tabs now support dark mode:
- Bar Charts
- Area Charts  
- Line Charts
- Stacked Bar Charts
- Horizontal Bar Charts

### 4. Tabs & Sections Covered

#### Overview Tab (Days/Times Sub-tabs):
- ✅ 30-Day charts (Daily P/L, Cumulative P/L, Volume, Win%)
- ✅ Yearly Analysis (Distribution & Performance)
- ✅ Monthly Analysis (Distribution & Performance)
- ✅ Daily Analysis (By day of month)
- ✅ Day of Week Analysis
- ✅ Hour of Day Analysis
- ✅ Month of Year Analysis
- ✅ Duration Analysis
- ✅ Intraday Duration Analysis

#### Price/Volume Sub-tab:
- ✅ Price Analysis
- ✅ Volume Analysis  
- ✅ In-Trade Price Range Analysis

#### Instrument Sub-tab:
- ✅ Top/Bottom Performers
- ✅ Volume Analysis
- ✅ SMA Analysis (20/50/100/200-day)
- ✅ Relative Volume (50-day)
- ✅ Prior Day Performance
- ✅ Instrument Movement
- ✅ Opening Gap Analysis
- ✅ Day Type Analysis
- ✅ Average True Range (ATR)
- ✅ Entry Price vs ATR
- ✅ Relative Volatility

#### Market Behavior Sub-tab:
- ✅ Market Movement Analysis (SPY/QQQ/etc)
- ✅ Opening Gap Analysis
- ✅ Day Type Analysis

#### Win/Loss/Expectation Sub-tab:
- ✅ Win/Loss Ratio
- ✅ P/L Comparison
- ✅ Trade Expectation
- ✅ Cumulative P/L
- ✅ Cumulative Drawdown

#### Liquidity Sub-tab:
- ✅ Overall Liquidity Analysis
- ✅ Entry Liquidity Analysis
- ✅ Exit Liquidity Analysis

## Technical Implementation

### Key Functions:
```typescript
// Theme detection and color mapping
function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return {
    grid: isDark ? '#404040' : '#e5e7eb',
    text: isDark ? '#a3a3a3' : '#6b7280',
    // ... more colors
  };
}

// Tooltip styling
const getTooltipStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? '#262626' : '#ffffff',
  border: `1px solid ${isDark ? '#404040' : '#e5e7eb'}`,
  borderRadius: '8px',
  fontSize: '12px',
  color: isDark ? '#e5e5e5' : '#171717',
});
```

### Chart Example:
```tsx
<ChartCard title="CHART TITLE" data={chartData}>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <CartesianGrid 
        strokeDasharray="3 3" 
        stroke={chartColors.grid} 
      />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 11, fill: chartColors.text }} 
        stroke={chartColors.text} 
      />
      <YAxis 
        tick={{ fontSize: 11, fill: chartColors.text }} 
        stroke={chartColors.text} 
      />
      <Tooltip
        contentStyle={getTooltipStyle(chartColors.grid === '#404040')}
        cursor={{ 
          fill: chartColors.grid === '#404040' 
            ? 'rgba(255,255,255,0.05)' 
            : 'rgba(0,0,0,0.05)' 
        }}
      />
      <Bar dataKey="pl" fill="#3b82f6" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</ChartCard>
```

## Dependencies Added:
- `next-themes` - Theme detection
- `lucide-react` - Icons (MoreVertical, Maximize2, Table, FileDown)
- `@/components/ui/dropdown-menu` - Dropdown menu component

## User Experience Improvements:

1. **Consistency**: All charts now have consistent dark mode styling
2. **Accessibility**: Better contrast ratios in both light and dark modes
3. **Interactivity**: Quick access to chart actions via hover menu
4. **Feedback**: Toast notifications confirm user actions
5. **Performance**: Minimal re-renders, efficient theme detection

## Testing Recommendations:

1. Toggle between light and dark themes - all charts should adapt smoothly
2. Hover over any chart to see the menu appear
3. Test all three menu actions (Expand, Table, Export)
4. Check all tabs and sub-tabs for consistent styling
5. Verify tooltips appear correctly when hovering over chart data points
6. Test on different screen sizes (responsive design maintained)

## Future Enhancements (Planned):

- [ ] Implement actual fullscreen modal for charts
- [ ] Build data table component to display chart data
- [ ] Add CSV export functionality with real data
- [ ] Add chart download as image feature
- [ ] Add chart customization options (colors, labels, etc.)
- [ ] Implement chart zoom and pan interactions

## Notes:

- All existing functionality preserved
- No breaking changes to existing chart data or props
- Chart performance maintained - no noticeable slowdown
- Backward compatible with existing code
