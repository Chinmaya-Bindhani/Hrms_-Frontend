import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Styling_files/index.css'
import App from './app.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
