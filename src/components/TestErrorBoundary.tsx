import React, { useState } from 'react';
import useErrorBoundary from '../hooks/useErrorBoundary';

const TestErrorBoundary: React.FC = () => {
  const [errorCount, setErrorCount] = useState<number>(0);

  const { hasError, error, resetError, captureError, retryCount, canRetry } = useErrorBoundary({
    maxRetries: 2,
    retryDelay: 2000,
    onError: () => setErrorCount(prev => prev + 1)
  });

  const throwError = () => {
    throw new Error('Error de prueba lanzado intencionalmente');
  };

  const simulateAsyncError = async () => {
    try {
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Error asíncrono simulado')), 1000);
      });
    } catch (error) {
      if (error instanceof Error) {
        captureError(error, { type: 'async' });
      }
    }
  };

  if (hasError && error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ padding: '20px', backgroundColor: '#ffebee', border: '2px solid #f44336', borderRadius: '8px' }}>
          <h2 style={{ color: '#d32f2f' }}>Error Capturado</h2>
          <p><strong>Mensaje:</strong> {error.message}</p>
          <p><strong>Timestamp:</strong> {new Date(error.timestamp).toLocaleString()}</p>
          <p><strong>Intentos:</strong> {retryCount}</p>
          
          <button onClick={resetError} style={{ padding: '10px 20px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <h2>Test useErrorBoundary Hook</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#374151', borderRadius: '8px' }}>
        <h3>Estadísticas</h3>
        <p>Errores capturados: {errorCount}</p>
        <p>Retries realizados: {retryCount}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test 1: Error Síncrono</h3>
        <button onClick={throwError} style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
          Lanzar Error
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test 2: Error Asíncrono</h3>
        <button onClick={simulateAsyncError} style={{ padding: '10px 20px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
          Error Asíncrono
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test 3: Error con Contexto</h3>
        <button onClick={() => captureError(new Error('Error con contexto'), { operation: 'test', userId: '123' })} style={{ padding: '10px 20px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px' }}>
          Error Contextual
        </button>
      </div>
    </div>
  );
};

export default TestErrorBoundary;
