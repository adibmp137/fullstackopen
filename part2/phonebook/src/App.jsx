import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/notes'

const Notification = ({ message, color }) => {
  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  
  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

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

const Persons = ({ personsToShow, deleteHandler }) => {
  return ( 
    <div>
      {personsToShow.map((person) => 
      <div key={person.id}>
        {person.name} {person.number} <button onClick={() => deleteHandler(person)}>delete</button>
      </div>)
      }
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorColor, setErrorColor] = useState('green')
  
  useEffect(() => {
    noteService.getAll().then(initialPersons => {setPersons(initialPersons)})
  }, [])

  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    const personObject = {
      name: newName,
      number: newNumber,
    }
    noteService.create(personObject).then(newPerson => setPersons(persons.concat(newPerson)))
    setErrorMessage(
      `Added ${newName}`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
 
  const updateContact = () => {
    const targetContact = persons.find((p) => p.name === newName)
    const updatedTargetContact = { ...targetContact, number: newNumber }
    if (confirm(`${ newName } is already added to phonebook, replace the old number with a new one?`)) {
      noteService.update(targetContact.id, updatedTargetContact)
      .then((returnedContact) => {
        setPersons(persons.map((person) => person === targetContact ? returnedContact : person ))
      })
      .catch(error => {
        setErrorColor('red')
        if (error.response && error.response.status === 404) {
          setErrorMessage(`Information of ${newName} has already been removed from server`)
          setPersons(persons.filter(n => n.id !== targetContact.id))
        } else if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error)
        } else {
          setErrorMessage('An unknown error occurred')
        }
        setTimeout(() => {
          setErrorColor('green')
          setErrorMessage(null)
        }, 5000)
        console.log('error')
      })
    }
  }

  const submitForm = (event) => {
    event.preventDefault()
    newName === ('') 
      ? alert(`Name field cannot be empty`) 
      : persons.some((person) => person.name === newName)
        ? updateContact()
        : addPerson(event)
    setNewName('')
    setNewNumber('')
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
  
  const deleteHandler = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      noteService.remove(person.id)
      .then(() => {
        setPersons(persons.filter((initialPersons) => initialPersons.id !== person.id))
      })
    }
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={errorColor} />
      <Filter {...{ searchedPerson, handleSearchChange }}/>
      <h2>add a new</h2>
      <PersonForm {...{ submitForm, newName, handleNameChange, newNumber, handleNumberChange }} />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deleteHandler={deleteHandler} />
    </div>
  )
}

export default App