import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      duration: notification.duration || 5000
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

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
          bg: colors.success,
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        };
      case 'error':
        return {
          bg: colors.error,
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600'
        };
      case 'warning':
        return {
          bg: colors.warning,
          border: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600'
        };
      case 'info':
        return {
          bg: colors.primary,
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
      default:
        return {
          bg: colors.primary,
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getNotificationStyles(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`relative flex items-start gap-3 p-4 rounded-xl border-2 ${styles.bg} ${styles.border} ${colors.shadow} min-w-[300px] max-w-md`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center ${styles.iconColor}`}>
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm ${colors.text} mb-1`}>
                  {notification.title}
                </h4>
                <p className={`text-sm ${colors.textMuted} leading-relaxed`}>
                  {notification.message}
                </p>
                
                {/* Action */}
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className={`mt-2 text-sm font-medium ${colors.primaryText} hover:underline`}
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeNotification(notification.id)}
                className={`flex-shrink-0 p-1 rounded-lg ${colors.bgSecondary} hover:${colors.bg} transition-colors`}
              >
                <X size={14} className={colors.textMuted} />
              </button>

              {/* Progress Bar */}
              {notification.duration && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                  className={`absolute bottom-0 left-0 h-1 ${colors.primary} rounded-b-xl`}
                />
              )}
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
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg ${colors.bgCard} ${colors.border} ${colors.shadow} hover:scale-105 transition-all`}
      >
        <Bell size={20} className={colors.textSecondary} />
        
        {/* Badge */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 w-5 h-5 ${colors.error} text-white text-xs rounded-full flex items-center justify-center font-bold`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`absolute right-0 mt-2 w-96 rounded-2xl ${colors.bgCard} ${colors.border} ${colors.shadow} z-50 max-h-96 overflow-hidden`}
          >
            <div className={`p-4 border-b ${colors.borderLight} flex items-center justify-between`}>
              <h3 className={`font-semibold ${colors.text}`}>Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className={`text-sm ${colors.primaryText} hover:underline`}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => {
                    const styles = getNotificationStyles(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 backgroundColor: ${theme.surface}, border: 1px solid ${theme.borderLight}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full ${styles.iconBg} flex items-center justify-center ${styles.iconColor} flex-shrink-0`}>
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-sm ${theme.text} mb-1`}>
                            <h4 className={`font-medium text-sm ${colors.text} mb-1`}>
                              {notification.title}
                            </h4>
                            <p className={`text-xs ${colors.textMuted} line-clamp-2`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs ${colors.textMuted} mt-1`}>
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell size={48} className={`${colors.textMuted} mx-auto mb-3`} />
                  <p className={`${colors.textSecondary} mb-1`}>No notifications</p>
                  <p className={`text-sm ${colors.textMuted}`}>You're all caught up!</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

// Helper function
const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600'
      };
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600'
      };
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
      };
    case 'info':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      };
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      };
  }
};
