import type { Question, QuestionOption } from '@prisma/client'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface SingleChoiceQuestionProps {
  question: Question
  options: QuestionOption[]
  value?: number
  onChange: (optionId: number) => void
  error?: string
}

export function SingleChoiceQuestion({
  question,
  options,
  value,
  onChange,
  error,
}: SingleChoiceQuestionProps) {
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
        <RadioGroup
          value={value?.toString()}
          onValueChange={(val) => onChange(parseInt(val))}
        >
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${option.id}`}
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
        </RadioGroup>
        
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