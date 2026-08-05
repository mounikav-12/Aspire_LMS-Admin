import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { LmsDataProvider } from './context/LmsDataContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <LmsDataProvider>
            <AppRoutes />
          </LmsDataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
