import { useState } from "react";

/**
 * A hook that syncs state with localStorage.
 * @param {string} key - The localStorage key.
 * @param {*} initialValue - Fallback if key doesn't exist.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof valueToStore === "string") {
        localStorage.setItem(key, valueToStore);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`useLocalStorage: failed to set key "${key}"`, error);
    }
  };

  return [storedValue, setValue];
}