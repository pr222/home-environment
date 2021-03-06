import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react'

// Dynamic import for chart module to fix window-undefined, according to:
// https://github.com/apexcharts/vue-apexcharts/issues/307
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Diagram component.
 * 
 * @param {*} data - data to display.
 * @returns this component.
 */
export default function EnvironmentDiagram({ ...data }) {
  const [selection, setSelection] = useState({})
  const options = {
    chart: {
      id: 'home-environment',
      type: 'Line'
    },
    markers: {
      size: 5
    },
    xaxis: {
      categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    }
  }

  useEffect(() => {
    setSelection({
      series : [{
        color: '#CCCCCC',
        name: 'Weather Humidity',
        data:  data.weatherHumidity
      }, {
        color: '#1cb7cc',
        name: 'Humidity',
        data:  data.humidity
      }, {
        color: '#2dd37b',
        name: 'Temperature',
        data: data.temperature
      }, {
        color: '#000000',
        name: 'Weather Temperature',
        data:  data.weatherTemperature
      }
    ]})
  }, [data.temperature, data.humidity, data.weatherTemperature, data.weatherHumidity])

  return (
    <>
      <ApexCharts
        options={options}
        series={selection.series}
        width={800}
        height={620}
      />    
    </>
  )
}