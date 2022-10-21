import { SessionProvider } from "next-auth/react"
import { Toaster } from 'react-hot-toast';

import '../styles/globals.css'
import { PriceContext } from "../utils/context/PriceContext"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <PriceContext>
        <Toaster />
        <Component {...pageProps} />
      </PriceContext>
    </SessionProvider>
  )
}