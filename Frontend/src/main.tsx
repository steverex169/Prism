import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <NotificationProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </NotificationProvider>
    </StrictMode>
  </BrowserRouter>,
)
