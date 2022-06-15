import Head from 'next/head'
import router from 'next/router'
import { useState } from 'react'
import moment from 'Moment'
import EnvironmentDiagram from '../components/EnvironmentDiagram'
import styles from '../styles/Home.module.css'

export default function Home() {

  const [greeting, setGreeting] = useState('Hello')
  const [date, setDate] = useState(moment()) // default to "now"
  const [formDate, setFormDate] = useState(date.format().split('T')[0]) // make form-friendly format with the default date

  // moment.format()

  console.log(date.calendar())
  console.log(formDate)

  const handleDateChange = event => {
    console.log(event.target.value)
    setFormDate(event.target.value)

    setDate(moment(event.target.value))
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Environment</title>
        <meta name="description" content="A Home Environment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          A Home Environment
        </h1>

        <form>
          <label htmlFor="formDate">Select a date </label>
          <input type="date" id="formDate" name="formDate" value={formDate} onChange={handleDateChange}></input>
        </form>

        <p>Display data for {date.calendar()}</p>

        <EnvironmentDiagram message={greeting} />

      </main>

      <footer className={styles.footer}>
        {
        /*
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>        
        */
        }

      </footer>
    </div>
  )
}
