import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';
import { useSimpleTheme } from '../contexts/SimpleThemeContext';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Container Component
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  const { theme } = useSimpleTheme();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <Check size={16} />;
      case 'error': return <AlertCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'info': return <Info size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          bg: '#10b981',
          iconBg: '#059669',
          textColor: '#ffffff',
          borderColor: '#059669'
        };
      case 'error':
        return {
          bg: '#fca5a5',
          iconBg: '#ef4444',
          textColor: '#ffffff',
          borderColor: '#ef4444'
        };
      case 'warning':
        return {
          bg: '#fbbf24',
          iconBg: '#f59e0b',
          textColor: '#ffffff',
          borderColor: '#f59e0b'
        };
      case 'info':
        return {
          bg: '#60a5fa',
          iconBg: '#3b82f6',
          textColor: '#ffffff',
          borderColor: '#3b82f6'
        };
      default:
        return {
          bg: '#6b7280',
          iconBg: '#4b5563',
          textColor: '#ffffff',
          borderColor: '#4b5563'
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getNotificationStyles(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="p-4 rounded-lg shadow-lg border"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                minWidth: '320px',
                maxWidth: '400px'
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: styles.iconBg }}
                >
                  <div style={{ color: styles.textColor }}>
                    {getIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 
                    className="font-medium text-sm mb-1"
                    style={{ color: theme.text }}
                  >
                    {notification.title}
                  </h4>
                  <p 
                    className="text-xs line-clamp-2"
                    style={{ color: theme.textSecondary }}
                  >
                    {notification.message}
                  </p>
                  {notification.timestamp && (
                    <p 
                      className="text-xs mt-1"
                      style={{ color: theme.textSecondary }}
                    >
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  style={{ color: theme.textSecondary }}
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Notification Bell Component
export const NotificationBell = () => {
  const { notifications, clearAll } = useNotifications();
  const { theme } = useSimpleTheme();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.timestamp > new Date(Date.now() - 60000)).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border shadow-sm hover:shadow-md transition-all hover:scale-105 relative"
        style={{ 
          backgroundColor: theme.surface, 
          borderColor: theme.border,
          color: theme.text
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
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
                border: `1px solid ${theme.border}`
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: theme.border }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold" style={{ color: theme.text }}>
                    Notifications
                  </h3>
                  <button
                    onClick={clearAll}
                    className="text-sm px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                    style={{ color: theme.textSecondary }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="p-2 space-y-2">
                    {notifications.map((notification) => {
                      const styles = getNotificationStyles(notification.type);
                      
                      return (
                        <div
                          key={notification.id}
                          className="p-3 rounded-lg border"
                          style={{
                            backgroundColor: theme.surface,
                            borderColor: theme.border
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: styles.iconBg }}
                            >
                              <div style={{ color: styles.textColor }}>
                                {getIcon(notification.type)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 
                                className="font-medium text-sm mb-1"
                                style={{ color: theme.text }}
                              >
                                {notification.title}
                              </h4>
                              <p 
                                className="text-xs line-clamp-2"
                                style={{ color: theme.textSecondary }}
                              >
                                {notification.message}
                              </p>
                              <p 
                                className="text-xs mt-1"
                                style={{ color: theme.textSecondary }}
                              >
                                {notification.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <Bell size={48} />
                    </div>
                    <p className="text-gray-500 text-sm">
                      No notifications yet
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
