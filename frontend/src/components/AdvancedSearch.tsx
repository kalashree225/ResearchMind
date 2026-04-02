import { useState, useCallback, useMemo } from 'react';
import { Search, Filter, Calendar, TrendingUp, BookOpen, Users, Download, X, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilters {
  query: string;
  dateRange: string;
  authors: string[];
  categories: string[];
  citations: string;
  sortBy: string;
}

const AdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateRange: 'all',
    authors: [],
    categories: [],
    citations: 'all',
    sortBy: 'relevance'
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentSearches] = useState([
    'neural networks optimization',
    'transformer architecture comparison',
    'BERT fine-tuning methods',
    'computer vision object detection'
  ]);

  const categories = useMemo(() => [
    'Machine Learning',
    'Natural Language Processing', 
    'Computer Vision',
    'Optimization',
    'Graph Theory',
    'Data Mining'
  ], []);

  const citationRanges = useMemo(() => [
    { value: 'all', label: 'All Papers' },
    { value: '10+', label: '10+ Citations' },
    { value: '50+', label: '50+ Citations' },
    { value: '100+', label: '100+ Citations' },
    { value: '500+', label: '500+ Citations' }
  ], []);

  const sortOptions = useMemo(() => [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Publication Date' },
    { value: 'citations', label: 'Citation Count' },
    { value: 'impact', label: 'Impact Factor' },
    { value: 'trending', label: 'Trending Score' }
  ], []);

  const handleFilterChange = useCallback((filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    // Perform search logic here
    console.log('Searching with filters:', filters);
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      dateRange: 'all',
      authors: [],
      categories: [],
      citations: 'all',
      sortBy: 'relevance'
    });
  }, []);

  const addRecentSearch = useCallback((search: string) => {
    setRecentSearches(prev => [search, ...prev.slice(0, 4)]);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      query: '',
      dateRange: 'all',
      authors: [],
      categories: [],
      citations: 'all',
      sortBy: 'relevance'
    });
    setIsExpanded(false);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-border rounded-2xl shadow-lg backdrop-blur-sm"
      >
        {/* Main Search Bar */}
        <div className="p-6 border-b border-border">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Search research papers, authors, keywords, or topics..."
                className="w-full pl-12 pr-12 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              {filters.query && (
                <button
                  onClick={() => handleFilterChange('query', '')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-surface rounded-lg transition-colors"
                >
                  <X size={16} className="text-text-muted" />
                </button>
              )}
            </div>
            
            <button 
              onClick={handleSearch}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Sparkles size={16} className="mr-2" />
              Advanced Search
            </button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex gap-3 mt-4">
            <select 
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white hover:border-primary-300 transition-colors"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <select 
              value={filters.citations}
              onChange={(e) => handleFilterChange('citations', e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-white hover:border-primary-300 transition-colors"
            >
              {citationRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
            
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-surface transition-all"
            >
              <Filter size={16} />
              {isExpanded ? 'Hide Filters' : 'Show Filters'}
              <ChevronDown 
                size={14} 
                className={`ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Publication Date
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {['all', 'last_year', 'last_5_years', 'last_10_years'].map(range => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dateRange"
                          value={range}
                          checked={filters.dateRange === range}
                          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                          className="text-primary-600"
                        />
                        <span className="text-sm text-text-secondary">
                          {range === 'all' ? 'All Time' : 
                           range === 'last_year' ? 'Last Year' :
                           range === 'last_5_years' ? 'Last 5 Years' : 'Last 10 Years'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    <BookOpen className="inline w-4 h-4 mr-2" />
                    Research Categories
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map(category => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, categories: [...prev.categories, category] }));
                            } else {
                              setFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
                            }
                          }}
                          className="text-primary-600"
                        />
                        <span className="text-sm text-text-secondary">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Authors */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    <Users className="inline w-4 h-4 mr-2" />
                    Top Authors
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Geoffrey Hinton', 'Yann LeCun', 'Yoshua Bengio', 'Andrew Ng', 'Ian Goodfellow'].map(author => (
                      <label key={author} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.authors.includes(author)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, authors: [...prev.authors, author] }));
                            } else {
                              setFilters(prev => ({ ...prev, authors: prev.authors.filter(a => a !== author) }));
                            }
                          }}
                          className="text-primary-600"
                        />
                        <span className="text-sm text-text-secondary">{author}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Searches & Trends */}
        <div className="p-6 border-t border-border bg-surface">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-primary-500" />
                Recent Searches
              </h4>
              <div className="space-y-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters(prev => ({ ...prev, query: search }))}
                    className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-primary-600 hover:bg-white rounded-lg transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                <Download size={16} className="text-primary-500" />
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-primary-600 hover:bg-white rounded-lg transition-colors">
                  Export Current Results (CSV)
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-primary-600 hover:bg-white rounded-lg transition-colors">
                  Save Search Preferences
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-primary-600 hover:bg-white rounded-lg transition-colors">
                  Create Research Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedSearch;
