/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { darkTheme, stitches } from "../styles/stitches.config";
import { getStorageValue, setStorageValue } from "../hooks/useLocalStorage";

export const ThemeContext = React.createContext<any>(undefined);

const html = document.documentElement;

type ThemeProviderProps = {
  children: any;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useState({
    type: "light",
    className: "",
  });

  const toggleTheme = () => {
    const newTheme = currentTheme.type !== "light" ? stitches.theme : darkTheme;
    const previousTheme = currentTheme.className;
    const newCurrentTheme = {
      type: currentTheme.type !== "light" ? "light" : "dark",
      className: newTheme.className,
    };

    setCurrentTheme(() => {
      return newCurrentTheme;
    });

    html.classList.add(newTheme.className);
    setStorageValue("coders@theme", newCurrentTheme);
    if (previousTheme) {
      html.classList.remove(previousTheme);
    }
  };

  useEffect(() => {
    const storage = getStorageValue("coders@theme");

    if (storage) {
      const newTheme = storage.type === "light" ? stitches.theme : darkTheme;
      setCurrentTheme(() => {
        return {
          type: storage.type,
          className: storage.className,
        };
      });

      html.classList.add(newTheme?.className);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        toggleTheme: toggleTheme,
        theme: currentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
