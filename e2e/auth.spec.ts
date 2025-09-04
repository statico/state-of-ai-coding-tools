import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('displays password form', async ({ page }) => {
    await page.goto('/auth')

    // Check title
    await expect(page.locator('h2')).toContainText('Enter Weekly Password')

    // Check form elements
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toContainText(
      'Enter Survey'
    )
  })

  test('shows validation error for empty password', async ({ page }) => {
    await page.goto('/auth')

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Should stay on auth page (HTML5 validation will prevent submission)
    await expect(page).toHaveURL('/auth')
  })

  test('shows error for invalid password', async ({ page }) => {
    await page.goto('/auth')

    // Enter invalid password
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=Invalid password')).toBeVisible()
  })
})
