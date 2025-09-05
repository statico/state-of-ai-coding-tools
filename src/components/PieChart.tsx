'use client'

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  customTooltipContentStyle,
  customTooltipLabelStyle,
} from './ChartTooltip'
import { getColor } from '@/lib/chart-colors'

interface PieChartProps {
  data: Array<{
    name: string
    value: number
    percentage: number
  }>
  title: string
}

export function PieChart({ data, title }: PieChartProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-card-foreground mb-4">{title}</h3>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage.toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover text-popover-foreground border border-border rounded-md shadow-md p-2 text-xs">
                        <p className="font-semibold">{payload[0].name}</p>
                        <p className="text-popover-foreground">
                          {`${payload[0].value} responses`}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </RechartsPieChart>
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
