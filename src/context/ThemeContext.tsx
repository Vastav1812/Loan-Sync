import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  primary: '#4A6FFF',
  secondary: '#FF6B6B',
  background: '#FFFFFF',
  card: '#F5F7FF',
  text: '#1A1A1A',
  border: '#E1E1E1',
  notification: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  info: '#5AC8FA',
  error: '#FF3B30',
  disabled: '#C7C7CC',
  accent: '#5E5CE6',
};

export const darkTheme = {
  primary: '#5E5CE6',
  secondary: '#FF6B6B',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2C2C2C',
  notification: '#FF453A',
  success: '#32D74B',
  warning: '#FFD60A',
  info: '#64D2FF',
  error: '#FF453A',
  disabled: '#3A3A3C',
  accent: '#BF5AF2',
};

// Theme names for selection
export const themes = {
  light: 'light',
  dark: 'dark',
  system: 'system',
  neonNight: 'neonNight',
  oceanBreeze: 'oceanBreeze',
};

// Custom themes
export const neonNightTheme = {
  ...darkTheme,
  primary: '#00FFFF',
  secondary: '#FF00FF',
  accent: '#FFFF00',
  card: '#1A1A2E',
};

export const oceanBreezeTheme = {
  ...lightTheme,
  primary: '#0077B6',
  secondary: '#48CAE4',
  background: '#F0FAFF',
  card: '#E1F5FE',
  accent: '#00B4D8',
};

type ThemeType = typeof lightTheme;
type ThemeNameType = keyof typeof themes;

interface ThemeContextType {
  theme: ThemeType;
  themeName: ThemeNameType;
  isDark: boolean;
  setTheme: (name: ThemeNameType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeName: 'system',
  isDark: false,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() || 'light';
  const [themeName, setThemeName] = useState<ThemeNameType>('system');
  const [theme, setThemeColors] = useState<ThemeType>(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeName');
        if (savedTheme && Object.keys(themes).includes(savedTheme)) {
          setThemeName(savedTheme as ThemeNameType);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    loadTheme();
  }, []);

  // Update theme when themeName changes
  useEffect(() => {
    let selectedTheme: ThemeType;
    
    switch (themeName) {
      case 'light':
        selectedTheme = lightTheme;
        break;
      case 'dark':
        selectedTheme = darkTheme;
        break;
      case 'neonNight':
        selectedTheme = neonNightTheme;
        break;
      case 'oceanBreeze':
        selectedTheme = oceanBreezeTheme;
        break;
      case 'system':
      default:
        selectedTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
        break;
    }
    
    setThemeColors(selectedTheme);
    
    // Save theme preference
    AsyncStorage.setItem('themeName', themeName).catch(error => {
      console.error('Failed to save theme preference:', error);
    });
  }, [themeName, systemColorScheme]);

  const isDark = 
    themeName === 'dark' || 
    themeName === 'neonNight' || 
    (themeName === 'system' && systemColorScheme === 'dark');

  const setTheme = (name: ThemeNameType) => {
    setThemeName(name);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};