# Quick Reference - Analytics Chart Features

## User Guide

### 🖱️ How to Use Chart Menus

1. **Hover** over any chart title area
2. **Click** the three-dot (⋮) menu button that appears
3. **Choose** an action:

#### 📱 Expand Fullscreen
- Opens chart in large modal
- Great for detailed analysis
- Press ESC or click X to close

#### 📊 Show Data Table  
- View raw data in table format
- Sortable and scrollable
- Perfect for data inspection

#### 💾 Export to CSV
- Downloads data as CSV file
- Opens in Excel, Sheets, etc.
- Filename matches chart title

### 🌓 Dark Mode

Charts automatically adapt to your theme:
- Toggle theme in top-right corner
- All charts update instantly
- Tooltips, grids, axes all adapt

## Developer Reference

### Adding a New Chart

```typescript
<ChartCard title="MY CHART TITLE" data={myChartData}>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={myChartData}>
      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
      <XAxis 
        dataKey="category" 
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
      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</ChartCard>
```

### Key Points:

1. **Always** add `const chartColors = useChartColors();` in component
2. **Always** pass `data` prop to ChartCard
3. **Use** `chartColors.grid` for grid lines
4. **Use** `chartColors.text` for axis text and strokes
5. **Use** `getTooltipStyle()` for tooltips
6. **Add** cursor fill for hover effects

### Color Palette

```typescript
// Light Mode
grid: '#e5e7eb'      // neutral-200
text: '#6b7280'      // neutral-500
background: '#ffffff' // white

// Dark Mode  
grid: '#404040'      // neutral-700
text: '#a3a3a3'      // neutral-400
background: '#171717' // neutral-900
```

### Data Format

ChartCard expects data as:
- Array of objects: `[{ key: value, ... }, ...]`
- Single object: `{ key: value, ... }`
- Keys become table headers
- Values displayed in cells/exported to CSV

### CSV Export Format

Automatically handles:
- Comma escaping
- Quote escaping  
- Header generation
- RFC 4180 compliance
- Filename sanitization

## Troubleshooting

### Chart doesn't show menu
- Check if `onMouseEnter`/`onMouseLeave` working
- Verify button has opacity transition
- Check z-index if menu hidden

### Dark mode not working
- Ensure `useChartColors()` called in component
- Check if `chartColors` used (not hardcoded colors)
- Verify ThemeProvider wraps app

### Export fails
- Ensure `data` prop passed to ChartCard
- Check data is valid array/object
- Verify no circular references

### Table shows "No data"
- Confirm `data` prop not undefined
- Check data structure is array or object
- Verify data has properties

### Fullscreen modal empty
- Ensure chart children rendered correctly
- Check ResponsiveContainer has dimensions
- Verify no conditional rendering issues

## Best Practices

✅ **DO:**
- Pass data to ChartCard
- Use chartColors for all Recharts elements
- Test in both light and dark mode
- Handle empty/undefined data gracefully
- Use meaningful chart titles

❌ **DON'T:**
- Hardcode colors
- Skip data prop
- Use inline styles for theme-dependent values
- Forget error handling
- Use className for stroke/fill in Recharts

## Support

For issues or questions:
1. Check console for errors
2. Verify TypeScript types
3. Test in isolation
4. Check browser compatibility

Happy charting! 📊✨
