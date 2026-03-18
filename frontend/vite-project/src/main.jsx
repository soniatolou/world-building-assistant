import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ConsistencyProvider } from './context/ConsistencyContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConsistencyProvider>
        <App />
      </ConsistencyProvider>
    </BrowserRouter>
  </StrictMode>,
)
