const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('user creation', () => {
  test('succeeds with valid data', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const users = await User.find({})
    assert.strictEqual(users.length, 1)
    assert.strictEqual(users[0].username, 'testuser')
  })

  test('fails with status 400 if username is missing', async () => {
    const newUser = {
      name: 'Test User',
      password: 'password123'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('Both username and password are required'))
  })

  test('fails with status 400 if password is missing', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('Both username and password are required'))
  })

  test('fails with status 400 if username is too short', async () => {
    const newUser = {
      username: 'te',
      name: 'Test User',
      password: 'password123'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('at least 3 characters long'))
  })

  test('fails with status 400 if password is too short', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'pw'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('at least 3 characters long'))
  })

  test('fails with status 400 if username is not unique', async () => {
    const user1 = {
      username: 'testuser',
      name: 'Test User',
      password: 'password123'
    }

    // Create first user
    await api.post('/api/users').send(user1)

    const user2 = {
      username: 'testuser',
      name: 'Another User',
      password: 'anotherpassword'
    }

    const response = await api
      .post('/api/users')
      .send(user2)
      .expect(400)

    assert(response.body.error.includes('expected `username` to be unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
