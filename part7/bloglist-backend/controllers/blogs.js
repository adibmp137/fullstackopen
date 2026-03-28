const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const { title, url } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const user = request.user

  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  const result = await blog.save()

  // Add blog to user's blogs array
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  // Re-fetch the blog we just saved and populate the user field
  const populatedBlog = await Blog.findById(result._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const user = request.user

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }

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
  const populatedBlog = await Blog.findById(blog.id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

module.exports = blogRouter
