import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const TestLocalStorage: React.FC = () => {
  // Probar el hook con diferentes tipos de datos
  const [name, setName] = useLocalStorage<string>('userName', '');
  const [count, setCount] = useLocalStorage<number>('counter', 0);
  const [preferences, setPreferences] = useLocalStorage<{theme: string, language: string}>('userPrefs', {
    theme: 'light',
    language: 'es'
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 Test useLocalStorage Hook</h2>
      
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>String Test</h3>
        <p>Nombre: {name || 'No definido'}</p>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Escribe tu nombre"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button onClick={() => setName('')} style={{ padding: '5px 10px' }}>
          Limpiar
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Number Test</h3>
        <p>Contador: {count}</p>
        <button onClick={() => setCount(c => c + 1)} style={{ padding: '5px 10px', marginRight: '10px' }}>
          Incrementar
        </button>
        <button onClick={() => setCount(c => c - 1)} style={{ padding: '5px 10px', marginRight: '10px' }}>
          Decrementar
        </button>
        <button onClick={() => setCount(0)} style={{ padding: '5px 10px' }}>
          Reset
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Object Test</h3>
        <p>Tema: {preferences.theme}</p>
        <p>Idioma: {preferences.language}</p>
        <button 
          onClick={() => setPreferences(prev => ({
            ...prev, 
            theme: prev.theme === 'light' ? 'dark' : 'light'
          }))}
          style={{ padding: '5px 10px', marginRight: '10px' }}
        >
          Toggle Tema
        </button>
        <button 
          onClick={() => setPreferences(prev => ({
            ...prev, 
            language: prev.language === 'es' ? 'en' : 'es'
          }))}
          style={{ padding: '5px 10px' }}
        >
          Toggle Idioma
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
        <h4>📋 Instrucciones de Prueba:</h4>
        <ul style={{ textAlign: 'left' }}>
          <li>Escribe tu nombre y verifica que se guarda</li>
          <li>Incrementa el contador varias veces</li>
          <li>Cambia tema e idioma</li>
          <li>Recarga la página (F5) - ¡Los datos deben persistir!</li>
          <li>Abre otra pestaña con la misma URL - ¡Sincronización automática!</li>
        </ul>
      </div>
    </div>
  );
};

export default TestLocalStorage;