import moment from "Moment"

/**
 * Gets weather temperature and humidity by using SMHI Open Data API.
 * 
 * API DOCS: http://opendata.smhi.se/apidocs/metobs/index.html
 * API License:(Creative Commons 4.0 SE) https://www.smhi.se/data/oppna-data/information-om-oppna-data/villkor-for-anvandning-1.30622
 * 
 * @param {*} req - request object
 * @param {*} res - resonse object
 */
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
  const humidity = filterData(humidityResponse.value, date)

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
    if (moment(record.date).subtract(2, 'hours').format().split('T')[0] === day) {
      const temp = {
        time: moment(record.date).subtract(2, 'hours').format(), // Subtract to remove the +2 timezone
        value: record.value
      }

      results.push(temp)
    }
  }

  return results
}