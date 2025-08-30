import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <div className="App">
          <Dashboard />
        </div>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
