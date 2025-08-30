import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import TestTripContext from './components/TestTripContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <div className="App">
          <header className="App-header">
            <h1>TripWase - Desarrollo</h1>
            <p>Probando TripContext - Sistema de Planificación de Viajes</p>
          </header>
          <TestTripContext />
        </div>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;