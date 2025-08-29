import { useState, useEffect, useCallback, useRef } from 'react';

export interface WebVitals {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
}

export interface ReactMetrics {
  renderCount: number;
  rerenderDuration: number;
  averageRenderTime: number;
  slowRenders: number;
  memoryUsage?: number;
}

export interface AppMetrics {
  apiCallsCount: number;
  apiCallsAverageTime: number;
  slowApiCalls: number;
  errorRate: number;
  userInteractions: number;
}

export interface PerformanceState {
  webVitals: WebVitals;
  reactMetrics: ReactMetrics;
  appMetrics: AppMetrics;
  isMonitoring: boolean;
  lastUpdated: number;
}

export interface PerformanceOptions {
  enableWebVitals?: boolean;
  enableReactMetrics?: boolean;
  enableAppMetrics?: boolean;
  slowRenderThreshold?: number;
  slowApiThreshold?: number;
  updateInterval?: number;
  onMetricsUpdate?: (metrics: PerformanceState) => void;
  enableLogging?: boolean;
}

export interface PerformanceMonitorReturn extends PerformanceState {
  startMonitoring: () => void;
  stopMonitoring: () => void;
  resetMetrics: () => void;
  trackApiCall: (duration: number) => void;
  trackUserInteraction: () => void;
  trackError: () => void;
  exportMetrics: () => string;
}

function usePerformanceMonitor(options: PerformanceOptions = {}): PerformanceMonitorReturn {
  const { enableLogging = false, slowRenderThreshold = 16, slowApiThreshold = 1000, updateInterval = 5000 } = options;

  const [state, setState] = useState<PerformanceState>({
    webVitals: {},
    reactMetrics: { renderCount: 0, rerenderDuration: 0, averageRenderTime: 0, slowRenders: 0 },
    appMetrics: { apiCallsCount: 0, apiCallsAverageTime: 0, slowApiCalls: 0, errorRate: 0, userInteractions: 0 },
    isMonitoring: false,
    lastUpdated: Date.now()
  });

  const renderTimes = useRef<number[]>([]);
  const apiTimes = useRef<number[]>([]);
  const errorCount = useRef<number>(0);
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);

  const measureWebVitals = useCallback((): WebVitals => {
    const vitals: WebVitals = {};
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      vitals.TTFB = navigation.responseStart - navigation.requestStart;
    }
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        vitals.FCP = entry.startTime;
      }
    });
    return vitals;
  }, []);

  const calculateReactMetrics = useCallback((): ReactMetrics => {
    const times = renderTimes.current;
    const renderCount = times.length;
    if (renderCount === 0) {
      return { renderCount: 0, rerenderDuration: 0, averageRenderTime: 0, slowRenders: 0 };
    }
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageRenderTime = totalTime / renderCount;
    const slowRenders = times.filter(time => time > slowRenderThreshold).length;
    return { renderCount, rerenderDuration: totalTime, averageRenderTime, slowRenders };
  }, [slowRenderThreshold]);

  const calculateAppMetrics = useCallback((): AppMetrics => {
    const times = apiTimes.current;
    const apiCallsCount = times.length;
    if (apiCallsCount === 0) {
      return { apiCallsCount: 0, apiCallsAverageTime: 0, slowApiCalls: 0, errorRate: 0, userInteractions: state.appMetrics.userInteractions };
    }
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const apiCallsAverageTime = totalTime / apiCallsCount;
    const slowApiCalls = times.filter(time => time > slowApiThreshold).length;
    const errorRate = errorCount.current / apiCallsCount;
    return { apiCallsCount, apiCallsAverageTime, slowApiCalls, errorRate, userInteractions: state.appMetrics.userInteractions };
  }, [slowApiThreshold, state.appMetrics.userInteractions]);

  const updateMetrics = useCallback(() => {
    setState(prevState => ({
      webVitals: measureWebVitals(),
      reactMetrics: calculateReactMetrics(),
      appMetrics: calculateAppMetrics(),
      isMonitoring: prevState.isMonitoring,
      lastUpdated: Date.now()
    }));
  }, [measureWebVitals, calculateReactMetrics, calculateAppMetrics]);

  const startMonitoring = useCallback(() => {
    if (monitoringInterval.current) clearInterval(monitoringInterval.current);
    setState(prev => ({ ...prev, isMonitoring: true }));
    updateMetrics();
    monitoringInterval.current = setInterval(updateMetrics, updateInterval);
  }, [updateMetrics, updateInterval]);

  const stopMonitoring = useCallback(() => {
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
    setState(prev => ({ ...prev, isMonitoring: false }));
  }, []);

  const resetMetrics = useCallback(() => {
    renderTimes.current = [];
    apiTimes.current = [];
    errorCount.current = 0;
    setState({
      webVitals: {},
      reactMetrics: { renderCount: 0, rerenderDuration: 0, averageRenderTime: 0, slowRenders: 0 },
      appMetrics: { apiCallsCount: 0, apiCallsAverageTime: 0, slowApiCalls: 0, errorRate: 0, userInteractions: 0 },
      isMonitoring: false,
      lastUpdated: Date.now()
    });
  }, []);

  const trackApiCall = useCallback((duration: number) => {
    apiTimes.current.push(duration);
    if (apiTimes.current.length > 100) {
      apiTimes.current = apiTimes.current.slice(-100);
    }
  }, []);

  const trackUserInteraction = useCallback(() => {
    setState(prev => ({
      ...prev,
      appMetrics: { ...prev.appMetrics, userInteractions: prev.appMetrics.userInteractions + 1 }
    }));
  }, []);

  const trackError = useCallback(() => {
    errorCount.current += 1;
  }, []);

  const exportMetrics = useCallback((): string => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  useEffect(() => {
    return () => {
      if (monitoringInterval.current) clearInterval(monitoringInterval.current);
    };
  }, []);

  return { ...state, startMonitoring, stopMonitoring, resetMetrics, trackApiCall, trackUserInteraction, trackError, exportMetrics };
}

export default usePerformanceMonitor;
