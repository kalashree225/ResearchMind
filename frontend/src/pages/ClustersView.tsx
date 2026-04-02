import { motion } from 'framer-motion';
import { Map, Zap, Layers, Share2, Filter, TrendingUp, BarChart3, Settings, Download, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGenerateClusters } from '../hooks/useTopics';
import { useSimpleTheme } from '../contexts/SimpleThemeContext';
import { useNavigate } from 'react-router-dom';
import { papersService } from '../services/papers';

const ClustersView = () => {
  const { theme } = useSimpleTheme();
  const navigate = useNavigate();
  const [activeCluster, setActiveCluster] = useState<number | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('umap');
  const [clusterCount, setClusterCount] = useState(5);
  const [showLabels, setShowLabels] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [colorScheme, setColorScheme] = useState('material');
  const [paperCount, setPaperCount] = useState(0);
  const { mutate: generateClusters, data: clusterData, isPending } = useGenerateClusters();

  // Fetch papers count on mount
  useEffect(() => {
    papersService.listPapers()
      .then(papers => setPaperCount(papers.length))
      .catch(() => setPaperCount(0));
  }, []);

  const clusters = clusterData?.clusters || [];

  const handleGenerateClusters = async () => {
    try {
      const papers = await papersService.listPapers();
      if (papers.length === 0) {
        alert('No papers found. Please upload some papers first.');
        return;
      }
      
      setPaperCount(papers.length);
      const paperIds = papers.map(p => String(p.id));
      generateClusters(paperIds);
    } catch (error) {
      console.error('Failed to fetch papers:', error);
      alert('Error loading papers. Please try again.');
    }
  };

  // Color schemes for clusters
  const colorSchemes = {
    material: ['#1976d2', '#dc004e', '#388e3c', '#f57c00', '#7b1fa2', '#0288d1', '#c2185b', '#689f38'],
    vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#FFDFD3', '#C8E6C9'],
    dark: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1', '#D5DBDB', '#ABB2B9']
  };

  const clusterColors = colorSchemes[colorScheme as keyof typeof colorSchemes];

  const handleClusterClick = (clusterId: number) => {
    setActiveCluster(clusterId);
    const cluster = clusters.find(c => c.id === clusterId);
    if (cluster && 'paper_ids' in cluster && cluster.paper_ids && cluster.paper_ids.length > 0) {
      // Navigate to first paper in cluster
      navigate(`/chat/${cluster.paper_ids[0]}`);
    }
  };

  const handlePaperClick = (paperId: string) => {
    navigate(`/chat/${paperId}`);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.background, color: theme.text }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
            Advanced Topic Clustering
          </h1>
          <p style={{ color: theme.textSecondary }}>
            Discover research patterns and relationships through AI-powered clustering
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="p-4 rounded-lg border">
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Algorithm
            </label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="w-full p-2 rounded border"
              style={{ 
                backgroundColor: theme.background, 
                borderColor: theme.border,
                color: theme.text
              }}
            >
              <option value="umap">UMAP</option>
              <option value="tsne">t-SNE</option>
              <option value="pca">PCA</option>
              <option value="kmeans">K-Means</option>
            </select>
          </div>

          <div style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="p-4 rounded-lg border">
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Cluster Count
            </label>
            <input
              type="number"
              value={clusterCount}
              onChange={(e) => setClusterCount(parseInt(e.target.value))}
              min="2"
              max="20"
              className="w-full p-2 rounded border"
              style={{ 
                backgroundColor: theme.background, 
                borderColor: theme.border,
                color: theme.text
              }}
            />
          </div>

          <div style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="p-4 rounded-lg border">
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Color Scheme
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value)}
              className="w-full p-2 rounded border"
              style={{ 
                backgroundColor: theme.background, 
                borderColor: theme.border,
                color: theme.text
              }}
            >
              <option value="material">Material Design</option>
              <option value="vibrant">Vibrant</option>
              <option value="pastel">Pastel</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="p-4 rounded-lg border">
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              View Mode
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('2d')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === '2d' 
                    ? 'text-white' 
                    : ''
                }`}
                style={{ 
                  backgroundColor: viewMode === '2d' ? theme.primary : theme.surface,
                  color: viewMode === '2d' ? '#ffffff' : theme.text
                }}
              >
                2D
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === '3d' 
                    ? 'text-white' 
                    : ''
                }`}
                style={{ 
                  backgroundColor: viewMode === '3d' ? theme.primary : theme.surface,
                  color: viewMode === '3d' ? '#ffffff' : theme.text
                }}
              >
                3D
              </button>
            </div>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cluster Visualization */}
          <div className="lg:col-span-2 p-6 rounded-xl border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: theme.text }}>
                Cluster Visualization
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className="px-3 py-1 rounded text-sm"
                  style={{ 
                    backgroundColor: showLabels ? theme.primary : theme.surface,
                    color: showLabels ? '#ffffff' : theme.text
                  }}
                >
                  {showLabels ? 'Hide Labels' : 'Show Labels'}
                </button>
                <button
                  onClick={handleGenerateClusters}
                  disabled={isPending}
                  className="px-3 py-1 rounded text-sm text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  {isPending ? 'Generating...' : (clusters.length > 0 ? 'Regenerate' : 'Generate Clusters')}
                </button>
              </div>
            </div>

            {/* SVG Visualization */}
            <div className="relative h-96 border rounded-lg flex items-center justify-center" style={{ borderColor: theme.border, backgroundColor: theme.background }}>
              {clusters.length === 0 ? (
                <div className="text-center" style={{ color: theme.textSecondary }}>
                  <p className="text-lg font-medium">No clusters generated yet</p>
                  <p className="text-sm mt-2">Upload some papers first to generate clusters</p>
                </div>
              ) : (
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                {/* Connection Lines */}
                {clusters.map((cluster, i) => 
                  clusters.slice(i + 1).map((otherCluster) => {
                    const distance = Math.sqrt(
                      Math.pow(cluster.x - otherCluster.x, 2) + 
                      Math.pow(cluster.y - otherCluster.y, 2)
                    );
                    if (distance < 30) {
                      return (
                        <line
                          key={`${cluster.id}-${otherCluster.id}`}
                          x1={cluster.x}
                          y1={cluster.y}
                          x2={otherCluster.x}
                          y2={otherCluster.y}
                          stroke={theme.border}
                          strokeWidth="0.5"
                          strokeDasharray="2,2"
                        />
                      );
                    }
                    return null;
                  })
                )}

                {/* Cluster Nodes */}
                {clusters.map((cluster, index) => (
                  <g key={cluster.id}>
                    <motion.circle
                      cx={cluster.x}
                      cy={cluster.y}
                      r={cluster.size * 8}
                      fill={clusterColors[index % clusterColors.length]}
                      fillOpacity={0.8}
                      stroke={clusterColors[index % clusterColors.length]}
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClusterClick(cluster.id)}
                    />
                    
                    {showLabels && (
                      <text
                        x={cluster.x}
                        y={cluster.y + cluster.size * 8 + 5}
                        textAnchor="middle"
                        fontSize="3"
                        fill={theme.text}
                        style={{ pointerEvents: 'none' }}
                      >
                        {cluster.name}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
              )}
            </div>
          </div>

          {/* Cluster Details */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
              Cluster Details
            </h2>
            
            {activeCluster ? (
              <div className="space-y-4">
                {(() => {
                  const cluster = clusters.find(c => c.id === activeCluster);
                  if (!cluster) return null;
                  
                  return (
                    <>
                      <div>
                        <h3 className="font-semibold mb-2" style={{ color: clusterColors[clusters.indexOf(cluster) % clusterColors.length] }}>
                          {cluster.name}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p style={{ color: theme.textSecondary }}>
                            <strong>Papers:</strong> {cluster.papers}
                          </p>
                          <p style={{ color: theme.textSecondary }}>
                            <strong>Density:</strong> {(cluster.density * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2" style={{ color: theme.text }}>
                          Keywords
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {cluster.keywords.map((keyword, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded text-xs"
                              style={{ 
                                backgroundColor: clusterColors[clusters.indexOf(cluster) % clusterColors.length] + '20',
                                color: clusterColors[clusters.indexOf(cluster) % clusterColors.length]
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2" style={{ color: theme.text }}>
                          Papers in Cluster
                        </h4>
                        <div className="space-y-2">
                          {cluster.paperList.map((paper, i) => (
                            <button
                              key={i}
                              onClick={() => handlePaperClick(paper.id)}
                              className="w-full text-left p-2 rounded border text-sm hover:opacity-80 transition-opacity"
                              style={{ 
                                backgroundColor: theme.background,
                                borderColor: theme.border,
                                color: theme.text
                              }}
                            >
                              <div className="font-medium">{paper.title}</div>
                              <div className="text-xs" style={{ color: theme.textSecondary }}>
                                {paper.authors}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: theme.textSecondary }}>
                <p>Select a cluster from the visualization to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary + '20' }}>
                <Layers size={20} style={{ color: theme.primary }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.text }}>
                  {clusters.length}
                </p>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Total Clusters
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary + '20' }}>
                <TrendingUp size={20} style={{ color: theme.primary }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.text }}>
                  {clusters.reduce((sum, c) => sum + c.papers, 0)}
                </p>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Total Papers
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4CAF50' + '20' }}>
                <BarChart3 size={20} style={{ color: '#4CAF50' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.text }}>
                  {(clusters.reduce((sum, c) => sum + c.density, 0) / clusters.length * 100).toFixed(1)}%
                </p>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Avg Density
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ef4444' + '20' }}>
                <Zap size={20} style={{ color: '#ef4444' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.text }}>
                  {selectedAlgorithm.toUpperCase()}
                </p>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  Algorithm
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClustersView;
