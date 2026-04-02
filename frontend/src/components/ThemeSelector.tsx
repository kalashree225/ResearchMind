import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { useSimpleTheme } from '../contexts/SimpleThemeContext';

const ThemeSelector = () => {
  const { themeName, setTheme } = useSimpleTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { 
      value: 'light', 
      icon: Sun, 
      label: 'Light', 
      description: 'Clean and bright'
    },
    { 
      value: 'dark', 
      icon: Moon, 
      label: 'Dark', 
      description: 'Easy on the eyes'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border shadow-sm hover:shadow-md transition-all hover:scale-105"
        style={{ 
          backgroundColor: 'white', 
          borderColor: '#e5e7eb'
        }}
      >
        <Palette size={20} />
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
              className="absolute right-0 mt-2 w-64 rounded-2xl shadow-xl z-50 overflow-hidden"
              style={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb'
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#1f2937' }}>
                  Theme
                </h3>
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  Choose your preferred theme
                </p>
              </div>

              <div className="p-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = themeName === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setTheme(option.value);
                        setIsOpen(false);
                      }}
                      className="relative w-full p-3 rounded-xl border-2 transition-all mb-2"
                      style={{
                        backgroundColor: isSelected ? '#3b82f6' : 'transparent',
                        borderColor: isSelected ? '#3b82f6' : '#e5e7eb'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6' }}
                        >
                          <Icon size={16} style={{ color: '#ffffff' }} />
                        </div>
                        <div className="text-left flex-1">
                          <div 
                            className="font-medium text-sm"
                            style={{ color: '#1f2937' }}
                          >
                            {option.label}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ color: '#6b7280' }}
                          >
                            {option.description}
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#10b981' }}
                        >
                          <Check size={12} style={{ color: '#ffffff' }} />
                        </motion.div>
                      )}
                    </button>
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

export default ThemeSelector;
