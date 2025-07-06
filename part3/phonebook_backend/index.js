require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const People = require('./models/person')

app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length') || '-',
        '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}))

app.post('/api/persons', async (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const existing = await People.findOne({ name: { $regex: new RegExp('^' + body.name + '$', 'i') } })
    if (existing) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new People({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            response.status(500).json({ error: 'database error', details: error.message })
        })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  People.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      response.status(500).json({ error: 'database error', details: error.message })
    })
})

app.get('/info', (request, response) => {
    const now = new Date()
    People.countDocuments({})
        .then(count => {
            response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${now}</p>
            `)
        })
        .catch(error => {
            response.status(500).send('Database error')
        })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    People.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            response.status(400).json({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    People.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).json({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})