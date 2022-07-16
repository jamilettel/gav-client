import '@/styles/globals.scss'
import store from '@/utils/store'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <Provider store={store}>
          <Component {...pageProps} />
      </Provider>
  )
}

export default MyApp
