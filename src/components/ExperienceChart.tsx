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

export function ExperienceChart({ data, title }: ExperienceChartProps) {
  // Transform data for stacked bar chart
  const chartData = data.map(item => {
    return {
      name: item.toolName,
      'Never heard': item.total > 0 ? (item.neverHeard / item.total) * 100 : 0,
      'Want to try': item.total > 0 ? (item.wantToTry / item.total) * 100 : 0,
      'Not interested':
        item.total > 0 ? (item.notInterested / item.total) * 100 : 0,
      'Would use again':
        item.total > 0 ? (item.wouldUseAgain / item.total) * 100 : 0,
      'Would not use':
        item.total > 0 ? (item.wouldNotUse / item.total) * 100 : 0,
    }
  })

  return (
    <div className="bg-card p-6 rounded-lg shadow col-span-full">
      <h3 className="text-lg font-medium text-card-foreground mb-4">{title}</h3>
      <div
        className="w-full overflow-hidden"
        style={{ height: Math.min(800, 60 + chartData.length * 40) }}
      >
        <ResponsiveContainer width="100%" height="100%">
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
              animationDuration={150}
            />
            <Bar
              dataKey="Want to try"
              stackId="a"
              fill={CHART_COLORS.experience.wantToTry}
              animationDuration={150}
            />
            <Bar
              dataKey="Not interested"
              stackId="a"
              fill={CHART_COLORS.experience.notInterested}
              animationDuration={150}
            />
            <Bar
              dataKey="Would use again"
              stackId="a"
              fill={CHART_COLORS.experience.wouldUseAgain}
              animationDuration={150}
            />
            <Bar
              dataKey="Would not use"
              stackId="a"
              fill={CHART_COLORS.experience.wouldNotUse}
              animationDuration={150}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
