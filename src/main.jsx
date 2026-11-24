import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AcademyProvider } from './context/AcademyContext.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AcademyProvider>
      <App />
    </AcademyProvider>
  </React.StrictMode>,
)
