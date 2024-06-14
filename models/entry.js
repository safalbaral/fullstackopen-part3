const mongoose = require('mongoose')


const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB!')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB: ', error.message)
    })

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
},
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
        validator: (v) => {
            return /^\d{2,3}-\d+$/.test(v)
        }
    }
  }
})

// id may look like a string, but it's an object so we turn it into a string
// And we also remove the __v attribute when passing to the frontend
entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Entry', entrySchema)