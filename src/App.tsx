import React from 'react';
import TestDebounce from './components/TestDebounce';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🧳 TripWase - Desarrollo</h1>
        <p>Probando useDebounce Hook</p>
      </header>
      <TestDebounce />
    </div>
  );
}

export default App;