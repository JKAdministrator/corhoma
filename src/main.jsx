import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';
import AppContextProvider from './AppContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={`${import.meta.env.VITE_APP_PATH}`}>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
)
