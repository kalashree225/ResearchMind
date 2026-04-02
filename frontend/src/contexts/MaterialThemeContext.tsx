import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface MaterialTheme {
  name: string;
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  background: string;
  surface: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  onError: string;
  elevation: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
}

const materialThemes: Record<string, MaterialTheme> = {
  light: {
    name: 'Light',
    primary: '#1976d2',
    primaryVariant: '#002171',
    secondary: '#dc004e',
    secondaryVariant: '#7a0000',
    background: '#ffffff',
    surface: '#ffffff',
    error: '#b00020',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#ffffff',
    elevation: {
      level1: '#f5f5f5',
      level2: '#eeeeee',
      level3: '#e0e0e0',
      level4: '#bdbdbd'
    }
  },
  dark: {
    name: 'Dark',
    primary: '#90caf9',
    primaryVariant: '#1976d2',
    secondary: '#f48fb1',
    secondaryVariant: '#c2185b',
    background: '#121212',
    surface: '#121212',
    error: '#cf6679',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    onError: '#000000',
    elevation: {
      level1: '#1e1e1e',
      level2: '#2a2a2a',
      level3: '#363636',
      level4: '#424242'
    }
  },
  highContrast: {
    name: 'High Contrast',
    primary: '#0000ff',
    primaryVariant: '#000080',
    secondary: '#ff0000',
    secondaryVariant: '#800000',
    background: '#ffffff',
    surface: '#ffffff',
    error: '#ff0000',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#ffffff',
    elevation: {
      level1: '#f0f0f0',
      level2: '#e0e0e0',
      level3: '#d0d0d0',
      level4: '#c0c0c0'
    }
  }
};

interface MaterialThemeContextType {
  theme: MaterialTheme;
  themeName: string;
  setTheme: (themeName: string) => void;
  isDark: boolean;
}

const MaterialThemeContext = createContext<MaterialThemeContextType | undefined>(undefined);

export const useMaterialTheme = () => {
  const context = useContext(MaterialThemeContext);
  if (!context) {
    throw new Error('useMaterialTheme must be used within a MaterialThemeProvider');
  }
  return context;
};

interface MaterialThemeProviderProps {
  children: ReactNode;
}

export const MaterialThemeProvider: React.FC<MaterialThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    return localStorage.getItem('materialTheme') || 'light';
  });
  
  const theme = materialThemes[themeName];
  const isDark = themeName === 'dark' || themeName === 'highContrast';

  const setTheme = (newThemeName: string) => {
    setThemeName(newThemeName);
  };

  useEffect(() => {
    localStorage.setItem('materialTheme', themeName);
    
    // Apply theme to document
    document.documentElement.className = `material-theme-${themeName}`;
    
    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--md-primary', theme.primary);
    root.style.setProperty('--md-primary-variant', theme.primaryVariant);
    root.style.setProperty('--md-secondary', theme.secondary);
    root.style.setProperty('--md-secondary-variant', theme.secondaryVariant);
    root.style.setProperty('--md-background', theme.background);
    root.style.setProperty('--md-surface', theme.surface);
    root.style.setProperty('--md-error', theme.error);
    root.style.setProperty('--md-on-primary', theme.onPrimary);
    root.style.setProperty('--md-on-secondary', theme.onSecondary);
    root.style.setProperty('--md-on-background', theme.onBackground);
    root.style.setProperty('--md-on-surface', theme.onSurface);
    root.style.setProperty('--md-on-error', theme.onError);
    root.style.setProperty('--md-elevation-1', theme.elevation.level1);
    root.style.setProperty('--md-elevation-2', theme.elevation.level2);
    root.style.setProperty('--md-elevation-3', theme.elevation.level3);
    root.style.setProperty('--md-elevation-4', theme.elevation.level4);
    
    // Apply theme class to body
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
  }, [themeName, theme, isDark]);

  return (
    <MaterialThemeContext.Provider value={{ theme, themeName, setTheme, isDark }}>
      {children}
    </MaterialThemeContext.Provider>
  );
};
