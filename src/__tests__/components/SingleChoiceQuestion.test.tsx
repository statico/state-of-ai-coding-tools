import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { SingleChoiceQuestion } from '@/components/SingleChoiceQuestion'
import type { Question, QuestionOption, QuestionType } from '@prisma/client'

const mockQuestion: Question = {
  id: 1,
  title: 'What is your favorite programming language?',
  description: 'Please select one option',
  type: 'SINGLE_CHOICE' as QuestionType,
  category: 'preferences',
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
    value: 'javascript',
    label: 'JavaScript',
    description: 'The language of the web',
    orderIndex: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    questionId: 1,
    value: 'python',
    label: 'Python',
    description: 'Simple and powerful',
    orderIndex: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

describe('SingleChoiceQuestion', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders question title and description', () => {
    render(
      <SingleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('What is your favorite programming language?')).toBeInTheDocument()
    expect(screen.getByText('Please select one option')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument() // Required indicator
  })

  it('renders all options with labels and descriptions', () => {
    render(
      <SingleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('The language of the web')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('Simple and powerful')).toBeInTheDocument()
  })

  it('calls onChange when an option is selected', () => {
    render(
      <SingleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        onChange={mockOnChange}
      />
    )

    const radioButton = screen.getByRole('radio', { name: /JavaScript/i })
    fireEvent.click(radioButton)

    expect(mockOnChange).toHaveBeenCalledWith(1)
  })

  it('shows selected option as checked', () => {
    render(
      <SingleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        value={2}
        onChange={mockOnChange}
      />
    )

    const pythonRadio = screen.getByRole('radio', { name: /Python/i })
    const javascriptRadio = screen.getByRole('radio', { name: /JavaScript/i })

    expect(pythonRadio).toBeChecked()
    expect(javascriptRadio).not.toBeChecked()
  })

  it('displays error message when provided', () => {
    render(
      <SingleChoiceQuestion
        question={mockQuestion}
        options={mockOptions}
        onChange={mockOnChange}
        error="This field is required"
      />
    )

    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })
})