import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { RatingQuestion } from '@/components/RatingQuestion'
import type { Question, QuestionType } from '@prisma/client'

const mockQuestion: Question = {
  id: 1,
  title: 'How satisfied are you with AI tools?',
  description: 'Rate from 1 to 5 stars',
  type: 'RATING' as QuestionType,
  category: 'satisfaction',
  orderIndex: 1,
  isRequired: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('RatingQuestion', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders question title and description', () => {
    render(
      <RatingQuestion
        question={mockQuestion}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('How satisfied are you with AI tools?')).toBeInTheDocument()
    expect(screen.getByText('Rate from 1 to 5 stars')).toBeInTheDocument()
  })

  it('renders 5 star buttons', () => {
    render(
      <RatingQuestion
        question={mockQuestion}
        onChange={mockOnChange}
      />
    )

    const starButtons = screen.getAllByRole('button')
    expect(starButtons).toHaveLength(5)
  })

  it('calls onChange when a star is clicked', () => {
    render(
      <RatingQuestion
        question={mockQuestion}
        onChange={mockOnChange}
      />
    )

    const starButtons = screen.getAllByRole('button')
    fireEvent.click(starButtons[2]) // Click 3rd star (rating 3)

    expect(mockOnChange).toHaveBeenCalledWith(3)
  })

  it('displays rating text when value is provided', () => {
    render(
      <RatingQuestion
        question={mockQuestion}
        value={4}
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('4 out of 5 stars')).toBeInTheDocument()
  })
})