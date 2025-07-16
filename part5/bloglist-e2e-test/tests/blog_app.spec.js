const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174')
  })

  test('Login form is shown', async ({ page }) => {
    const usernameInput = await page.getByText('username')
    const passwordInput = await page.getByText('password')
    const loginButton = await page.getByRole('button', { name: 'login' })

    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

    const textboxes = await page.getByRole('textbox').all()
    await expect(textboxes).toHaveLength(2)

    await expect(loginButton).toBeVisible()
  })
})