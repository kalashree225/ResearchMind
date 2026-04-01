import { motion } from 'framer-motion';
import { History, Search, FileText, ChevronRight, MessageSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatSessions } from '../hooks/useChat';

const HistoryView = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useChatSessions();

  return (
    <div className="flex-1 w-full flex flex-col p-10 relative z-10 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 w-full max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-primary-500 shadow-lg">
            <History size={20} />
          </div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Chat History</h1>
        </div>
        <p className="text-text-secondary text-lg ml-14">Review past analysis sessions and jump back into the context.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="w-full max-w-5xl mx-auto mb-8">
        <div className="flex bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-primary-500 transition-colors shadow-inner items-center">
          <Search size={18} className="text-text-muted mr-3" />
          <input 
            type="text" 
            placeholder="Search past sessions by title, keywords, or paper names..." 
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted"
          />
        </div>
      </motion.div>

      <div className="w-full max-w-5xl mx-auto space-y-4">
        {isLoading ? (
          <div className="text-center text-text-muted py-12">Loading sessions...</div>
        ) : sessions && sessions.length > 0 ? (
          sessions.map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => navigate(`/chat/${session.id}`)}
            className="glass-panel hover:bg-surface-hover/50 transition-colors rounded-2xl p-6 cursor-pointer group border border-border/50"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary group-hover:text-primary-400 transition-colors">{session.title}</h3>
                <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(session.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><FileText size={14} /> {session.papers?.length || 0} Paper{session.papers?.length !== 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-1.5"><MessageSquare size={14} /> {session.messages?.length || 0} Messages</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted group-hover:bg-primary-500 group-hover:text-white transition-all shadow-md">
                <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))
        ) : (
          <div className="text-center text-text-muted py-12">No chat sessions found</div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
