import moment from "Moment"

export default async function handler(req, res) {
  const { date } = req.query

  const request = await fetch(`${process.env.WEATHER_API_LINK}`, {
    method: 'GET'
  })

  const response = await request.json()
  console.log(response)
  console.log(date)
  const time = `${date}T00:00:00`
  const tajm = Math.floor(new Date(time).getTime()/1000.0) 
  console.log(moment(tajm).unix())
  console.log(moment(tajm).format('x'))


  const one = moment(response.value[2].date).format()
  console.log(one, 'TWEO?')
  const results = []

  for (let m of response.value) {
    if (moment(m.date).format().split('T')[0] === date) {
      const temp = {
        time: moment(m.date).format(),
        value: m.value
      }

      results.push(temp)
    }
  }
  console.log(results)

  res.status(200).json({ temperature: results })
}