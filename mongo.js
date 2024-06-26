const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstackopen:${password}@cluster0.4fuhqhm.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
  Entry.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry)
      mongoose.connection.close()
      process.exit(0)
    })
  })
} else {
  const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4],
  })

  entry.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}