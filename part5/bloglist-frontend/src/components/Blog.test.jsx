import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders content display title & author, not URL, likes, and nd user', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10,
    user: {
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText('Test Blog', { exact: false })
  expect(titleElement).toBeDefined()

  const authorElement = screen.getByText('Test Author', { exact: false })
  expect(authorElement).toBeDefined()

  const urlElement = screen.queryByText('http://testurl.com', { exact: false })
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText(/likes.*10/)
  expect(likesElement).toBeNull()

  const userElement = screen.queryByText('Test User')
  expect(userElement).toBeNull()
})

test('URL and likes shown when view button clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10,
    user: {
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('http://testurl.com', { exact: false })
  expect(urlElement).toBeDefined()

  const likesText = screen.getByText(/likes.*10/)
  expect(likesText).toBeDefined()
})
