const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as last argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://baldwin:${password}@cluster0.yvb88kd.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  mongoose.connect(url)
  console.log('phonebook: ')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  mongoose
    .connect(url)
    .then(result => {
      console.log('connected')

      const person = new Person({
        name: name,
        number: number
      })

      console.log(`added ${person.name} - ${person.number} to phonebook`)

      return person.save()

    })
    .then(() => {
      
      return mongoose.connection.close()

    })
    .catch(err => console.log(err))
  }