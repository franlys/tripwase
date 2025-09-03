// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

/**
 * Hook para aplicar debounce a un valor
 * �til para optimizar b�squedas y evitar llamadas excesivas a APIs
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
