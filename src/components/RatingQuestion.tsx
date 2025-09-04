import { StarIcon } from '@radix-ui/react-icons'
import type { Question } from '@prisma/client'

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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">
          {question.title}
          {question.isRequired && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {question.description && (
          <p className="mt-1 text-sm text-gray-600">{question.description}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`p-1 hover:scale-110 transition-transform ${
              value && value >= rating
                ? 'text-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <StarIcon className="h-8 w-8 fill-current" />
          </button>
        ))}
        {value && (
          <span className="ml-2 text-sm text-gray-600">
            {value} out of 5 stars
          </span>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}