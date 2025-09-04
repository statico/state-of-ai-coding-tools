import { Star } from 'lucide-react'
import type { Question } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RatingQuestionProps {
  question: Question
  value?: number
  onChange: (rating: number) => void
  error?: string
}

export function RatingQuestion({
  question,
  value,
  onChange,
  error,
}: RatingQuestionProps) {
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
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => onChange(rating)}
              className="p-2 hover:scale-110 transition-all"
            >
              <Star
                className={cn(
                  "h-8 w-8 transition-colors",
                  value && value >= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-300"
                )}
              />
            </Button>
          ))}
          {value && (
            <span className="ml-4 text-sm text-muted-foreground">
              {value} out of 5 stars
            </span>
          )}
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