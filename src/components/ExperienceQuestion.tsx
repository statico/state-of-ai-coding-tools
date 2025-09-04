'use client'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Question, Experience } from '@prisma/client'

interface ExperienceQuestionProps {
  question: Question
  value?: {
    experience?: Experience
    writeInValue?: string
  }
  onChange: (value: { experience?: Experience; writeInValue?: string }) => void
  error?: string
}

const EXPERIENCE_OPTIONS = [
  {
    value: 'NEVER_HEARD' as Experience,
    emoji: '🤷',
    label: 'Never heard of it',
    shortLabel: 'Never heard',
    activeClass: 'bg-muted/50 border-muted-foreground/50',
  },
  {
    value: 'WANT_TO_TRY' as Experience,
    emoji: '✅',
    label: 'Heard of it, would like to try',
    shortLabel: 'Want to try',
    activeClass:
      'bg-green-100 dark:bg-green-950 border-green-600 dark:border-green-400',
  },
  {
    value: 'NOT_INTERESTED' as Experience,
    emoji: '🚫',
    label: 'Heard of it, not interested',
    shortLabel: 'Not interested',
    activeClass:
      'bg-orange-100 dark:bg-orange-950 border-orange-600 dark:border-orange-400',
  },
  {
    value: 'WOULD_USE_AGAIN' as Experience,
    emoji: '👍',
    label: 'Used it, would use again',
    shortLabel: 'Would use again',
    activeClass:
      'bg-blue-100 dark:bg-blue-950 border-blue-600 dark:border-blue-400',
  },
  {
    value: 'WOULD_NOT_USE' as Experience,
    emoji: '👎',
    label: 'Used it, would not use again',
    shortLabel: 'Would not use',
    activeClass:
      'bg-red-100 dark:bg-red-950 border-red-600 dark:border-red-400',
  },
]

export function ExperienceQuestion({
  question,
  value,
  onChange,
  error,
}: ExperienceQuestionProps) {
  const [showNotes, setShowNotes] = useState(false)

  const handleExperienceClick = (experience: Experience) => {
    onChange({
      ...value,
      experience,
    })
  }

  const handleWriteInChange = (writeInValue: string) => {
    onChange({
      ...value,
      writeInValue,
    })
  }

  return (
    <Card className={cn('overflow-hidden', error && 'border-destructive')}>
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Label className="text-lg font-medium">
              {question.title}
              {question.isRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {question.description && (
              <CardDescription className="mt-0.5">
                {question.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-3">
        {/* Experience Selection - Compact horizontal buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
          {EXPERIENCE_OPTIONS.map(option => {
            const isSelected = value?.experience === option.value
            return (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleExperienceClick(option.value)}
                className={cn(
                  'h-auto py-2 px-2 flex flex-col items-center justify-center text-center',
                  'min-h-[60px]',
                  'border-2',
                  isSelected ? option.activeClass : 'bg-background'
                )}
              >
                <div className="text-base leading-none mb-1">
                  {option.emoji}
                </div>
                <div className="text-[11px] leading-tight font-normal">
                  <div className="sm:hidden">{option.shortLabel}</div>
                  <div className="hidden sm:block">{option.label}</div>
                </div>
              </Button>
            )
          })}
        </div>

        {/* Notes section - collapsible with more space */}
        <div className="mt-3 pt-1">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showNotes ? (
              <>
                <ChevronUp className="h-3 w-3" />
                Hide notes/feedback
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                Add notes/feedback...
              </>
            )}
          </button>

          {showNotes && (
            <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
              <Textarea
                placeholder={`Share your thoughts about ${question.title}...`}
                value={value?.writeInValue || ''}
                onChange={e => handleWriteInChange(e.target.value)}
                className="min-h-[60px] text-sm resize-y"
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}
