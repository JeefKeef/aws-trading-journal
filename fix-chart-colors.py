#!/usr/bin/env python3
import re

# Read the file
with open('app/(shell)/analytics/analytics-content.tsx', 'r') as f:
    content = f.read()

# Find all functions that use chartColors but don't have it defined
functions_to_fix = [
    'PriceVolumeContent',
    'MarketBehaviorContent',
    'WinLossExpectationContent',
    'LiquidityContent',
    'InstrumentContent',
]

for func_name in functions_to_fix:
    # Find the function and add chartColors hook
    pattern = rf'(function {func_name}\(\).*?\{{)'
    replacement = r'\1\n  const chartColors = useChartColors();'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write the file back
with open('app/(shell)/analytics/analytics-content.tsx', 'w') as f:
    f.write(content)

print("Added chartColors to all functions!")
