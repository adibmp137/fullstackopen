const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://adibmp2:${password}@cluster0.q5hcv.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

if (process.argv.length > 3) {
    const person = new Person({
    id: getRandomInt(10000),
    name: name,
    number: number,
    })

    person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
    })
}

if (process.argv.length == 3) {
    Person.find({}).then(result => {
    let output = 'phonebook:\n';
    result.forEach(person => {
        output += `${person.name} ${person.number}\n`;
    });
    console.log(output);
    mongoose.connection.close();
    });
}
