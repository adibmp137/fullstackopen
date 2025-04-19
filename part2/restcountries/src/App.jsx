import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryData = ({ selectedInfo, weather }) => {
  const imgStyle = {
    border: '5px solid #555'
  }
  if (!weather || !weather.current) return null;
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
      <img src={selectedInfo.flags.png} style={imgStyle}/>
      <h1>Weather in {selectedInfo.capital[0]}</h1>
      <p>Temperature {(weather.current.temp - 273.15).toFixed(2)} Celsius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} alt={`${weather.current.weather[0].description}`}/>
      <p>Wind {weather.current.wind_speed} m/s</p>
    </div>
  )
}

const App = () => {
  const [searchType, setSearchType] = useState('')
  const [fullInfo, setInfo] = useState(null)
  const [weather, setWeather] = useState(null)
  const [forceSelect, setForceSelect] = useState(null)
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  const apiKey = import.meta.env.VITE_SOME_KEY

  const filteredCountries = fullInfo 
  ? (searchType === ''
    ? []
    : fullInfo.filter(country => 
        country.name.common.toLowerCase().includes(searchType.toLowerCase())
      ))
  : []

  const selectedInfo = forceSelect || (filteredCountries.length === 1 ? filteredCountries[0] : null)
  
  useEffect(() => {
    axios.get(baseUrl).then(response => setInfo(response.data))
  }, [])

  useEffect(() => {
    if (selectedInfo) {
      const lat = selectedInfo.capitalInfo.latlng[0]
      const lon = selectedInfo.capitalInfo.latlng[1]
      const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`

      axios.get(weatherUrl)
        .then(response => setWeather(response.data))
        .catch(error => console.error('Error fetching weather:', error))
    } else {
      setWeather(null)
    }
  }, [selectedInfo])
  
  if (!fullInfo) {
    return (<div></div>)
  }

  const handleSearchChange = (event) => {
    setSearchType(event.target.value)
    setForceSelect(null)
  };

  const searchDisplay = 
  forceSelect
  ? <CountryData selectedInfo={forceSelect} weather={weather}/>
  : filteredCountries.length < 10
    ? filteredCountries.length === 1 
      ? <CountryData selectedInfo={selectedInfo} weather={weather}/>
      : filteredCountries.map((country,i) => (
          <div key={i}>
            {country.name.common} <button onClick={() => setForceSelect(country)}>Show</button>
          </div>))
    : 'Too many matches, specify another filter'

  return (
    <div>
      <p>find countries <input value={searchType} onChange={handleSearchChange} placeholder='search country here'/></p>
      <div>{searchDisplay}</div>
    </div>
  )
}

export default App