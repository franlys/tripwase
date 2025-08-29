import React, { useState } from 'react';
import usePerformanceMonitor from '../hooks/usePerformanceMonitor';

const TestPerformanceMonitor: React.FC = () => {
  const [heavyRenderActive, setHeavyRenderActive] = useState<boolean>(false);
  const [itemCount, setItemCount] = useState<number>(100);

  const { webVitals, reactMetrics, appMetrics, isMonitoring, startMonitoring, stopMonitoring, resetMetrics, trackApiCall, trackUserInteraction, exportMetrics } = usePerformanceMonitor({
    enableWebVitals: true,
    enableReactMetrics: true,
    enableAppMetrics: true,
    updateInterval: 2000
  });

  const simulateApiCall = async (delay: number = 800) => {
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, delay));
    const duration = performance.now() - start;
    trackApiCall(duration);
  };

  const formatTime = (ms: number | undefined): string => {
    if (ms === undefined) return 'N/A';
    return Math.round(ms * 100) / 100 + 'ms';
  };

  const generateHeavyRender = () => {
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      items.push(
        <div key={i} style={{ padding: '2px', border: '1px solid #444' }}>
          Item {i} - {Math.random().toString(36).substring(7)}
        </div>
      );
    }
    return items;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <h2>Test usePerformanceMonitor Hook</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#374151', borderRadius: '8px' }}>
        <h3>Controles del Monitor</h3>
        <button onClick={isMonitoring ? stopMonitoring : startMonitoring} style={{ padding: '10px 20px', backgroundColor: isMonitoring ? '#dc2626' : '#059669', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
          {isMonitoring ? 'Detener' : 'Iniciar'} Monitoreo
        </button>
        <button onClick={resetMetrics} style={{ padding: '10px 20px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
          Reset Métricas
        </button>
        <button onClick={() => console.log(exportMetrics())} style={{ padding: '10px 20px', backgroundColor: '#0891b2', color: 'white', border: 'none', borderRadius: '4px' }}>
          Exportar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#065f46', borderRadius: '8px' }}>
          <h4>Web Vitals</h4>
          <p>TTFB: {formatTime(webVitals.TTFB)}</p>
          <p>FCP: {formatTime(webVitals.FCP)}</p>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#1e3a8a', borderRadius: '8px' }}>
          <h4>React Métricas</h4>
          <p>Renders: {reactMetrics.renderCount}</p>
          <p>Tiempo promedio: {formatTime(reactMetrics.averageRenderTime)}</p>
          <p>Renders lentos: {reactMetrics.slowRenders}</p>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#7c2d12', borderRadius: '8px' }}>
          <h4>App Métricas</h4>
          <p>API Calls: {appMetrics.apiCallsCount}</p>
          <p>Tiempo API: {formatTime(appMetrics.apiCallsAverageTime)}</p>
          <p>Interacciones: {appMetrics.userInteractions}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '2px solid #3b82f6', borderRadius: '8px' }}>
        <h3>Test de Rendimiento React</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Elementos: 
            <input type="range" min="50" max="500" step="50" value={itemCount} onChange={(e) => setItemCount(Number(e.target.value))} style={{ marginLeft: '10px' }} />
            {itemCount}
          </label>
        </div>
        <button onClick={() => { setHeavyRenderActive(!heavyRenderActive); trackUserInteraction(); }} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '10px' }}>
          {heavyRenderActive ? 'Detener' : 'Iniciar'} Render Pesado
        </button>
        {heavyRenderActive && (
          <div style={{ maxHeight: '150px', overflow: 'auto', backgroundColor: '#111827', padding: '10px', borderRadius: '4px' }}>
            {generateHeavyRender()}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '2px solid #ea580c', borderRadius: '8px' }}>
        <h3>Test de API</h3>
        <button onClick={() => { simulateApiCall(200); trackUserInteraction(); }} style={{ padding: '8px 16px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
          API Rápida
        </button>
        <button onClick={() => { simulateApiCall(1200); trackUserInteraction(); }} style={{ padding: '8px 16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px' }}>
          API Lenta
        </button>
      </div>
    </div>
  );
};

export default TestPerformanceMonitor;
