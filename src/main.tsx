import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-right" 
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(12px)',
            color: '#f8fafc',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '10px',
            padding: '14px 20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            fontSize: '0.95rem',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ecfdf5',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fee2e2',
            },
          },
        }}
      />
      <App />
    </Provider>
  </StrictMode>,
)
