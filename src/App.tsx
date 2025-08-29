import React from 'react';
import TestLocalStorage from './components/TestLocalStorage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🧳 TripWase - Desarrollo - Franlys</h1>
        <p>Probando useLocalStorage Hook</p>
      </header>
      <TestLocalStorage />
    </div>
  );
}

export default App;
