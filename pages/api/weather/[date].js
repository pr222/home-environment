import moment from "Moment"

export default async function handler(req, res) {
  const { date } = req.query

  const temperatureRequest = await fetch(`${process.env.WEATHER_API_LINK_TEMPERATURE}`, {
    method: 'GET'
  })
  const temperatureResponse = await temperatureRequest.json()
  const temperature = filterData(temperatureResponse.value, date)


  const humidityRequest = await fetch(`${process.env.WEATHER_API_LINK_HUMIDITY}`, {
    method: 'GET'
  })
  const humidityResponse = await humidityRequest.json()
  console.log(humidityResponse)
  const humidity = filterData(humidityResponse.value, date)
  console.log(humidity)
  const weather = {
    temperature: temperature,
    humidity: humidity
  }

  res.status(200).json({ weather })
}

/**
 * Filter out data for records of one day.
 * 
 * @param {object} data - Array of objects which hold the properies date and value.
 * @param {string} day - date formatted "YYYY-MM-DD" 
 * @returns array of filtered results
 */
function filterData(data, day) {
  const results = []

  for (let record of data) {
    if (moment(record.date).format().split('T')[0] === day) {
      const temp = {
        time: moment(record.date).format(),
        value: record.value
      }

      results.push(temp)
    }
  }

  return results
}