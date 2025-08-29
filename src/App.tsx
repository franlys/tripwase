import React from 'react';
import TestErrorBoundary from './components/TestErrorBoundary';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TripWase - Desarrollo</h1>
        <p>Probando useErrorBoundary Hook</p>
      </header>
      <TestErrorBoundary />
    </div>
  );
}

export default App;