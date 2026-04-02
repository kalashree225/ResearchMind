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

  const features = [
    {
      icon: BrainCircuit,
      title: 'AI-Powered Analysis',
      description: 'Get intelligent insights from your research papers',
      color: theme.primary,
      path: '/upload'
    },
    {
      icon: BookOpen,
      title: 'Smart Library',
      description: 'Organize and access your research collection',
      color: theme.primary,
      path: '/library'
    },
    {
      icon: BarChart3,
      title: 'Topic Clustering',
      description: 'Discover patterns and relationships in your research',
      color: '#10b981',
      path: '/clusters'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Work together with your research team',
      color: '#f59e0b',
      path: '/history'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Track your research progress and impact',
      color: '#8b5cf6',
      path: '/history'
    }
  ];

  const stats = [
    {
      label: 'Total Papers',
      value: '24',
      change: '+12%',
      icon: BookOpen
    },
    {
      label: 'Active Projects',
      value: '8',
      change: '+25%',
      icon: BrainCircuit
    },
    {
      label: 'Collaborations',
      value: '156',
      change: '+8%',
      icon: Users
    },
    {
      label: 'Citations',
      value: '1,247',
      change: '+18%',
      icon: TrendingUp
    }
  ];

  return (
    <div style={{ backgroundColor: theme.background, minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto p-8"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            ResearchMind Dashboard
          </motion.h1>
          <p className="text-xl" style={{ color: theme.textSecondary }}>
            Your intelligent research companion
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(feature.path)}
              className="p-6 rounded-2xl border hover:shadow-lg transition-all hover:scale-105 text-left"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border,
                color: theme.text
              }}
            >
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: feature.color + '20' }}
                >
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {feature.description}
              </p>
              <div className="flex items-center text-sm" style={{ color: feature.color }}>
                <span>Get Started</span>
                <ArrowRight size={16} className="ml-1" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl border"
              style={{
                backgroundColor: theme.surface,
                borderColor: theme.border
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.primary + '20' }}
                >
                  <stat.icon size={20} style={{ color: theme.primary }} />
                </div>
                <span 
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: stat.change.startsWith('+') ? '#10b981' : '#ef4444',
                    color: '#ffffff'
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: theme.text }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: theme.textSecondary }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: theme.text }}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Paper uploaded successfully', time: '2 minutes ago', type: 'success' },
              { title: 'New citation detected', time: '1 hour ago', type: 'info' },
              { title: 'Analysis completed', time: '3 hours ago', type: 'success' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg"
                style={{
                  backgroundColor: theme.background,
                  borderLeft: `3px solid ${activity.type === 'success' ? '#10b981' : activity.type === 'info' ? '#3b82f6' : '#f59e0b'}`
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activity.type === 'success' ? '#10b981' : activity.type === 'info' ? '#3b82f6' : '#f59e0b' }}
                />
                <div className="flex-1">
                  <div className="font-medium" style={{ color: theme.text }}>
                    {activity.title}
                  </div>
                  <div className="text-sm" style={{ color: theme.textSecondary }}>
                    {activity.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Upload CTA */}
        <div className="text-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/upload')}
            className="px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105"
            style={{
              backgroundColor: theme.primary,
              color: '#ffffff'
            }}
          >
            Upload New Paper
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
