import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Link as LinkIcon, FileText, ArrowRight, Map as MapIcon, BrainCircuit, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUploadPDF, useUploadArxiv, usePaperPolling } from '../hooks/usePapers';
import type { Paper } from '../services/papers';

const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);
  const [arxivLink, setArxivLink] = useState('');
  const [uploadedPaperId, setUploadedPaperId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const uploadPDF = useUploadPDF();
  const uploadArxiv = useUploadArxiv();
  
  const { data: paperStatus } = usePaperPolling(
    uploadedPaperId || '',
    !!uploadedPaperId
  ) as { data: Paper | undefined };

  const uploadState = uploadedPaperId
    ? paperStatus?.status === 'ready'
      ? 'success'
      : paperStatus?.status === 'failed'
      ? 'error'
      : 'processing'
    : uploadPDF.isPending || uploadArxiv.isPending
    ? 'uploading'
    : 'idle';

  const progress = uploadState === 'uploading' ? 25 : 
                   uploadState === 'processing' ? (paperStatus?.extraction_progress || 50) : 
                   uploadState === 'success' ? 100 : 0;

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      uploadPDF.mutate(file, {
        onSuccess: (data) => {
          setUploadedPaperId(data.id);
        },
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      uploadPDF.mutate(file, {
        onSuccess: (data) => {
          setUploadedPaperId(data.id);
        },
      });
    }
  };

  const handleUrlSubmit = () => {
    if (arxivLink.trim()) {
      uploadArxiv.mutate(arxivLink, {
        onSuccess: (data) => {
          setUploadedPaperId(data.id);
          setArxivLink('');
        },
      });
    }
  };

  if (uploadState === 'success' && uploadedPaperId) {
    setTimeout(() => {
      navigate(`/chat/${uploadedPaperId}`);
    }, 1000);
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-8 relative z-10 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 mt-10"
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4 tracking-tight">
          Analyze Academic Papers with <span className="gradient-text">AI Precision</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Upload PDFs, paste arXiv links, and instantly generate structured insights, citation graphs, and multi-paper comparisons.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-xl border border-border"
      >
        <AnimatePresence mode="wait">
          {uploadState === 'idle' ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="application/pdf" 
                multiple 
              />
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-14 px-6 transition-all duration-300 ease-in-out cursor-pointer ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-500/10 scale-[1.02]' 
                    : 'border-border hover:border-text-muted hover:bg-surface-hover/30'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center shadow-lg mb-4 hover:scale-110 transition-transform">
                  <UploadCloud className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Drag & Drop research papers here</h3>
                <p className="text-sm text-text-muted mb-6">Supports PDF formats up to 10MB. Max 5 papers simultaneously.</p>
                <button className="px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors shadow-lg pointer-events-none">
                  Browse Files
                </button>
              </div>

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs uppercase font-bold text-text-muted tracking-widest">OR IMPORT SECURELY FROM</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="flex bg-white border-2 border-border rounded-xl px-2 py-2 focus-within:border-primary-500 transition-colors shadow-sm">
                <div className="flex items-center pl-3 pr-2 border-r border-border text-text-muted">
                  <LinkIcon size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Paste arXiv URL, DOI, or Semantic Scholar link..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 text-text-primary placeholder:text-text-muted"
                  value={arxivLink}
                  onChange={(e) => setArxivLink(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <button 
                  onClick={handleUrlSubmit}
                  className="p-2 ml-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center justify-center"
            >
              {uploadState === 'success' ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-secondary mb-4">
                  <CheckCircle size={64} />
                </motion.div>
              ) : (
                <Loader2 size={48} className="text-primary-500 animate-spin mb-6" />
              )}
              
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {uploadState === 'uploading' ? 'Uploading Document...' : 
                 uploadState === 'processing' ? 
                   (paperStatus?.status === 'extracting' ? 'Extracting Text from PDF...' :
                    paperStatus?.status === 'chunking' ? 'Creating Text Chunks...' :
                    paperStatus?.status === 'embedding' ? 'Generating AI Embeddings...' :
                    'Processing Document...') :
                 uploadState === 'error' ? 'Processing Failed' :
                 'Ready! Redirecting...'}
              </h3>
              
              {uploadState === 'error' && paperStatus?.processing_error && (
                <p className="text-sm text-red-600 mb-4">{paperStatus.processing_error}</p>
              )}
              
              <div className="w-full max-w-md mt-6">
                <div className="flex justify-between text-xs text-text-muted mb-2 font-medium">
                  <span>{Math.round(progress)}% Complete</span>
                  <span>
                    {uploadState === 'processing' ? 
                      (paperStatus?.status === 'extracting' ? 'PDF Processing' :
                       paperStatus?.status === 'chunking' ? 'Text Chunking' :
                       paperStatus?.status === 'embedding' ? 'AI Embeddings' :
                       'Processing') : 
                      uploadState === 'uploading' ? 'File Upload' : 
                      'Complete'}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-border">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary-600 to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.3 }}
                  />
                </div>
                {paperStatus?.chunk_count !== undefined && paperStatus.chunk_count > 0 && (
                  <p className="text-xs text-text-muted mt-2">
                    Created {paperStatus.chunk_count} text chunks
                    {paperStatus.total_pages && ` from {paperStatus.total_pages} pages`}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4 mt-8 pb-8"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm text-sm text-text-secondary hover:shadow-md transition-shadow">
          <FileText size={16} className="text-primary-500"/> RAG Over Documents
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm text-sm text-text-secondary hover:shadow-md transition-shadow">
          <MapIcon size={16} className="text-secondary"/> Citation Graphs
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm text-sm text-text-secondary hover:shadow-md transition-shadow">
          <BrainCircuit size={16} className="text-purple-500"/> NLP Multi-Paper Comparison
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
