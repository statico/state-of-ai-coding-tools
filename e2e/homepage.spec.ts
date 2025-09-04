import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('displays main title and navigation', async ({ page }) => {
    await page.goto('/')

    // Check main title
    await expect(page.locator('h1')).toContainText('State of AI Coding Tools')

    // Check description
    await expect(
      page.getByText('Help shape the future of AI coding tools')
    ).toBeVisible()

    // Check navigation links
    await expect(
      page.getByRole('button', { name: /Enter Survey/i })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: /View Results/i })
    ).toBeVisible()
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
