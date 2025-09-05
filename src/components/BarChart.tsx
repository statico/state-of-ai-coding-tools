'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  customTooltipContentStyle,
  customTooltipLabelStyle,
  customLegendStyle,
} from './ChartTooltip'
import { CHART_COLORS, getColor } from '@/lib/chart-colors'

interface BarChartProps {
  data: Array<{
    name: string
    value: number
    percentage: number
  }>
  title: string
}

export function BarChart({ data, title }: BarChartProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-card-foreground mb-4">{title}</h3>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.2)"
              />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 11, fill: '#ffffff' }}
                stroke="rgba(255, 255, 255, 0.3)"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#ffffff' }}
                stroke="rgba(255, 255, 255, 0.3)"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value as number
                    const total = data.reduce(
                      (sum, item) => sum + item.value,
                      0
                    )
                    const percentage = ((value / total) * 100).toFixed(1)
                    return (
                      <div className="bg-popover text-popover-foreground border border-border rounded-md shadow-md p-2 text-xs">
                        <p className="font-semibold">{label}</p>
                        <p className="text-popover-foreground">
                          {`${value} responses (${percentage}%)`}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:w-48 space-y-1">
          {data.slice(0, 10).map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-[11px]">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: getColor(index) }}
              />
              <span className="text-card-foreground truncate flex-1">
                {entry.name}
              </span>
              <span className="text-card-foreground text-[10px]">
                {entry.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
          {data.length > 10 && (
            <div className="text-[11px] text-card-foreground pt-1">
              +{data.length - 10} more...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
