import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { 
      id: 1,
      name: 'Arto Hellas',
      number: '040-1234567',
    },
    { 
      id: 2,
      name: 'Ada Locelace',
      number: '39-44-5323523' ,
    }
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
    newName === ('') ? alert(`Name field cannot be empty`) : 
    persons.some((person) => person.name === newName)
    ? alert(`${newName} is already added to phonebook`)
    : addPerson(event)
  }

  const [newNumber, setNewNumber] = useState('')

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      {persons.map((person) => <div key={person.id}>{person.name} {person.number}</div>)}
      <br />
      <div>debug: {newName} {newNumber}</div>
    
    </div>

  )
}

export default App