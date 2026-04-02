import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, BookOpen, BarChart3, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSimpleTheme } from '../contexts/SimpleThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme } = useSimpleTheme();
  const [uploadedPaperId] = useState<string | null>(() => {
    return localStorage.getItem('uploadedPaperId') || null;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto p-8"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-4 mb-6"
          >
            <div className={`w-16 h-16 rounded-2xl ${colors.gradientPrimary} flex items-center justify-center text-white ${colors.shadow}`}>
              <BrainCircuit size={32} />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${colors.text} mb-2`}>ResearchMind Dashboard</h1>
              <p className={`${colors.textSecondary} text-lg`}>Advanced AI-powered research platform</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${colors.bgCard} rounded-2xl p-6 ${colors.shadow} ${colors.border}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl ${colors.primaryLight} flex items-center justify-center`}>
                <BookOpen className={colors.primaryText} size={20} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${colors.text}`}>Total Papers</h3>
                <p className={`text-3xl font-bold ${colors.primaryText}`}>24</p>
              </div>
            </div>
            <p className={`text-sm ${colors.textMuted}`}>All uploaded research papers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${colors.bgCard} rounded-2xl p-6 ${colors.shadow} ${colors.border}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl ${colors.successLight} flex items-center justify-center`}>
                <BarChart3 className={colors.successText} size={20} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${colors.text}`}>Processing</h3>
                <p className={`text-3xl font-bold ${colors.successText}`}>3</p>
              </div>
            </div>
            <p className={`text-sm ${colors.textMuted}`}>Currently being processed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${colors.bgCard} rounded-2xl p-6 ${colors.shadow} ${colors.border}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl ${colors.secondaryLight} flex items-center justify-center`}>
                <Users className={colors.secondaryText} size={20} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${colors.text}`}>Active Users</h3>
                <p className={`text-3xl font-bold ${colors.secondaryText}`}>12</p>
              </div>
            </div>
            <p className={`text-sm ${colors.textMuted}`}>Researchers online now</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${colors.bgCard} rounded-2xl p-6 ${colors.shadow} ${colors.border}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center`}>
                <TrendingUp className="text-orange-600" size={20} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${colors.text}`}>Citations</h3>
                <p className={`text-3xl font-bold text-orange-600`}>1,247</p>
              </div>
            </div>
            <p className={`text-sm ${colors.textMuted}`}>Total citation count</p>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className={`${colors.gradientPrimary} rounded-2xl p-8 text-white ${colors.shadow}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${colors.glass} flex items-center justify-center`}>
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-2`}>Upload New Paper</h3>
                <p className={`${colors.primary} text-opacity-90`}>Add research papers to analyze with AI</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/upload')}
              className={`w-full px-6 py-3 ${colors.glass} hover:${colors.glassBorder} rounded-lg font-medium transition-all flex items-center justify-center gap-2`}
            >
              Start Upload
              <ArrowRight size={20} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className={`${colors.bgCard} rounded-2xl p-8 ${colors.shadow} ${colors.border}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${colors.primaryLight} flex items-center justify-center`}>
                <BrainCircuit size={24} />
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${colors.text}`}>View Library</h3>
                <p className={`${colors.textSecondary}`}>Browse and manage your research collection</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/library')}
              className={`w-full px-6 py-3 ${colors.bgSecondary} hover:${colors.bg} rounded-lg font-medium transition-all flex items-center justify-center gap-2`}
            >
              Browse Library
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <div className={`${colors.bgCard} rounded-2xl p-8 ${colors.shadow} ${colors.border}`}>
            <h3 className={`text-xl font-semibold ${colors.text} mb-6`}>Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Uploaded "Attention Is All You Need"', time: '2 hours ago', user: 'Dr. Smith' },
                { action: 'Completed analysis of "BERT paper"', time: '4 hours ago', user: 'Prof. Johnson' },
                { action: 'Generated citation network', time: '6 hours ago', user: 'Dr. Williams' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`flex items-center justify-between p-4 ${colors.borderLight} rounded-lg hover:${colors.bgSecondary}`}
                >
                  <div className="flex-1">
                    <p className={`font-medium ${colors.text}`}>{activity.action}</p>
                    <p className={`text-sm ${colors.textMuted}`}>{activity.time} • {activity.user}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${colors.primary}`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
