import { useState, useEffect } from 'react';
import { useSimpleTheme } from '../contexts/SimpleThemeContext';

const DebugClustersView = () => {
  const [themeInfo, setThemeInfo] = useState<string>('Loading...');
  const { theme, themeName, isDark, setTheme } = useSimpleTheme();
  
  useEffect(() => {
    setThemeInfo(`Theme: ${themeName}, Is Dark: ${isDark}, Primary: ${theme.primary}`);
  }, [themeName, isDark, theme]);

  return (
    <div style={{ 
      backgroundColor: theme.background, 
      color: theme.text,
      padding: '20px',
      minHeight: '100vh'
    }}>
      <h1>Debug: Clusters View</h1>
      <p>Theme Info: {themeInfo}</p>
      <p>Primary Color: {theme.primary}</p>
      <p>Background: {theme.background}</p>
      <p>Text Color: {theme.text}</p>
      
      <div style={{ 
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Sample Card</h2>
        <p>This should be visible with Simple Theme.</p>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          style={{
            backgroundColor: theme.primary,
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default DebugClustersView;
