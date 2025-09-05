'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart } from '@/components/BarChart'
import { PieChart } from '@/components/PieChart'
import { RatingChart } from '@/components/RatingChart'
import { ExperienceChart } from '@/components/ExperienceChart'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ResultData {
  questionId: number
  questionTitle: string
  questionType: string
  results: Array<{
    optionId?: number
    optionLabel?: string
    count: number
    percentage: number
  }>
}

interface Survey {
  id: number
  title: string
  description: string | null
}

export default function ResultsPage() {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [results, setResults] = useState<ResultData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentWeek, setCurrentWeek] = useState(0) // 0 = current week, -1 = last week, etc.

  useEffect(() => {
    fetchResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek])

  const fetchResults = async () => {
    try {
      setIsLoading(true)
      const params = currentWeek !== 0 ? `?weekOffset=${currentWeek}` : ''
      const response = await fetch(`/api/results${params}`)
      const data = await response.json()

      if (data.success) {
        setSurvey(data.survey)
        setResults(data.results)
      } else {
        setError(data.error || 'Failed to fetch results')
      }
    } catch (err) {
      setError('Network error')
      console.error('Error fetching results:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getWeekLabel = () => {
    const today = new Date()
    const weekStart = new Date(today)
    const weekEnd = new Date(today)

    // Calculate start of week (Monday)
    const dayOfWeek = today.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    weekStart.setDate(today.getDate() - daysToMonday + currentWeek * 7)

    // Calculate end of week (Sunday)
    weekEnd.setDate(weekStart.getDate() + 6)

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }

    const startStr = weekStart.toLocaleDateString('en-US', formatOptions)
    const endStr = weekEnd.toLocaleDateString('en-US', formatOptions)

    // If same month and year, show simplified format
    if (
      weekStart.getMonth() === weekEnd.getMonth() &&
      weekStart.getFullYear() === weekEnd.getFullYear()
    ) {
      const monthYear = weekEnd.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      const startDay = weekStart.getDate()
      const endDay = weekEnd.getDate()
      return `${monthYear.split(' ')[0]} ${startDay} - ${endDay}, ${monthYear.split(' ')[1]}`
    }

    return `${startStr} - ${endStr}`
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
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  if (!survey || results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            No Results
          </h1>
          <p className="text-muted-foreground mb-4">
            No survey responses have been submitted yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  // Group results by category
  const resultsByCategory = results.reduce(
    (acc, result) => {
      // Determine category from question title or assume based on content
      let category = 'other'
      const title = result.questionTitle.toLowerCase()

      if (
        title.includes('experience') ||
        title.includes('company') ||
        title.includes('size')
      ) {
        category = 'demographics'
      } else if (
        title.includes('tool') ||
        title.includes('language') ||
        title.includes('coding')
      ) {
        category = 'tools'
      } else if (
        title.includes('satisfied') ||
        title.includes('rating') ||
        title.includes('rate')
      ) {
        category = 'satisfaction'
      } else if (title.includes('feedback') || title.includes('improvement')) {
        category = 'feedback'
      }

      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(result)
      return acc
    },
    {} as Record<string, ResultData[]>
  )

  const totalResponses =
    results.length > 0
      ? Math.max(
          ...results.map(r =>
            r.results.reduce((sum, res) => sum + res.count, 0)
          )
        )
      : 0

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {survey.title} - Results
          </h1>
          {survey.description && (
            <p className="mt-2 text-lg text-muted-foreground">
              {survey.description}
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            Total responses: {totalResponses}
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            ← Return Home
          </Link>

          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeek(currentWeek - 1)}
              className="p-2 border border-border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentWeek < -52}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="px-4 py-2 min-w-[140px] text-center border border-border rounded-md bg-card">
              <span className="font-medium">{getWeekLabel()}</span>
            </div>

            <button
              onClick={() => setCurrentWeek(currentWeek + 1)}
              className="p-2 border border-border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentWeek >= 0}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Link
            href="/trends"
            className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            View Trends →
          </Link>
        </div>

        {/* Results by Category */}
        {Object.entries(resultsByCategory).map(
          ([category, categoryResults]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 capitalize">
                {category.replace('_', ' ')}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categoryResults
                  .filter(result => result.questionType !== 'EXPERIENCE')
                  .map(result => {
                    const chartData = result.results.map(res => ({
                      name: res.optionLabel || 'No answer',
                      value: res.count,
                      percentage: res.percentage,
                    }))

                    switch (result.questionType) {
                      case 'SINGLE_CHOICE':
                      case 'DEMOGRAPHIC':
                        return (
                          <PieChart
                            key={result.questionId}
                            data={chartData}
                            title={result.questionTitle}
                          />
                        )

                      case 'MULTIPLE_CHOICE':
                        return (
                          <BarChart
                            key={result.questionId}
                            data={chartData}
                            title={result.questionTitle}
                          />
                        )

                      case 'RATING':
                        return (
                          <RatingChart
                            key={result.questionId}
                            data={result.results}
                            title={result.questionTitle}
                          />
                        )

                      case 'TEXT':
                        return (
                          <div
                            key={result.questionId}
                            className="bg-card p-6 rounded-lg shadow"
                          >
                            <h3 className="text-lg font-medium text-card-foreground mb-4">
                              {result.questionTitle}
                            </h3>
                            <div className="text-center py-8">
                              <div className="text-3xl font-bold text-primary mb-2">
                                {result.results[0]?.count || 0}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Text responses submitted
                              </div>
                            </div>
                          </div>
                        )

                      default:
                        return null
                    }
                  })}
              </div>

              {/* Experience Questions */}
              {(() => {
                const experienceResults = categoryResults.filter(
                  result => result.questionType === 'EXPERIENCE'
                )

                if (experienceResults.length === 0) return null

                // Transform experience data for chart
                const experienceData = experienceResults.map(result => {
                  const counts = {
                    neverHeard: 0,
                    wantToTry: 0,
                    notInterested: 0,
                    wouldUseAgain: 0,
                    wouldNotUse: 0,
                    total: 0,
                  }

                  result.results.forEach(res => {
                    const exp = res.optionLabel
                    counts.total += res.count

                    switch (exp) {
                      case 'NEVER_HEARD':
                        counts.neverHeard = res.count
                        break
                      case 'WANT_TO_TRY':
                        counts.wantToTry = res.count
                        break
                      case 'NOT_INTERESTED':
                        counts.notInterested = res.count
                        break
                      case 'WOULD_USE_AGAIN':
                        counts.wouldUseAgain = res.count
                        break
                      case 'WOULD_NOT_USE':
                        counts.wouldNotUse = res.count
                        break
                    }
                  })

                  return {
                    toolName: result.questionTitle.replace(
                      'Experience with ',
                      ''
                    ),
                    ...counts,
                  }
                })

                if (experienceData.length > 0) {
                  return (
                    <ExperienceChart
                      data={experienceData}
                      title="Tool Experience"
                    />
                  )
                }

                return null
              })()}
            </div>
          )
        )}
      </div>
    </div>
  )
}
