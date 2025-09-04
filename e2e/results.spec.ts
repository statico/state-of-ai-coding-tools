import { test, expect } from '@playwright/test'

test.describe('Results Page', () => {
  test('displays no results message when no data', async ({ page }) => {
    await page.goto('/results')

    // Should show no results message when no survey data exists
    await expect(page.locator('h1')).toContainText('Error')
    await expect(page.locator('text=No active survey found')).toBeVisible()
  })

  test('has return home link on error page', async ({ page }) => {
    await page.goto('/results')

    // Should have return home button
    await expect(page.locator('a[href="/"]')).toContainText('Return Home')
    
    // Test navigation back home
    await page.click('text=Return Home')
    await expect(page).toHaveURL('/')
  })
})