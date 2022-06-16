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

  const [displayDate, setDisplayDate] = useState(moment()) // Default to "now"
  const [formDate, setFormDate] = useState(displayDate.format().split('T')[0]) // Make form-friendly format with the default display date.
  const [isLoading, setIsLoading] = useState(false)

  const handleDateChange = event => {
    setIsLoading(true)
    setFormDate(event.target.value) // Kicks the useEffect-hook
    setDisplayDate(moment(event.target.value))
  }

  useEffect (() => {
    setIsLoading(true)

    fetch(`api/readings/home-environment?date=${formDate}`)
      .then((res) => res.json())
      .then((data) => {
        const temps = data.temperature.map(val => Number(val))
        setTemperature(temps)
        setIsLoading(false)
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

      <EnvironmentDiagram temperature={temperature} /> 
    </>
  )
}