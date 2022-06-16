import { useState, useEffect } from 'react'
import moment from 'Moment'
import EnvironmentDiagram from './EnvironmentDiagram'

/**
 * A Home Environment component.
 * 
 * @returns this component.
 */
export default function HomeEnvironment() {
  const [temperature, setTemperature] = useState()

  const [date, setDate] = useState(moment()) // default to "now"
  const [formDate, setFormDate] = useState(date.format().split('T')[0]) // make form-friendly format with the default date


  const handleDateChange = async event => {
    setFormDate(event.target.value) // Kicks the useEffect-hook

    setDate(moment(event.target.value)) // Keep as main date-display?
  }

  useEffect (() => {
    fetch(`api/hello?date=${formDate}`)
      .then((res) => res.json())
      .then((data) => {
        setTemperature(data.name)
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

      <p>Display data for: {date.calendar()}</p>

      <EnvironmentDiagram temperature={temperature} /> 
    </>
  )
}