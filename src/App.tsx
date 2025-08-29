import React from 'react';
import TestPerformanceMonitor from './components/TestPerformanceMonitor';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TripWase - Desarrollo</h1>
        <p>Probando usePerformanceMonitor Hook</p>
      </header>
      <TestPerformanceMonitor />
    </div>
  );
}

export default App;