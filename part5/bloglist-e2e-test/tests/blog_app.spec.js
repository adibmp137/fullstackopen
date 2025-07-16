const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the test database
    await request.post('http://localhost:3003/api/testing/reset')
    
    // Create a test user
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpass'
    }
    
    await request.post('http://localhost:3003/api/users', {
      data: user
    })
    
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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpass')

      await expect(page.getByText('Test User logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpass')

      const errorDiv = page.getByText('Wrong username or password')
      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      
      await expect(page.getByText('Log in to application')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpass')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title-input').fill('Test Blog Title')
      await page.getByTestId('author-input').fill('Test Author')
      await page.getByTestId('url-input').fill('http://testblog.com')
      
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('A new blog Test Blog Title by Test Author added')).toBeVisible()
      
      const blogElement = page.getByText('Test Blog Title Test Author')
      await expect(blogElement).toBeVisible()
    })
  })
})