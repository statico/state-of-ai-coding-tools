import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('displays main title and navigation', async ({ page }) => {
    await page.goto('/')

    // Check main title
    await expect(page.locator('h1')).toContainText('State of AI Coding Tools')
    
    // Check description
    await expect(page.locator('p')).toContainText('A survey system for gauging interest and usage of AI coding tools')

    // Check navigation links
    await expect(page.locator('a[href="/auth"]')).toContainText('Enter Survey')
    await expect(page.locator('a[href="/results"]')).toContainText('View Results')
  })

  test('navigates to auth page', async ({ page }) => {
    await page.goto('/')
    
    await page.click('text=Enter Survey')
    await expect(page).toHaveURL('/auth')
  })

  test('navigates to results page', async ({ page }) => {
    await page.goto('/')
    
    await page.click('text=View Results')
    await expect(page).toHaveURL('/results')
  })
})