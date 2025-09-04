'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Question, QuestionOption } from '@prisma/client'

interface ExperienceQuestionProps {
  question: Question
  options: QuestionOption[]
  value?: { optionId?: number; writeInValue?: string }
  onChange: (value: { optionId?: number; writeInValue?: string }) => void
  error?: string
}

const EXPERIENCE_OPTIONS = [
  { id: 1, value: 'never_heard', label: 'Never heard of it', emoji: '❓' },
  { id: 2, value: 'heard_not_interested', label: "Heard of it, but I'm not interested", emoji: '🚫' },
  { id: 3, value: 'used_wont_use_again', label: "Used it, but wouldn't use it again", emoji: '👎' },
  { id: 4, value: 'used_would_use_again', label: 'Used it and would use it again', emoji: '👍' },
]

export function ExperienceQuestion({
  question,
  options,
  value,
  onChange,
  error,
}: ExperienceQuestionProps) {
  const [showWriteIn, setShowWriteIn] = useState(false)
  const [writeInValue, setWriteInValue] = useState(value?.writeInValue || '')
  
  const handleOptionChange = (optionValue: string) => {
    const option = EXPERIENCE_OPTIONS.find(o => o.value === optionValue)
    if (option) {
      onChange({ 
        optionId: option.id,
        writeInValue: showWriteIn ? writeInValue : undefined
      })
    }
  }
  
  const handleWriteInChange = (text: string) => {
    setWriteInValue(text)
    if (value?.optionId) {
      onChange({
        optionId: value.optionId,
        writeInValue: text
      })
    }
  }
  
  const selectedOption = value?.optionId 
    ? EXPERIENCE_OPTIONS.find(o => o.id === value.optionId)
    : null

  return (
    <Card className={cn(error && "border-destructive")}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Label className="text-base font-medium">
              {question.title}
              {question.isRequired && <span className="text-destructive ml-1">*</span>}
            </Label>
            {question.description && (
              <CardDescription className="mt-1">{question.description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedOption?.value || ''}
          onValueChange={handleOptionChange}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXPERIENCE_OPTIONS.map((option) => (
              <div 
                key={option.id}
                className={cn(
                  "flex items-start space-x-3 rounded-lg border p-3 transition-colors cursor-pointer",
                  selectedOption?.id === option.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                )}
                onClick={() => handleOptionChange(option.value)}
              >
                <RadioGroupItem 
                  value={option.value} 
                  id={`${question.id}-${option.value}`}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`${question.id}-${option.value}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        
        {/* Optional write-in section for custom tools */}
        {question.title.toLowerCase().includes('other') && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${question.id}-write-in`}
                checked={showWriteIn}
                onChange={(e) => setShowWriteIn(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor={`${question.id}-write-in`} className="text-sm">
                Add a custom tool or specify details
              </Label>
            </div>
            {showWriteIn && (
              <Input
                placeholder="Enter tool name or additional details..."
                value={writeInValue}
                onChange={(e) => handleWriteInChange(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        )}
        
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}