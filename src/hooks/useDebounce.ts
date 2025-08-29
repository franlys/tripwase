import { useState, useEffect } from 'react';

/**
 * Hook para aplicar debounce a un valor
 * Útil para optimizar búsquedas y evitar llamadas excesivas a APIs
 * 
 * @param value - Valor al que aplicar debounce
 * @param delay - Tiempo de espera en milisegundos (por defecto 300ms)
 * @returns Valor con debounce aplicado
 * 
 * @example
 * ```typescript
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // Llamar a la API solo cuando el usuario deje de escribir
 *     searchAPI(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  // Estado para almacenar el valor con debounce
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar el timer para actualizar el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia antes de que termine el delay
    // Esto es lo que previene las llamadas excesivas
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Se ejecuta cuando cambia el valor o el delay

  return debouncedValue;
}

export default useDebounce;