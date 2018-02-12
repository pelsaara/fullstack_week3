const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
morgan.token('type', (req, res) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))


const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(` Puhelinluettelossa on ${persons.length} henkilön tiedot hetkellä <br/> ${new Date()}`)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(formatPerson(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then( () => {
      res.status(204).end()
    })
    .catch( () => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === '') {
    return res.status(400).json({ error: 'Nimi puuttuu' })
  }

  if (body.number === '') {
    return res.status(400).json({ error: 'Numero puuttuu' })
  }

  // if (persons.find(p => p.name === body.name)) {
  //     return res.status(400).json({ error: 'Tällä nimellä löytyy jo henkilö puhelinluettelosta' })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(formatPerson)
    .then(savedAndFormattedPerson => {
      res.json(savedAndFormattedPerson)
    })

})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findOneAndUpdate({ name: person.name }, person, { new: true })
    .then(updatedPerson => {
      res.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})