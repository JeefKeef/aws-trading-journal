#!/usr/bin/env python3
import re

# Read the file
with open('app/(shell)/analytics/analytics-content.tsx', 'r') as f:
    content = f.read()

# Find ChartCard instances and try to infer data prop from the chart data
# Pattern: <ChartCard title="SOME TITLE"> followed by ResponsiveContainer and Chart with data={something}
pattern = r'<ChartCard title="([^"]+)">\s*<ResponsiveContainer[^>]*>\s*<(\w+Chart) data=\{([^}]+)\}'
matches = re.findall(pattern, content)

print(f"Found {len(matches)} chart instances")

# Replace ChartCard opening tags to include data prop
def replace_chartcard(match):
    title = match.group(1)
    chart_type = match.group(2)
    data_var = match.group(3)
    return f'<ChartCard title="{title}" data={{{data_var}}}>\n            <ResponsiveContainer width="100%" height={{300}}>\n              <{chart_type} data={{{data_var}}}'

content = re.sub(
    r'<ChartCard title="([^"]+)">\s*<ResponsiveContainer[^>]*>\s*<(\w+Chart) data=\{([^}]+)\}',
    replace_chartcard,
    content
)

# Write the file back
with open('app/(shell)/analytics/analytics-content.tsx', 'w') as f:
    f.write(content)

print("Added data props to all ChartCard instances!")
