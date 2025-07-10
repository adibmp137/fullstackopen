const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const { title, url } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'Title and URL are required' })
  }

  const blog = new Blog(request.body)
  const result = await blog.save()
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
