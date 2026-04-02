import { motion } from 'framer-motion';
import { Map, Zap, Layers, Share2, Filter, TrendingUp, BarChart3, Settings, Download, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGenerateClusters } from '../hooks/useTopics';
import { useMaterialTheme } from '../contexts/MaterialThemeContext';

const ClustersView = () => {
  const { theme } = useMaterialTheme();
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
      papers: [
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
      papers: [
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
      papers: [
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
      papers: [
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
      papers: [
        { id: '9', title: 'Semi-Supervised Classification with Graph Convolutional Networks', authors: 'Kipf & Welling' }
      ]
    }
  ];
      density: 0.68,
      keywords: ['CNN', 'Object Detection', 'Segmentation', 'Image Classification', 'GANs']
    },
    {
      id: 4,
      name: 'Optimization',
      x: 75,
      y: 55,
      size: 0.8,
      color: 'bg-orange-500',
      papers: 5,
      density: 0.61,
      keywords: ['Gradient Descent', 'SGD', 'Adam', 'Learning Rate', 'Regularization']
    },
    {
      id: 5,
      name: 'Graph Theory',
      x: 20,
      y: 65,
      size: 0.7,
      color: 'bg-red-500',
      papers: 4,
      density: 0.54,
      keywords: ['PageRank', 'Community Detection', 'Network Analysis', 'Centrality', 'Clustering']
    }
  ];

  return (
    <div className="flex-1 w-full flex flex-col p-10 relative z-10 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 w-full max-w-7xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-white shadow-lg">
                <Map size={24} />
              </div>
              <h1 className="text-4xl font-display font-bold text-text-primary">Advanced Topic Clustering</h1>
            </div>
            <p className="text-text-secondary text-lg ml-16">AI-powered semantic analysis with advanced visualization algorithms</p>
          </div>
          
          <div className="flex gap-3">
            <select 
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg text-sm bg-white"
            >
              <option value="umap">UMAP Projection</option>
              <option value="tsne">t-SNE</option>
              <option value="pca">PCA</option>
              <option value="kmeans">K-Means</option>
              <option value="hierarchical">Hierarchical</option>
            </select>
            
            <select 
              value={clusterCount}
              onChange={(e) => setClusterCount(Number(e.target.value))}
              className="px-4 py-2 border border-border rounded-lg text-sm bg-white"
            >
              <option value={3}>3 Clusters</option>
              <option value={5}>5 Clusters</option>
              <option value={8}>8 Clusters</option>
              <option value={10}>10 Clusters</option>
            </select>
            
            <button 
              onClick={() => generateClusters([])}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors shadow-inner disabled:opacity-50"
            >
              <Layers size={16} /> Re-cluster
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">
              <Share2 size={16} /> Export Analysis
            </button>
          </div>
        </div>
      </motion.div>

      <div className="w-full max-w-7xl mx-auto flex gap-8 h-[700px]">
        {/* Main Visualization Pane */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="flex-1 glass-panel rounded-3xl relative overflow-hidden border border-border/50 bg-gradient-to-br from-slate-50 to-blue-50"
        >
          {/* Visualization Controls */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-3 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
                className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium hover:bg-primary-200 transition-colors"
              >
                {viewMode === '2d' ? '3D View' : '2D View'}
              </button>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="showLabels" 
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded" 
                />
                <label htmlFor="showLabels" className="text-xs text-text-secondary">Labels</label>
              </div>
              
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={14} className="text-text-muted" />
              </button>
            </div>
          </div>
          
          {/* Advanced Cluster Visualization */}
          <div className="absolute inset-0 p-8">
            <div className="relative w-full h-full">
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full">
                {clusters.map((cluster1, i) => 
                  clusters.slice(i + 1).map((cluster2, j) => {
                    const distance = Math.sqrt(Math.pow(cluster2.x - cluster1.x, 2) + Math.pow(cluster2.y - cluster1.y, 2));
                    const opacity = Math.max(0.1, 1 - distance / 100);
                    return (
                      <line
                        key={`${i}-${j}`}
                        x1={`${cluster1.x}%`}
                        y1={`${cluster1.y}%`}
                        x2={`${cluster2.x}%`}
                        y2={`${cluster2.y}%`}
                        stroke="rgba(99, 102, 241, 0.2)"
                        strokeWidth="1"
                        opacity={opacity}
                      />
                    );
                  })
                )}
              </svg>
              
              {/* Cluster Nodes */}
              {clusters.map((cluster) => (
                <motion.div
                  key={cluster.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: cluster.size }}
                  transition={{ type: 'spring', stiffness: 100, delay: cluster.id * 0.1 }}
                  onMouseEnter={() => setActiveCluster(cluster.id)}
                  onMouseLeave={() => setActiveCluster(null)}
                  className={`absolute rounded-full cursor-pointer transition-all duration-300 ${activeCluster === cluster.id ? 'z-30 scale-125 brightness-125' : 'z-10 hover:scale-110 hover:brightness-110'}`}
                  style={{
                    left: `${cluster.x}%`,
                    top: `${cluster.y}%`,
                    width: `${60 + cluster.size * 20}px`,
                    height: `${60 + cluster.size * 20}px`,
                    transform: 'translate(-50%, -50%)',
                    background: `radial-gradient(circle at 30% 30%, ${cluster.color.replace('bg-', 'rgb(var(--tw-').replace('500', '400))')}, ${cluster.color.replace('bg-', 'rgb(var(--tw-').replace('500', '600))')})`,
                    boxShadow: `0 8px 32px ${cluster.color.replace('bg-', 'rgba(var(--tw-').replace('500', '500), 0.3)')}, inset 0 2px 4px rgba(255,255,255,0.3)`,
                    border: '2px solid rgba(255,255,255,0.8)'
                  }}
                >
                  <div className="w-full h-full rounded-full flex flex-col items-center justify-center text-white p-2 text-center backdrop-blur-sm">
                    {showLabels && (
                      <>
                        <span className="text-xs font-bold leading-tight uppercase drop-shadow-lg">{cluster.name}</span>
                        <span className="text-[10px] opacity-80">{cluster.papers} papers</span>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border border-border rounded-xl shadow-lg p-4 max-w-xs">
            <h4 className="text-xs font-bold text-text-primary mb-3">Cluster Analysis</h4>
            <div className="space-y-2">
              {clusters.slice(0, 4).map((cluster) => (
                <div key={cluster.id} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cluster.color}`} />
                  <span className="text-xs text-text-secondary truncate">{cluster.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Advanced Analytics Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="w-96 flex flex-col gap-6"
        >
          {/* Cluster Statistics */}
          <div className="glass-panel p-6 rounded-2xl border border-border/50">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-primary-500" />
              Cluster Analytics
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{clusters.length}</div>
                  <div className="text-xs text-primary-400">Total Clusters</div>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{clusters.reduce((sum, c) => sum + c.papers, 0)}</div>
                  <div className="text-xs text-secondary/80">Total Papers</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-secondary">Avg Density</span>
                  <span className="text-text-primary font-medium">
                    {(clusters.reduce((sum, c) => sum + c.density, 0) / clusters.length).toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Active Cluster Details */}
          {activeCluster ? (
            <div className="glass-panel p-6 rounded-2xl border border-border/50 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-4 h-4 rounded-full shadow-lg ${clusters.find(c => c.id === activeCluster)?.color || 'bg-primary-500'}`} />
                <h3 className="text-xl font-bold text-text-primary">
                  {clusters.find(c => c.id === activeCluster)?.name}
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-text-secondary mb-1">Papers in Cluster</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {clusters.find(c => c.id === activeCluster)?.papers}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary mb-1">Density Score</div>
                    <div className="text-2xl font-bold text-secondary">
                      {clusters.find(c => c.id === activeCluster)?.density.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Top Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {clusters.find(c => c.id === activeCluster)?.keywords.map((kw, i) => (
                       <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                         i < 3 ? 'bg-primary-100 text-primary-700 border-primary-200' :
                         i < 6 ? 'bg-secondary text-white border-secondary/50' :
                         'bg-surface text-text-primary border-border'
                       }`}>
                         {kw}
                       </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-600 to-secondary text-white rounded-xl font-medium hover:from-primary-500 hover:to-secondary/90 transition-all shadow-lg">
                    <TrendingUp size={16} /> Deep Dive Analysis
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-border/50 flex-1 flex flex-col items-center justify-center text-center">
              <Map size={48} className="mb-4 text-text-muted opacity-50" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Select a Cluster</h3>
              <p className="text-text-secondary text-sm max-w-xs">
                Click on any cluster to view detailed analytics, keywords, and research trends.
              </p>
            </div>
          )}
          
          {/* Export Options */}
          <div className="glass-panel p-4 rounded-2xl border border-border/50">
            <h4 className="text-sm font-bold text-text-primary mb-3">Export Options</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-surface hover:bg-surface-hover rounded-lg text-sm transition-colors">
                <Download size={14} /> Export as JSON
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-surface hover:bg-surface-hover rounded-lg text-sm transition-colors">
                <Download size={14} /> Export as CSV
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-surface hover:bg-surface-hover rounded-lg text-sm transition-colors">
                <Download size={14} /> Generate Report
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ClustersView;
