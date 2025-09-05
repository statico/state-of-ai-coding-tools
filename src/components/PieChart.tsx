'use client'

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import {
  customTooltipContentStyle,
  customTooltipLabelStyle,
} from './ChartTooltip'

interface PieChartProps {
  data: Array<{
    name: string
    value: number
    percentage: number
  }>
  title: string
}

const COLORS = [
  '#ff7c00',
  '#ffb366',
  '#40a9a6',
  '#2c7a7b',
  '#f6c458',
  '#ffa040',
  '#94d0cc',
  '#b5838d',
  '#e07b39',
  '#a44a3f',
  '#c97064',
  '#de9151',
  '#f4a460',
  '#cd5c5c',
  '#daa520',
  '#8b7355',
  '#bc8f8f',
  '#d2691e',
  '#ff6b6b',
  '#4ecdc4',
]

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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={customTooltipContentStyle}
                labelStyle={customTooltipLabelStyle}
                formatter={value => [`${value} responses`, 'Count']}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:w-48 space-y-1">
          {data.slice(0, 10).map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-[11px]">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground truncate flex-1">
                {entry.name}
              </span>
              <span className="text-muted-foreground text-[10px]">
                {entry.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
          {data.length > 10 && (
            <div className="text-[11px] text-muted-foreground pt-1">
              +{data.length - 10} more...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
