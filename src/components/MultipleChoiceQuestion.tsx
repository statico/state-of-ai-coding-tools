import type { Question, QuestionOption } from '@prisma/client'

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
              type="checkbox"
              name={`question-${question.id}`}
              value={option.id}
              checked={value.includes(option.id)}
              onChange={(e) => handleChange(option.id, e.target.checked)}
              className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
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