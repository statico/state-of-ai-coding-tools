import type { Question, QuestionOption } from '@prisma/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface MultipleChoiceQuestionProps {
  question: Question
  options: QuestionOption[]
  value?: number[]
  onChange: (optionIds: number[]) => void
  error?: string
}

export function MultipleChoiceQuestion({
  question,
  options,
  value = [],
  onChange,
  error,
}: MultipleChoiceQuestionProps) {
  const handleChange = (optionId: number, checked: boolean) => {
    if (checked) {
      onChange([...value, optionId])
    } else {
      onChange(value.filter((id) => id !== optionId))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {question.title}
          {question.isRequired && <span className="text-red-500 ml-1">*</span>}
        </CardTitle>
        {question.description && (
          <CardDescription>{question.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="flex items-start space-x-3">
              <Checkbox
                id={`option-${option.id}`}
                checked={value.includes(option.id)}
                onCheckedChange={(checked) => handleChange(option.id, !!checked)}
                className="mt-0.5"
              />
              <Label
                htmlFor={`option-${option.id}`}
                className="flex-1 cursor-pointer"
              >
                <span className="font-medium">{option.label}</span>
                {option.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                )}
              </Label>
            </div>
          ))}
        </div>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}