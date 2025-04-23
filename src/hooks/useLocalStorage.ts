
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() =>{
    if ( typeof window === 'undefined') return defaultValue;

    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch(error) {
        console.warn('useLocalStorage error', error);
        return defaultValue;
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch(error) {
        console.warn('useLocalStorage error', error);
    }
  },[key, value])

  return[value, setValue] as const
}

