import type { Question } from '@prisma/client'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface TextQuestionProps {
  question: Question
  value?: string
  onChange: (text: string) => void
  error?: string
}

export function TextQuestion({
  question,
  value = '',
  onChange,
  error,
}: TextQuestionProps) {
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
        <Textarea
          rows={4}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter your response..."
          className="w-full"
        />

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
