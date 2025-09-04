import type { Question } from '@prisma/client'

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

      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your response..."
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}