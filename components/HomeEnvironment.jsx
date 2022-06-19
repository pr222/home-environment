import { useState, useEffect } from 'react'
import moment from 'moment'
import EnvironmentDiagram from './EnvironmentDiagram'

/**
 * A Home Environment component.
 * 
 * @returns this component.
 */
export default function HomeEnvironment() {
  const [temperature, setTemperature] = useState([])
  const [humidity, setHumidity] = useState([])
  const [weatherTemperature, setWeatherTemperature] = useState([])
  const [weatherHumidity, setWeatherHumidity] = useState([])

  const [displayDate, setDisplayDate] = useState(moment()) // Default to "now"
  const [formDate, setFormDate] = useState(displayDate.format().split('T')[0]) // Make form-friendly format with the default display date.
  const [isLoading, setIsLoading] = useState(false)

  const handleDateChange = event => {
    setIsLoading(true)
    setFormDate(event.target.value) // Kicks the useEffect-hook
    setDisplayDate(moment(event.target.value))
  }

  // Cleanes up sensor reading objects to match format for the Diagram.
  const cleanup = (readings) => {
    const cleaned = []

    // Loop for each place to fill to the diagram-array.
    for (let i = 0; i < 24; i++) {
      let found = false
      const cordinate = {}

      // Loop all readings for handling matches
      for (const elem of readings) {
        const hour = elem.time.split('T')[1].split(':')[0]

        if (hour == i) { // intentionally not using === to accept both string and int values
          found = true
          cordinate.x = hour
          cordinate.y = Number(elem.value).toFixed(2)
        }
      }

      if (found) {
        cleaned.push(cordinate)
      } else {
        cleaned.push({
          x: i.toString(),
          y: ''
        })
      }
    }

    return cleaned
  }

  useEffect (() => {
    setIsLoading(true)

    fetch(`api/readings/home-environment?date=${formDate}`)
      .then((res) => res.json())
      .then((data) => {
        const temps = data.properties.temperature
        const t = cleanup(temps)
        setTemperature(t)

        const humid = data.properties.humidity
        const h = cleanup(humid)
        setHumidity(h)

        fetch(`api/weather/${formDate}`)
        .then((res) => res.json())
        .then((data) => {
          const weatherT = data.weather.temperature
          const wTemperature = cleanup(weatherT)
          setWeatherTemperature(wTemperature)

          const weatherH = data.weather.humidity
          const wHumidity = cleanup(weatherH)
          setWeatherHumidity(wHumidity)

          setIsLoading(false)
        })
      })
  }, [formDate])

  return (
    <>
      <form>
        <label htmlFor="formDate">Select a date </label>
        <input 
          type="date"
          id="formDate"
          name="formDate"
          value={formDate}
          onChange={handleDateChange}
        />
      </form>

     <p>{isLoading ? 'Loading...' : `Displaying data for: ${displayDate.calendar()}`}</p>

      <EnvironmentDiagram temperature={temperature} humidity={humidity} weatherTemperature={weatherTemperature} weatherHumidity={weatherHumidity} />
    </>
  )
}