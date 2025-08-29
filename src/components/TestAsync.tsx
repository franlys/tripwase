import React, { useState } from 'react';
import useAsync from '../hooks/useAsync';

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  averagePrice: number;
}

const TestAsync: React.FC = () => {
  const [destinationQuery, setDestinationQuery] = useState<string>('Madrid');

  const fetchDestinations = async (query: string): Promise<Destination[]> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (Math.random() < 0.2) {
      throw new Error('Error al buscar destinos');
    }

    return [
      { id: '1', name: query + ' Centro', country: 'España', description: 'Centro histórico', averagePrice: 89 },
      { id: '2', name: query + ' Playa', country: 'España', description: 'Zona costera', averagePrice: 125 }
    ];
  };

  const destinationsAsync = useAsync(fetchDestinations, { retries: 2, timeout: 5000 });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <h2>Test useAsync Hook</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          value={destinationQuery}
          onChange={(e) => setDestinationQuery(e.target.value)}
          placeholder="Destino"
          style={{ padding: '8px', fontSize: '16px', marginRight: '10px' }}
        />
        <button 
          onClick={() => destinationsAsync.execute(destinationQuery)}
          disabled={destinationsAsync.loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: destinationsAsync.loading ? '#ccc' : '#4caf50',
            color: 'white', 
            border: 'none', 
            borderRadius: '4px'
          }}
        >
          {destinationsAsync.loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#333', borderRadius: '5px' }}>
        <p>Estado: {destinationsAsync.loading ? 'Cargando...' : destinationsAsync.error ? 'Error' : destinationsAsync.data ? 'Éxito' : 'Inactivo'}</p>
        
        {destinationsAsync.error && (
          <p style={{ color: 'red' }}>Error: {destinationsAsync.error.message}</p>
        )}
        
        {destinationsAsync.data && (
          <div>
            <strong>Destinos encontrados:</strong>
            <ul>
              {destinationsAsync.data.map(dest => (
                <li key={dest.id}>
                  {dest.name} - {dest.country} | {dest.averagePrice}/noche
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAsync;
