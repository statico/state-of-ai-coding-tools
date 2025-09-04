import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MultipleChoiceQuestion } from '@/components/MultipleChoiceQuestion'
import type { Question, QuestionOption, QuestionType } from '@prisma/client'

const mockQuestion: Question = {
  id: 1,
  title: 'Which AI tools do you use?',
  description: 'Select all that apply',
  type: 'MULTIPLE_CHOICE' as QuestionType,
  category: 'tools',
  orderIndex: 1,
  isRequired: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockOptions: QuestionOption[] = [
  {
    id: 1,
    questionId: 1,
    value: 'copilot',
    label: 'GitHub Copilot',
    description: null,
    orderIndex: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    questionId: 1,
    value: 'chatgpt',
    label: 'ChatGPT',
    description: null,
    orderIndex: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

describe('MultipleChoiceQuestion', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders question title and description', () => {
    render(
      <MultipleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('Which AI tools do you use?')).toBeInTheDocument()
    expect(screen.getByText('Select all that apply')).toBeInTheDocument()
  })

  it('adds option to selection when checked', () => {
    render(
      <MultipleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        value={[]}
        onChange={mockOnChange}
      />
    )

    const checkbox = screen.getByRole('checkbox', { name: /GitHub Copilot/i })
    fireEvent.click(checkbox)

    expect(mockOnChange).toHaveBeenCalledWith([1])
  })

  it('removes option from selection when unchecked', () => {
    render(
      <MultipleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        value={[1, 2]}
        onChange={mockOnChange}
      />
    )

    const checkbox = screen.getByRole('checkbox', { name: /GitHub Copilot/i })
    fireEvent.click(checkbox)

    expect(mockOnChange).toHaveBeenCalledWith([2])
  })

  it('shows selected options as checked', () => {
    render(
      <MultipleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        value={[1]}
        onChange={mockOnChange}
      />
    )

    const copilotCheckbox = screen.getByRole('checkbox', { name: /GitHub Copilot/i })
    const chatgptCheckbox = screen.getByRole('checkbox', { name: /ChatGPT/i })

    expect(copilotCheckbox).toBeChecked()
    expect(chatgptCheckbox).not.toBeChecked()
  })
})