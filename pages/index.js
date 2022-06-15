import Head from 'next/head'
import { useState } from 'react'
import EnvironmentDiagram from '../components/EnvironmentDiagram'
import styles from '../styles/Home.module.css'

export default function Home() {

const [greeting, setGreeting] = useState('Hello')

  const handleSubmit = event => {
    event.preventDefault()

    setGreeting('HELLO WORLD!')
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

        <form onSubmit={handleSubmit}>
          <button type="submit">Push me!</button>
        </form>

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
