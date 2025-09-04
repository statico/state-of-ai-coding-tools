'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Question, QuestionOption } from '@prisma/client'

interface SelectQuestionProps {
  question: Question
  options: QuestionOption[]
  value?: number
  onChange: (value: number) => void
  error?: string
}

export function SelectQuestion({
  question,
  options,
  value,
  onChange,
  error,
}: SelectQuestionProps) {
  const handleChange = (optionValue: string) => {
    const option = options.find(o => o.value === optionValue)
    if (option) {
      onChange(option.id)
    }
  }

  const selectedOption = value ? options.find(o => o.id === value) : null

  return (
    <Card className={cn(error && 'border-destructive')}>
      <CardHeader>
        <Label className="text-base font-medium">
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
      </CardHeader>
      <CardContent>
        <Select
          value={selectedOption?.value || ''}
          onValueChange={handleChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {options.map(option => (
              <SelectItem key={option.id} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </CardContent>
    </Card>
  )
}
