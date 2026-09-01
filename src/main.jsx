import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FloraV1 from './FloraV1.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FloraV1 />
  </StrictMode>,
)
