import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.tsx';
import { Toaster } from 'react-hot-toast';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ProfileProvider } from './contexts/ProfileContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ProfileProvider>
            <App />
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#ffffff',
                  color: '#0f172a',
                },
              }}
            />
        </ProfileProvider>
      </AuthProvider>
    </Router>
  </StrictMode>,
);
