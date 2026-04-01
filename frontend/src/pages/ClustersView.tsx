import { motion } from 'framer-motion';
import { Map, Zap, Layers, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGenerateClusters } from '../hooks/useTopics';

const ClustersView = () => {
  const [activeCluster, setActiveCluster] = useState<number | null>(null);
  const { mutate: generateClusters, data: clusterData, isPending } = useGenerateClusters();

  useEffect(() => {
    generateClusters();
  }, []);

  const clusters = clusterData?.clusters || [];

  return (
    <div className="flex-1 w-full flex flex-col p-10 relative z-10 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 w-full max-w-6xl mx-auto flex items-end justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary-500 shadow-lg">
              <Map size={20} />
            </div>
            <h1 className="text-3xl font-display font-bold text-text-primary">Semantic Topic Map</h1>
          </div>
          <p className="text-text-secondary text-lg ml-14">UMAP projection of document embeddings clustered via DBSCAN.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => generateClusters()}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-surface-hover transition-colors shadow-inner disabled:opacity-50"
          >
            <Layers size={16} /> Re-cluster
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">
            <Share2 size={16} /> Export View
          </button>
        </div>
      </motion.div>

      <div className="w-full max-w-6xl mx-auto flex gap-8 h-[600px]">
        {isPending ? (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p>Generating clusters...</p>
            </div>
          </div>
        ) : clusters.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            <p>No clusters available. Upload papers to generate clusters.</p>
          </div>
        ) : (
          <>
        {/* Graph Pane */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="flex-1 glass-panel rounded-3xl relative overflow-hidden border border-border/50 bg-[#0c0c10]"
        >
          {/* Scatter Plot Simulation */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          {clusters.map((cluster) => (
            <motion.div
              key={cluster.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: cluster.size }}
              transition={{ type: 'spring', stiffness: 100, delay: cluster.id * 0.1 }}
              onMouseEnter={() => setActiveCluster(cluster.id)}
              onMouseLeave={() => setActiveCluster(null)}
              className={`absolute rounded-full cursor-pointer transition-all duration-300 ${activeCluster === cluster.id ? 'z-20 brightness-125' : 'z-10 blur-[1px] hover:blur-none'} ${cluster.color}`}
              style={{
                left: `${cluster.x}%`,
                top: `${cluster.y}%`,
                width: '80px',
                height: '80px',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 40px currentColor'
              }}
            >
              <div className="w-full h-full rounded-full bg-black/40 flex flex-col items-center justify-center text-white p-2 text-center backdrop-blur-sm border border-white/20">
                <span className="text-[10px] font-bold leading-tight uppercase drop-shadow-lg">{cluster.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Pane */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="w-80 flex flex-col gap-6"
        >
          {activeCluster ? (
            <div className="glass-panel p-6 rounded-2xl border border-border/50 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-4 h-4 rounded-full shadow-[0_0_15px_currentColor] ${clusters.find(c => c.id === activeCluster)?.color || 'bg-primary-500'}`} />
                <h3 className="text-xl font-bold text-text-primary">{clusters.find(c => c.id === activeCluster)?.name}</h3>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-muted text-sm">Papers Indexed</span>
                  <span className="bg-surface px-2 py-0.5 rounded text-text-primary font-bold text-sm">
                    {clusters.find(c => c.id === activeCluster)?.papers}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-muted text-sm">Density Score</span>
                  <span className="bg-surface px-2 py-0.5 rounded text-secondary font-bold text-sm">
                    {clusters.find(c => c.id === activeCluster)?.density.toFixed(2)}
                  </span>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Top Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {clusters.find(c => c.id === activeCluster)?.keywords.map(kw => (
                       <span key={kw} className="px-2 py-1 rounded bg-primary-500/10 text-primary-400 text-xs font-medium border border-primary-500/20">
                         {kw}
                       </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-auto flex items-center justify-center gap-2 py-3 bg-surface-hover text-text-primary rounded-xl font-medium hover:bg-primary-600 hover:text-white transition-colors">
                 <Zap size={16} /> Analyze Cluster
              </button>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-border/50 h-full flex flex-col items-center justify-center text-center text-text-muted">
               <Map size={48} className="mb-4 opacity-50" />
               <p>Hover over a semantic cluster to view TF-IDF keywords, density metrics, and related papers.</p>
            </div>
          )}
        </motion.div>
        </>
        )}
      </div>
    </div>
  );
};

export default ClustersView;
