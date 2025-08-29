import { useState, useEffect, useCallback } from 'react';

export interface ErrorInfo {
  message: string;
  stack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  context?: Record<string, any>;
}

export interface ErrorBoundaryOptions {
  onError?: (error: ErrorInfo) => void;
  maxRetries?: number;
  retryDelay?: number;
  logToConsole?: boolean;
}

export interface ErrorBoundaryReturn {
  hasError: boolean;
  error: ErrorInfo | null;
  resetError: () => void;
  captureError: (error: Error, context?: Record<string, any>) => void;
  retryCount: number;
  canRetry: boolean;
}

function useErrorBoundary(options: ErrorBoundaryOptions = {}): ErrorBoundaryReturn {
  const { onError, maxRetries = 3, retryDelay = 1000, logToConsole = true } = options;

  const [state, setState] = useState({
    hasError: false,
    error: null as ErrorInfo | null,
    retryCount: 0
  });

  const createErrorInfo = useCallback((error: Error, context?: Record<string, any>): ErrorInfo => {
    return {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };
  }, []);

  const captureError = useCallback((error: Error, context?: Record<string, any>) => {
    const errorInfo = createErrorInfo(error, context);

    if (logToConsole) {
      console.error('Error captured:', error, errorInfo);
    }

    setState(prev => ({
      hasError: true,
      error: errorInfo,
      retryCount: prev.retryCount
    }));

    if (onError) {
      onError(errorInfo);
    }
  }, [createErrorInfo, logToConsole, onError]);

  const resetError = useCallback(() => {
    setState(prev => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1
    }));
  }, []);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      captureError(error, { type: 'globalError' });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      captureError(error, { type: 'unhandledRejection' });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [captureError]);

  return {
    hasError: state.hasError,
    error: state.error,
    resetError,
    captureError,
    retryCount: state.retryCount,
    canRetry: state.retryCount < maxRetries
  };
}

export default useErrorBoundary;
