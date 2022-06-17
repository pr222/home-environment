import { useState, useEffect } from 'react'
import moment from 'Moment'
import EnvironmentDiagram from './EnvironmentDiagram'

/**
 * A Home Environment component.
 * 
 * @returns this component.
 */
export default function HomeEnvironment() {
  const [temperature, setTemperature] = useState([])
  const [humidity, setHumidity] = useState([])

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

    for (let i = 0; i < 24; i++) {
      let found = false
      const cordinate = {}

      for (const elem of readings) {
        const hour = elem.time.split('T')[1].split(':')[0]

        if (hour == i) { // intentionally not using === to accept both string and int values
          found = true
          cordinate.x = hour
          cordinate.y = elem.value.toFixed(2)
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

        setIsLoading(false)
      })

      fetch(`api/weather/${formDate}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
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

      <EnvironmentDiagram temperature={temperature} humidity={humidity} /> 
    </>
  )
}