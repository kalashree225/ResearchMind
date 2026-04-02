import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Download, Share2, Maximize2, ChevronDown, X, Check, AlertCircle, Info } from 'lucide-react';

// Enhanced Button Component with Loading States
interface EnhancedButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const EnhancedButton = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  onClick,
  className = ''
}: EnhancedButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = useMemo(() => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 text-white hover:bg-primary-500 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:scale-105';
      case 'secondary':
        return 'bg-surface text-text-primary border border-border hover:bg-surface-hover focus:ring-primary-500';
      case 'outline':
        return 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500';
      case 'ghost':
        return 'text-text-muted hover:text-text-primary hover:bg-surface focus:ring-primary-500';
      default:
        return '';
    }
  }, [variant]);

  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-sm';
      case 'md': return 'px-4 py-2 text-sm';
      case 'lg': return 'px-6 py-3 text-base';
      default: return '';
    }
  }, [size]);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
        />
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

// Enhanced Card Component with Hover Effects
interface EnhancedCardProps {
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
  className?: string;
  onClick?: () => void;
}

export const EnhancedCard = ({
  children,
  hover = true,
  glass = false,
  className = '',
  onClick
}: EnhancedCardProps) => {
  const baseClasses = 'rounded-2xl border transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : '';
  const glassClasses = glass ? 'backdrop-blur-sm bg-white/80' : 'bg-white';
  
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${glassClasses} ${className} border-border shadow-sm`}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Input Component with Validation
interface EnhancedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  clearable?: boolean;
  className?: string;
}

export const EnhancedInput = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  success,
  icon,
  clearable = false,
  className = ''
}: EnhancedInputProps) => {
  const [focused, setFocused] = useState(false);
  
  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const inputClasses = useMemo(() => {
    const base = 'w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none';
    const iconPadding = icon ? 'pl-12' : 'pl-4';
    const clearPadding = clearable && value ? 'pr-12' : 'pr-4';
    
    let borderClass = 'border-border';
    if (error) borderClass = 'border-red-500 focus:border-red-500';
    else if (success) borderClass = 'border-green-500 focus:border-green-500';
    else if (focused) borderClass = 'border-primary-500 focus:border-primary-500';
    
    return `${base} ${iconPadding} ${clearPadding} ${borderClass} ${className}`;
  }, [icon, clearable, value, error, success, focused, className]);

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted">
          {icon}
        </div>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={inputClasses}
      />
      
      {clearable && value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-surface rounded-lg transition-colors"
        >
          <X size={16} className="text-text-muted" />
        </button>
      )}
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-0 text-xs text-green-600 flex items-center gap-1"
          >
            <Check size={12} />
            {success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Tooltip Component
interface EnhancedTooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const EnhancedTooltip = ({
  content,
  position = 'top',
  children
}: EnhancedTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = useMemo(() => {
    switch (position) {
      case 'top': return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
      case 'bottom': return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left': return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right': return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      default: return '';
    }
  }, [position]);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap ${positionClasses}`}
          >
            {content}
            <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45" 
                 style={position === 'top' ? { bottom: '-4px', left: '50%', marginLeft: '-4px' } :
                        position === 'bottom' ? { top: '-4px', left: '50%', marginLeft: '-4px' } :
                        position === 'left' ? { right: '-4px', top: '50%', marginTop: '-4px' } :
                        { left: '-4px', top: '50%', marginTop: '-4px' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) => {
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      default: return 'w-6 h-6';
    }
  }, [size]);

  const colorClasses = useMemo(() => {
    switch (color) {
      case 'primary': return 'border-primary-600';
      case 'secondary': return 'border-text-muted';
      case 'white': return 'border-white';
      default: return 'border-primary-600';
    }
  }, [color]);

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses} ${colorClasses} border-2 border-t-transparent rounded-full ${className}`}
    />
  );
};

// Enhanced Badge Component
interface EnhancedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const EnhancedBadge = ({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  className = ''
}: EnhancedBadgeProps) => {
  const variantClasses = useMemo(() => {
    switch (variant) {
      case 'success': return 'bg-green-100 text-green-700 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-surface text-text-primary border-border';
    }
  }, [variant]);

  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm': return 'px-2 py-1 text-xs';
      case 'md': return 'px-3 py-1.5 text-sm';
      default: return 'px-3 py-1.5 text-sm';
    }
  }, [size]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 rounded-full border font-medium ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );
};
