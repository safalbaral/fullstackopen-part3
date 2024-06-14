const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

// Need to import dotenv before Entry
require('dotenv').config()
const Entry = require('./models/entry')

const app = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000);
  }
  
app.get('/api/persons', (request, response) => {
    Entry.find({}).then(entries => {
        response.json(entries)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Entry.findById(request.params.id).then(entry => {
        if (entry){
            response.json(entry)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {  
    const body = request.body //This is made only possible by the json middleware   

    if (body.name === '') {
        return response.status(400).json({
            error: 'The name field must not be blank'
        })
    }

    const entry = new Entry({
        name: body.name,
        number: body.number
    })

    entry.save().then(savedEntry => {
        response.json(savedEntry)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Entry.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))

    const id = Number(request.params.id);
    entries = entries.filter(entry => entry.id !== id)
    response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const entry = {
        name: body.name,
        number: body.number
    }

    Entry.findByIdAndUpdate(request.params.id, entry, {new: true}) // {new:true} ensures that the entry provided to the callback funciton is the updated entry and not the old one, which is the default behavior
        .then(updatedEntry => {
            response.json(updatedEntry)
        }).catch(error => next(error))
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${entries.length} people. <br /> ${Date()}`)
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'Cast Error') {
        return response.status(400).send({
            error: 'Malformatted ID'
        })
    }

    next(error)
}

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})