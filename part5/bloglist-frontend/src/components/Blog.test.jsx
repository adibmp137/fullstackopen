import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
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

  const urlElement = screen.queryByText('http://testurl.com')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes 10')
  expect(likesElement).toBeNull()

  const userElement = screen.queryByText('Test User')
  expect(userElement).toBeNull()
})