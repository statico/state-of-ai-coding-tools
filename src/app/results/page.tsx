'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart } from '@/components/BarChart'
import { PieChart } from '@/components/PieChart'
import { RatingChart } from '@/components/RatingChart'

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

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results')
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
          <h1 className="text-2xl font-bold text-foreground mb-4">No Results</h1>
          <p className="text-muted-foreground mb-4">No survey responses have been submitted yet.</p>
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
  const resultsByCategory = results.reduce((acc, result) => {
    // Determine category from question title or assume based on content
    let category = 'other'
    const title = result.questionTitle.toLowerCase()
    
    if (title.includes('experience') || title.includes('company') || title.includes('size')) {
      category = 'demographics'
    } else if (title.includes('tool') || title.includes('language') || title.includes('coding')) {
      category = 'tools'
    } else if (title.includes('satisfied') || title.includes('rating') || title.includes('rate')) {
      category = 'satisfaction'
    } else if (title.includes('feedback') || title.includes('improvement')) {
      category = 'feedback'
    }
    
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(result)
    return acc
  }, {} as Record<string, ResultData[]>)

  const totalResponses = results.length > 0 ? 
    Math.max(...results.map(r => r.results.reduce((sum, res) => sum + res.count, 0))) : 0

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">{survey.title} - Results</h1>
          {survey.description && (
            <p className="mt-2 text-lg text-muted-foreground">{survey.description}</p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            Total responses: {totalResponses}
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
          >
            ← Return Home
          </Link>
        </div>

        {/* Results by Category */}
        {Object.entries(resultsByCategory).map(([category, categoryResults]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 capitalize">
              {category.replace('_', ' ')}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categoryResults.map((result) => {
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
                      <div key={result.questionId} className="bg-card p-6 rounded-lg shadow">
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
          </div>
        ))}
      </div>
    </div>
  )
}