'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SingleChoiceQuestion } from '@/components/SingleChoiceQuestion'
import { MultipleChoiceQuestion } from '@/components/MultipleChoiceQuestion'
import { RatingQuestion } from '@/components/RatingQuestion'
import { TextQuestion } from '@/components/TextQuestion'
import { ExperienceQuestion } from '@/components/ExperienceQuestion'
import { SelectQuestion } from '@/components/SelectQuestion'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import type { Question, QuestionOption, Experience } from '@prisma/client'

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
  experience?: string
}

interface TabbedSurveyProps {
  questions: QuestionWithOptions[]
  onSubmit: (responses: Record<number, SurveyResponse>) => Promise<void>
  hasSubmitted?: boolean
  submissionMessage?: string
}

const TAB_SECTIONS = [
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

export function TabbedSurvey({
  questions,
  onSubmit,
  hasSubmitted = false,
  submissionMessage = '',
}: TabbedSurveyProps) {
  const [activeTab, setActiveTab] = useState(TAB_SECTIONS[0].id)
  const [responses, setResponses] = useState<Record<number, SurveyResponse>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Smooth scroll to top of survey
  const scrollToSurvey = () => {
    // Find the survey container and scroll it into view
    const surveyElement = document.querySelector('[role="tabpanel"]')
    if (surveyElement) {
      const yOffset = -20 // Small offset from top
      const y =
        surveyElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    } else {
      // Fallback to scrolling to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const currentTabIndex = TAB_SECTIONS.findIndex(tab => tab.id === activeTab)
  const isLastTab = currentTabIndex === TAB_SECTIONS.length - 1
  const isFirstTab = currentTabIndex === 0

  // Group questions by category
  const questionsByCategory = questions.reduce(
    (acc, q) => {
      const category = q.question.category.toLowerCase()
      if (!acc[category]) acc[category] = []
      acc[category].push(q)
      return acc
    },
    {} as Record<string, QuestionWithOptions[]>
  )

  // Get questions for current tab
  const getCurrentTabQuestions = () => {
    const currentTab = TAB_SECTIONS[currentTabIndex]
    const tabQuestions: QuestionWithOptions[] = []

    currentTab.categories.forEach(category => {
      const categoryQuestions = questionsByCategory[category] || []
      tabQuestions.push(...categoryQuestions)
    })

    return tabQuestions
  }

  const updateResponse = (
    questionId: number,
    responseData: Partial<SurveyResponse>
  ) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        ...responseData,
      },
    }))

    // Clear error for this question
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[questionId]
      return newErrors
    })
  }

  const validateCurrentTab = (): boolean => {
    const tabQuestions = getCurrentTabQuestions()
    const newErrors: Record<number, string> = {}
    let isValid = true

    for (const { question } of tabQuestions) {
      if (question.isRequired && !responses[question.id]) {
        newErrors[question.id] = 'This question is required'
        isValid = false
        continue
      }

      const response = responses[question.id]
      if (question.isRequired && response) {
        if (
          (question.type === 'SINGLE_CHOICE' ||
            question.type === 'EXPERIENCE') &&
          !response.optionId
        ) {
          newErrors[question.id] = 'Please select an option'
          isValid = false
        } else if (
          question.type === 'MULTIPLE_CHOICE' &&
          (!response.optionIds || response.optionIds.length === 0)
        ) {
          newErrors[question.id] = 'Please select at least one option'
          isValid = false
        } else if (question.type === 'RATING' && !response.ratingValue) {
          newErrors[question.id] = 'Please provide a rating'
          isValid = false
        } else if (
          question.type === 'TEXT' &&
          (!response.textValue || response.textValue.trim() === '')
        ) {
          newErrors[question.id] = 'Please provide a response'
          isValid = false
        } else if (question.type === 'EXPERIENCE' && !response.experience) {
          newErrors[question.id] = 'Please select your experience level'
          isValid = false
        }
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateCurrentTab()) {
      setCompletedTabs(prev => new Set(Array.from(prev).concat(activeTab)))
      const nextTab = TAB_SECTIONS[currentTabIndex + 1]
      if (nextTab) {
        setActiveTab(nextTab.id)
        // Small delay to ensure tab content is rendered before scrolling
        setTimeout(() => scrollToSurvey(), 100)
      }
    }
  }

  const handlePrevious = () => {
    const prevTab = TAB_SECTIONS[currentTabIndex - 1]
    if (prevTab) {
      setActiveTab(prevTab.id)
      // Small delay to ensure tab content is rendered before scrolling
      setTimeout(() => scrollToSurvey(), 100)
    }
  }

  const handleSubmit = async () => {
    if (!validateCurrentTab()) {
      return
    }

    setCompletedTabs(prev => new Set(Array.from(prev).concat(activeTab)))
    setIsSubmitting(true)

    try {
      await onSubmit(responses)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestion = ({ question, options }: QuestionWithOptions) => {
    const response = responses[question.id]
    const error = errors[question.id]

    switch (question.type) {
      case 'SINGLE_CHOICE':
      case 'DEMOGRAPHIC':
        // Use SelectQuestion for questions with more than 10 options
        if (options.length > 10) {
          return (
            <SelectQuestion
              key={question.id}
              question={question}
              options={options}
              value={response?.optionId}
              onChange={optionId => updateResponse(question.id, { optionId })}
              error={error}
            />
          )
        }
        return (
          <SingleChoiceQuestion
            key={question.id}
            question={question}
            options={options}
            value={response?.optionId}
            onChange={optionId => updateResponse(question.id, { optionId })}
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
            onChange={optionIds => updateResponse(question.id, { optionIds })}
            error={error}
          />
        )

      case 'RATING':
        return (
          <RatingQuestion
            key={question.id}
            question={question}
            value={response?.ratingValue}
            onChange={ratingValue =>
              updateResponse(question.id, { ratingValue })
            }
            error={error}
          />
        )

      case 'TEXT':
        return (
          <TextQuestion
            key={question.id}
            question={question}
            value={response?.textValue}
            onChange={textValue => updateResponse(question.id, { textValue })}
            error={error}
          />
        )

      case 'EXPERIENCE':
        return (
          <ExperienceQuestion
            key={question.id}
            question={question}
            value={{
              experience: response?.experience as Experience | undefined,
              writeInValue: response?.writeInValue,
            }}
            onChange={({ experience, writeInValue }) =>
              updateResponse(question.id, {
                experience: experience as string,
                writeInValue,
              })
            }
            error={error}
          />
        )

      default:
        return null
    }
  }

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    // Small delay to ensure tab content is rendered before scrolling
    setTimeout(() => scrollToSurvey(), 100)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${TAB_SECTIONS.length}, 1fr)` }}
      >
        {TAB_SECTIONS.map(section => (
          <TabsTrigger
            key={section.id}
            value={section.id}
            className="relative cursor-pointer"
          >
            {completedTabs.has(section.id) && (
              <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
            )}
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {TAB_SECTIONS.map(section => (
        <TabsContent
          key={section.id}
          value={section.id}
          className="space-y-6 mt-6"
        >
          <div className="space-y-6">
            {getCurrentTabQuestions().map(renderQuestion)}
          </div>

          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Please complete all required questions</AlertTitle>
              <AlertDescription>
                There are {Object.keys(errors).length} questions that need your
                attention in this section.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstTab}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {isLastTab ? (
              <div className="flex flex-col items-end gap-2">
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || hasSubmitted}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : hasSubmitted ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Already Submitted
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Survey
                    </>
                  )}
                </Button>
                {hasSubmitted && submissionMessage && (
                  <p className="text-sm text-muted-foreground">
                    {submissionMessage}
                  </p>
                )}
              </div>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
