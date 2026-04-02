import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface SimpleTheme {
  name: string;
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export const themes: Record<string, SimpleTheme> = {
  light: {
    name: 'Light',
    primary: '#1976d2',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#e0e0e0'
  },
  dark: {
    name: 'Dark',
    primary: '#90caf9',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333'
  }
};

interface SimpleThemeContextType {
  theme: SimpleTheme;
  themeName: string;
  setTheme: (themeName: string) => void;
  isDark: boolean;
}

const SimpleThemeContext = createContext<SimpleThemeContextType | undefined>(undefined);

export const useSimpleTheme = () => {
  const context = useContext(SimpleThemeContext);
  if (!context) {
    throw new Error('useSimpleTheme must be used within a SimpleThemeProvider');
  }
  return context;
};

interface SimpleThemeProviderProps {
  children: ReactNode;
}

export const SimpleThemeProvider: React.FC<SimpleThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simpleTheme');
      return saved || 'light';
    }
    return 'light';
  });
  
  const theme = themes[themeName];
  const isDark = themeName === 'dark';

  const setTheme = (newThemeName: string) => {
    setThemeName(newThemeName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('simpleTheme', newThemeName);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && theme) {
      // Apply theme to document
      document.documentElement.className = `simple-theme-${themeName}`;
      document.documentElement.style.setProperty('--theme-primary', theme.primary);
      document.documentElement.style.setProperty('--theme-background', theme.background);
      document.documentElement.style.setProperty('--theme-surface', theme.surface);
      document.documentElement.style.setProperty('--theme-text', theme.text);
      document.documentElement.style.setProperty('--theme-text-secondary', theme.textSecondary);
      document.documentElement.style.setProperty('--theme-border', theme.border);
      
      // Apply to body
      document.body.style.backgroundColor = theme.background;
      document.body.style.color = theme.text;
    }
  }, [themeName, theme]);

  return (
    <SimpleThemeContext.Provider value={{ theme, themeName, setTheme, isDark }}>
      {children}
    </SimpleThemeContext.Provider>
  );
};
