'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  customTooltipContentStyle,
  customTooltipLabelStyle,
  customLegendStyle,
} from './ChartTooltip'
import { CHART_COLORS } from '@/lib/chart-colors'

interface ExperienceChartProps {
  data: Array<{
    toolName: string
    neverHeard: number
    wantToTry: number
    notInterested: number
    wouldUseAgain: number
    wouldNotUse: number
    total: number
  }>
  title: string
}

// Experience labels for reference (currently unused)
// const EXPERIENCE_LABELS = {
//   neverHeard: 'Never heard',
//   wantToTry: 'Want to try',
//   notInterested: 'Not interested',
//   wouldUseAgain: 'Would use again',
//   wouldNotUse: 'Would not use',
// }

export function ExperienceChart({ data, title }: ExperienceChartProps) {
  // Transform data for stacked bar chart
  const chartData = data.map(item => ({
    name: item.toolName,
    'Never heard': (item.neverHeard / item.total) * 100,
    'Want to try': (item.wantToTry / item.total) * 100,
    'Not interested': (item.notInterested / item.total) * 100,
    'Would use again': (item.wouldUseAgain / item.total) * 100,
    'Would not use': (item.wouldNotUse / item.total) * 100,
  }))

  return (
    <div className="bg-card p-6 rounded-lg shadow col-span-full">
      <h3 className="text-lg font-medium text-card-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={60 + data.length * 40}>
        <RechartsBarChart
          data={chartData}
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 11 }}
          />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={customTooltipContentStyle}
            labelStyle={customTooltipLabelStyle}
            formatter={(value: number) => `${value.toFixed(1)}%`}
          />
          <Legend wrapperStyle={customLegendStyle} />

          <Bar
            dataKey="Never heard"
            stackId="a"
            fill={CHART_COLORS.experience.neverHeard}
          />
          <Bar
            dataKey="Want to try"
            stackId="a"
            fill={CHART_COLORS.experience.wantToTry}
          />
          <Bar
            dataKey="Not interested"
            stackId="a"
            fill={CHART_COLORS.experience.notInterested}
          />
          <Bar
            dataKey="Would use again"
            stackId="a"
            fill={CHART_COLORS.experience.wouldUseAgain}
          />
          <Bar
            dataKey="Would not use"
            stackId="a"
            fill={CHART_COLORS.experience.wouldNotUse}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
