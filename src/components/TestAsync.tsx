import React, { useState } from 'react';
import useAsync from '../hooks/useAsync';

// Simulación de tipos de datos que tendríamos en TripWase
interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  averagePrice: number;
}

interface Weather {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
}

interface FlightPrice {
  from: string;
  to: string;
  price: number;
  airline: string;
  duration: string;
}

const TestAsync: React.FC = () => {
  // Estados para inputs
  const [destinationQuery, setDestinationQuery] = useState<string>('Madrid');
  const [weatherCity, setWeatherCity] = useState<string>('Barcelona');
  const [flightFrom, setFlightFrom] = useState<string>('Madrid');
  const [flightTo, setFlightTo] = useState<string>('Paris');

  // Funciones simuladas de API
  const fetchDestinations = async (query: string): Promise<Destination[]> => {
    console.log(`🔍 Buscando destinos para: "${query}"`);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular posible error (20% de probabilidad)
    if (Math.random() < 0.2) {
      throw new Error(`Error al buscar destinos para "${query}"`);
    }

    // Simular respuesta de API
    const mockDestinations: Destination[] = [
      {
        id: '1',
        name: `${query} Centro`,
        country: 'España',
        description: `El corazón histórico de ${query}`,
        averagePrice: 89
      },
      {
        id: '2', 
        name: `${query} Playa`,
        country: 'España',
        description: `Zona costera de ${query}`,
        averagePrice: 125
      },
      {
        id: '3',
        name: `${query} Montaña`,
        country: 'España', 
        description: `Región montañosa cerca de ${query}`,
        averagePrice: 95
      }
    ];

    return mockDestinations;
  };

  const fetchWeather = async (city: string): Promise<Weather> => {
    console.log(`🌤️ Obteniendo clima para: "${city}"`);
    
    // Simular delay más corto
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simular posible error (15% de probabilidad)
    if (Math.random() < 0.15) {
      throw new Error(`No se pudo obtener el clima para "${city}"`);
    }

    // Simular respuesta meteorológica
    const conditions = ['Soleado', 'Parcialmente nublado', 'Lluvioso', 'Nevando'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      location: city,
      temperature: Math.floor(Math.random() * 35) + 5, // 5-40°C
      condition: randomCondition,
      humidity: Math.floor(Math.random() * 60) + 20 // 20-80%
    };
  };

  const fetchFlightPrices = async (from: string, to: string): Promise<FlightPrice[]> => {
    console.log(`✈️ Buscando vuelos de ${from} a ${to}`);
    
    // Simular delay largo (como APIs reales de vuelos)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simular posible error (25% de probabilidad - APIs de vuelos fallan más)
    if (Math.random() < 0.25) {
      throw new Error(`No se encontraron vuelos de ${from} a ${to}`);
    }

    // Simular múltiples opciones de vuelo
    const airlines = ['Iberia', 'Vueling', 'Ryanair', 'Air Europa'];
    const flights: FlightPrice[] = airlines.map((airline, index) => ({
      from,
      to,
      price: Math.floor(Math.random() * 300) + 89, // 89-389€
      airline,
      duration: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 60)}min`
    }));

    return flights;
  };

  // Hooks useAsync para cada operación
  const destinationsAsync = useAsync(fetchDestinations, { 
    retries: 2, 
    timeout: 5000 
  });

  const weatherAsync = useAsync(fetchWeather, { 
    retries: 1, 
    timeout: 3000 
  });

  const flightsAsync = useAsync(fetchFlightPrices, { 
    retries: 3, 
    timeout: 10000,
    retryDelay: 2000
  });

  // Operación que siempre falla para demostrar manejo de errores
  const failingOperation = async (): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error('Esta operación siempre falla (para demostración)');
  };

  const failingAsync = useAsync(failingOperation, { 
    retries: 2,
    retryDelay: 500 
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🚀 Test useAsync Hook - Operaciones Avanzadas</h2>
      
      {/* Explicación del hook */}
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
        <h3>⚡ Funcionalidades de useAsync</h3>
        <ul style={{ textAlign: 'left', margin: '10px 0' }}>
          <li><strong>Estados automáticos:</strong> loading, data, error</li>
          <li><strong>Cancelación:</strong> Evita memory leaks</li>
          <li><strong>Retry automático:</strong> Reintenta en caso de fallos</li>
          <li><strong>Timeout:</strong> Cancela operaciones lentas</li>
          <li><strong>TypeScript:</strong> Tipado fuerte en todo</li>
        </ul>
      </div>

      {/* Test 1: Búsqueda de destinos */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #4caf50', borderRadius: '8px' }}>
        <h3>🔍 Búsqueda de Destinos (con retry y timeout)</h3>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text"
            value={destinationQuery}
            onChange={(e) => setDestinationQuery(e.target.value)}
            placeholder="Nombre del destino"
            style={{ padding: '8px', fontSize: '16px', marginRight: '10px', width: '200px' }}
          />
          <button 
            onClick={() => destinationsAsync.execute(destinationQuery)}
            disabled={destinationsAsync.loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: destinationsAsync.loading ? '#ccc' : '#4caf50',
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: destinationsAsync.loading ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            {destinationsAsync.loading ? '🔄 Buscando...' : '🔍 Buscar Destinos'}
          </button>
          <button 
            onClick={destinationsAsync.cancel}
            disabled={!destinationsAsync.loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              opacity: destinationsAsync.loading ? 1 : 0.5,
              cursor: destinationsAsync.loading ? 'pointer' : 'not-allowed',
              marginRight: '10px'
            }}
          >
            ⏹️ Cancelar
          </button>
          <button 
            onClick={destinationsAsync.reset}
            style={{ padding: '8px 16px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            🔄 Reset
          </button>
        </div>

        {/* Estado y resultados */}
        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <p><strong>Estado:</strong> {destinationsAsync.loading ? '⏳ Cargando...' : destinationsAsync.error ? '❌ Error' : destinationsAsync.data ? '✅ Éxito' : '⏸️ Inactivo'}</p>
          
          {destinationsAsync.error && (
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              🚨 Error: {destinationsAsync.error.message}
            </p>
          )}
          
          {destinationsAsync.data && (
            <div>
              <strong>📍 Destinos encontrados:</strong>
              <ul style={{ margin: '10px 0' }}>
                {destinationsAsync.data.map(dest => (
                  <li key={dest.id} style={{ margin: '5px 0', padding: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
                    <strong>{dest.name}</strong> - {dest.country} | 💰 ${dest.averagePrice}/noche
                    <br/>
                    <small style={{ color: '#666' }}>{dest.description}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Test 2: Información del clima */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #2196f3', borderRadius: '8px' }}>
        <h3>🌤️ Información del Clima (timeout corto)</h3>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text"
            value={weatherCity}
            onChange={(e) => setWeatherCity(e.target.value)}
            placeholder="Ciudad"
            style={{ padding: '8px', fontSize: '16px', marginRight: '10px', width: '200px' }}
          />
          <button 
            onClick={() => weatherAsync.execute(weatherCity)}
            disabled={weatherAsync.loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: weatherAsync.loading ? '#ccc' : '#2196f3',
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: weatherAsync.loading ? 'not-allowed' : 'pointer'
            }}
          >
            {weatherAsync.loading ? '🔄 Consultando...' : '🌤️ Ver Clima'}
          </button>
        </div>

        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          {weatherAsync.loading && <p>⏳ Consultando información meteorológica...</p>}
          {weatherAsync.error && <p style={{ color: 'red' }}>🌩️ {weatherAsync.error.message}</p>}
          {weatherAsync.data && (
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
              <h4>📍 {weatherAsync.data.location}</h4>
              <p><strong>🌡️ Temperatura:</strong> {weatherAsync.data.temperature}°C</p>
              <p><strong>☁️ Condición:</strong> {weatherAsync.data.condition}</p>
              <p><strong>💧 Humedad:</strong> {weatherAsync.data.humidity}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Test 3: Precios de vuelos */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #ff9800', borderRadius: '8px' }}>
        <h3>✈️ Precios de Vuelos (operación lenta con múltiples retries)</h3>
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text"
            value={flightFrom}
            onChange={(e) => setFlightFrom(e.target.value)}
            placeholder="Origen"
            style={{ padding: '8px', fontSize: '16px', width: '150px' }}
          />
          <span>→</span>
          <input 
            type="text"
            value={flightTo}
            onChange={(e) => setFlightTo(e.target.value)}
            placeholder="Destino" 
            style={{ padding: '8px', fontSize: '16px', width: '150px' }}
          />
          <button 
            onClick={() => flightsAsync.execute(flightFrom, flightTo)}
            disabled={flightsAsync.loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: flightsAsync.loading ? '#ccc' : '#ff9800',
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: flightsAsync.loading ? 'not-allowed' : 'pointer'
            }}
          >
            {flightsAsync.loading ? '✈️ Buscando vuelos...' : '🔍 Buscar Vuelos'}
          </button>
        </div>

        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          {flightsAsync.loading && (
            <div>
              <p>⏳ Consultando precios de vuelos...</p>
              <small style={{ color: '#666' }}>Esta operación puede tardar hasta 10 segundos y se reintentará automáticamente si falla</small>
            </div>
          )}
          {flightsAsync.error && <p style={{ color: 'red' }}>🛑 {flightsAsync.error.message}</p>}
          {flightsAsync.data && (
            <div>
              <strong>✈️ Opciones de vuelo disponibles:</strong>
              <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                {flightsAsync.data.map((flight, index) => (
                  <div key={index} style={{ padding: '12px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{flight.airline}</strong>
                        <br/>
                        <small>{flight.from} → {flight.to}</small>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4caf50' }}>
                          €{flight.price}
                        </div>
                        <small>{flight.duration}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Test 4: Operación que siempre falla */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #f44336', borderRadius: '8px' }}>
        <h3>🚨 Test de Manejo de Errores (operación que siempre falla)</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Esta operación está diseñada para fallar y demostrar el retry automático (2 intentos con 500ms de delay)
        </p>
        
        <button 
          onClick={() => failingAsync.execute()}
          disabled={failingAsync.loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: failingAsync.loading ? '#ccc' : '#f44336',
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: failingAsync.loading ? 'not-allowed' : 'pointer'
          }}
        >
          {failingAsync.loading ? '🔄 Reintentando...' : '💥 Ejecutar Operación Fallida'}
        </button>

        <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px', marginTop: '10px' }}>
          {failingAsync.loading && <p>⏳ Intentando operación... (se reintentará automáticamente si falla)</p>}
          {failingAsync.error && (
            <p style={{ color: 'red' }}>
              ❌ <strong>Error final:</strong> {failingAsync.error.message}
              <br/>
              <small>Se intentó 3 veces total (1 inicial + 2 retries)</small>
            </p>
          )}
        </div>
      </div>

      {/* Resumen de funcionalidades */}
      <div style={{ padding: '15px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '8px' }}>
        <h3>📊 Resumen de Capacidades Demostradas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '10px' }}>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
            <strong>🎯 Estados Automáticos</strong>
            <ul style={{ fontSize: '14px', margin: '5px 0' }}>
              <li>✅ Loading state</li>
              <li>✅ Success state</li>
              <li>✅ Error state</li>
            </ul>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
            <strong>🛡️ Protección Avanzada</strong>
            <ul style={{ fontSize: '14px', margin: '5px 0' }}>
              <li>✅ Cancelación de requests</li>
              <li>✅ Timeout configurable</li>
              <li>✅ Memory leak prevention</li>
            </ul>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
            <strong>🔄 Resilencia</strong>
            <ul style={{ fontSize: '14px', margin: '5px 0' }}>
              <li>✅ Retry automático</li>
              <li>✅ Backoff configurable</li>
              <li>✅ Error handling robusto</li>
            </ul>
          </div>
          <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>
            <strong>💻 Desarrollo</strong>
            <ul style={{ fontSize: '14px', margin: '5px 0' }}>
              <li>✅ TypeScript completo</li>
              <li>✅ API intuitiva</li>
              <li>✅ Altamente reutilizable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAsync;