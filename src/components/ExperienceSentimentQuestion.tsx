'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import type { Question, ExperienceLevel, SentimentScore } from '@prisma/client'

interface ExperienceSentimentQuestionProps {
  question: Question
  value?: {
    experienceLevel?: ExperienceLevel
    sentimentScore?: SentimentScore
    writeInValue?: string
  }
  onChange: (value: {
    experienceLevel?: ExperienceLevel
    sentimentScore?: SentimentScore
    writeInValue?: string
  }) => void
  error?: string
}

const EXPERIENCE_LEVELS = [
  {
    value: 'NEVER_HEARD' as ExperienceLevel,
    label: 'Never heard',
    description: 'Never heard of it',
    color:
      'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700',
  },
  {
    value: 'HEARD_OF' as ExperienceLevel,
    label: 'Heard of it',
    description: 'Heard of it but never used',
    color:
      'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800',
  },
  {
    value: 'USED_BEFORE' as ExperienceLevel,
    label: 'Used before',
    description: 'Used it before but not currently',
    color:
      'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800',
  },
  {
    value: 'CURRENTLY_USING' as ExperienceLevel,
    label: 'Currently using',
    description: 'Currently using in projects',
    color:
      'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800',
  },
  {
    value: 'WOULD_USE_AGAIN' as ExperienceLevel,
    label: 'Would use again',
    description: 'Would use again / recommend',
    color:
      'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800',
  },
]

const SENTIMENT_SCORES = [
  {
    value: 'VERY_NEGATIVE' as SentimentScore,
    label: '😞',
    description: 'Very negative',
    color: 'bg-red-500 hover:bg-red-600 text-white',
  },
  {
    value: 'NEGATIVE' as SentimentScore,
    label: '🙁',
    description: 'Negative',
    color: 'bg-orange-500 hover:bg-orange-600 text-white',
  },
  {
    value: 'NEUTRAL' as SentimentScore,
    label: '😐',
    description: 'Neutral',
    color: 'bg-gray-500 hover:bg-gray-600 text-white',
  },
  {
    value: 'POSITIVE' as SentimentScore,
    label: '🙂',
    description: 'Positive',
    color: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  {
    value: 'VERY_POSITIVE' as SentimentScore,
    label: '😄',
    description: 'Very positive',
    color: 'bg-green-500 hover:bg-green-600 text-white',
  },
]

export function ExperienceSentimentQuestion({
  question,
  value,
  onChange,
  error,
}: ExperienceSentimentQuestionProps) {
  const handleExperienceClick = (experienceLevel: ExperienceLevel) => {
    onChange({
      ...value,
      experienceLevel,
    })
  }

  const handleSentimentClick = (sentimentScore: SentimentScore) => {
    onChange({
      ...value,
      sentimentScore,
    })
  }

  const handleWriteInChange = (writeInValue: string) => {
    onChange({
      ...value,
      writeInValue,
    })
  }

  const showSentiment =
    value?.experienceLevel &&
    value.experienceLevel !== 'NEVER_HEARD' &&
    value.experienceLevel !== 'HEARD_OF'

  return (
    <Card className={cn(error && 'border-destructive')}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Label className="text-lg font-semibold">
              {question.title}
              {question.isRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {question.description && (
              <CardDescription className="mt-1">
                {question.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Experience Level Selection */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            What&apos;s your experience with this tool?
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {EXPERIENCE_LEVELS.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleExperienceClick(level.value)}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all',
                  'flex flex-col items-center justify-center text-center',
                  'min-h-[80px]',
                  value?.experienceLevel === level.value
                    ? cn(level.color, 'border-primary ring-2 ring-primary/20')
                    : cn('border-gray-200 dark:border-gray-700', level.color)
                )}
              >
                <div className="font-medium text-sm">{level.label}</div>
                <div className="text-xs opacity-75 mt-1">
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sentiment Score Selection - Only show if user has used the tool */}
        {showSentiment && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <Label className="text-sm font-medium mb-3 block">
              How do you feel about it?
            </Label>
            <div className="flex gap-2 justify-center">
              {SENTIMENT_SCORES.map(sentiment => (
                <button
                  key={sentiment.value}
                  type="button"
                  onClick={() => handleSentimentClick(sentiment.value)}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all flex-1 max-w-[100px]',
                    'flex flex-col items-center justify-center',
                    value?.sentimentScore === sentiment.value
                      ? cn(
                          sentiment.color,
                          'border-primary ring-2 ring-primary/20'
                        )
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  )}
                >
                  <div className="text-2xl mb-1">{sentiment.label}</div>
                  <div className="text-xs">{sentiment.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Notes section - always visible */}
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-sm font-medium">
            Notes & Feedback (optional)
          </Label>
          <Textarea
            placeholder={`Share your experience with ${question.title}...`}
            value={value?.writeInValue || ''}
            onChange={e => handleWriteInChange(e.target.value)}
            className="min-h-[80px] resize-y"
          />
          <p className="text-xs text-muted-foreground">
            Any specific thoughts, use cases, or feedback about this tool
          </p>
        </div>

        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}
