import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { 
      id: 1,
      name: 'Arto Hellas' 
    },
    { 
      id: 2,
      name: 'Ada Locelace' 
    }
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    const personObject = {
      id: String(persons.length + 1),
      name: newName,
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const submitForm = (event) => {
    event.preventDefault()
    persons.some((person) => person.name === newName)
    ? alert(`${newName} is already added to phonebook`)
    : addPerson(event)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={submitForm}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => <div key={person.name}>{person.name}</div>)}
      <br />
      <div>debug: {newName}</div>
    
    </div>

  )
}

export default App