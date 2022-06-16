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

  // Request for environment readings, THING PROPERTIES currently temperature per second-reading
  const request = await fetch(`${process.env.THING_PROPERTIES}/timeseries?desc=false&from=2022-06-14T00:00:00Z&interval=3600&to=2022-06-15T00:00:00Z`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }  
  })

  const response = await request.json()
  console.log(response)

  const temp = []

  response.data.forEach(element => {
    temp.push(element.value.toFixed(2))
  });

  console.log(temp)

  res.status(200).json({ temperatures: temp })
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