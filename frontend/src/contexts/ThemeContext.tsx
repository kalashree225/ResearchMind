import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'teal';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
  colors: typeof themes[Theme];
}

const themes = {
  light: {
    name: 'Light',
    bg: 'bg-white',
    bgSecondary: 'bg-gray-50',
    bgCard: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    border: 'border-gray-200',
    borderLight: 'border-gray-100',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    primaryLight: 'bg-blue-50',
    secondary: 'bg-purple-600',
    secondaryHover: 'hover:bg-purple-700',
    secondaryText: 'text-purple-600',
    secondaryLight: 'bg-purple-50',
    success: 'bg-green-600',
    successHover: 'hover:bg-green-700',
    successText: 'text-green-600',
    successLight: 'bg-green-50',
    warning: 'bg-yellow-600',
    warningHover: 'hover:bg-yellow-700',
    warningText: 'text-yellow-600',
    warningLight: 'bg-yellow-50',
    error: 'bg-red-600',
    errorHover: 'hover:bg-red-700',
    errorText: 'text-red-600',
    errorLight: 'bg-red-50',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50',
    gradientPrimary: 'bg-gradient-to-br from-blue-500 to-purple-600',
    gradientSecondary: 'bg-gradient-to-br from-purple-500 to-pink-600',
    shadow: 'shadow-lg',
    shadowInner: 'shadow-inner',
    glass: 'bg-white/80 backdrop-blur-md',
    glassBorder: 'border-white/20',
  },
  dark: {
    name: 'Dark',
    bg: 'bg-gray-900',
    bgSecondary: 'bg-gray-800',
    bgCard: 'bg-gray-800',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-400',
    border: 'border-gray-700',
    borderLight: 'border-gray-600',
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-400',
    primaryText: 'text-blue-400',
    primaryLight: 'bg-blue-900/30',
    secondary: 'bg-purple-500',
    secondaryHover: 'hover:bg-purple-400',
    secondaryText: 'text-purple-400',
    secondaryLight: 'bg-purple-900/30',
    success: 'bg-green-500',
    successHover: 'hover:bg-green-400',
    successText: 'text-green-400',
    successLight: 'bg-green-900/30',
    warning: 'bg-yellow-500',
    warningHover: 'hover:bg-yellow-400',
    warningText: 'text-yellow-400',
    warningLight: 'bg-yellow-900/30',
    error: 'bg-red-500',
    errorHover: 'hover:bg-red-400',
    errorText: 'text-red-400',
    errorLight: 'bg-red-900/30',
    gradient: 'bg-gradient-to-br from-gray-800 to-gray-900',
    gradientPrimary: 'bg-gradient-to-br from-blue-600 to-purple-700',
    gradientSecondary: 'bg-gradient-to-br from-purple-600 to-pink-700',
    shadow: 'shadow-lg shadow-blue-500/10',
    shadowInner: 'shadow-inner shadow-black/20',
    glass: 'bg-gray-800/80 backdrop-blur-md',
    glassBorder: 'border-gray-700/50',
  },
  blue: {
    name: 'Ocean Blue',
    bg: 'bg-blue-50',
    bgSecondary: 'bg-blue-100',
    bgCard: 'bg-white',
    text: 'text-blue-900',
    textSecondary: 'text-blue-700',
    textMuted: 'text-blue-600',
    border: 'border-blue-200',
    borderLight: 'border-blue-100',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryText: 'text-blue-600',
    primaryLight: 'bg-blue-100',
    secondary: 'bg-cyan-600',
    secondaryHover: 'hover:bg-cyan-700',
    secondaryText: 'text-cyan-600',
    secondaryLight: 'bg-cyan-100',
    success: 'bg-teal-600',
    successHover: 'hover:bg-teal-700',
    successText: 'text-teal-600',
    successLight: 'bg-teal-100',
    warning: 'bg-amber-600',
    warningHover: 'hover:bg-amber-700',
    warningText: 'text-amber-600',
    warningLight: 'bg-amber-100',
    error: 'bg-rose-600',
    errorHover: 'hover:bg-rose-700',
    errorText: 'text-rose-600',
    errorLight: 'bg-rose-100',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    gradientPrimary: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    gradientSecondary: 'bg-gradient-to-br from-cyan-500 to-teal-600',
    shadow: 'shadow-lg shadow-blue-500/20',
    shadowInner: 'shadow-inner shadow-blue-500/10',
    glass: 'bg-blue-50/80 backdrop-blur-md',
    glassBorder: 'border-blue-200/50',
  },
  purple: {
    name: 'Royal Purple',
    bg: 'bg-purple-50',
    bgSecondary: 'bg-purple-100',
    bgCard: 'bg-white',
    text: 'text-purple-900',
    textSecondary: 'text-purple-700',
    textMuted: 'text-purple-600',
    border: 'border-purple-200',
    borderLight: 'border-purple-100',
    primary: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    primaryText: 'text-purple-600',
    primaryLight: 'bg-purple-100',
    secondary: 'bg-pink-600',
    secondaryHover: 'hover:bg-pink-700',
    secondaryText: 'text-pink-600',
    secondaryLight: 'bg-pink-100',
    success: 'bg-emerald-600',
    successHover: 'hover:bg-emerald-700',
    successText: 'text-emerald-600',
    successLight: 'bg-emerald-100',
    warning: 'bg-violet-600',
    warningHover: 'hover:bg-violet-700',
    warningText: 'text-violet-600',
    warningLight: 'bg-violet-100',
    error: 'bg-rose-600',
    errorHover: 'hover:bg-rose-700',
    errorText: 'text-rose-600',
    errorLight: 'bg-rose-100',
    gradient: 'bg-gradient-to-br from-purple-50 to-pink-50',
    gradientPrimary: 'bg-gradient-to-br from-purple-500 to-pink-600',
    gradientSecondary: 'bg-gradient-to-br from-pink-500 to-rose-600',
    shadow: 'shadow-lg shadow-purple-500/20',
    shadowInner: 'shadow-inner shadow-purple-500/10',
    glass: 'bg-purple-50/80 backdrop-blur-md',
    glassBorder: 'border-purple-200/50',
  },
  green: {
    name: 'Forest Green',
    bg: 'bg-green-50',
    bgSecondary: 'bg-green-100',
    bgCard: 'bg-white',
    text: 'text-green-900',
    textSecondary: 'text-green-700',
    textMuted: 'text-green-600',
    border: 'border-green-200',
    borderLight: 'border-green-100',
    primary: 'bg-green-600',
    primaryHover: 'hover:bg-green-700',
    primaryText: 'text-green-600',
    primaryLight: 'bg-green-100',
    secondary: 'bg-emerald-600',
    secondaryHover: 'hover:bg-emerald-700',
    secondaryText: 'text-emerald-600',
    secondaryLight: 'bg-emerald-100',
    success: 'bg-teal-600',
    successHover: 'hover:bg-teal-700',
    successText: 'text-teal-600',
    successLight: 'bg-teal-100',
    warning: 'bg-amber-600',
    warningHover: 'hover:bg-amber-700',
    warningText: 'text-amber-600',
    warningLight: 'bg-amber-100',
    error: 'bg-red-600',
    errorHover: 'hover:bg-red-700',
    errorText: 'text-red-600',
    errorLight: 'bg-red-100',
    gradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
    gradientPrimary: 'bg-gradient-to-br from-green-500 to-emerald-600',
    gradientSecondary: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    shadow: 'shadow-lg shadow-green-500/20',
    shadowInner: 'shadow-inner shadow-green-500/10',
    glass: 'bg-green-50/80 backdrop-blur-md',
    glassBorder: 'border-green-200/50',
  },
  orange: {
    name: 'Sunset Orange',
    bg: 'bg-orange-50',
    bgSecondary: 'bg-orange-100',
    bgCard: 'bg-white',
    text: 'text-orange-900',
    textSecondary: 'text-orange-700',
    textMuted: 'text-orange-600',
    border: 'border-orange-200',
    borderLight: 'border-orange-100',
    primary: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    primaryText: 'text-orange-600',
    primaryLight: 'bg-orange-100',
    secondary: 'bg-amber-600',
    secondaryHover: 'hover:bg-amber-700',
    secondaryText: 'text-amber-600',
    secondaryLight: 'bg-amber-100',
    success: 'bg-green-600',
    successHover: 'hover:bg-green-700',
    successText: 'text-green-600',
    successLight: 'bg-green-100',
    warning: 'bg-yellow-600',
    warningHover: 'hover:bg-yellow-700',
    warningText: 'text-yellow-600',
    warningLight: 'bg-yellow-100',
    error: 'bg-red-600',
    errorHover: 'hover:bg-red-700',
    errorText: 'text-red-600',
    errorLight: 'bg-red-100',
    gradient: 'bg-gradient-to-br from-orange-50 to-amber-50',
    gradientPrimary: 'bg-gradient-to-br from-orange-500 to-amber-600',
    gradientSecondary: 'bg-gradient-to-br from-amber-500 to-yellow-600',
    shadow: 'shadow-lg shadow-orange-500/20',
    shadowInner: 'shadow-inner shadow-orange-500/10',
    glass: 'bg-orange-50/80 backdrop-blur-md',
    glassBorder: 'border-orange-200/50',
  },
  pink: {
    name: 'Rose Pink',
    bg: 'bg-pink-50',
    bgSecondary: 'bg-pink-100',
    bgCard: 'bg-white',
    text: 'text-pink-900',
    textSecondary: 'text-pink-700',
    textMuted: 'text-pink-600',
    border: 'border-pink-200',
    borderLight: 'border-pink-100',
    primary: 'bg-pink-600',
    primaryHover: 'hover:bg-pink-700',
    primaryText: 'text-pink-600',
    primaryLight: 'bg-pink-100',
    secondary: 'bg-rose-600',
    secondaryHover: 'hover:bg-rose-700',
    secondaryText: 'text-rose-600',
    secondaryLight: 'bg-rose-100',
    success: 'bg-emerald-600',
    successHover: 'hover:bg-emerald-700',
    successText: 'text-emerald-600',
    successLight: 'bg-emerald-100',
    warning: 'bg-amber-600',
    warningHover: 'hover:bg-amber-700',
    warningText: 'text-amber-600',
    warningLight: 'bg-amber-100',
    error: 'bg-red-600',
    errorHover: 'hover:bg-red-700',
    errorText: 'text-red-600',
    errorLight: 'bg-red-100',
    gradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
    gradientPrimary: 'bg-gradient-to-br from-pink-500 to-rose-600',
    gradientSecondary: 'bg-gradient-to-br from-rose-500 to-red-600',
    shadow: 'shadow-lg shadow-pink-500/20',
    shadowInner: 'shadow-inner shadow-pink-500/10',
    glass: 'bg-pink-50/80 backdrop-blur-md',
    glassBorder: 'border-pink-200/50',
  },
  teal: {
    name: 'Ocean Teal',
    bg: 'bg-teal-50',
    bgSecondary: 'bg-teal-100',
    bgCard: 'bg-white',
    text: 'text-teal-900',
    textSecondary: 'text-teal-700',
    textMuted: 'text-teal-600',
    border: 'border-teal-200',
    borderLight: 'border-teal-100',
    primary: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    primaryText: 'text-teal-600',
    primaryLight: 'bg-teal-100',
    secondary: 'bg-cyan-600',
    secondaryHover: 'hover:bg-cyan-700',
    secondaryText: 'text-cyan-600',
    secondaryLight: 'bg-cyan-100',
    success: 'bg-green-600',
    successHover: 'hover:bg-green-700',
    successText: 'text-green-600',
    successLight: 'bg-green-100',
    warning: 'bg-amber-600',
    warningHover: 'hover:bg-amber-700',
    warningText: 'text-amber-600',
    warningLight: 'bg-amber-100',
    error: 'bg-red-600',
    errorHover: 'hover:bg-red-700',
    errorText: 'text-red-600',
    errorLight: 'bg-red-100',
    gradient: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    gradientPrimary: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    gradientSecondary: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    shadow: 'shadow-lg shadow-teal-500/20',
    shadowInner: 'shadow-inner shadow-teal-500/10',
    glass: 'bg-teal-50/80 backdrop-blur-md',
    glassBorder: 'border-teal-200/50',
  },
} as const;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'light';
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Apply CSS custom properties
    const root = document.documentElement;
    const colors = themes[theme];
    
    Object.entries(colors).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('bg-')) {
        const colorValue = value.replace('bg-', '');
        root.style.setProperty(`--color-${key}`, colorValue);
      }
    });
  }, [theme]);

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, systemTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { themes };
