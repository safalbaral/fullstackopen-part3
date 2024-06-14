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
  name: String,
  number: String
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