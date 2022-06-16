import moment from 'Moment'

// Temperature: Returns temperature in celcius (C)
// Humidity: Returns relative humidity (rH) in percentage %

/**
 * Get environment readings from the Arduino Cloud API.
 * Should return one reading per hour for the queried date (YYYY-MM-DD).
 * Returns values for the properties: temperature, .
 * 
 * @param {*} req request object
 * @param {*} res response object
 */
export default async function handler(req, res) {
  console.log(req.query.date)

  const accessToken = await getAccessToken()

  if(!accessToken) {
    return res.status(500).json({ message: 'Could not establish connection.'})
  }

  const queryString = getQueryString(req.query.date)

  const temperature = await getSensorReadings(accessToken, `${process.env.TEMPERATURE_ID}`, queryString)
  const humidity = await getSensorReadings(accessToken, `${process.env.HUMIDITY_ID}`, queryString)
  
  // Cleanup data to return to the client.
  const temp = []

  temperature.forEach(element => {
    temp.push(element.value.toFixed(2))
  });

  const humid = []

  humidity.forEach(element => {
    humid.push(Math.round(Number(element.value)))
  })

  const data = {
    temperature: temp,
    humidity: humid
  }

  res.status(200).json(data)
}

/**
 * Build query string for the queried parameter,
 * with a interval of once per hour.
 * 
 * @param {string} date - date as "YYYY-MM-DD"
 * @returns 
 */
function getQueryString(date) {
  // Set the right dates
  let startDate = moment(date)
  let endDate = startDate.clone().add(1, 'days')

  // Format dates
  startDate = startDate.format().split('T')[0]
  endDate = endDate.format().split('T')[0]

  let interval = 3600 // 1 hour in seconds

  const query = `desc=false&from=${startDate}T00:00:00Z&interval=${interval}&to=${endDate}T00:00:00Z`

  return query
}

/**
 * Authenticate to get access token for the Arduino Cloud API.
 *
 * @returns a JWT access token
 */
async function getAccessToken() {
  const request = await fetch('https://api2.arduino.cc/iot/v1/clients/token', {
    method: 'POST',
    'Content-Type': 'application/x-www-form-urlencoded',
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: `${process.env.CLIENT_ID}`,
      client_secret: `${process.env.CLIENT_SECRET}`,
      audience: 'https://api2.arduino.cc/iot'      
    })
  })

  const response = await request.json()

  return response.access_token
}

/**
 * Get sensor readings from the Arduino Cloud using its API.
 * 
 * @param {string} accessToken - JWT token
 * @param {string} propertyID - the thing property ID
 * @param {string} queries - queries string
 * @returns 
 */
async function getSensorReadings(accessToken, propertyID, queries) {
  const fetchString = `${process.env.THING_PROPERTIES_URL}/${propertyID}/timeseries?${queries}`

  const request = await fetch(fetchString, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }  
  })

  const response = await request.json()

  return response.data
}