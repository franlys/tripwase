import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

const TestDebounce: React.FC = () => {
  // Estados para diferentes tests
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [budget, setBudget] = useState<number>(1000);
  const [destination, setDestination] = useState<string>('');

  // Aplicar debounce a cada valor
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedBudget = useDebounce(budget, 500);
  const debouncedDestination = useDebounce(destination, 400);

  // Contadores para mostrar cuántas veces se ejecutarían las "API calls"
  const [searchCalls, setSearchCalls] = useState<number>(0);
  const [budgetCalls, setBudgetCalls] = useState<number>(0);
  const [destinationCalls, setDestinationCalls] = useState<number>(0);

  // Estados para simular resultados de búsqueda
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [budgetResults, setBudgetResults] = useState<string>('');
  const [destinationResults, setDestinationResults] = useState<string[]>([]);

  // Simular búsqueda de términos generales
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setSearchCalls(prev => prev + 1);
      
      // Simular resultados de búsqueda
      const mockResults = [
        `"${debouncedSearchTerm}" en destinos`,
        `"${debouncedSearchTerm}" en actividades`,
        `"${debouncedSearchTerm}" en hoteles`,
        `"${debouncedSearchTerm}" en restaurantes`
      ];
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  // Simular cálculo de presupuesto
  useEffect(() => {
    if (debouncedBudget > 0) {
      setBudgetCalls(prev => prev + 1);
      
      // Simular análisis de presupuesto
      let analysis = '';
      if (debouncedBudget < 500) {
        analysis = 'Presupuesto bajo - Hostales y comida local';
      } else if (debouncedBudget < 1500) {
        analysis = 'Presupuesto medio - Hoteles 3⭐ y restaurantes';
      } else if (debouncedBudget < 3000) {
        analysis = 'Presupuesto alto - Hoteles 4⭐ y experiencias premium';
      } else {
        analysis = 'Presupuesto premium - Lujo total y experiencias exclusivas';
      }
      setBudgetResults(analysis);
    }
  }, [debouncedBudget]);

  // Simular búsqueda de destinos
  useEffect(() => {
    if (debouncedDestination.trim()) {
      setDestinationCalls(prev => prev + 1);
      
      // Simular sugerencias de destinos
      const mockDestinations = [
        `${debouncedDestination}, España`,
        `${debouncedDestination}, México`,
        `${debouncedDestination}, Argentina`,
        `${debouncedDestination}, Colombia`
      ];
      setDestinationResults(mockDestinations);
    } else {
      setDestinationResults([]);
    }
  }, [debouncedDestination]);

  // Función para limpiar todos los contadores
  const resetCounters = () => {
    setSearchCalls(0);
    setBudgetCalls(0);
    setDestinationCalls(0);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>⚡ Test useDebounce Hook</h2>
      
      {/* Información sobre el debounce */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '8px', border: '1px solid #bee5eb' }}>
        <h3>🎯 ¿Qué hace useDebounce?</h3>
        <p>
          <strong>Sin debounce:</strong> Cada tecla que presiones = 1 llamada a la API ❌<br/>
          <strong>Con debounce:</strong> Solo llama a la API cuando dejas de escribir por X milisegundos ✅
        </p>
        <button onClick={resetCounters} style={{ padding: '5px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          🔄 Reset Contadores
        </button>
      </div>

      {/* Test 1: Búsqueda general */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>🔍 Búsqueda General (300ms debounce)</h3>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Busca destinos, hoteles, actividades..."
          style={{ width: '300px', padding: '8px', fontSize: '16px', marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div>
            <p><strong>Valor actual:</strong> "{searchTerm}"</p>
            <p><strong>Valor con debounce:</strong> "{debouncedSearchTerm}"</p>
            <p><strong>🚀 API Calls simuladas:</strong> <span style={{color: 'red', fontWeight: 'bold'}}>{searchCalls}</span></p>
          </div>
          <div style={{ flex: 1 }}>
            <strong>📋 Resultados de búsqueda:</strong>
            {searchResults.length > 0 ? (
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {searchResults.map((result, index) => (
                  <li key={index} style={{ margin: '2px 0' }}>{result}</li>
                ))}
              </ul>
            ) : (
              <p style={{ fontStyle: 'italic', color: '#666' }}>Escribe para ver resultados...</p>
            )}
          </div>
        </div>
      </div>

      {/* Test 2: Presupuesto */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>💰 Calculadora de Presupuesto (500ms debounce)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <label>Presupuesto: $</label>
          <input 
            type="number" 
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min="0"
            max="10000"
            step="50"
            style={{ padding: '8px', fontSize: '16px', width: '100px' }}
          />
          <input 
            type="range" 
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min="0"
            max="5000"
            step="50"
            style={{ width: '200px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <p><strong>Valor actual:</strong> ${budget}</p>
            <p><strong>Valor con debounce:</strong> ${debouncedBudget}</p>
            <p><strong>🚀 Cálculos realizados:</strong> <span style={{color: 'red', fontWeight: 'bold'}}>{budgetCalls}</span></p>
          </div>
          <div style={{ flex: 1, padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <strong>📊 Análisis de presupuesto:</strong>
            <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#28a745' }}>
              {budgetResults || 'Ajusta el presupuesto para ver análisis...'}
            </p>
          </div>
        </div>
      </div>

      {/* Test 3: Destinos */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>🌎 Búsqueda de Destinos (400ms debounce)</h3>
        <input 
          type="text" 
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ej: Madrid, Cancún, Buenos Aires..."
          style={{ width: '300px', padding: '8px', fontSize: '16px', marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div>
            <p><strong>Valor actual:</strong> "{destination}"</p>
            <p><strong>Valor con debounce:</strong> "{debouncedDestination}"</p>
            <p><strong>🚀 Búsquedas realizadas:</strong> <span style={{color: 'red', fontWeight: 'bold'}}>{destinationCalls}</span></p>
          </div>
          <div style={{ flex: 1 }}>
            <strong>🏙️ Destinos sugeridos:</strong>
            {destinationResults.length > 0 ? (
              <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                {destinationResults.map((result, index) => (
                  <li key={index} style={{ margin: '2px 0', cursor: 'pointer', padding: '2px', borderRadius: '3px' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    📍 {result}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontStyle: 'italic', color: '#666' }}>Escribe un destino para ver sugerencias...</p>
            )}
          </div>
        </div>
      </div>

      {/* Resumen de optimización */}
      <div style={{ padding: '15px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px' }}>
        <h3>📈 Resumen de Optimización</h3>
        <p>
          <strong>Total de "API calls" simuladas:</strong> 
          <span style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}> {searchCalls + budgetCalls + destinationCalls}</span>
        </p>
        <p style={{ fontSize: '14px', color: '#155724' }}>
          💡 <strong>Sin debounce</strong>, cada tecla presionada habría sido una llamada a la API. 
          Con debounce, solo llamamos cuando el usuario termina de escribir, ¡ahorrando recursos y mejorando la experiencia!
        </p>
      </div>
    </div>
  );
};

export default TestDebounce;