import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import CustomHead from '../components/CustomHead'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <CustomHead />
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
