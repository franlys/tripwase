import { useState, useEffect } from 'react';

/**
 * Custom hook para manejar localStorage con TypeScript
 * @param key - Clave para localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns [valor, setValue] - Estado y función para actualizar
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Intentar obtener el valor del localStorage
      const item = window.localStorage.getItem(key);
      
      // Si existe, parsearlo; si no, usar el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay error al parsear, usar valor inicial
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para casos como setState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Actualizar el estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Disparar evento personalizado para sincronización entre pestañas
      window.dispatchEvent(
        new CustomEvent('localStorageChange', {
          detail: { key, value: valueToStore }
        })
      );
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Escuchar cambios en localStorage de otras pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    // Escuchar cambios desde otras pestañas
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar cambios desde la misma pestaña
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };
    
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;