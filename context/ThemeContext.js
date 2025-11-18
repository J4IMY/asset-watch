import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setTheme(colorScheme || 'light');
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const themeColors = {
    light: {
      primary: '#1976D2',
      secondary: '#4CAF50',
      background: '#F5F7FA',
      surface: '#FFFFFF',
      text: '#2D3748',
      error: '#E53E3E'
    },
    dark: {
      primary: '#64B5F6',
      secondary: '#81C784',
      background: '#1A202C',
      surface: '#2D3748',
      text: '#E2E8F0',
      error: '#FC8181'
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      colors: themeColors[theme],
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
