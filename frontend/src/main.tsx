import React from 'react'
import reactDOMClient from 'react-dom/client'
import './index.css'
import App from './App'

reactDOMClient.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)