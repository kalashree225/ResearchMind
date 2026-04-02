import { motion } from 'framer-motion';
import { Map, Zap, Layers, Share2, Filter, TrendingUp, BarChart3, Settings, Download, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGenerateClusters } from '../hooks/useTopics';
import { useMaterialTheme } from '../contexts/MaterialThemeContext';
import { useNavigate } from 'react-router-dom';

const ClustersView = () => {
  const { theme } = useMaterialTheme();
  const navigate = useNavigate();
  const [activeCluster, setActiveCluster] = useState<number | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('umap');
  const [clusterCount, setClusterCount] = useState(5);
  const [showLabels, setShowLabels] = useState(true);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [colorScheme, setColorScheme] = useState('material');
  const { mutate: generateClusters, data: clusterData, isPending } = useGenerateClusters();

  // Color schemes for clusters
  const colorSchemes = {
    material: ['#1976d2', '#dc004e', '#388e3c', '#f57c00', '#7b1fa2', '#0288d1', '#c2185b', '#689f38'],
    vibrant: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#FFDFD3', '#C8E6C9'],
    dark: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1', '#D5DBDB', '#ABB2B9']
  };

  const clusterColors = colorSchemes[colorScheme as keyof typeof colorSchemes];

  useEffect(() => {
    // Load paper IDs from library or use all papers
    const paperIds = ['1', '2', '3', '4', '5']; // Mock paper IDs
    generateClusters(paperIds);
  }, [generateClusters]);

  const clusters = clusterData?.clusters || [
    {
      id: 1,
      name: 'Neural Networks',
      x: 25,
      y: 30,
      size: 1.2,
      papers: 12,
      density: 0.85,
      keywords: ['Deep Learning', 'Backpropagation', 'CNN', 'RNN', 'Transformers'],
      paperList: [
        { id: '1', title: 'Attention Is All You Need', authors: 'Vaswani et al.' },
        { id: '2', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.' },
        { id: '3', title: 'GPT-3: Language Models are Few-Shot Learners', authors: 'Brown et al.' }
      ]
    },
    {
      id: 2,
      name: 'Natural Language Processing',
      x: 65,
      y: 25,
      size: 1.0,
      papers: 8,
      density: 0.72,
      keywords: ['BERT', 'GPT', 'Tokenization', 'Attention', 'Embeddings'],
      paperList: [
        { id: '4', title: 'Word2Vec: Distributed Representations of Words', authors: 'Mikolov et al.' },
        { id: '5', title: 'GloVe: Global Vectors for Word Representation', authors: 'Pennington et al.' }
      ]
    },
    {
      id: 3,
      name: 'Computer Vision',
      x: 45,
      y: 60,
      size: 0.9,
      papers: 6,
      density: 0.68,
      keywords: ['CNN', 'Object Detection', 'Image Segmentation', 'YOLO', 'ResNet'],
      paperList: [
        { id: '6', title: 'Deep Residual Learning for Image Recognition', authors: 'He et al.' },
        { id: '7', title: 'You Only Look Once: Unified, Real-Time Object Detection', authors: 'Redmon et al.' }
      ]
    },
    {
      id: 4,
      name: 'Reinforcement Learning',
      x: 15,
      y: 70,
      size: 0.8,
      papers: 4,
      density: 0.61,
      keywords: ['Q-Learning', 'Policy Gradients', 'Actor-Critic', 'PPO', 'DQN'],
      paperList: [
        { id: '8', title: 'Playing Atari with Deep Reinforcement Learning', authors: 'Mnih et al.' }
      ]
    },
    {
      id: 5,
      name: 'Graph Neural Networks',
      x: 75,
      y: 55,
      size: 0.7,
      papers: 3,
      density: 0.55,
      keywords: ['GCN', 'Graph Attention', 'Node Classification', 'Link Prediction'],
      paperList: [
        { id: '9', title: 'Semi-Supervised Classification with Graph Convolutional Networks', authors: 'Kipf & Welling' }
      ]
    }
  ];

  const handleClusterClick = (clusterId: number) => {
    setActiveCluster(clusterId);
    const cluster = clusters.find(c => c.id === clusterId);
    if (cluster && cluster.paperList.length > 0) {
      // Navigate to first paper in cluster
      navigate(`/chat/${cluster.paperList[0].id}`);
    }
  };

  const handlePaperClick = (paperId: string) => {
    navigate(`/chat/${paperId}`);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: theme.background, color: theme.onBackground }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: theme.onBackground }}>
            Advanced Topic Clustering
          </h1>
          <p style={{ color: theme.onBackground + '99' }}>
            Discover research patterns and relationships through AI-powered clustering
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div style={{ backgroundColor: theme.surface }} className="p-4 rounded-lg border" style={{ borderColor: theme.elevation.level2 }}>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.onSurface }}>
              Algorithm
            </label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="w-full p-2 rounded border"
              style={{ 
                backgroundColor: theme.background, 
                borderColor: theme.elevation.level2,
                color: theme.onBackground
              }}
            >
              <option value="umap">UMAP</option>
              <option value="tsne">t-SNE</option>
              <option value="pca">PCA</option>
              <option value="kmeans">K-Means</option>
            </select>
          </div>

          <div style={{ backgroundColor: theme.surface }} className="p-4 rounded-lg border" style={{ borderColor: theme.elevation.level2 }}>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.onSurface }}>
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
                borderColor: theme.elevation.level2,
                color: theme.onBackground
              }}
            />
          </div>

          <div style={{ backgroundColor: theme.surface }} className="p-4 rounded-lg border" style={{ borderColor: theme.elevation.level2 }}>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.onSurface }}>
              Color Scheme
            </label>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value)}
              className="w-full p-2 rounded border"
              style={{ 
                backgroundColor: theme.background, 
                borderColor: theme.elevation.level2,
                color: theme.onBackground
              }}
            >
              <option value="material">Material Design</option>
              <option value="vibrant">Vibrant</option>
              <option value="pastel">Pastel</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div style={{ backgroundColor: theme.surface }} className="p-4 rounded-lg border" style={{ borderColor: theme.elevation.level2 }}>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.onSurface }}>
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
                  backgroundColor: viewMode === '2d' ? theme.primary : theme.elevation.level1,
                  color: viewMode === '2d' ? theme.onPrimary : theme.onSurface
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
                  backgroundColor: viewMode === '3d' ? theme.primary : theme.elevation.level1,
                  color: viewMode === '3d' ? theme.onPrimary : theme.onSurface
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
          <div className="lg:col-span-2" style={{ backgroundColor: theme.surface }} className="p-6 rounded-xl border" style={{ borderColor: theme.elevation.level2 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold" style={{ color: theme.onSurface }}>
                Cluster Visualization
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className="px-3 py-1 rounded text-sm"
                  style={{ 
                    backgroundColor: showLabels ? theme.primary : theme.elevation.level1,
                    color: showLabels ? theme.onPrimary : theme.onSurface
                  }}
                >
                  {showLabels ? 'Hide Labels' : 'Show Labels'}
                </button>
                <button
                  onClick={() => generateClusters(['1', '2', '3', '4', '5'])}
                  disabled={isPending}
                  className="px-3 py-1 rounded text-sm text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  {isPending ? 'Generating...' : 'Regenerate'}
                </button>
              </div>
            </div>

            {/* SVG Visualization */}
            <div className="relative h-96 border rounded-lg" style={{ borderColor: theme.elevation.level2, backgroundColor: theme.background }}>
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
                          stroke={theme.elevation.level3}
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
                        fill={theme.onBackground}
                        style={{ pointerEvents: 'none' }}
                      >
                        {cluster.name}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Cluster Details */}
          <div style={{ backgroundColor: theme.surface }} className="p-6 rounded-xl border" style={{ borderColor: theme.elevation.level2 }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.onSurface }}>
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
                          <p style={{ color: theme.onSurface + '99' }}>
                            <strong>Papers:</strong> {cluster.papers}
                          </p>
                          <p style={{ color: theme.onSurface + '99' }}>
                            <strong>Density:</strong> {(cluster.density * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2" style={{ color: theme.onSurface }}>
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
                        <h4 className="font-medium mb-2" style={{ color: theme.onSurface }}>
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
                                borderColor: theme.elevation.level2,
                                color: theme.onSurface
                              }}
                            >
                              <div className="font-medium">{paper.title}</div>
                              <div className="text-xs" style={{ color: theme.onSurface + '80' }}>
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
              <div className="text-center py-8" style={{ color: theme.onSurface + '60' }}>
                <Map size={48} className="mx-auto mb-4" />
                <p>Click on a cluster to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div style={{ backgroundColor: theme.surface }} className="p-4 rounded-lg border" style={{ borderColor: theme.elevation.level2 }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary + '20' }}>
                <Layers size={20} style={{ color: theme.primary }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.onSurface }}>
                  {clusters.length}
                </p>
                <p className="text-sm" style={{ color: theme.onSurface + '80' }}>
                  Total Clusters
                </p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: theme.surface }} className="p-4 rounded-lg border" style={{ borderColor: theme.elevation.level2 }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.secondary + '20' }}>
                <TrendingUp size={20} style={{ color: theme.secondary }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.onSurface }}>
                  {clusters.reduce((sum, c) => sum + c.papers, 0)}
                </p>
                <p className="text-sm" style={{ color: theme.onSurface + '80' }}>
                  Total Papers
                </p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: theme.surface }} className="p-4 rounded-lg border" style={{ borderColor: theme.elevation.level2 }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#4CAF50' + '20' }}>
                <BarChart3 size={20} style={{ color: '#4CAF50' }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.onSurface }}>
                  {(clusters.reduce((sum, c) => sum + c.density, 0) / clusters.length * 100).toFixed(1)}%
                </p>
                <p className="text-sm" style={{ color: theme.onSurface + '80' }}>
                  Avg Density
                </p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: theme.surface }} className="p-4 rounded-lg border" style={{ borderColor: theme.elevation.level2 }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.error + '20' }}>
                <Zap size={20} style={{ color: theme.error }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: theme.onSurface }}>
                  {selectedAlgorithm.toUpperCase()}
                </p>
                <p className="text-sm" style={{ color: theme.onSurface + '80' }}>
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
