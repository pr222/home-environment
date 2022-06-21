This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

<hr>

>This repository is deployed using Vercel at [https://home-environment.vercel.app/](https://home-environment.vercel.app/).

<hr>

## Consuming the API endpoints

### Home Environment IoT Data

Getting sensor readings: 
```
-GET https://{baseURL}/api/readings/home-environment?date={YYYY-MM-DD}
```
This will return as JSON with this schema:
```
{
    "thing": "Home-Environment",
    "properties": {
      "temperature": [{
        "time": "string",
        "value": "number"
      }], 
      "humidity": [{
        "time": "string",
        "value": "number"
      }]      
    }
}
```

The API sends calls to the Arduino IoT Cloud REST API following its [documentation](https://www.arduino.cc/reference/en/iot/api/).

### Weather Data
The weather endpoint uses [SMHI's Open API](http://opendata.smhi.se/apidocs/metobs/index.html) to get data.

Getting weather data:
```
-GET https://{baseURL}/api/weather/{YYYY-MM-DD}
```
This will return as JSON with this schema:
```
{
  "weather": {
    "temperature": [{
      "time": "string",
      "value": "string"
    }], 
    "humidity": [{
      "time": "string",
      "value": "string"
    }]      
  }
}
```

## Setting up the enrivonment variables for this project
### For communicating with Arduino Cloud REST API
How to create these variables for this project is described more in detail in the repository for the [arduino code](https://github.com/pr222/arduino).

```CLIENT_ID``` and ```CLIENT_SECRET``` refers to the API key created in the Arduino Cloud Integrations page.

```THING_PROPERTIES_URL``` refers to the URL to call to the REST API and looks like this:

```
https://api2.arduino.cc/iot/v2/things/{thing-id}/properties
```

In order to easily choose what property to query the link is followed by the property ID, which in this case are used in the environment variables ```TEMPERATURE_ID``` and ```HUMIDITY_ID```.

More information of how to make calls to the [Arduino's REST API](https://www.arduino.cc/reference/en/iot/api/).

### For communicating with SMHI's Open API
You can check their [documentation](http://opendata.smhi.se/apidocs/metobs/index.html) for how to find and use different endpoints. 

For this project the following variables were used:
```
WEATHER_API_LINK_TEMPERATURE="https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1/station/96190/period/latest-months/data.json"

WEATHER_API_LINK_HUMIDITY="https://opendata-download-metobs.smhi.se/api/version/latest/parameter/6/station/96190/period/latest-months/data.json"
```