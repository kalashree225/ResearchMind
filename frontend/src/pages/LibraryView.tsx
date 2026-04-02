import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, DownloadCloud, TrendingUp, Eye, Share2, MoreVertical, Grid, List, ExternalLink } from 'lucide-react';
import { usePapers, useDeletePaper } from '../hooks/usePapers';
import { useNavigate } from 'react-router-dom';
import { useMaterialTheme } from '../contexts/MaterialThemeContext';

const LibraryView = () => {
  const navigate = useNavigate();
  const { theme } = useMaterialTheme();
  const { data: papers } = usePapers();
  const deletePaper = useDeletePaper();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'citations' | 'relevance'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'processing' | 'failed'>('all');
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const mockPapers = [
    {
      id: '1',
      title: 'Attention Is All You Need',
      authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.'],
      abstract: 'The dominant sequence transduction models...',
      status: 'ready',
      uploaded_at: '2024-01-15',
      citations: 15420,
      journal: 'NeurIPS',
      year: 2017,
      doi: '10.5555/2017.99991',
      tags: ['Transformers', 'Attention', 'NLP'],
      bookmarked: true,
      notes: 'Foundational paper on attention mechanisms'
    },
    {
      id: '2',
      title: 'BERT: Pre-training of Deep Bidirectional Transformers',
      authors: ['Devlin, J.', 'Chang, M.', 'Lee, K.'],
      abstract: 'We introduce a new language representation model...',
      status: 'ready',
      uploaded_at: '2024-01-20',
      citations: 8970,
      journal: 'NAACL',
      year: 2018,
      doi: '10.18653/v1/2019.14235',
      tags: ['BERT', 'Pre-training', 'NLP'],
      bookmarked: false,
      notes: ''
    },
    {
      id: '3',
      title: 'Generative Adversarial Networks',
      authors: ['Goodfellow, I.', 'Pouget-Abadie, J.'],
      abstract: 'We propose a new framework for estimating generative models...',
      status: 'processing',
      uploaded_at: '2024-02-01',
      citations: 23450,
      journal: 'NIPS',
      year: 2014,
      doi: '10.1109/CVPR.2014.590',
      tags: ['GANs', 'Deep Learning', 'Computer Vision'],
      bookmarked: true,
      notes: 'Revolutionary work in generative modeling'
    }
  ];

  const filteredPapers = mockPapers.filter(paper => {
    const matchesSearch = !searchQuery || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || paper.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const sortedPapers = [...filteredPapers].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'citations':
        return (b.citations || 0) - (a.citations || 0);
      case 'relevance':
      default:
        return 0;
    }
  });

  const handlePaperSelect = (paperId: string) => {
    setSelectedPapers(prev => 
      prev.includes(paperId) 
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

  const handleBulkAction = (action: 'export' | 'delete' | 'bookmark') => {
    switch (action) {
      case 'export':
        console.log('Exporting papers:', selectedPapers);
        break;
      case 'delete':
        selectedPapers.forEach(id => {
          deletePaper.mutate(id);
        });
        setSelectedPapers([]);
        break;
      case 'bookmark':
        console.log('Bookmarking papers:', selectedPapers);
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col p-8 relative z-10 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 w-full max-w-7xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-white shadow-lg">
                <BookOpen size={24} />
              </div>
              <h1 className="text-4xl font-display font-bold text-text-primary">Advanced Research Library</h1>
            </div>
            <p className="text-text-secondary text-lg ml-16">Professional paper management with intelligent search and analytics</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors"
            >
              <Filter size={16} />
              Advanced Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors shadow-lg">
              <DownloadCloud size={16} /> Export Library
            </button>
          </div>
        </div>
      </motion.div>

      {/* Advanced Search and Filters */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.1 }}
        className="w-full max-w-7xl mx-auto mb-6"
      >
        {/* Search Bar */}
        <div className="bg-white border-2 border-border rounded-xl p-4 shadow-sm mb-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papers by title, author, abstract, DOI, or keywords..."
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted"
              />
            </div>
            
            <div className="flex gap-3">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-white"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="citations">Sort by Citations</option>
                <option value="relevance">Sort by Relevance</option>
              </select>
              
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="ready">Ready</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
              
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border border-border rounded-lg hover:bg-surface transition-colors"
              >
                {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      {selectedPapers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-7xl mx-auto mb-4"
        >
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-primary-700 font-medium">
                {selectedPapers.length} paper{selectedPapers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors"
                >
                  Export
                </button>
                <button
                  onClick={() => handleBulkAction('bookmark')}
                  className="px-3 py-1.5 bg-white text-primary-600 border border-primary-200 rounded-lg text-sm hover:bg-primary-50 transition-colors"
                >
                  Bookmark
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedPapers([])}
              className="text-primary-600 hover:text-primary-700"
            >
              Clear Selection
            </button>
          </div>
        </motion.div>
      )}

      {/* Papers Display */}
      <div className="w-full max-w-7xl mx-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPapers.map((paper) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer relative"
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4">
                  <input
                    type="checkbox"
                    checked={selectedPapers.includes(paper.id)}
                    onChange={() => handlePaperSelect(paper.id)}
                    className="w-4 h-4 text-primary-600"
                  />
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paper.status)}`}>
                    {paper.status}
                  </span>
                </div>
                
                {/* Paper Content */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                    {paper.title}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                    {paper.abstract}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-text-muted">
                      {paper.authors.slice(0, 2).join(', ')}
                      {paper.authors.length > 2 && ' et al.'}
                    </span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted">{paper.year}</span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-xs text-text-muted">{paper.journal}</span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Metrics */}
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        {paper.citations?.toLocaleString() || '0'} citations
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/chat/${paper.id}`)}
                        className="p-1 hover:bg-surface rounded transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-1 hover:bg-surface rounded transition-colors">
                        <Share2 size={14} />
                      </button>
                      <button className="p-1 hover:bg-surface rounded transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-border rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPapers.length === sortedPapers.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPapers(sortedPapers.map(p => p.id));
                        } else {
                          setSelectedPapers([]);
                        }
                      }}
                      className="text-primary-600"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase">Title & Authors</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase">Venue</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase">Citations</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedPapers.map((paper) => (
                  <motion.tr
                    key={paper.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}
                    className="border-b border-border hover:bg-surface transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPapers.includes(paper.id)}
                        onChange={() => handlePaperSelect(paper.id)}
                        className="text-primary-600"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-text-primary mb-1">{paper.title}</div>
                        <div className="text-sm text-text-muted">
                          {paper.authors.slice(0, 3).join(', ')}
                          {paper.authors.length > 3 && ' et al.'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{paper.journal}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{paper.year}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        {paper.citations?.toLocaleString() || '0'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(paper.status)}`}>
                        {paper.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/chat/${paper.id}`)}
                          className="p-1 hover:bg-surface rounded transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        <button className="p-1 hover:bg-surface rounded transition-colors">
                          <Share2 size={14} />
                        </button>
                        <button className="p-1 hover:bg-surface rounded transition-colors">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;
