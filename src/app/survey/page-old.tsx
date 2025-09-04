'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { TabbedSurvey } from '@/components/TabbedSurvey'
import { ShareModal } from '@/components/ShareModal'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
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
  writeInValue?: string
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
        const formatted: Record<string, unknown> = {
          questionId: response.questionId,
        }

        if (response.optionId) formatted.optionId = response.optionId
        if (response.textValue) formatted.textValue = response.textValue
        if (response.ratingValue) formatted.ratingValue = response.ratingValue
        if (response.writeInValue) formatted.writeInValue = response.writeInValue

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

      if (response.ok && (data.success || data.message === 'Responses submitted successfully')) {
        router.push('/survey/thank-you')
      } else {
        console.error('Failed to submit survey:', data.error || 'Unknown error')
        alert(data.error || 'Failed to submit survey. Please try again.')
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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <CardTitle className="text-3xl">{survey?.title || 'Survey'}</CardTitle>
                {survey?.description && (
                  <CardDescription className="text-lg mt-2">{survey.description}</CardDescription>
                )}
              </div>
              <ShareModal />
            </div>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
              {Object.entries(questionsByCategory).map(([category, categoryQuestions], index) => (
                <div key={category}>
                  {index > 0 && <Separator className="my-8" />}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold capitalize">
                      {category.replace(/_/g, ' ')}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {categoryQuestions.filter(q => q.question.isRequired).length} required questions
                    </p>
                  </div>
                  
                  <div className="space-y-6">
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

                        case 'EXPERIENCE':
                          return (
                            <ExperienceQuestion
                              key={question.id}
                              question={question}
                              options={options}
                              value={{
                                optionId: response?.optionId,
                                writeInValue: response?.writeInValue
                              }}
                              onChange={({ optionId, writeInValue }) => 
                                updateResponse(question.id, { optionId, writeInValue })
                              }
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

              {Object.keys(errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Please complete all required questions</AlertTitle>
                  <AlertDescription>
                    There are {Object.keys(errors).length} questions that need your attention.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Survey
                    </>
                  )}
                </Button>
              </div>
            </form>
      </div>
    </div>
  )
}