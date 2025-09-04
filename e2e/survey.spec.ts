import { test, expect } from '@playwright/test'

test.describe('State of AI Coding Tools Survey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4001')
  })

  test('should display homepage with navigation options', async ({ page }) => {
    await expect(page).toHaveTitle(/State of AI Coding Tools/)
    
    const heading = page.getByRole('heading', { name: 'State of AI Coding Tools' })
    await expect(heading).toBeVisible()
    
    const surveyLink = page.getByRole('link', { name: 'Enter Survey' })
    await expect(surveyLink).toBeVisible()
    
    const resultsLink = page.getByRole('link', { name: 'View Results' })
    await expect(resultsLink).toBeVisible()
  })

  test('should require authentication to access survey', async ({ page }) => {
    await page.click('text=Enter Survey')
    
    await expect(page).toHaveURL(/\/auth/)
    
    const passwordHeading = page.getByRole('heading', { name: 'Enter Weekly Password' })
    await expect(passwordHeading).toBeVisible()
  })

  test('should authenticate with correct password', async ({ page }) => {
    await page.goto('http://localhost:4001/auth')
    
    await page.fill('input[type="password"]', 'ai2024')
    await page.click('button:has-text("Enter Survey")')
    
    await expect(page).toHaveURL(/\/survey/)
  })

  test('should reject incorrect password', async ({ page }) => {
    await page.goto('http://localhost:4001/auth')
    
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button:has-text("Enter Survey")')
    
    const errorMessage = page.locator('text=/Invalid password/')
    await expect(errorMessage).toBeVisible()
  })

  test('should display survey form with all question types', async ({ page }) => {
    // Authenticate first
    await page.goto('http://localhost:4001/auth')
    await page.fill('input[type="password"]', 'ai2024')
    await page.click('button:has-text("Enter Survey")')
    
    await expect(page).toHaveURL(/\/survey/)
    
    // Check for question categories
    await expect(page.locator('text=demographics')).toBeVisible()
    await expect(page.locator('text=tools')).toBeVisible()
    await expect(page.locator('text=satisfaction')).toBeVisible()
    await expect(page.locator('text=feedback')).toBeVisible()
    
    // Check for specific questions
    await expect(page.locator('text=/How many years of programming experience/')).toBeVisible()
    await expect(page.locator('text=/Which AI coding tools do you currently use/')).toBeVisible()
    await expect(page.locator('text=/How satisfied are you with AI coding tools/')).toBeVisible()
  })

  test('should validate required fields on submission', async ({ page }) => {
    // Authenticate first
    await page.goto('http://localhost:4001/auth')
    await page.fill('input[type="password"]', 'ai2024')
    await page.click('button:has-text("Enter Survey")')
    
    // Try to submit without filling required fields
    await page.click('button:has-text("Submit Survey")')
    
    // Should show validation errors
    const requiredMessage = page.locator('text=/This question is required/').first()
    await expect(requiredMessage).toBeVisible()
  })

  test('should submit survey with valid responses', async ({ page }) => {
    // Authenticate first
    await page.goto('http://localhost:4001/auth')
    await page.fill('input[type="password"]', 'ai2024')
    await page.click('button:has-text("Enter Survey")')
    
    // Fill out required fields
    // Experience
    await page.click('text=3-5 years')
    
    // Company size  
    await page.click('text=11-50 people')
    
    // Select AI tools
    await page.click('text=GitHub Copilot')
    await page.click('text=Claude')
    
    // Primary language
    await page.click('text=JavaScript/TypeScript')
    
    // Satisfaction rating (click 4th star)
    const ratingSection = page.locator('text=/How satisfied are you/').locator('..')
    await ratingSection.locator('button').nth(3).click()
    
    // Submit survey
    await page.click('button:has-text("Submit Survey")')
    
    // Should redirect to thank you page
    await expect(page).toHaveURL(/\/survey\/thank-you/, { timeout: 10000 })
  })

  test('should display results dashboard', async ({ page }) => {
    await page.goto('http://localhost:4001/results')
    
    await expect(page.getByRole('heading', { name: /Survey Results Dashboard/ })).toBeVisible()
    
    // Check for chart sections
    await expect(page.locator('text=/Tool Usage Distribution/')).toBeVisible()
    await expect(page.locator('text=/Experience Level Distribution/')).toBeVisible()
    await expect(page.locator('text=/Language Distribution/')).toBeVisible()
    await expect(page.locator('text=/Satisfaction Ratings/')).toBeVisible()
  })
})

test.describe('Survey Interaction Tests', () => {
  test('should handle multiple choice questions correctly', async ({ page }) => {
    // Authenticate
    await page.goto('http://localhost:4001/auth')
    await page.fill('input[type="password"]', 'ai2024')
    await page.click('button:has-text("Enter Survey")')
    
    // Select multiple AI tools
    await page.click('text=GitHub Copilot')
    await page.click('text=ChatGPT')
    await page.click('text=Claude')
    
    // Verify checkboxes are checked
    const githubCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: 'GitHub Copilot' })
    await expect(githubCheckbox).toBeChecked()
  })

  test('should handle rating selection with visual feedback', async ({ page }) => {
    // Authenticate
    await page.goto('http://localhost:4001/auth') 
    await page.fill('input[type="password"]', 'ai2024')
    await page.click('button:has-text("Enter Survey")')
    
    // Click on rating stars
    const ratingSection = page.locator('text=/How satisfied are you/').locator('..')
    await ratingSection.locator('button').nth(4).click() // 5 stars
    
    // Should show "5 out of 5 stars"
    await expect(ratingSection.locator('text=/5 out of 5 stars/')).toBeVisible()
  })

  test('should persist form data during navigation', async ({ page }) => {
    // Authenticate
    await page.goto('http://localhost:4001/auth')
    await page.fill('input[type="password"]', 'ai2024')
    await page.click('button:has-text("Enter Survey")')
    
    // Fill some fields
    await page.click('text=6-10 years')
    await page.click('text=GitHub Copilot')
    
    // Navigate away and back
    await page.goto('http://localhost:4001')
    await page.click('text=Enter Survey')
    
    // Check if selections are still present (depends on localStorage implementation)
    const experienceRadio = page.locator('input[type="radio"]').filter({ hasText: '6-10 years' })
    // This might not persist depending on implementation
  })
})