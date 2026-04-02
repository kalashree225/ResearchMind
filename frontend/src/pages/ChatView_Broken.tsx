import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Send, AlignLeft, BarChart3, Network, FileDown, ExternalLink, MessageSquare, ListFilter, Bot, Sparkles, Copy, Download, Share2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { useChatSession } from '../hooks/useChat';
import { usePaperSummary } from '../hooks/usePapers';
import { useCitationGraph } from '../hooks/useCitations';
import { ChatWebSocket, type WebSocketMessage } from '../services/websocket';

const ChatView = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('summary');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const wsRef = useRef<ChatWebSocket | null>(null);

  const { data: session } = useChatSession(id || '');
  const { data: summary } = usePaperSummary(id || '');
  const { data: citationGraph } = useCitationGraph(id ? [id] : undefined);

  useEffect(() => {
    if (session?.messages) {
      setMessages(session.messages.map(m => ({ role: m.role, content: m.content })));
    }
  }, [session]);

  useEffect(() => {
    if (id) {
      wsRef.current = new ChatWebSocket();
      wsRef.current.connect(
        id,
        (msg: WebSocketMessage) => {
          if (msg.type === 'message' && msg.content) {
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === 'assistant') {
                return [...prev.slice(0, -1), { ...lastMsg, content: (lastMsg.content || '') + msg.content }];
              }
              return [...prev, { role: 'assistant', content: msg.content || '' }];
            });
          } else if (msg.type === 'complete') {
            setIsStreaming(false);
          }
        }
      );

      return () => {
        wsRef.current?.disconnect();
      };
    }
  }, [id]);

  const handleSendMessage = () => {
    if (input.trim() && id && wsRef.current) {
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      setIsStreaming(true);
      wsRef.current.sendMessage(input, [id]);
      setInput('');
    }
  };

  const tabs = [
    { id: 'summary', name: 'AI Summary', icon: <AlignLeft size={16}/> },
    { id: 'document', name: 'Source Document', icon: <FileDown size={16}/> },
    { id: 'graph', name: 'Citation Network', icon: <Network size={16}/> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={16}/> },
    { id: 'compare', name: 'Comparison', icon: <BarChart3 size={16}/> },
  ];

  // Mock D3 Force Graph Effect
  useEffect(() => {
    if (activeTab !== 'graph' || !svgRef.current || !citationGraph) return;

    const nodes = citationGraph.nodes?.map(n => ({
      id: n.id,
      title: n.title,
      group: Math.floor(Math.random() * 4) + 1,
      val: n.citation_count || 20,
    })) || [];
    
    const links = citationGraph.edges?.map(e => ({
      source: e.source,
      target: e.target,
    })) || [];

    const width = 600;
    const height = 500;
    const svg = d3.select(svgRef.current).attr("viewBox", [0, 0, width, height]);
    svg.selectAll("*").remove();

    if (nodes.length === 0 || links.length === 0) {
      // Show empty state
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("class", "text-gray-400 text-sm")
        .text("No citation data available");
      return;
    }

    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    const node = svg.append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("r", (d: any) => Math.sqrt(d.val) * 2)
      .attr("fill", (d: any) => d3.schemeCategory10[d.group])
      .call(d3.drag()
        .on("start", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event: any, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    const label = svg.append("g")
      .selectAll("text")
      .data(nodes)
      .enter().append("text")
      .text((d: any) => d.title.substring(0, 20) + (d.title.length > 20 ? "..." : ""))
      .attr("font-size", "10px")
      .attr("dx", 12)
      .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x + 12)
        .attr("y", (d: any) => d.y + 4);
    });

    return () => {
      simulation.stop();
    };
  }, [activeTab, citationGraph]);

  return (
    <div className="flex w-full h-full bg-white overflow-hidden relative z-10">
      
      <section className="w-[45%] flex flex-col border-r border-border bg-white relative z-20">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-text-primary">Research Assistant</h2>
            <span className="px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-600 font-medium border border-primary-200">GPT-4 RAG</span>
          </div>
          <button className="text-text-muted hover:text-text-primary transition-colors">
            <ListFilter size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-secondary text-white' : 'bg-primary-600 text-white'
                }`}>
                  {msg.role === 'user' ? <MessageSquare size={14} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white border border-border text-text-secondary leading-relaxed shadow-sm'
                }`}>
                  {msg.content}
                  
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-border/50 flex gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 border border-blue-200 text-xs text-blue-700 hover:bg-blue-100 cursor-pointer transition-colors">
                        <ExternalLink size={10} /> Page 3
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-border bg-white">
          <div className="relative flex items-end bg-gray-50 border-2 border-border rounded-xl focus-within:border-primary-500 transition-all px-2 py-2">
            <textarea
              className="w-full bg-transparent border-none outline-none resize-none px-4 py-2 text-text-primary placeholder:text-text-muted max-h-32 min-h-[44px]"
              placeholder="Ask a question about methodology, results, or compare with other works..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if(input.trim() && !isStreaming) {
                    handleSendMessage();
                  }
                }
              }}
            />
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition-colors ml-2 shrink-0 shadow-lg mb-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={isStreaming || !input.trim()}
            >
              <Send size={18} className="translate-x-[-1px]" />
            </button>
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col bg-gradient-to-br from-blue-50/50 to-white relative z-10 w-[55%]">
        <div className="h-16 flex items-center px-6 border-b border-border bg-white/80 backdrop-blur-md gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 h-full border-b-2 px-2 transition-all font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-muted hover:text-text-secondary'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative">
          
          {/* Summary Tab */}
          {activeTab === 'summary' && summary && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-primary-600 mb-2">Main Contribution</h3>
                <p className="text-text-primary text-lg font-medium leading-relaxed">
                  {summary.sections?.main_contribution || 'Loading...'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-secondary mb-4">Key Methodology</h3>
                  <ul className="space-y-3 text-text-secondary text-sm">
                    {summary.sections?.methodology?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-blue-600 mb-3">Results Summary</h3>
                    <div className="text-2xl font-display font-bold text-blue-900 mb-1">{summary.sections?.key_results || 'N/A'}</div>
                    <p className="text-sm text-text-muted">{summary.sections?.key_results || ''}</p>
                  </div>
                  {summary.sections?.limitations && (
                    <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
                      <h3 className="text-xs uppercase tracking-wider font-bold text-red-600 mb-3">Limitations</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {summary.sections.limitations}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Document Tab */}
          {activeTab === 'document' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto p-6">
              <div className="bg-white border border-border rounded-2xl shadow-sm">
                <div className="p-6 border-b border-border">
                  <h3 className="text-xl font-bold text-text-primary mb-2">Source Document Viewer</h3>
                  <p className="text-text-secondary">Read and navigate through the original research paper</p>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-text-secondary">Page:</label>
                      <select className="px-3 py-1 border border-border rounded-lg text-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="text" placeholder="Search in document..." className="px-3 py-1 border border-border rounded-lg text-sm flex-1" />
                      <button className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm">Search</button>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-border rounded-lg p-8 min-h-[600px]">
                    <div className="prose max-w-none">
                      <h4 className="text-lg font-semibold mb-4">Abstract</h4>
                      <p className="text-text-secondary leading-relaxed mb-6">
                        This paper presents a novel approach to solving complex problems in the field. 
                        The authors demonstrate significant improvements over existing methods through rigorous 
                        experimental validation and comprehensive analysis.
                      </p>
                      <h4 className="text-lg font-semibold mb-4">Introduction</h4>
                      <p className="text-text-secondary leading-relaxed mb-6">
                        In recent years, the field has seen rapid advancement with new techniques emerging 
                        to address longstanding challenges. This work builds upon previous research by introducing 
                        innovative methodologies that combine theoretical rigor with practical applications...
                      </p>
                      <h4 className="text-lg font-semibold mb-4">Methodology</h4>
                      <p className="text-text-secondary leading-relaxed">
                        Our approach consists of several key components that work together to achieve 
                        superior performance. First, we establish a theoretical framework that guides 
                        the design of our algorithm. Second, we implement practical solutions that 
                        can be deployed in real-world scenarios...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Readability Score</h4>
                  <div className="text-3xl font-bold text-primary-600">8.7/10</div>
                  <p className="text-xs text-text-muted mt-1">High academic readability</p>
                </div>
                <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Citation Count</h4>
                  <div className="text-3xl font-bold text-secondary">247</div>
                  <p className="text-xs text-text-muted mt-1">Well-cited paper</p>
                </div>
                <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                  <h4 className="text-sm font-medium text-text-secondary mb-2">Impact Factor</h4>
                  <div className="text-3xl font-bold text-blue-600">4.2</div>
                  <p className="text-xs text-text-muted mt-1">High impact journal</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                  <h4 className="text-lg font-semibold text-text-primary mb-4">Keyword Analysis</h4>
                  <div className="space-y-3">
                    {['Machine Learning', 'Neural Networks', 'Optimization', 'Algorithm Design'].map((keyword, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{keyword}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${80 - i * 15}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-muted">{80 - i * 15}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
                  <h4 className="text-lg font-semibold text-text-primary mb-4">Research Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">Originality</span>
                        <span className="text-text-primary font-medium">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">Technical Depth</span>
                        <span className="text-text-primary font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">Practical Impact</span>
                        <span className="text-text-primary font-medium">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Graph Tab */}
          {activeTab === 'graph' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col pt-8">
               <div className="px-8 flex justify-between items-center mb-4">
                 <div>
                   <h3 className="text-xl font-medium text-text-primary">Advanced Citation Network</h3>
                   <p className="text-sm text-text-muted">Interactive research paper relationship visualization</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <select className="px-3 py-1 border border-border rounded-lg text-sm">
                     <option>Force-Directed Layout</option>
                     <option>Circular Layout</option>
                     <option>Hierarchical Layout</option>
                     <option>Cluster Layout</option>
                   </select>
                   <button className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-500 transition-colors">
                     Export Graph
                   </button>
                 </div>
               </div>
               
               <div className="flex-1 w-full bg-white rounded-3xl overflow-hidden mt-4 border-2 border-border mx-8 mb-8 relative shadow-inner">
                 <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
                 
                 {/* Advanced Graph Controls */}
                 <div className="absolute top-4 right-4 bg-white border border-border rounded-xl shadow-lg p-3 space-y-2">
                   <div className="flex items-center gap-2">
                     <input type="checkbox" id="showLabels" className="rounded" defaultChecked />
                     <label htmlFor="showLabels" className="text-xs text-text-secondary">Show Labels</label>
                   </div>
                   <div className="flex items-center gap-2">
                     <input type="checkbox" id="showClusters" className="rounded" defaultChecked />
                     <label htmlFor="showClusters" className="text-xs text-text-secondary">Show Clusters</label>
                   </div>
                   <div className="flex items-center gap-2">
                     <label className="text-xs text-text-secondary">Node Size:</label>
                     <input type="range" min="1" max="10" defaultValue="5" className="w-20" />
                   </div>
                   <div className="flex items-center gap-2">
                     <label className="text-xs text-text-secondary">Link Strength:</label>
                     <input type="range" min="1" max="10" defaultValue="5" className="w-20" />
                   </div>
                 </div>
                 
                 {/* Enhanced Graph Legend */}
                 <div className="absolute bottom-6 left-6 bg-white border border-border rounded-xl shadow-lg p-4">
                   <h4 className="text-xs font-bold text-text-primary mb-3">Network Analysis</h4>
                   <div className="space-y-2">
                     <div className="flex items-center gap-2 text-xs text-text-muted">
                       <div className="w-3 h-3 rounded-full bg-blue-500" />
                       <span>Core Papers (High Centrality)</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-text-muted">
                       <div className="w-3 h-3 rounded-full bg-green-500" />
                       <span>Seminal Works</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-text-muted">
                       <div className="w-3 h-3 rounded-full bg-purple-500" />
                       <span>Recent Publications</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs text-text-muted">
                       <div className="w-3 h-3 rounded-full bg-orange-500" />
                       <span>Interdisciplinary Research</span>
                     </div>
                   </div>
                   
                   <div className="mt-4 pt-3 border-t border-border">
                     <div className="text-xs font-medium text-text-primary mb-2">Graph Metrics</div>
                     <div className="space-y-1">
                       <div className="flex justify-between text-xs">
                         <span className="text-text-muted">Total Nodes:</span>
                         <span className="text-text-primary font-medium">47</span>
                       </div>
                       <div className="flex justify-between text-xs">
                         <span className="text-text-muted">Total Edges:</span>
                         <span className="text-text-primary font-medium">156</span>
                       </div>
                       <div className="flex justify-between text-xs">
                         <span className="text-text-muted">Clusters:</span>
                         <span className="text-text-primary font-medium">6</span>
                       </div>
                       <div className="flex justify-between text-xs">
                         <span className="text-text-muted">Density:</span>
                         <span className="text-text-primary font-medium">0.142</span>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Mini Map */}
                 <div className="absolute bottom-6 right-6 w-48 h-32 bg-white border border-border rounded-xl shadow-lg overflow-hidden">
                   <div className="text-xs font-medium text-text-primary p-2 border-b border-border">Network Overview</div>
                   <div className="p-2">
                     <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                       <span className="text-xs text-text-muted">Mini Map</span>
                     </div>
                   </div>
                 </div>
               </div>
            </motion.div>
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
               <div className="mb-6 flex justify-between items-end">
                 <div>
                   <h3 className="text-xl font-bold text-text-primary mb-1">Architecture Comparison</h3>
                   <p className="text-text-muted text-sm">Cross-paper analysis generated by GPT-4</p>
                 </div>
                 <button className="px-4 py-2 border-2 border-border bg-white text-text-primary rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                   + Add Paper
                 </button>
               </div>

               <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-lg">
                 <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-50 border-b border-border">
                      <tr>
                        <th className="w-1/4 px-6 py-4 text-xs font-bold text-text-muted uppercase">Feature</th>
                        <th className="w-[37.5%] px-6 py-4 border-l border-border bg-blue-50">
                           <span className="block font-bold text-primary-600 mb-1">Attention Is All You Need</span>
                           <span className="text-xs font-normal text-text-muted">Vaswani et al. (2017)</span>
                        </th>
                        <th className="w-[37.5%] px-6 py-4 border-l border-border">
                           <span className="block font-bold text-text-primary mb-1">BERT</span>
                           <span className="text-xs font-normal text-text-muted">Devlin et al. (2018)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-sm">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 font-medium text-text-secondary">Core Architecture</td>
                        <td className="px-6 py-5 border-l border-border bg-blue-50 text-text-primary">Encoder-Decoder Transformer</td>
                        <td className="px-6 py-5 border-l border-border text-text-primary">Bidirectional Encoder-only Transformer</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 font-medium text-text-secondary">Pre-training Objective</td>
                        <td className="px-6 py-5 border-l border-border bg-blue-50 text-text-primary">Translation (Supervised sequence-to-sequence)</td>
                        <td className="px-6 py-5 border-l border-border text-text-primary">Masked Language Modeling (MLM) & Next Sentence Prediction (NSP)</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 font-medium text-text-secondary">Contextual Representation</td>
                        <td className="px-6 py-5 border-l border-border bg-blue-50 text-text-primary">Left-to-right (in decoder) limiting deep bidirectionality</td>
                        <td className="px-6 py-5 border-l border-border text-text-primary">Deeply bidirectional context across all layers simultaneously</td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 font-medium text-text-secondary">Key Result</td>
                        <td className="px-6 py-5 border-l border-border bg-blue-50 text-text-primary">28.4 BLEU on WMT 2014 EN-DE</td>
                        <td className="px-6 py-5 border-l border-border text-text-primary">80.5 GLUE score, SOTA on 11 NLP tasks</td>
                      </tr>
                    </tbody>
                 </table>
               </div>
            </motion.div>
          )}

        </div>
      </section>

    </div>
  );
};

export default ChatView;
