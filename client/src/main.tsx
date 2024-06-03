import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './redux/Store.ts'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Toaster />
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode>, */}
    </BrowserRouter>
  </Provider>
)
