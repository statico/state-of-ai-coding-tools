'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { TabbedSurvey } from '@/components/TabbedSurvey'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle } from 'lucide-react'
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
  const { isAuthenticated, survey, loading } = useAuth()
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [submissionMessage, setSubmissionMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth')
      return
    }

    if (!loading && isAuthenticated) {
      fetchQuestions()
      checkExistingSubmission()
    }
  }, [loading, isAuthenticated, router])

  const checkExistingSubmission = async () => {
    const sessionId = localStorage.getItem('survey_session_id')
    if (!sessionId) return

    try {
      const response = await fetch('/api/survey/check-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })
      const data = await response.json()

      if (data.hasSubmitted) {
        setHasSubmitted(true)
        setSubmissionMessage(
          data.message ||
            'You have already submitted your responses for this week'
        )
      }
    } catch (error) {
      console.error('Error checking submission:', error)
    }
  }

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

  const handleSubmit = async (responses: Record<number, SurveyResponse>) => {
    if (!survey) return

    const formattedResponses = Object.values(responses).map(response => {
      const formatted: Record<string, unknown> = {
        questionId: response.questionId,
      }

      if (response.optionId) formatted.optionId = response.optionId
      if (response.optionIds) formatted.optionIds = response.optionIds
      if (response.textValue) formatted.textValue = response.textValue
      if (response.ratingValue) formatted.ratingValue = response.ratingValue
      if (response.writeInValue) formatted.writeInValue = response.writeInValue

      return formatted
    })

    // Generate a session ID
    const sessionId =
      localStorage.getItem('survey_session_id') ||
      `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

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

    if (
      response.ok &&
      (data.success || data.message === 'Responses submitted successfully')
    ) {
      router.push('/survey/thank-you')
    } else {
      throw new Error(data.error || 'Failed to submit survey')
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <div>
              <CardTitle className="text-3xl">
                {survey?.title || 'AI Coding Tools Weekly Survey'}
              </CardTitle>
              {survey?.description && (
                <CardDescription className="text-lg mt-2">
                  {survey.description}
                </CardDescription>
              )}
              {hasSubmitted && (
                <Alert className="mt-4 border-green-500 bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-300" />
                  <AlertDescription className="text-green-900 dark:text-green-100">
                    {submissionMessage ||
                      'You have already submitted your responses for this week'}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className="p-6">
          <TabbedSurvey
            questions={questions}
            onSubmit={handleSubmit}
            hasSubmitted={hasSubmitted}
            submissionMessage={submissionMessage}
          />
        </Card>
      </div>
    </div>
  )
}
