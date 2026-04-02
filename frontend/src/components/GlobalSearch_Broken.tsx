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
  score?: number;
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
      subtitle: 'Vaswani et al.',
      description: 'The dominant sequence transduction models based on complex recurrent or convolutional neural networks...',
      url: '/chat/1',
      icon: <FileText size={16} />,
      tags: ['Transformers', 'Attention', 'NLP'],
      score: 95,
      date: '2017-06-12'
    },
    {
      id: '2',
      type: 'author',
      title: 'Ashish Vaswani',
      subtitle: 'Google Research',
      description: 'Research Scientist at Google Brain, author of influential papers on transformers...',
      url: '/author/ashish-vaswani',
      icon: <Users size={16} />,
      tags: ['Transformers', 'NLP', 'Deep Learning'],
      score: 88,
      date: '2017-01-01'
    },
    {
      id: '3',
      type: 'keyword',
      title: 'Transformer Architecture',
      subtitle: 'Research Topic',
      description: 'Neural network architecture that relies entirely on self-attention mechanisms...',
      url: '/topic/transformer-architecture',
      icon: <Hash size={16} />,
      tags: ['Architecture', 'Neural Networks', 'Attention'],
      score: 92,
      date: '2024-01-01'
    }
  ];

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filteredResults = mockResults.filter(result => {
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'papers' && result.type === 'paper') ||
        (selectedFilter === 'authors' && result.type === 'author') ||
        (selectedFilter === 'keywords' && result.type === 'keyword');
      
      const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesQuery;
    });

    setResults(filteredResults);
    
    // Add to history
    if (searchQuery.trim()) {
      const newHistoryItem: SearchHistory = {
        query: searchQuery,
        timestamp: new Date(),
        type: selectedFilter
      };
      
      setHistory(prev => {
        const filtered = prev.filter(item => item.query !== searchQuery);
        return [newHistoryItem, ...filtered].slice(0, 10);
      });
    }
    
    setIsLoading(false);
  }, [selectedFilter]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
      inputRef.current?.focus();
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'paper': return <FileText size={16} />;
      case 'author': return <Users size={16} />;
      case 'keyword': return <Hash size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getResultTypeColor = (type: string) => {
    switch (type) {
      case 'paper': return 'text-blue-600 bg-blue-100';
      case 'author': return 'text-purple-600 bg-purple-100';
      case 'keyword': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl ${colors.bgCard} ${colors.border} ${colors.shadow} hover:scale-105 transition-all w-full max-w-md`}
      >
        <Search size={20} className={colors.textMuted} />
        <span className={`${colors.textMuted} text-sm`}>Search papers, authors, keywords... (⌘K)</span>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl max-h-[80vh] rounded-2xl ${colors.bgCard} ${colors.border} ${colors.shadow} z-50 overflow-hidden`}
            >
              {/* Search Header */}
              <div className={`p-6 border-b ${colors.borderLight}`}>
                <div className="flex items-center gap-4">
                  <Search size={24} className={colors.textMuted} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(query);
                      }
                    }}
                    placeholder="Search papers, authors, keywords..."
                    className={`flex-1 bg-transparent border-none outline-none text-lg ${colors.text} placeholder:${colors.textMuted}`}
                    autoFocus
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg ${colors.bgSecondary} hover:${colors.bg} transition-colors`}
                  >
                    <X size={20} className={colors.textMuted} />
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 mt-4">
                  <Filter size={16} className={colors.textMuted} />
                  {['all', 'papers', 'authors', 'keywords'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter as any)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        selectedFilter === filter
                          ? `${colors.primary} text-white`
                          : `${colors.bgSecondary} ${colors.textSecondary} hover:${colors.bg}`
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto">
                {query && (
                  <div className="p-6">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className={`w-8 h-8 border-4 ${colors.border} border-t-${colors.primary.replace('bg-', '')} rounded-full`}
                        />
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-3">
                        {results.map((result, index) => (
                          <motion.a
                            key={result.id}
                            href={result.url}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`block p-4 rounded-xl ${colors.bgSecondary} hover:${colors.bg} transition-all border ${colors.borderLight} hover:${colors.border}`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg ${colors.bgCard} ${colors.border}`}>
                                {result.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={`font-semibold ${colors.text}`}>{result.title}</h4>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getResultTypeColor(result.type)}`}>
                                    {result.type}
                                  </span>
                                  {result.score && (
                                    <span className={`text-xs ${colors.textMuted} flex items-center gap-1`}>
                                      <TrendingUp size={12} />
                                      {result.score}% match
                                    </span>
                                  )}
                                </div>
                                {result.subtitle && (
                                  <p className={`text-sm ${colors.textSecondary} mb-2`}>{result.subtitle}</p>
                                )}
                                {result.description && (
                                  <p className={`text-sm ${colors.textMuted} mb-2 line-clamp-2`}>{result.description}</p>
                                )}
                                {result.tags && (
                                  <div className="flex flex-wrap gap-1">
                                    {result.tags.map((tag, tagIndex) => (
                                      <span
                                        key={tagIndex}
                                        className={`px-2 py-0.5 rounded text-xs ${colors.bg} ${colors.borderLight} ${colors.textMuted}`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {result.date && (
                                  <p className={`text-xs ${colors.textMuted} mt-2`}>{result.date}</p>
                                )}
                              </div>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText size={48} className={colors.textMuted + ' mx-auto mb-4'} />
                        <p className={`${colors.textSecondary} mb-2`}>No results found</p>
                        <p className={`text-sm ${colors.textMuted}`}>Try different keywords or filters</p>
                      </div>
                    )}
                  </div>
                )}

                {!query && history.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock size={16} className={colors.textMuted} />
                      <h3 className={`font-semibold ${colors.text}`}>Recent Searches</h3>
                    </div>
                    <div className="space-y-2">
                      {history.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(item.query);
                            handleSearch(item.query);
                          }}
                          className={`w-full text-left p-3 rounded-lg ${colors.bgSecondary} hover:${colors.bg} transition-all`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={colors.text}>{item.query}</span>
                            <span className={`text-xs ${colors.textMuted}`}>
                              {item.type} • {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalSearch;
