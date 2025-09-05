'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChevronLeft, Home } from 'lucide-react'
import {
  customTooltipContentStyle,
  customTooltipLabelStyle,
  customLegendStyle,
} from '@/components/ChartTooltip'

interface TrendData {
  week: string
  weekStart: string
  weekEnd: string
  responses: number
  [key: string]: number | string
}

interface Question {
  id: number
  title: string
  type: string
  category: string
  options?: Array<{
    id: number
    label: string
  }>
}

const TAB_SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    categories: ['overview'],
  },
  {
    id: 'demographics',
    label: 'Demographics',
    categories: ['demographics'],
  },
  {
    id: 'ai_tools',
    label: 'AI Tools',
    categories: ['ai_tools'],
  },
  {
    id: 'tools',
    label: 'Dev Tools',
    categories: ['tools'],
  },
  {
    id: 'frameworks',
    label: 'Frameworks',
    categories: ['frameworks'],
  },
  {
    id: 'preferences',
    label: 'Preferences',
    categories: ['preferences'],
  },
  {
    id: 'challenges',
    label: 'Challenges',
    categories: ['challenges'],
  },
  {
    id: 'workflow',
    label: 'Workflow',
    categories: ['workflow'],
  },
]

// Generate colors for lines
const generateColor = (index: number, total: number) => {
  const hue = (index * 360) / total
  return `hsl(${hue}, 70%, 50%)`
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendData[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [weekRange, setWeekRange] = useState(12)
  const [activeTab, setActiveTab] = useState('overview')
  const [isFetching, setIsFetching] = useState(false)
  const [categoryData, setCategoryData] = useState<
    Record<string, { trends: TrendData[]; questions: Question[] }>
  >({})

  useEffect(() => {
    if (!isFetching && activeTab === 'overview') {
      fetchTrends()
    } else if (
      !isFetching &&
      activeTab !== 'overview' &&
      !categoryData[activeTab]
    ) {
      fetchCategoryData(activeTab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekRange, activeTab])

  const fetchTrends = async () => {
    if (isFetching) return

    try {
      setIsFetching(true)
      setIsLoading(true)
      // For overview, we only need response counts, not question data
      const response = await fetch(
        `/api/trends?weeks=${weekRange}&category=overview`
      )
      const data = await response.json()

      if (data.success) {
        setTrends(data.trends)
        setQuestions([])
      } else {
        setError(data.error || 'Failed to fetch trends')
      }
    } catch (err) {
      setError('Network error')
      console.error('Error fetching trends:', err)
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }

  const fetchCategoryData = async (categoryId: string) => {
    if (isFetching) return

    try {
      setIsFetching(true)
      setIsLoading(true)

      // Find the categories for this tab
      const section = TAB_SECTIONS.find(s => s.id === categoryId)
      if (!section) return

      // Fetch data for each category in this tab
      const categoryPromises = section.categories.map(cat =>
        fetch(`/api/trends?weeks=${weekRange}&category=${cat}`).then(res =>
          res.json()
        )
      )

      const results = await Promise.all(categoryPromises)

      // Combine all results
      const combinedQuestions: Question[] = []
      let combinedTrends: TrendData[] = []

      results.forEach(data => {
        if (data.success) {
          combinedQuestions.push(...(data.questions || []))
          if (combinedTrends.length === 0) {
            combinedTrends = data.trends
          }
        }
      })

      // Store in category-specific cache
      setCategoryData(prev => ({
        ...prev,
        [categoryId]: {
          trends: combinedTrends,
          questions: combinedQuestions,
        },
      }))

      setQuestions(combinedQuestions)
      setTrends(combinedTrends)
    } catch (err) {
      setError('Network error')
      console.error('Error fetching category data:', err)
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link
            href="/results"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90"
          >
            Back to Results
          </Link>
        </div>
      </div>
    )
  }

  // Group questions by category
  const questionsByCategory = questions.reduce(
    (acc, q) => {
      if (!acc[q.category]) {
        acc[q.category] = []
      }
      acc[q.category].push(q)
      return acc
    },
    {} as Record<string, Question[]>
  )

  const renderQuestionChart = (question: Question) => {
    switch (question.type) {
      case 'SINGLE_CHOICE':
      case 'DEMOGRAPHIC':
      case 'MULTIPLE_CHOICE':
        // Create chart data for options with stacked bars
        const optionBars =
          question.options?.map((opt, idx) => ({
            dataKey: `q_${question.id}_opt_${opt.id}`,
            name: opt.label,
            fill: generateColor(idx, question.options?.length || 1),
          })) || []

        return (
          <Card key={question.id} className="p-6">
            <CardHeader>
              <CardTitle>{question.title}</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  label={{
                    value: 'Percentage (%)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip
                  contentStyle={customTooltipContentStyle}
                  labelStyle={customTooltipLabelStyle}
                />
                <Legend wrapperStyle={customLegendStyle} />
                {optionBars.map(bar => (
                  <Bar
                    key={bar.dataKey}
                    stackId="stack"
                    dataKey={bar.dataKey}
                    name={bar.name}
                    fill={bar.fill}
                    animationDuration={0}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )

      case 'RATING':
        return (
          <Card key={question.id} className="p-6">
            <CardHeader>
              <CardTitle>{question.title}</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  label={{
                    value: 'Average Rating',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 11 },
                  }}
                  domain={[0, 5]}
                />
                <Tooltip
                  contentStyle={customTooltipContentStyle}
                  labelStyle={customTooltipLabelStyle}
                />
                <Legend wrapperStyle={customLegendStyle} />
                <Bar
                  dataKey={`q_${question.id}_avg`}
                  name="Average Rating"
                  fill="#3b82f6"
                  animationDuration={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )

      case 'EXPERIENCE':
        const experienceMetrics = [
          { key: 'never_heard', label: 'Never Heard', color: '#6b7280' },
          { key: 'want_to_try', label: 'Want to Try', color: '#3b82f6' },
          {
            key: 'not_interested',
            label: 'Not Interested',
            color: '#ef4444',
          },
          {
            key: 'would_use_again',
            label: 'Would Use Again',
            color: '#10b981',
          },
          { key: 'would_not_use', label: 'Would Not Use', color: '#f59e0b' },
        ]

        return (
          <Card key={question.id} className="p-6">
            <CardHeader>
              <CardTitle>{question.title}</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  label={{
                    value: 'Percentage (%)',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip
                  contentStyle={customTooltipContentStyle}
                  labelStyle={customTooltipLabelStyle}
                />
                <Legend wrapperStyle={customLegendStyle} />
                {experienceMetrics.map(metric => (
                  <Line
                    key={metric.key}
                    type="monotone"
                    dataKey={`q_${question.id}_${metric.key}`}
                    name={metric.label}
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    animationDuration={0}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )

      case 'TEXT':
        return (
          <Card key={question.id} className="p-6">
            <CardHeader>
              <CardTitle>{question.title}</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="week"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  label={{
                    value: 'Response Count',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 11 },
                  }}
                />
                <Tooltip
                  contentStyle={customTooltipContentStyle}
                  labelStyle={customTooltipLabelStyle}
                />
                <Legend wrapperStyle={customLegendStyle} />
                <Bar
                  dataKey={`q_${question.id}_count`}
                  name="Text Responses"
                  fill="#8b5cf6"
                  animationDuration={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Survey Trends</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Track survey responses and metrics over time
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/results"
            className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Link>

          {/* Week Range Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select
              value={weekRange}
              onChange={e => setWeekRange(Number(e.target.value))}
              className="px-3 py-2 border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value={4}>Last 4 weeks</option>
              <option value={8}>Last 8 weeks</option>
              <option value={12}>Last 12 weeks</option>
              <option value={26}>Last 26 weeks</option>
              <option value={52}>Last year</option>
            </select>
          </div>

          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </div>

        {/* Summary Statistics - Always visible */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {trends.length > 0 && (
              <>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Latest Week
                  </h3>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {trends[trends.length - 1]?.responses || 0} responses
                  </p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Average Weekly
                  </h3>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {Math.round(
                      trends.reduce((a, b) => a + b.responses, 0) /
                        trends.length
                    )}{' '}
                    responses
                  </p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Peak Week
                  </h3>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {Math.max(...trends.map(t => t.responses))} responses
                  </p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Total Responses
                  </h3>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {trends.reduce((a, b) => a + b.responses, 0)} overall
                  </p>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            {TAB_SECTIONS.map(section => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Response Count Trend */}
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Total Weekly Responses</CardTitle>
              </CardHeader>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={customTooltipContentStyle}
                    labelStyle={customTooltipLabelStyle}
                  />
                  <Legend wrapperStyle={customLegendStyle} />
                  <Line
                    type="monotone"
                    dataKey="responses"
                    stroke="#ff7c00"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total Responses"
                    animationDuration={0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {TAB_SECTIONS.slice(1).map(section => {
            const catData = categoryData[section.id]
            const catQuestions = catData?.questions || []
            const catTrends = catData?.trends || trends

            // Group questions by category for this specific tab
            const tabQuestionsByCategory = catQuestions.reduce(
              (acc, q) => {
                if (!acc[q.category]) {
                  acc[q.category] = []
                }
                acc[q.category].push(q)
                return acc
              },
              {} as Record<string, Question[]>
            )

            return (
              <TabsContent
                key={section.id}
                value={section.id}
                className="space-y-6"
              >
                {activeTab === section.id && (
                  <>
                    {isLoading ? (
                      <Card className="p-6">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </Card>
                    ) : (
                      section.categories.map(category => (
                        <div key={category} className="space-y-6">
                          {tabQuestionsByCategory[category]?.map(question => {
                            // Create a modified renderQuestionChart that uses catTrends
                            const chartData = catTrends
                            switch (question.type) {
                              case 'SINGLE_CHOICE':
                              case 'DEMOGRAPHIC':
                              case 'MULTIPLE_CHOICE':
                                const optionBars =
                                  question.options?.map((opt, idx) => ({
                                    dataKey: `q_${question.id}_opt_${opt.id}`,
                                    name: opt.label,
                                    fill: generateColor(
                                      idx,
                                      question.options?.length || 1
                                    ),
                                  })) || []

                                return (
                                  <Card key={question.id} className="p-6">
                                    <CardHeader>
                                      <CardTitle>{question.title}</CardTitle>
                                    </CardHeader>
                                    <ResponsiveContainer
                                      width="100%"
                                      height={300}
                                    >
                                      <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                          dataKey="week"
                                          angle={-45}
                                          textAnchor="end"
                                          height={80}
                                          tick={{ fontSize: 11 }}
                                        />
                                        <YAxis
                                          tick={{ fontSize: 11 }}
                                          label={{
                                            value: 'Percentage (%)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: { fontSize: 11 },
                                          }}
                                        />
                                        <Tooltip
                                          contentStyle={
                                            customTooltipContentStyle
                                          }
                                          labelStyle={customTooltipLabelStyle}
                                        />
                                        <Legend
                                          wrapperStyle={customLegendStyle}
                                        />
                                        {optionBars.map(bar => (
                                          <Bar
                                            key={bar.dataKey}
                                            stackId="stack"
                                            dataKey={bar.dataKey}
                                            name={bar.name}
                                            fill={bar.fill}
                                            animationDuration={0}
                                          />
                                        ))}
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </Card>
                                )

                              case 'RATING':
                                return (
                                  <Card key={question.id} className="p-6">
                                    <CardHeader>
                                      <CardTitle>{question.title}</CardTitle>
                                    </CardHeader>
                                    <ResponsiveContainer
                                      width="100%"
                                      height={300}
                                    >
                                      <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                          dataKey="week"
                                          angle={-45}
                                          textAnchor="end"
                                          height={80}
                                          tick={{ fontSize: 11 }}
                                        />
                                        <YAxis
                                          tick={{ fontSize: 11 }}
                                          label={{
                                            value: 'Average Rating',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: { fontSize: 11 },
                                          }}
                                          domain={[0, 5]}
                                        />
                                        <Tooltip
                                          contentStyle={
                                            customTooltipContentStyle
                                          }
                                          labelStyle={customTooltipLabelStyle}
                                        />
                                        <Legend
                                          wrapperStyle={customLegendStyle}
                                        />
                                        <Bar
                                          dataKey={`q_${question.id}_avg`}
                                          name="Average Rating"
                                          fill="#3b82f6"
                                          animationDuration={0}
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </Card>
                                )

                              case 'EXPERIENCE':
                                const experienceMetrics = [
                                  {
                                    key: 'never_heard',
                                    label: 'Never Heard',
                                    color: '#6b7280',
                                  },
                                  {
                                    key: 'want_to_try',
                                    label: 'Want to Try',
                                    color: '#3b82f6',
                                  },
                                  {
                                    key: 'not_interested',
                                    label: 'Not Interested',
                                    color: '#ef4444',
                                  },
                                  {
                                    key: 'would_use_again',
                                    label: 'Would Use Again',
                                    color: '#10b981',
                                  },
                                  {
                                    key: 'would_not_use',
                                    label: 'Would Not Use',
                                    color: '#f59e0b',
                                  },
                                ]

                                return (
                                  <Card key={question.id} className="p-6">
                                    <CardHeader>
                                      <CardTitle>{question.title}</CardTitle>
                                    </CardHeader>
                                    <ResponsiveContainer
                                      width="100%"
                                      height={300}
                                    >
                                      <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                          dataKey="week"
                                          angle={-45}
                                          textAnchor="end"
                                          height={80}
                                          tick={{ fontSize: 11 }}
                                        />
                                        <YAxis
                                          tick={{ fontSize: 11 }}
                                          label={{
                                            value: 'Percentage (%)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: { fontSize: 11 },
                                          }}
                                        />
                                        <Tooltip
                                          contentStyle={
                                            customTooltipContentStyle
                                          }
                                          labelStyle={customTooltipLabelStyle}
                                        />
                                        <Legend
                                          wrapperStyle={customLegendStyle}
                                        />
                                        {experienceMetrics.map(metric => (
                                          <Line
                                            key={metric.key}
                                            type="monotone"
                                            dataKey={`q_${question.id}_${metric.key}`}
                                            name={metric.label}
                                            stroke={metric.color}
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                            activeDot={{ r: 5 }}
                                            animationDuration={0}
                                          />
                                        ))}
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </Card>
                                )

                              case 'TEXT':
                                return (
                                  <Card key={question.id} className="p-6">
                                    <CardHeader>
                                      <CardTitle>{question.title}</CardTitle>
                                    </CardHeader>
                                    <ResponsiveContainer
                                      width="100%"
                                      height={300}
                                    >
                                      <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                          dataKey="week"
                                          angle={-45}
                                          textAnchor="end"
                                          height={80}
                                          tick={{ fontSize: 11 }}
                                        />
                                        <YAxis
                                          tick={{ fontSize: 11 }}
                                          label={{
                                            value: 'Response Count',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: { fontSize: 11 },
                                          }}
                                        />
                                        <Tooltip
                                          contentStyle={
                                            customTooltipContentStyle
                                          }
                                          labelStyle={customTooltipLabelStyle}
                                        />
                                        <Legend
                                          wrapperStyle={customLegendStyle}
                                        />
                                        <Bar
                                          dataKey={`q_${question.id}_count`}
                                          name="Text Responses"
                                          fill="#8b5cf6"
                                          animationDuration={0}
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </Card>
                                )

                              default:
                                return null
                            }
                          })}
                          {!tabQuestionsByCategory[category] && (
                            <Card className="p-6">
                              <p className="text-muted-foreground text-center">
                                No questions found for this category
                              </p>
                            </Card>
                          )}
                        </div>
                      ))
                    )}
                  </>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </div>
  )
}
