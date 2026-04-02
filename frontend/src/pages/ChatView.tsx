import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Send, AlignLeft, BarChart3, Network, FileDown, ExternalLink, MessageSquare, ListFilter, Bot, Sparkles, Copy, Download, Share2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { useChatSession } from '../hooks/useChat';
import { usePaperSummary } from '../hooks/usePapers';
import { useCitationGraph } from '../hooks/useCitations';
import { ChatWebSocket, type WebSocketMessage } from '../services/websocket';
import { useSimpleTheme } from '../contexts/SimpleThemeContext';

const ChatView = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('summary');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const wsRef = useRef<ChatWebSocket | null>(null);
  const { theme } = useSimpleTheme();

  const { data: session } = useChatSession(id || '');
  const { data: summary } = usePaperSummary(id || '');
  const { data: citationGraph } = useCitationGraph(id ? [id] : undefined);

  const tabs = [
    { id: 'summary', name: 'Summary', icon: <FileDown size={16} /> },
    { id: 'document', name: 'Document', icon: <AlignLeft size={16} /> },
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={16} /> },
    { id: 'graph', name: 'Graph', icon: <Network size={16} /> },
    { id: 'compare', name: 'Compare', icon: <Sparkles size={16} /> },
  ];

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

  const handleSendMessage = useCallback(() => {
    if (input.trim() && !isStreaming) {
      setIsStreaming(true);
      wsRef.current?.sendMessage(input);
      setInput('');
    }
  }, [input, isStreaming]);

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

    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links as any).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes as any)
      .enter()
      .append('circle')
      .attr('r', (d: any) => Math.sqrt(d.val) * 2)
      .attr('fill', (d: any) => {
        const colors = [theme.primary, '#10b981', '#f59e0b', '#8b5cf6'];
        return colors[d.group % 4];
      })
      .attr('stroke', theme.surface)
      .attr('stroke-width', 2)
      .call(d3.drag()
        .on('start', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: any, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    const label = svg.append('g')
      .selectAll('text')
      .data(nodes as any)
      .enter()
      .append('text')
      .text((d: any) => d.title)
      .attr('font-size', 10)
      .attr('fill', theme.text)
      .attr('text-anchor', 'middle')
      .attr('dy', -15);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x + 12)
        .attr('y', (d: any) => d.y + 4);
    });

    return () => {
      simulation.stop();
    };
  }, [activeTab, citationGraph, theme]);

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text }} className="flex w-full h-full overflow-hidden relative z-10">
      
      <section style={{ backgroundColor: theme.surface }} className="w-[45%] flex flex-col border-r relative z-20">
        <div style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-3">
            <h2 style={{ color: theme.text }} className="font-semibold">Research Assistant</h2>
            <span style={{ backgroundColor: theme.primary + '20', color: theme.primary, borderColor: theme.primary + '40' }} className="px-2 py-0.5 rounded text-xs font-medium border">GPT-4 RAG</span>
          </div>
          <button style={{ color: theme.textSecondary }} className="transition-colors">
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
                  msg.role === 'user' ? '' : ''
                }`} style={{ 
                  backgroundColor: msg.role === 'user' ? theme.primary : theme.primary,
                  color: '#ffffff'
                }}>
                  {msg.role === 'user' ? <MessageSquare size={14} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user' ? '' : 'border'
                }`} style={{
                  backgroundColor: msg.role === 'user' ? theme.primary : theme.surface,
                  borderColor: theme.border,
                  color: msg.role === 'user' ? '#ffffff' : theme.text
                }}>
                  {msg.content}
                  
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-3 flex gap-2" style={{ borderTop: `1px solid ${theme.border}20` }}>
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:cursor-pointer transition-colors" style={{
                        backgroundColor: theme.primary + '10',
                        borderColor: theme.primary + '30',
                        color: theme.primary
                      }}>
                        <ExternalLink size={10} /> Page 3
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="p-4 border-t">
          <div className="relative flex items-end rounded-xl focus-within:border-primary-500 transition-all px-2 py-2" style={{ backgroundColor: theme.background, border: `2px solid ${theme.border}` }}>
            <textarea
              className="w-full bg-transparent border-none outline-none resize-none px-4 py-2 max-h-32 min-h-[44px]"
              style={{ color: theme.text }}
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
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors ml-2 shrink-0 shadow-lg mb-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: theme.primary, color: '#ffffff' }}
              onClick={handleSendMessage}
              disabled={isStreaming || !input.trim()}
            >
              <Send size={18} className="translate-x-[-1px]" />
            </button>
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col relative z-10 w-[55%]" style={{ background: `linear-gradient(to bottom right, ${theme.primary}10, ${theme.background})` }}>
        <div style={{ backgroundColor: theme.surface + 'CC', borderColor: theme.border }} className="h-16 flex items-center px-6 border-b backdrop-blur-md gap-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 h-full border-b-2 px-2 transition-all font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id ? '' : 'border-transparent'
              }`}
              style={{
                borderColor: activeTab === tab.id ? theme.primary : 'transparent',
                color: activeTab === tab.id ? theme.primary : theme.textSecondary
              }}
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
              <div className="p-6 rounded-2xl shadow-sm relative overflow-hidden group" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: theme.primary }}></div>
                <h3 className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color: theme.primary }}>Main Contribution</h3>
                <p className="text-lg font-medium leading-relaxed" style={{ color: theme.text }}>
                  {summary.sections?.main_contribution || 'Loading...'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                  <h3 className="text-xs uppercase tracking-wider font-bold mb-4" style={{ color: theme.primary }}>Key Methodology</h3>
                  <ul className="space-y-3 text-sm" style={{ color: theme.textSecondary }}>
                    {summary.sections?.methodology?.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: theme.primary }} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="p-5 rounded-2xl" style={{ backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }}>
                    <h3 className="text-xs uppercase tracking-wider font-bold mb-3" style={{ color: theme.primary }}>Results Summary</h3>
                    <div className="text-2xl font-display font-bold mb-1" style={{ color: theme.primary }}>{summary.sections?.key_results || 'N/A'}</div>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>{summary.sections?.key_results || ''}</p>
                  </div>
                  {summary.sections?.limitations && (
                    <div className="p-5 rounded-2xl" style={{ backgroundColor: '#ef444410', borderColor: '#ef444430' }}>
                      <h3 className="text-xs uppercase tracking-wider font-bold mb-3" style={{ color: '#ef4444' }}>Limitations</h3>
                      <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                        {summary.sections.limitations}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Graph Tab */}
          {activeTab === 'graph' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col pt-8">
              <div className="px-8 flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-medium mb-1" style={{ color: theme.text }}>Advanced Citation Network</h3>
                  <p className="text-sm" style={{ color: theme.textSecondary }}>Interactive research paper relationship visualization</p>
                </div>
                <div className="flex items-center gap-3">
                  <select className="px-3 py-1 rounded-lg text-sm" style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }}>
                    <option>Force-Directed Layout</option>
                    <option>Circular Layout</option>
                    <option>Hierarchical Layout</option>
                    <option>Cluster Layout</option>
                  </select>
                  <button className="px-3 py-1 rounded-lg text-sm transition-colors" style={{ backgroundColor: theme.primary, color: '#ffffff' }}>
                    Export Graph
                  </button>
                </div>
              </div>
              
              <div className="flex-1 w-full rounded-3xl overflow-hidden mt-4 border-2 mx-8 mb-8 relative shadow-inner" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
              </div>
            </motion.div>
          )}

          {/* Other tabs can be added here */}
        </div>
      </section>
    </div>
  );
};

export default ChatView;
