import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

const TestDebounce: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchCalls, setSearchCalls] = useState<number>(0);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setSearchCalls(prev => prev + 1);
    }
  }, [debouncedSearchTerm]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>⚡ Test useDebounce Hook</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
        <h3>🎯 Cómo funciona useDebounce</h3>
        <p><strong>Sin debounce:</strong> Cada tecla = 1 API call ❌</p>
        <p><strong>Con debounce:</strong> Solo llama cuando dejas de escribir ✅</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>🔍 Búsqueda con Debounce (300ms)</h3>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Escribe para probar el debounce..."
          style={{ width: '300px', padding: '8px', fontSize: '16px', marginBottom: '10px' }}
        />
        <div>
          <p><strong>Valor actual:</strong> "{searchTerm}"</p>
          <p><strong>Valor con debounce:</strong> "{debouncedSearchTerm}"</p>
          <p><strong>🚀 API Calls simuladas:</strong> <span style={{color: 'red', fontWeight: 'bold'}}>{searchCalls}</span></p>
        </div>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '8px' }}>
        <h3>📈 Resultado</h3>
        <p>Total de llamadas: <strong>{searchCalls}</strong></p>
        <p>💡 Sin debounce habrían sido muchas más llamadas!</p>
      </div>
    </div>
  );
};

export default TestDebounce;
