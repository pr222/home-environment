import moment from 'Moment'

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
  // Set the right dates
  let startDate = moment(req.query.date)
  let endDate = startDate.clone().add(1, 'days')

  // Format dates
  startDate = startDate.format().split('T')[0]
  endDate = endDate.format().split('T')[0]

  let interval = 3600 // 1 hour in seconds

  const accessToken = await getAccessToken()

  if(!accessToken) {
    return res.status(500).json({ message: 'Could not establish connection.'})
  }

  const fetchString = `${process.env.THING_PROPERTIES}/timeseries?desc=false&from=${startDate}T00:00:00Z&interval=${interval}&to=${endDate}T00:00:00Z`

  // Request for environment readings, THING PROPERTIES currently temperature per second-reading
  const request = await fetch(fetchString, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }  
  })

  const response = await request.json()

  // Cleanup data to return to the client.
  const temp = []

  response.data.forEach(element => {
    temp.push(element.value.toFixed(2))
  });

  res.status(200).json({ temperature: temp })
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