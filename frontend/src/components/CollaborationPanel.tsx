import { useState, useCallback, useMemo } from 'react';
import { Users, MessageSquare, Share2, Eye, Star, Filter, Send, Bell, Settings, UserPlus, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  paperId: string;
  highlights?: string[];
}

interface Activity {
  id: string;
  type: 'comment' | 'highlight' | 'bookmark' | 'export';
  userId: string;
  userName: string;
  description: string;
  timestamp: string;
  paperId?: string;
}

const CollaborationPanel = ({ paperId }: { paperId: string }) => {
  const [activeUsers] = useState<User[]>([
    { id: '1', name: 'Dr. Sarah Chen', avatar: 'SC', status: 'online' },
    { id: '2', name: 'Prof. Michael Roberts', avatar: 'MR', status: 'online' },
    { id: '3', name: 'Dr. Emily Watson', avatar: 'EW', status: 'away', lastSeen: '5 min ago' },
    { id: '4', name: 'Dr. James Liu', avatar: 'JL', status: 'offline', lastSeen: '2 hours ago' }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Dr. Sarah Chen',
      content: 'The methodology section here is particularly interesting. I think the approach could be enhanced with attention mechanisms.',
      timestamp: '2 hours ago',
      paperId,
      highlights: ['methodology section', 'attention mechanisms']
    },
    {
      id: '2',
      userId: '2',
      userName: 'Prof. Michael Roberts',
      content: 'Great point! I also noticed the results section could benefit from more statistical analysis.',
      timestamp: '1 hour ago',
      paperId
    }
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'comment',
      userId: '1',
      userName: 'Dr. Sarah Chen',
      description: 'Commented on methodology section',
      timestamp: '2 hours ago',
      paperId
    },
    {
      id: '2',
      type: 'highlight',
      userId: '2',
      userName: 'Prof. Michael Roberts',
      description: 'Highlighted results section',
      timestamp: '3 hours ago',
      paperId
    },
    {
      id: '3',
      type: 'bookmark',
      userId: '3',
      userName: 'Dr. Emily Watson',
      description: 'Bookmarked this paper',
      timestamp: '1 day ago',
      paperId
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [filter, setFilter] = useState<'all' | 'comments' | 'highlights' | 'bookmarks'>('all');
  const [isTyping, setIsTyping] = useState(false);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  }, []);

  const getStatusText = useCallback((user: User) => {
    if (user.status === 'online') return 'Active now';
    if (user.status === 'away') return `Away ${user.lastSeen}`;
    if (user.status === 'offline') return `Offline ${user.lastSeen}`;
    return '';
  }, []);

  const addComment = useCallback(() => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: 'current-user',
        userName: 'You',
        content: newComment,
        timestamp: 'Just now',
        paperId
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
  }, [newComment, paperId]);

  const onlineUsers = useMemo(() => activeUsers.filter(u => u.status === 'online'), [activeUsers]);
  const totalContributions = useMemo(() => activities.length + comments.length, [activities, comments]);

  return (
    <div className="w-full h-full flex flex-col bg-white border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Users size={20} className="text-primary-500" />
            Research Collaboration
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white rounded-lg transition-colors">
              <Share2 size={16} className="text-text-muted" />
            </button>
            <button className="p-2 hover:bg-white rounded-lg transition-colors">
              <Filter size={16} className="text-text-muted" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Active Users Sidebar */}
        <div className="w-80 border-r border-border bg-surface flex flex-col">
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-medium text-text-primary mb-3">
              Active Researchers ({activeUsers.filter(u => u.status === 'online').length})
            </h4>
            <div className="space-y-3">
              {activeUsers.map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full ${getStatusColor(user.status)} flex items-center justify-center text-white text-xs font-bold`}>
                      {user.avatar}
                    </div>
                    {user.status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary">{user.name}</div>
                    <div className="text-xs text-text-muted">{getStatusText(user)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-medium text-text-primary mb-3">Session Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Session Duration</span>
                <span className="text-text-primary font-medium">2h 34m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Contributions</span>
                <span className="text-text-primary font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Active Highlights</span>
                <span className="text-text-primary font-medium">23</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Filter Tabs */}
          <div className="flex border-b border-border bg-surface">
            {['all', 'comments', 'highlights', 'bookmarks'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === tab
                    ? 'text-primary-600 bg-white border-b-2 border-primary-500'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab === 'all' && <MessageSquare size={16} />}
                  {tab === 'comments' && <MessageSquare size={16} />}
                  {tab === 'highlights' && <Eye size={16} />}
                  {tab === 'bookmarks' && <Star size={16} />}
                  <span className="capitalize">{tab}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {filter === 'all' || filter === 'comments' ? (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {comments.map(comment => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-surface border border-border rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                          {comment.userName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-text-primary">{comment.userName}</span>
                            <span className="text-xs text-text-muted">{comment.timestamp}</span>
                          </div>
                          <p className="text-text-secondary text-sm leading-relaxed">{comment.content}</p>
                          {comment.highlights && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {comment.highlights.map((highlight, i) => (
                                <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  "{highlight}"
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : filter === 'highlights' ? (
                <motion.div
                  key="highlights"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {['Methodology Innovation', 'Results Analysis', 'Future Work Section', 'References'].map((highlight, i) => (
                    <div key={i} className="bg-surface border border-border rounded-xl p-4">
                      <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                        <Eye size={14} className="text-primary-500" />
                        {highlight}
                      </h4>
                      <p className="text-text-secondary text-sm">Highlighted by {['Dr. Sarah Chen', 'Prof. Roberts', 'Dr. Watson'][i]}</p>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="bookmarks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {['Introduction Section', 'Algorithm Details', 'Experimental Setup', 'Conclusion'].map((bookmark, i) => (
                    <div key={i} className="bg-surface border border-border rounded-xl p-4">
                      <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
                        <Star size={14} className="text-yellow-500" />
                        {bookmark}
                      </h4>
                      <p className="text-text-secondary text-sm">Bookmarked by {['Dr. Emily Watson', 'Prof. Roberts', 'Dr. Chen'][i]}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-border bg-surface">
            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or highlight..."
                className="flex-1 px-4 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    addComment();
                  }
                }}
              />
              <button
                onClick={addComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;
