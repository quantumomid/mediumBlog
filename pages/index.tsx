import Head from 'next/head'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className="">
      <Header />
      <Head>
        <title>Medium 2.0</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

        <h1 className="">Medium 2.0</h1>

    </div>
  )
}
