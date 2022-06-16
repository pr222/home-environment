import { useState, useEffect } from 'react'
import moment from 'Moment'
import EnvironmentDiagram from './EnvironmentDiagram'

/**
 * A Home Environment component.
 * 
 * @returns this component.
 */
export default function HomeEnvironment() {
  const [temperatures, setTemperatures] = useState([])

  const [date, setDate] = useState(moment()) // default to "now"
  const [formDate, setFormDate] = useState(date.format().split('T')[0]) // make form-friendly format with the default date

  const [isLoading, setIsLoading] = useState(false)

  const handleDateChange = event => {
    setIsLoading(true)
    console.log(formDate, 'Form Date in client Before set')    
    setFormDate(event.target.value) // Kicks the useEffect-hook
    console.log(formDate, 'Form Date in client AFter set')
    setDate(moment(event.target.value)) // Keep as main date-display?

    // const request = await fetch(`api/readings/home-environment?date=${formDate}`)
    // const response = await request.json()
    // console.log(response)
    // const temperatures = response.temperatures.map(val => Number(val))
    // console.log(temperatures)
    // setTemperatures(temperatures)
    // setIsLoading(false)
  }

  useEffect (() => {
    setIsLoading(true)
    // fetch(`api/hello?date=${formDate}`)
    fetch(`api/readings/home-environment?date=${formDate}`)
      .then((res) => res.json())
      .then((data) => {
        const temps = data.temperatures.map(val => Number(val))
        setTemperatures(temps)
        setIsLoading(false)
      })
    // setIsLoading(false)
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

     <p>{isLoading ? 'Loading...' : `Display data for: ${date.calendar()}`}</p>

      <EnvironmentDiagram temperatures={temperatures} /> 
    </>
  )
}