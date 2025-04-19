import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryData = ({ selectedInfo }) => {
  return (
    <div>
      <h1>{selectedInfo.name.common}</h1>
      <div>Capital: {selectedInfo.capital[0]}</div>
      <div>Area {selectedInfo.area}</div>
      <h1>Languages</h1>
      <ul>
        {Object.values(selectedInfo.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={selectedInfo.flags.png}/>
    </div>
  )
}

const App = () => {
  const [searchType, setSearchType] = useState('')
  const [fullInfo, setInfo] = useState(null)
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

  useEffect(() => {
    axios.get(baseUrl).then(response => setInfo(response.data))
  }, [])

  if (!fullInfo) {
    return (<div></div>)
  }

  const handleSearchChange = (event) => {
    setSearchType(event.target.value)
  }
  
  const countryList = fullInfo.map((info) => info.name.common)
  const searchList =
    searchType === ''
      ? []
      : countryList.filter((c) => c.toLowerCase().includes(searchType.toLowerCase()))

  const selectedCountry = 
  searchList.length === 1
    ? searchList[0]
    : {}

  const selectedInfo = fullInfo.filter((info) => info.name.common === selectedCountry)[0]

  const searchDisplay = 
  searchList.length < 10
    ? searchList.length === 1
      ? <CountryData selectedInfo={selectedInfo}/>
      : searchList.map((a,i) => (<div key={i}>{a}</div>))
    : 'Too many matches, specify another filter'
  
  return (
    <div>
      <p>find countries <input value={searchType} onChange={handleSearchChange} placeholder='search country here'/></p>
      <div>{searchDisplay}</div>
    </div>
  )
}

export default App