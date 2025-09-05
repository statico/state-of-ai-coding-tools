'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { StarIcon } from '@radix-ui/react-icons'
import {
  customTooltipContentStyle,
  customTooltipLabelStyle,
  customLegendStyle,
} from './ChartTooltip'

interface RatingChartProps {
  data: Array<{
    optionId?: number
    optionLabel?: string
    count: number
    percentage: number
  }>
  title: string
}

export function RatingChart({ data, title }: RatingChartProps) {
  const chartData = data
    .map(item => ({
      rating: item.optionId || 0,
      count: item.count,
      percentage: item.percentage,
    }))
    .sort((a, b) => a.rating - b.rating)

  const averageRating =
    data.reduce((sum, item) => sum + (item.optionId || 0) * item.count, 0) /
    data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-card-foreground">{title}</h3>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-primary mr-2">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? 'text-primary fill-current'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="rating"
            tickFormatter={value => `${value} ⭐`}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={customTooltipContentStyle}
            labelStyle={customTooltipLabelStyle}
            formatter={value => [
              `${value} responses (${(((value as number) / data.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`,
              'Count',
            ]}
          />
          <Legend wrapperStyle={customLegendStyle} />
          <Bar dataKey="count" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
