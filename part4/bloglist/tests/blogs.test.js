const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const listHelper = require('../utils/list_helper')
const Blogs = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blogs.deleteMany({})
  await Blogs.insertMany(listHelper.initialBlogs)
})

describe('dummy', () => {
  test('returns one', () => {
    const blogsEmpty = []
    const result = listHelper.dummy(blogsEmpty)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  test('returns the sum of likes for a list of blogs', () => {
    const result = listHelper.totalLikes(listHelper.initialBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(listHelper.initialBlogs)
    assert.deepStrictEqual(result, {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    })
  })
})

describe('most blogs', () => {
  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(listHelper.initialBlogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('returns the author with the most total likes', () => {
    const result = listHelper.mostLikes(listHelper.initialBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})

describe.only('4b test', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, listHelper.initialBlogs.length)
  })

  test('unique identifier is named id',  async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    for (const blog of blogs) {
      assert.ok(blog.id, 'Blog is missing id property')
      assert.strictEqual(blog._id, undefined)
    }
  })
})
after(async () => {
  await mongoose.connection.close()
})