'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StarIcon } from '@radix-ui/react-icons'

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
  const chartData = data.map(item => ({
    rating: item.optionId || 0,
    count: item.count,
    percentage: item.percentage,
  })).sort((a, b) => a.rating - b.rating)

  const averageRating = data.reduce((sum, item) => sum + (item.optionId || 0) * item.count, 0) / 
                       data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center">
          <span className="text-2xl font-bold text-yellow-500 mr-2">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
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
            tickFormatter={(value) => `${value} ⭐`}
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} responses (${((value as number) / data.reduce((sum, item) => sum + item.count, 0) * 100).toFixed(1)}%)`, 'Count']}
          />
          <Bar dataKey="count" fill="#FBBF24" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}