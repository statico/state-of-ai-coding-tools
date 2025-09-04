'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { SingleChoiceQuestion } from '@/components/SingleChoiceQuestion'
import { MultipleChoiceQuestion } from '@/components/MultipleChoiceQuestion'
import { RatingQuestion } from '@/components/RatingQuestion'
import { TextQuestion } from '@/components/TextQuestion'
import type { Question, QuestionOption } from '@prisma/client'

interface QuestionWithOptions {
  question: Question
  options: QuestionOption[]
}

interface SurveyResponse {
  questionId: number
  optionId?: number
  optionIds?: number[]
  textValue?: string
  ratingValue?: number
}

export default function SurveyPage() {
  const { isAuthenticated, survey, session, loading } = useAuth()
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [responses, setResponses] = useState<Record<number, SurveyResponse>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (!loading && isAuthenticated) {
      fetchQuestions()
    }
  }, [loading, isAuthenticated, router])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/survey/questions')
      const data = await response.json()
      
      if (data.success) {
        setQuestions(data.questions)
      } else {
        console.error('Failed to fetch questions')
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateResponse = (questionId: number, responseData: Partial<SurveyResponse>) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        ...responseData,
      }
    }))

    // Clear error for this question
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[questionId]
      return newErrors
    })
  }

  const validateResponses = (): boolean => {
    const newErrors: Record<number, string> = {}
    let isValid = true

    for (const { question } of questions) {
      if (question.isRequired && !responses[question.id]) {
        newErrors[question.id] = 'This question is required'
        isValid = false
        continue
      }

      const response = responses[question.id]
      if (question.isRequired && response) {
        if (question.type === 'SINGLE_CHOICE' && !response.optionId) {
          newErrors[question.id] = 'Please select an option'
          isValid = false
        } else if (question.type === 'MULTIPLE_CHOICE' && (!response.optionIds || response.optionIds.length === 0)) {
          newErrors[question.id] = 'Please select at least one option'
          isValid = false
        } else if (question.type === 'RATING' && !response.ratingValue) {
          newErrors[question.id] = 'Please provide a rating'
          isValid = false
        } else if (question.type === 'TEXT' && (!response.textValue || response.textValue.trim() === '')) {
          newErrors[question.id] = 'Please provide a response'
          isValid = false
        }
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateResponses() || !survey || !session) {
      return
    }

    setIsSubmitting(true)

    try {
      const formattedResponses = Object.values(responses).map(response => {
        const formatted: any = {
          questionId: response.questionId,
        }

        if (response.optionId) formatted.optionId = response.optionId
        if (response.textValue) formatted.textValue = response.textValue
        if (response.ratingValue) formatted.ratingValue = response.ratingValue

        return formatted
      })

      // Generate a session ID from localStorage or create one
      const sessionId = localStorage.getItem('survey_session_id') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      if (!localStorage.getItem('survey_session_id')) {
        localStorage.setItem('survey_session_id', sessionId)
      }

      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          surveyId: survey.id,
          responses: formattedResponses,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/survey/thank-you')
      } else {
        console.error('Failed to submit survey:', data.error)
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Group questions by category
  const questionsByCategory = questions.reduce((acc, questionWithOptions) => {
    const category = questionWithOptions.question.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(questionWithOptions)
    return acc
  }, {} as Record<string, QuestionWithOptions[]>)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{survey?.title}</h1>
              {survey?.description && (
                <p className="mt-2 text-lg text-gray-600">{survey.description}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
                <div key={category} className="border-b border-gray-200 pb-12 last:border-b-0">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 capitalize">
                    {category.replace('_', ' ')}
                  </h2>
                  
                  <div className="space-y-8">
                    {categoryQuestions.map(({ question, options }) => {
                      const response = responses[question.id]
                      const error = errors[question.id]

                      switch (question.type) {
                        case 'SINGLE_CHOICE':
                        case 'DEMOGRAPHIC':
                          return (
                            <SingleChoiceQuestion
                              key={question.id}
                              question={question}
                              options={options}
                              value={response?.optionId}
                              onChange={(optionId) => updateResponse(question.id, { optionId })}
                              error={error}
                            />
                          )

                        case 'MULTIPLE_CHOICE':
                          return (
                            <MultipleChoiceQuestion
                              key={question.id}
                              question={question}
                              options={options}
                              value={response?.optionIds}
                              onChange={(optionIds) => updateResponse(question.id, { optionIds })}
                              error={error}
                            />
                          )

                        case 'RATING':
                          return (
                            <RatingQuestion
                              key={question.id}
                              question={question}
                              value={response?.ratingValue}
                              onChange={(ratingValue) => updateResponse(question.id, { ratingValue })}
                              error={error}
                            />
                          )

                        case 'TEXT':
                          return (
                            <TextQuestion
                              key={question.id}
                              question={question}
                              value={response?.textValue}
                              onChange={(textValue) => updateResponse(question.id, { textValue })}
                              error={error}
                            />
                          )

                        default:
                          return null
                      }
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}