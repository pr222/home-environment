import moment from "Moment"

export default async function handler(req, res) {
  const { date } = req.query

  const request = await fetch(`${process.env.WEATHER_API_LINK}`, {
    method: 'GET'
  })

  const response = await request.json()

  console.log(date)

  console.log(moment(date))

  res.status(200).json(`Post: ${date}`)
}