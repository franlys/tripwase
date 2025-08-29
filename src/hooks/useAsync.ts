import { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface AsyncOptions {
  immediate?: boolean;
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

export interface AsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  cancel: () => void;
}

function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: AsyncOptions = {}
): AsyncReturn<T> {
  const { immediate = false, retries = 0, retryDelay = 1000, timeout = 10000 } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const cancelRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setState({ data: null, loading: false, error: null });
  }, [cancel]);

  const executeWithRetry = useCallback(async (
    fn: () => Promise<T>, 
    retriesLeft: number
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retriesLeft > 0 && !cancelRef.current) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        if (!cancelRef.current) {
          return executeWithRetry(fn, retriesLeft - 1);
        }
      }
      throw error;
    }
  }, [retryDelay]);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    cancel();
    cancelRef.current = false;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await executeWithRetry(() => asyncFunction(...args), retries);
      
      if (!cancelRef.current) {
        setState({ data: result, loading: false, error: null });
        return result;
      }
    } catch (error) {
      if (!cancelRef.current) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: errorObj });
      }
    }
    return null;
  }, [asyncFunction, retries, cancel, executeWithRetry]);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  useEffect(() => cancel, [cancel]);

  return { ...state, execute, reset, cancel };
}

export default useAsync;
