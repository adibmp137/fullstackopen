const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, url } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  // Assign the first user as the creator
  const users = await User.find({})
  const user = users[0]

  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  const result = await blog.save()

  // Add blog to user's blogs array
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// New endpoint to update the number of likes
blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  if (!body.likes) {
    return response.status(400).json({ error: 'Likes are required' })
  }

  const likes = Number(body.likes)
  const blog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true })
  response.json(blog)
})

module.exports = blogRouter
