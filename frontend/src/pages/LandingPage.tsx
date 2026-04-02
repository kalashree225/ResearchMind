import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, FileText, Network, Zap, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FileText size={24} />, title: 'Smart Analysis', desc: 'Extract key insights from research papers instantly' },
    { icon: <Network size={24} />, title: 'Citation Networks', desc: 'Visualize connections between papers' },
    { icon: <Zap size={24} />, title: 'AI-Powered Chat', desc: 'Ask questions about your research' },
    { icon: <BrainCircuit size={24} />, title: 'Topic Discovery', desc: 'Find patterns across your library' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-text-primary overflow-hidden">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-secondary flex items-center justify-center shadow-lg">
              <BrainCircuit size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl">ResearchMind</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-primary-500/20 mb-6">
              <Sparkles size={16} className="text-primary-400" />
              <span className="text-sm text-text-secondary">Advanced Research Tools</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 tracking-tight">
              Research Papers,
              <br />
              <span className="gradient-text">Simplified</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
              Upload papers, extract insights, visualize connections, and discover patterns across your research library.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all shadow-2xl shadow-primary-500/30 hover:scale-105 flex items-center gap-2"
              >
                Start Free <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 glass-panel hover:bg-surface-hover text-text-primary rounded-xl font-semibold transition-all"
              >
                Sign In
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20"
          >
            <div className="glass-panel rounded-3xl p-2 shadow-2xl border border-border/50">
              <div className="h-[400px] bg-surface/50 rounded-2xl flex items-center justify-center text-text-muted">
                <div className="text-center">
                  <BookOpen size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Everything you need</h2>
            <p className="text-text-secondary text-lg">Powerful tools for academic research</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-2xl hover:bg-surface-hover transition-all group cursor-pointer border border-border/50"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto glass-panel rounded-3xl p-12 border border-border/50">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-display font-bold gradient-text mb-2">Fast</div>
              <div className="text-text-secondary">Instant Analysis</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold gradient-text mb-2">Smart</div>
              <div className="text-text-secondary">AI-Powered</div>
            </div>
            <div>
              <div className="text-5xl font-display font-bold gradient-text mb-2">Simple</div>
              <div className="text-text-secondary">Easy to Use</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-bold mb-6">Ready to get started?</h2>
            <p className="text-text-secondary text-lg mb-8">Join researchers accelerating their work</p>
            <button 
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold transition-all shadow-2xl shadow-primary-500/30 hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-text-muted text-sm">
          <div>© 2024 ResearchMind. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
