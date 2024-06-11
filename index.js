const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

const app = express()
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
    response.json(entries)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const entry = entries.find(entry => entry.id === id)
    entry ? response.json(entry) : response.status(404).end()
})

app.post('/api/persons', (request, response) => {  
    const entry = request.body //This is made only possible by the json middleware   
    if (entries.find(e => e.name === entry.name)) {
        response.status(403).json({
            error: 'Name must be unique'
        })
    } else if (entry.name === '') {
        response.status(400).json({
            error: 'The name field must not be blank'
        }
        )
    } else {
        entry.id = generateRandomId()
        entries = entries.concat(entry)
        response.json(entry)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    entries = entries.filter(entry => entry.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${entries.length} people. <br /> ${Date()}`)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})