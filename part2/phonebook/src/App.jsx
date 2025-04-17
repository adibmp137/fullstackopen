import { useState } from 'react'

const Filter = ({ searchedPerson, handleSearchChange }) => {
  return (
    <div>
      filter shown with <input value={searchedPerson} onChange={handleSearchChange}/>
    </div>
  )
}

const PersonForm = ({ submitForm, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={submitForm}>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = ({ personsToShow}) => {
  return ( 
    <div>
      {personsToShow.map((person) => <div key={person.id}>{person.name} {person.number}</div>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    const personObject = {
      id: String(persons.length + 1),
      name: newName,
      number: newNumber,
    }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const submitForm = (event) => {
    event.preventDefault()
    newName === ('') 
      ? alert(`Name field cannot be empty`) 
      : persons.some((person) => person.name === newName)
        ? alert(`${newName} is already added to phonebook`)
        : addPerson(event)
  }

  const [newNumber, setNewNumber] = useState('')

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const [searchedPerson, setSearchedPerson] = useState('')

  const handleSearchChange = (event) => {
    setSearchedPerson(event.target.value)
  }

  const [shownPerson, setShownPerson] = useState(persons)

  const personsToShow = 
  searchedPerson === '' 
    ? persons 
    : persons.filter((person) => 
        person.name.toLowerCase().includes(searchedPerson.toLowerCase())
      );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter {...{ searchedPerson, handleSearchChange }}/>
      <h2>add a new</h2>
      <PersonForm {...{ submitForm, newName, handleNameChange, newNumber, handleNumberChange }} />
      <h2>Numbers</h2>
      <Persons {...{ personsToShow}} />
    </div>
  )
}

export default App