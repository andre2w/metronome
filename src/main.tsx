// import './index.module.scss'
import "@picocss/pico/scss/pico.scss";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
