const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const listHelper = require('../utils/list_helper')
const Blogs = require('../models/blog')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

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

describe('4b test', () => {
  let token

  beforeEach(async () => {
    // Clear users and create a test user
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    // Get token by logging in
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    token = response.body.token

    // Clear and initialize blogs
    await Blogs.deleteMany({})
    await Blogs.insertMany(listHelper.initialBlogs)
  })

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

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Tungtungtung Sahur',
      author: 'Brain Rot',
      url: 'http://blog.rotter.com/tungtungtung.html',
      likes: 69,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await listHelper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.title)
    assert(contents.includes('Tungtungtung Sahur'))
  })

  test('default likes to 0 when not provided', async () => {
    const newBlog = {
      title: 'Bombardino Crocodilo',
      author: 'Brain Rot',
      url: 'http://blog.rotter.com/bombardino.html',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await listHelper.blogsInDb()
    const blog = blogsAtEnd.find(n => n.title === 'Bombardino Crocodilo')
    assert.strictEqual(blog.likes, 0)
  })

  test('respondss with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Brain Rot',
      url: 'http://blog.rotter.com/bombardino.html',
      likes: 69,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('responds with status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'Bombardino Crocodilo',
      author: 'Brain Rot',
      likes: 69,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('a blog can be deleted', async () => {
    // Create a new blog first
    const newBlog = {
      title: 'Test Blog to Delete',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 0
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    const blogToDelete = response.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await listHelper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('updating a blog increases the number of likes', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikes = blogToUpdate.likes + 1

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = await Blogs.findById(blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, newLikes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
