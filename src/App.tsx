import React from 'react';
import TestAsync from './components/TestAsync';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TripWase - Desarrollo</h1>
        <p>Probando useAsync Hook</p>
      </header>
      <TestAsync />
    </div>
  );
}

export default App;