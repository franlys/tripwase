import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Estados posibles de una operación asíncrona
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Configuración para useAsync
 */
export interface AsyncOptions {
  immediate?: boolean;     // Ejecutar inmediatamente al montar
  retries?: number;       // Número de reintentos en caso de error
  retryDelay?: number;    // Delay entre reintentos (ms)
  timeout?: number;       // Timeout para la operación (ms)
}

/**
 * Valor de retorno de useAsync
 */
export interface AsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  cancel: () => void;
}

/**
 * Hook avanzado para manejar operaciones asíncronas
 * 
 * Funcionalidades:
 * - Estados de loading, data, error
 * - Cancelación de peticiones
 * - Retry automático con backoff
 * - Timeout configurable
 * - Prevención de memory leaks
 * - TypeScript completamente tipado
 * 
 * @param asyncFunction - Función asíncrona a ejecutar
 * @param options - Configuración opcional
 * @returns Estado y funciones de control
 * 
 * @example
 * ```typescript
 * const fetchUser = async (id: string) => {
 *   const response = await fetch(`/api/users/${id}`);
 *   return response.json();
 * };
 * 
 * const { data, loading, error, execute } = useAsync(fetchUser);
 * 
 * // Ejecutar manualmente
 * const handleClick = () => execute('123');
 * ```
 */
function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: AsyncOptions = {}
): AsyncReturn<T> {
  const {
    immediate = false,
    retries = 0,
    retryDelay = 1000,
    timeout = 10000
  } = options;

  // Estados del hook
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  // Referencias para control
  const cancelRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPromiseRef = useRef<Promise<T> | null>(null);

  // Función para cancelar operación en curso
  const cancel = useCallback(() => {
    cancelRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Función para resetear el estado
  const reset = useCallback(() => {
    cancel();
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, [cancel]);

  // Función para crear timeout promise
  const createTimeoutPromise = useCallback((ms: number): Promise<never> => {
    return new Promise((_, reject) => {
      timeoutRef.current = setTimeout(() => {
        reject(new Error(`Operation timed out after ${ms}ms`));
      }, ms);
    });
  }, []);

  // Función para ejecutar con retry
  const executeWithRetry = useCallback(async (
    fn: () => Promise<T>, 
    retriesLeft: number
  ): Promise<T> => {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      if (retriesLeft > 0 && !cancelRef.current) {
        // Esperar antes del retry
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Si no fue cancelado, intentar de nuevo
        if (!cancelRef.current) {
          return executeWithRetry(fn, retriesLeft - 1);
        }
      }
      throw error;
    }
  }, [retryDelay]);

  // Función principal de ejecución
  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    // Cancelar cualquier operación en curso
    cancel();
    cancelRef.current = false;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      // Crear la promesa de la operación
      const operationPromise = executeWithRetry(
        () => asyncFunction(...args),
        retries
      );

      // Crear promesa de timeout
      const timeoutPromise = createTimeoutPromise(timeout);

      // Guardar referencia para posible cancelación
      currentPromiseRef.current = operationPromise;

      // Ejecutar con timeout
      const result = await Promise.race([
        operationPromise,
        timeoutPromise
      ]);

      // Si no fue cancelado, actualizar estado con éxito
      if (!cancelRef.current) {
        setState({
          data: result,
          loading: false,
          error: null
        });

        // Limpiar timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        return result;
      }
    } catch (error) {
      // Solo actualizar estado si no fue cancelado
      if (!cancelRef.current) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState({
          data: null,
          loading: false,
          error: errorObj
        });
      }
    }

    return null;
  }, [asyncFunction, retries, timeout, cancel, executeWithRetry, createTimeoutPromise]);

  // Ejecutar inmediatamente si está configurado
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  return {
    ...state,
    execute,
    reset,
    cancel
  };
}

export default useAsync;