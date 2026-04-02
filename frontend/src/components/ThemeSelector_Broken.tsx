import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react';
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
    { value: 'light' as Theme, icon: Sun, label: 'Light', color: 'bg-gray-100' },
    { value: 'dark' as Theme, icon: Moon, label: 'Dark', color: 'bg-gray-800' },
    { value: 'blue' as Theme, icon: Palette, label: 'Ocean Blue', color: 'bg-blue-500' },
    { value: 'purple' as Theme, icon: Palette, label: 'Royal Purple', color: 'bg-purple-500' },
    { value: 'green' as Theme, icon: Palette, label: 'Forest Green', color: 'bg-green-500' },
    { value: 'orange' as Theme, icon: Palette, label: 'Sunset Orange', color: 'bg-orange-500' },
    { value: 'pink' as Theme, icon: Palette, label: 'Rose Pink', color: 'bg-pink-500' },
    { value: 'teal' as Theme, icon: Palette, label: 'Ocean Teal', color: 'bg-teal-500' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all ${themes[theme].bgCard} ${themes[theme].border} ${themes[theme].shadow} hover:scale-105`}
      >
        <Palette size={20} className={themes[theme].textSecondary} />
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
              className={`absolute right-0 mt-2 w-80 rounded-2xl ${themes[theme].bgCard} ${themes[theme].border} ${themes[theme].shadow} z-50 overflow-hidden`}
            >
              <div className={`p-4 border-b ${themes[theme].borderLight}`}>
                <h3 className={`font-semibold ${themes[theme].text}`}>Choose Theme</h3>
                <p className={`text-sm ${themes[theme].textMuted}`}>Personalize your ResearchMind experience</p>
              </div>

              <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = theme === option.value;
                    
                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setTheme(option.value);
                          setIsOpen(false);
                        }}
                        className={`relative p-3 rounded-xl border-2 transition-all ${
                          isSelected 
                            ? `${themes[theme].border} ${themes[theme].primaryLight} ${themes[theme].shadow}` 
                            : `${themes[theme].borderLight} hover:${themes[theme].border}`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${option.color} flex items-center justify-center`}>
                            <Icon size={16} className="text-white" />
                          </div>
                          <div className="text-left">
                            <div className={`font-medium text-sm ${themes[theme].text}`}>
                              {option.label}
                            </div>
                            <div className={`text-xs ${themes[theme].textMuted}`}>
                              {themes[option.value].name}
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`absolute top-2 right-2 w-5 h-5 ${themes[theme].primary} rounded-full flex items-center justify-center`}
                          >
                            <Check size={12} className="text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className={`p-4 border-t ${themes[theme].borderLight}`}>
                <div className="flex items-center gap-2">
                  <Monitor size={16} className={themes[theme].textMuted} />
                  <span className={`text-sm ${themes[theme].textMuted}`}>
                    System theme: {systemTheme === 'dark' ? 'Dark' : 'Light'}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
