import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, FileText, Users, Hash, X, Filter, TrendingUp } from 'lucide-react';
import { useSimpleTheme } from '../contexts/SimpleThemeContext';

interface SearchResult {
  id: string;
  type: 'paper' | 'author' | 'keyword' | 'collection';
  title: string;
  subtitle?: string;
  description?: string;
  url?: string;
  icon: React.ReactNode;
  tags?: string[];
  date?: string;
}

interface SearchHistory {
  query: string;
  timestamp: Date;
  type: string;
}

const GlobalSearch = () => {
  const { theme } = useSimpleTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'papers' | 'authors' | 'keywords'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock search data
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'paper',
      title: 'Attention Is All You Need',
      subtitle: 'Vaswani et al. 2017',
      description: 'The dominant sequence transduction models...',
      icon: <FileText size={16} />,
      tags: ['Transformers', 'NLP', 'Attention'],
      date: '2024-01-15'
    },
    {
      id: '2',
      type: 'author',
      title: 'Dr. Jane Smith',
      subtitle: 'Machine Learning Researcher',
      description: 'Published 12 papers on deep learning...',
      icon: <Users size={16} />,
      tags: ['ML', 'Deep Learning'],
      date: '2024-01-10'
    },
    {
      id: '3',
      type: 'keyword',
      title: 'Neural Networks',
      subtitle: '245 papers',
      description: 'Research papers related to neural architectures...',
      icon: <Hash size={16} />,
      tags: ['AI', 'Deep Learning', 'Networks'],
      date: '2024-01-08'
    }
  ];

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      setIsLoading(true);
      // Simulate search delay
      setTimeout(() => {
        const filteredResults = mockResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
        
        // Add to history
        if (query.trim() && !history.find(h => h.query === query)) {
          setHistory(prev => [{ query, timestamp: new Date(), type: 'search' }, ...prev.slice(0, 9)]);
        }
        
        setIsLoading(false);
      }, 500);
    }
  }, [query, history]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  }, []);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'paper': return <FileText size={14} />;
      case 'author': return <Users size={14} />;
      case 'keyword': return <Hash size={14} />;
      default: return <FileText size={14} />;
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (e.target === null) return;
      const target = e.target as Element;
      if (!target.closest('.global-search-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search papers, authors, keywords..."
            className="w-80 pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.text
            }}
          />
          <div className="absolute left-3 top-1/2" style={{ color: theme.textSecondary }}>
            <Search size={18} />
          </div>
          
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              style={{ color: theme.textSecondary }}
            >
              <X size={16} />
            </button>
          )}
          
          {isLoading && (
            <div className="absolute right-3 top-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent" />
            </div>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (query || results.length > 0) && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 global-search-dropdown"
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full left-0 mt-2 w-96 rounded-2xl shadow-2xl z-50 overflow-hidden global-search-dropdown"
                style={{
                  backgroundColor: theme.surface,
                  border: `1px solid ${theme.border}`
                }}
              >
                {/* Filters */}
                <div className="p-3 border-b" style={{ borderColor: theme.border }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Filter size={16} style={{ color: theme.textSecondary }} />
                    <span className="text-sm font-medium" style={{ color: theme.text }}>Filters</span>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'papers', 'authors', 'keywords'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter as any)}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          selectedFilter === filter ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                        }`}
                        style={{
                          backgroundColor: selectedFilter === filter ? theme.primary : 'transparent'
                        }}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2 space-y-2">
                      {results.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{
                            backgroundColor: theme.background,
                            borderColor: theme.border
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: theme.primary + '20' }}
                            >
                              <div style={{ color: theme.primary }}>
                                {getResultIcon(result.type)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm" style={{ color: theme.text }}>
                                {result.title}
                              </div>
                              {result.subtitle && (
                                <div className="text-xs" style={{ color: theme.textSecondary }}>
                                  {result.subtitle}
                                </div>
                              )}
                              {result.description && (
                                <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                                  {result.description}
                                </div>
                              )}
                              {result.tags && (
                                <div className="flex gap-1 mt-2">
                                  {result.tags.slice(0, 3).map((tag, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded text-xs"
                                      style={{
                                        backgroundColor: theme.primary + '10',
                                        color: theme.primary
                                      }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 mb-2">
                        <Search size={48} />
                      </div>
                      <p className="text-gray-500 text-sm">
                        No results found for "{query}"
                      </p>
                    </div>
                  )}
                </div>

                {/* History */}
                {history.length > 0 && (
                  <div className="p-3 border-t" style={{ borderColor: theme.border }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: theme.text }}>Recent Searches</span>
                      <button
                        onClick={() => setHistory([])}
                        className="text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                        style={{ color: theme.textSecondary }}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {history.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(item.query);
                            handleSearch();
                          }}
                          className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
                          style={{ color: theme.text }}
                        >
                          <Clock size={14} style={{ color: theme.textSecondary }} />
                          <span className="flex-1 text-sm">{item.query}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlobalSearch;
