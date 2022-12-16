import type { AppProps } from "next/app"
import Head from "next/head"
import { Inter } from "@next/font/google"

import "../style/global.css"
// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] })

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </main>
  )
}
