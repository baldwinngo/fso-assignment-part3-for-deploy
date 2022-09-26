require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/phonebook')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    `Console log: ${JSON.stringify(req.body)}`
  ].join(' ')
}))

// Get all phonebook entries from database
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Return number of entries from database
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const length = persons.length
    const date = new Date()
    response.send(`<p>There are ${length} entries in this phonebook.</p> <p>${date}</p>`)
  })
})

// Get entry by id
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log(persons)
  response.status(204).end()
})

// const generateId = () => Math.floor(Math.random()*999999)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  } 
  
  // else if (persons.find(person => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'name exists'
  //   })
  // } else if (persons.find(person => person.number === body.number)) {
  //   return response.status(400).json({
  //     error: 'number exists'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})