import type { Question, QuestionOption } from '@prisma/client'

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

      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.id} className="flex items-start">
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <div className="ml-3">
              <span className="text-sm text-gray-900">{option.label}</span>
              {option.description && (
                <p className="text-xs text-gray-500">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}