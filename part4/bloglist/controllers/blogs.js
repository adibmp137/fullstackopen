const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, url } = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const user = await User.findById(decodedToken.id)

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
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete this blog' });
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
  response.json(blog)
})

module.exports = blogRouter
