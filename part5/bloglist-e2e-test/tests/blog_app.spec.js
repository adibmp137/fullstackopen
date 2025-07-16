const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpass'
    }

    const secondUser = {
      name: 'Second User',
      username: 'usertwo',
      password: 'passtwo'
    }
    
    await request.post('http://localhost:3003/api/users', {
      data: user
    })
    await request.post('http://localhost:3003/api/users', {
      data: secondUser
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
      await createBlog(page, {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://testblog.com'
      })

      await expect(page.getByText('A new blog Test Blog Title by Test Author added')).toBeVisible()
      
      const blogElement = page.getByText('Test Blog Title Test Author')
      await expect(blogElement).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: 'Test Blog Title',
          author: 'Test Author',
          url: 'http://testblog.com'
        })
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        const likesElement = page.getByText('likes')
        await expect(likesElement).toContainText('likes 0')

        await page.getByRole('button', { name: 'like' }).click()

        await expect(likesElement).toContainText('likes 1')
      })

      test('a blog can be deleted by the user who created it', async ({ page }) => {
        page.on('dialog', async dialog => {
            await dialog.accept()
        })

        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Blog "Test Blog Title" deleted successfully')).toBeVisible()
        
        await expect(page.getByText('Test Blog Title Test Author')).not.toBeVisible()
      })

      test('a blog cannot be deleted by another user', async ({ page }) => {
        page.on('dialog', async dialog => {
            await dialog.accept()
        })

        await page.getByRole('button', { name: 'logout' }).click()

        await loginWith(page, 'usertwo', 'passtwo')

        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Failed to delete blog - unauthorized or server error')).toBeVisible()
      })
    })
  })
})