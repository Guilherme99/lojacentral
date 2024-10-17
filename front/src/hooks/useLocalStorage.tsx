/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

export function getStorageValue(key: string, defaultValue?: any) {
  // getting stored value
  const saved = localStorage.getItem(key);

  if (saved) {
    const initial = JSON.parse(saved);
    return initial;
  }
  return defaultValue;
}

export function setStorageValue(key: string, value: any) {
  // setting stored value
  localStorage.setItem(key, JSON.stringify(value));
}

export const useLocalStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
