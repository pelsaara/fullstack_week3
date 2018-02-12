const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
        name: 'Arto Hellas',
        number: '050-123456',
        id: 1
    },
    {
        name: 'Martti Tienari',
        number: '040-123456',
        id: 2
    },
    {
        name: 'Arto Järvinen',
        number: '040-123456',
        id: 3
    },
    {
        name: 'Lea Kutvonen',
        number: '040-123456',
        id: 4
    },
    {
        name: 'Leena Kutvonen',
        number: '040-123456',
        id: 5
    },

]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const personsLength = persons.length
    const date = new Date
    res.send('Puhelinluettelossa on ' + personsLength + ' henkilön tiedot hetkellä <br/>' + date)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(reqapp.post('/notes', (request, response) => {
        const note = request.body
        console.log(note)

        response.json(note)
    }).params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const minId = persons.length > 0 ? persons.length + 1 : 1
    return Math.floor(Math.random() * (1000 - minId)) + minId;
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'Nimi puuttuu' })
    }

    if (body.number === undefined) {
        return res.status(400).json({ error: 'Numero puuttuu' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})