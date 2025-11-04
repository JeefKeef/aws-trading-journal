# Analytics Charts Dark Mode & Hover Menu Implementation

## Summary
Successfully implemented dark mode support for all analytics charts and added hover functionality with dropdown menus for each chart.

## Changes Made

### 1. Dark Mode Support for Charts
- ✅ All `CartesianGrid` components now use theme-aware grid colors (`#e5e7eb` light / `#404040` dark)
- ✅ All `XAxis` and `YAxis` components use theme-aware text colors (`#6b7280` light / `#a3a3a3` dark)
- ✅ All `Tooltip` components use theme-aware styling (background, border, text colors)
- ✅ Added cursor hover effects that adapt to theme (semi-transparent overlay)

### 2. Hover Functionality
- ✅ Each chart card now displays a dropdown menu button on hover
- ✅ Dropdown menu includes three options:
  - **Expand Fullscreen** - Opens chart in fullscreen mode
  - **Show Data Table** - Displays underlying data in table format
  - **Export to CSV** - Downloads chart data as CSV file
- ✅ Fixed UI shift issue by reserving space for the button (always rendered but opacity changes)

### 3. Implementation Details

#### Helper Functions Added
```typescript
// Returns theme-aware colors based on current theme
function useChartColors() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  return {
    grid: isDark ? '#404040' : '#e5e7eb',
    text: isDark ? '#a3a3a3' : '#6b7280',
    background: isDark ? '#171717' : '#ffffff',
    tooltipBg: isDark ? '#262626' : '#ffffff',
    tooltipBorder: isDark ? '#404040' : '#e5e7eb',
  };
}

// Returns tooltip style object for charts
const getTooltipStyle = (isDark: boolean) => ({
  backgroundColor: isDark ? '#262626' : '#ffffff',
  border: `1px solid ${isDark ? '#404040' : '#e5e7eb'}`,
  borderRadius: '8px',
  fontSize: '12px',
  color: isDark ? '#e5e5e5' : '#171717',
});
```

#### ChartCard Component Updated
```typescript
function ChartCard({ title, children, data }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Always renders button but controls visibility with opacity
  // Prevents UI shift when hovering
  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex items-center justify-between mb-4 min-h-5">
        <h3>{title}</h3>
        <div className="w-8 h-8">
          <DropdownMenu>
            <DropdownMenuTrigger className={isHovered ? "opacity-100" : "opacity-0"}>
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* Menu items */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {children}
    </div>
  );
}
```

### 4. Components Updated
All chart components across different tabs:
- ✅ **Overview Tab** - DaysTimesOverviewContent (30+ charts)
- ✅ **Price/Volume Tab** - PriceVolumeContent (6 charts)
- ✅ **Instrument Tab** - InstrumentContent (30+ charts)
- ✅ **Market Behavior Tab** - MarketBehaviorContent (6 charts)
- ✅ **Win/Loss/Expectation Tab** - WinLossExpectationContent (4 charts)
- ✅ **Liquidity Tab** - LiquidityContent (6 charts)

### 5. Chart Types Fixed
- ✅ BarChart
- ✅ AreaChart
- ✅ LineChart
- ✅ Stacked BarChart

## Testing Checklist

### Dark Mode
- [ ] Verify all charts have dark backgrounds in dark mode
- [ ] Check that grid lines are visible but not too bright in dark mode
- [ ] Confirm axis labels are readable in both light and dark modes
- [ ] Test tooltip appearance in both themes
- [ ] Verify cursor hover effects work correctly

### Hover Menu
- [ ] Hover over each chart title - menu button should appear
- [ ] Confirm no UI shift occurs when hovering
- [ ] Click "Expand Fullscreen" - should show toast notification
- [ ] Click "Show Data Table" - should show toast notification
- [ ] Click "Export to CSV" - should show toast notification
- [ ] Test on different screen sizes

### Performance
- [ ] Charts render smoothly
- [ ] No noticeable lag when switching themes
- [ ] Hover interactions are responsive

## Known Limitations
1. Menu actions (Fullscreen, Data Table, Export) currently show toast notifications
2. Actual functionality for these actions needs to be implemented
3. Export to CSV needs proper data serialization logic

## Next Steps
1. Implement actual fullscreen modal for charts
2. Create data table component to display chart data
3. Add CSV export functionality with proper data formatting
4. Add keyboard shortcuts (e.g., F for fullscreen, T for table)
5. Consider adding chart customization options (colors, axes, etc.)

## Files Modified
- `/app/(shell)/analytics/analytics-content.tsx` - Main analytics component (3146 lines)

## Dependencies Added
- `next-themes` - Already installed, now using `useTheme` hook for theme detection
- `@radix-ui/react-dropdown-menu` - Already installed via shadcn/ui
- `lucide-react` - Already installed, added new icons (MoreVertical, Maximize2, FileDown, Table)
