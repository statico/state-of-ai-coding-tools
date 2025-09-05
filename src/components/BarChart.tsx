'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis />
          <Tooltip
            formatter={value => [
              `${value} responses (${(((value as number) / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
              'Count',
            ]}
          />
          <Bar dataKey="value" fill="#ff7c00" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
