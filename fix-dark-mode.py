#!/usr/bin/env python3
import re

# Read the file
with open('app/(shell)/analytics/analytics-content.tsx', 'r') as f:
    content = f.read()

# Replace hardcoded grid colors
content = re.sub(
    r'<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />',
    '<CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />',
    content
)

# Replace hardcoded axis colors - XAxis
content = re.sub(
    r'<XAxis ([^>]*?)tick=\{\{ fontSize: (\d+) \}\} stroke="#6b7280"',
    r'<XAxis \1tick={{ fontSize: \2, fill: chartColors.text }} stroke={chartColors.text}',
    content
)

# Replace hardcoded axis colors - YAxis
content = re.sub(
    r'<YAxis ([^>]*?)tick=\{\{ fontSize: (\d+) \}\} stroke="#6b7280"',
    r'<YAxis \1tick={{ fontSize: \2, fill: chartColors.text }} stroke={chartColors.text}',
    content
)

# Replace tooltip contentStyle
content = re.sub(
    r'contentStyle=\{\{[\s\S]*?backgroundColor: "#fff",[\s\S]*?border: "1px solid #e5e7eb",[\s\S]*?borderRadius: "8px",[\s\S]*?fontSize: "12px",[\s\S]*?\}\}',
    'contentStyle={getTooltipStyle(chartColors.grid === \'#404040\')}\n                  cursor={{ fill: chartColors.grid === \'#404040\' ? \'rgba(255,255,255,0.05)\' : \'rgba(0,0,0,0.05)\' }}',
    content
)

# Write the file back
with open('app/(shell)/analytics/analytics-content.tsx', 'w') as f:
    f.write(content)

print("Fixed dark mode for all charts!")
