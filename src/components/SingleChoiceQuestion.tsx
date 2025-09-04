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
          <div className="space-y-2">
            {options.map((option) => (
              <Label
                key={option.id}
                htmlFor={`option-${option.id}`}
                className="flex items-center space-x-3 p-4 rounded-lg border border-transparent hover:border-border hover:bg-accent/50 transition-all cursor-pointer -mx-2"
              >
                <RadioGroupItem
                  value={option.id.toString()}
                  id={`option-${option.id}`}
                  className="h-5 w-5 flex-shrink-0"
                />
                <div className="flex-1">
                  <span className="font-medium block">{option.label}</span>
                  {option.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  )}
                </div>
              </Label>
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