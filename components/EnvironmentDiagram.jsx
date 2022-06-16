import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react'
// import styles from '../styles/Home.module.css'

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
  // Set base options with countries for diagram.
  const [options, setOptions] = useState({
    chart: {
      id: 'home-environment',
      type: 'Line'
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    }
  })

  const [selection, setSelection] = useState({
    series : [{
      color: '#2dd37b',
      name: 'Temperature',
      data: data.temperatures
    }
  ]})

  useEffect(() => {
    setSelection({
      series : [{
        color: '#2dd37b',
        name: 'Temperature',
        data: data.temperatures
      }
    ]})
  }, [data.temperatures])

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