import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import TestAuthContext from './components/TestAuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <h1>TripWase - Desarrollo</h1>
          <p>Probando AuthContext - Sistema de Autenticación</p>
        </header>
        <TestAuthContext />
      </div>
    </AuthProvider>
  );
}

export default App;