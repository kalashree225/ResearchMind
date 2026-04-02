import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sun, Moon, Contrast, Check } from 'lucide-react';
import { useMaterialTheme, materialThemes } from '../contexts/MaterialThemeContext';

const MaterialThemeSelector = () => {
  const { themeName, setTheme, theme } = useMaterialTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { 
      value: 'light', 
      icon: Sun, 
      label: 'Light', 
      description: 'Clean and bright interface'
    },
    { 
      value: 'dark', 
      icon: Moon, 
      label: 'Dark', 
      description: 'Easy on the eyes'
    },
    { 
      value: 'highContrast', 
      icon: Contrast, 
      label: 'High Contrast', 
      description: 'Maximum readability'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:scale-105"
        style={{ backgroundColor: theme.surface, borderColor: theme.elevation.level2 }}
      >
        <Palette size={20} style={{ color: theme.onSurface }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl z-50 overflow-hidden"
              style={{ 
                backgroundColor: theme.surface,
                border: `1px solid ${theme.elevation.level2}`
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: theme.elevation.level1 }}>
                <h3 className="font-semibold" style={{ color: theme.onSurface }}>
                  Material Theme
                </h3>
                <p className="text-sm mt-1" style={{ color: theme.onSurface + '99' }}>
                  Choose your preferred theme
                </p>
              </div>

              <div className="p-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = themeName === option.value;
                  
                  return (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setTheme(option.value);
                        setIsOpen(false);
                      }}
                      className="relative w-full p-4 rounded-xl border-2 transition-all mb-2"
                      style={{
                        backgroundColor: isSelected ? theme.primary + '15' : 'transparent',
                        borderColor: isSelected ? theme.primary : theme.elevation.level2
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <Icon size={20} style={{ color: theme.onPrimary }} />
                        </div>
                        <div className="text-left flex-1">
                          <div 
                            className="font-medium text-sm"
                            style={{ color: theme.onSurface }}
                          >
                            {option.label}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: theme.onSurface + '80' }}
                          >
                            {option.description}
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <Check size={14} style={{ color: theme.onPrimary }} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MaterialThemeSelector;
