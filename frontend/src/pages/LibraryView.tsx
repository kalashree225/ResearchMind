import { motion } from 'framer-motion';
import { BookOpen, Search, Filter, HardDrive, DownloadCloud, AlertTriangle } from 'lucide-react';
import { usePapers, useDeletePaper } from '../hooks/usePapers';
import { useNavigate } from 'react-router-dom';

const LibraryView = () => {
  const navigate = useNavigate();
  const { data: papers, isLoading } = usePapers();
  const deletePaper = useDeletePaper();
  return (
    <div className="flex-1 w-full flex flex-col p-10 relative z-10 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 w-full max-w-6xl mx-auto flex items-end justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center text-white shadow-lg">
              <BookOpen size={20} />
            </div>
            <h1 className="text-3xl font-display font-bold text-text-primary">Research Library</h1>
          </div>
          <p className="text-text-secondary text-lg ml-14">Manage and index all your uploaded and referenced academic papers.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-border bg-white text-text-primary rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-500 transition-colors shadow-lg">
            <DownloadCloud size={16} /> Export RIS/BibTeX
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="w-full max-w-6xl mx-auto mb-6">
        <div className="flex bg-white border-2 border-border rounded-xl px-4 py-3 focus-within:border-primary-500 transition-colors shadow-sm items-center">
          <Search size={18} className="text-text-muted mr-3" />
          <input 
            type="text" 
            placeholder="Search papers by title, author, year, or abstract content..." 
            className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted"
          />
        </div>
      </motion.div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Title & Authors</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">Loading papers...</td>
                </tr>
              ) : papers && papers.length > 0 ? (
                papers.map((paper, i) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}
                  key={paper.id} 
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-text-primary mb-1">{paper.title}</p>
                    <p className="text-sm text-text-secondary">{paper.authors.join(', ')}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700">
                      {paper.arxiv_id ? 'arXiv' : 'PDF'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-text-secondary">{new Date(paper.uploaded_at).getFullYear()}</td>
                  <td className="px-6 py-5">
                    {paper.status === 'ready' && <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-secondary"><HardDrive size={14} /> INDEXED</span>}
                    {paper.status === 'processing' && <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-primary-400 animate-pulse"><div className="w-2 h-2 rounded-full bg-primary-400" /> PROCESSING</span>}
                    {paper.status === 'failed' && <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-red-400"><AlertTriangle size={14} /> FAILED</span>}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => navigate(`/chat/${paper.id}`)}
                      className="text-sm font-medium text-primary-500 hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Chat
                    </button>
                  </td>
                </motion.tr>
              ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">No papers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LibraryView;
