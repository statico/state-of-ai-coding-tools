import { test, expect } from '@playwright/test'

test.describe('Comprehensive System Tests', () => {
  test('full survey flow - authentication to submission', async ({ page }) => {
    // Start at homepage
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('State of AI Coding Tools')

    // Navigate to auth
    await page.getByRole('button', { name: /Enter Survey/i }).click()
    await expect(page).toHaveURL('/auth')

    // Attempt login with wrong password
    await page.fill('input[type="password"]', 'wrongpass')
    await page.getByRole('button', { name: /Enter Survey/i }).click()
    await expect(
      page.getByText(/Invalid password|Authentication failed/i)
    ).toBeVisible()

    // Login with correct password (check .env for actual password)
    await page.fill(
      'input[type="password"]',
      process.env.SURVEY_PASSWORD || 'survey2024'
    )
    await page.getByRole('button', { name: /Enter Survey/i }).click()

    // Should redirect to survey
    await expect(page).toHaveURL('/survey', { timeout: 10000 })

    // Check survey page loaded
    await expect(
      page.getByRole('button', { name: /Submit Survey/i })
    ).toBeVisible()

    // Try to submit without filling required fields
    await page.getByRole('button', { name: /Submit Survey/i }).click()
    await expect(page.getByText(/required|complete all/i)).toBeVisible()

    // Fill in some basic fields (actual questions may vary based on seed data)
    // Click on first available radio button in each group
    const radioGroups = await page.locator('[role="radiogroup"]').all()
    for (const group of radioGroups.slice(0, Math.min(3, radioGroups.length))) {
      const firstOption = group.locator('input[type="radio"]').first()
      await firstOption.click()
    }

    // Check any checkboxes if present
    const checkboxes = await page.locator('input[type="checkbox"]').all()
    for (const checkbox of checkboxes.slice(
      0,
      Math.min(2, checkboxes.length)
    )) {
      await checkbox.click()
    }

    // Fill text areas if present
    const textareas = await page.locator('textarea').all()
    for (const textarea of textareas) {
      await textarea.fill('Test response for automated testing')
    }

    // Submit survey
    await page.getByRole('button', { name: /Submit Survey/i }).click()

    // Should redirect to thank you page or show success
    await expect(page).toHaveURL(/thank-you|success/, { timeout: 10000 })
  })

  test('navigation menu functionality', async ({ page }) => {
    await page.goto('/')

    // Check desktop navigation
    const nav = page.locator('nav')
    await expect(nav.getByText('AI Coding Tools Survey')).toBeVisible()

    // Check theme switcher exists
    await expect(
      nav
        .locator('button[aria-label*="theme"], button:has-text("Theme")')
        .first()
    ).toBeVisible()

    // Test mobile menu on smaller viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Open mobile menu
    const menuButton = page.locator('button[aria-label="Toggle menu"]')
    if (await menuButton.isVisible()) {
      await menuButton.click()
      await expect(page.getByText('Home')).toBeVisible()
    }
  })

  test('results page accessibility', async ({ page }) => {
    await page.goto('/results')

    // Should show either results or error state
    const hasError = await page
      .getByText('Error')
      .isVisible()
      .catch(() => false)
    const hasResults = await page
      .getByText(/Results|Dashboard/i)
      .isVisible()
      .catch(() => false)

    expect(hasError || hasResults).toBeTruthy()

    // Should have navigation back home
    await expect(page.getByText(/Return Home|Home/i).first()).toBeVisible()
  })

  test('radio button selection visual feedback', async ({ page }) => {
    // Navigate to survey with auth
    await page.goto('/auth')
    await page.fill(
      'input[type="password"]',
      process.env.SURVEY_PASSWORD || 'survey2024'
    )
    await page.getByRole('button', { name: /Enter Survey/i }).click()

    await expect(page).toHaveURL('/survey', { timeout: 10000 })

    // Find first radio group
    const radioGroup = page.locator('[role="radiogroup"]').first()
    const radioButtons = radioGroup.locator('input[type="radio"]')

    if ((await radioButtons.count()) > 0) {
      // Click first radio button
      await radioButtons.first().click()

      // Check it's selected
      await expect(radioButtons.first()).toBeChecked()

      // Click second radio button
      if ((await radioButtons.count()) > 1) {
        await radioButtons.nth(1).click()
        // First should no longer be checked
        await expect(radioButtons.first()).not.toBeChecked()
        // Second should be checked
        await expect(radioButtons.nth(1)).toBeChecked()
      }
    }
  })
})

test.describe('Error Handling', () => {
  test('handles network errors gracefully', async ({ page }) => {
    // Block API calls
    await page.route('**/api/**', route => route.abort())

    await page.goto('/auth')
    await page.fill('input[type="password"]', 'test')
    await page.getByRole('button', { name: /Enter Survey/i }).click()

    // Should show error message
    await expect(page.getByText(/error|failed/i)).toBeVisible({
      timeout: 10000,
    })
  })

  test('handles missing data gracefully', async ({ page }) => {
    await page.goto('/results')

    // Should show appropriate message when no data
    const errorOrNoData = page.getByText(/No results|No active survey|Error/i)
    await expect(errorOrNoData).toBeVisible()
  })
})
