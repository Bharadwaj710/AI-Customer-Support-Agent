import React, { useState, useEffect, useRef } from 'react';
import { Send, TerminalSquare, Ticket, X, MoreHorizontal, ThumbsUp, ThumbsDown, Share, FileText, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHealth, sendMessage, createTicket } from './services/api';
import './App.css';

const TypingIndicator = ({ text }) => (
  <div className="loading-status">
    {text}
    <div className="typing-indicator">
      <motion.div className="typing-dot" animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} />
      <motion.div className="typing-dot" animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
      <motion.div className="typing-dot" animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} />
    </div>
  </div>
);



const parseMarkdown = (text) => {
  const lines = text.split('\n');
  return lines.map((line, lineIndex) => {
    // Check if line is a numbered list item
    const listMatch = line.match(/^(\d+\.)\s+(.*)/);
    let isListItem = false;
    let listContent = line;
    let listPrefix = "";

    if (listMatch) {
      isListItem = true;
      listPrefix = listMatch[1];
      listContent = listMatch[2];
    } else if (line.startsWith('- ')) {
       isListItem = true;
       listPrefix = "•";
       listContent = line.slice(2);
    }

    // Parse bold text
    const parts = listContent.split(/(\*\*.*?\*\*)/g);
    const parsedParts = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (isListItem) {
      return (
        <div key={lineIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span>{listPrefix}</span>
          <span>{parsedParts}</span>
        </div>
      );
    }

    if (line.trim() === '') return <div key={lineIndex} style={{height: '0.5rem'}} />;

    return <p key={lineIndex}>{parsedParts}</p>;
  });
};

const CitationCard = ({ source }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="citation-card">
      <div className="citation-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="citation-title">
          <div className="citation-file">
            <FileText size={14} />
            {source.source}
          </div>
          <div className="citation-section">{source.section || 'General'}</div>
        </div>
        {isExpanded ? <ChevronUp size={16} color="var(--text-secondary)" /> : <ChevronDown size={16} color="var(--text-secondary)" />}
      </div>
      {isExpanded && source.content && (
        <div className="citation-body">
          {source.content}
        </div>
      )}
    </div>
  );
};

const TicketModal = ({ isOpen, onClose, onSubmitSuccess }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', issue: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', issue: '' });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createTicket(formData.name, formData.email, formData.issue);
      setIsSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess(result.ticketId);
    } catch (err) {
      alert("Failed to create ticket: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create Support Ticket</h3>
          <X size={20} style={{cursor: 'pointer', color: 'var(--text-secondary)'}} onClick={onClose} />
        </div>
        
        {isSubmitted ? (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0'}}>
            <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{type: "spring", stiffness: 200, damping: 15}}>
              <CheckCircle size={48} color="var(--accent)" />
            </motion.div>
            <p style={{fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-primary)'}}>Ticket Submitted!</p>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center'}}>Our support team will get back to you shortly.</p>
            <button className="submit-ticket-btn" style={{width: '100%', marginTop: '1rem'}} onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Issue</label>
              <textarea rows={4} placeholder="Describe your issue..." required value={formData.issue} onChange={e => setFormData({...formData, issue: e.target.value})}></textarea>
            </div>
            <button type="submit" className="submit-ticket-btn" disabled={isSubmitting}>
              <Ticket size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const suggestionChips = [
  "Account Management", "Billing", "Subscriptions", "Dashboard Issues", "Security", "Notifications"
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Checking on that...');
  
  const [health, setHealth] = useState({ status: 'checking...', document_count: 0, vector_count: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activeTicketMessageId, setActiveTicketMessageId] = useState(null);
  
  // Track last response metadata for dev sidebar
  const [lastMetadata, setLastMetadata] = useState(null);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getHealth();
        setHealth(data);
      } catch (err) {
        setHealth({ status: 'offline', document_count: 0, vector_count: 0 });
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const openTicketModal = (msgId) => {
    setActiveTicketMessageId(msgId);
    setIsTicketModalOpen(true);
  };

  const handleTicketSuccess = (ticketId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === activeTicketMessageId 
        ? { ...msg, ticketCreated: true, ticketId: ticketId }
        : msg
    ));

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: `Your support ticket has been created successfully.\n\n**Ticket ID:** ${ticketId}`,
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hideActions: true
    }]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      sources: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    if (userText.toLowerCase().includes("summarize") || userText.length > 50) {
      setLoadingText('Summarising...');
    } else {
      setLoadingText('Checking on that...');
    }

    try {
      const data = await sendMessage(userMessage.text);
      const result = data.result;

      if (result.ticketId) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: `Ticket created successfully.\n\n**Ticket ID:** ${result.ticketId}`,
          sources: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hideActions: true
        }]);
      } else {
        if (result.metadata) setLastMetadata(result.metadata);
        
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: result.answer || "I couldn't find an answer to that.",
          sources: result.sources || [],
          metadata: result.metadata,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'Sorry, I encountered a network error. Please try again.',
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Dev Sidebar */}
      <div className="sidebar" style={{ display: isSidebarOpen ? 'flex' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><TerminalSquare size={20} /> Dev Mode</h2>
          <X size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setIsSidebarOpen(false)} />
        </div>
        <div className="dev-metrics">
          <div className="metric-card">
            <h3>Provider</h3>
            <div className="metric-value" style={{fontSize: '1rem'}}>{lastMetadata?.provider || 'N/A'}</div>
          </div>
          <div className="metric-card">
            <h3>Vector Database</h3>
            <div className="metric-value" style={{fontSize: '1rem'}}>ChromaDB</div>
          </div>
          <div className="metric-card">
            <h3>Documents Loaded</h3>
            <div className="metric-value">{health.document_count}</div>
          </div>
          <div className="metric-card">
            <h3>Vectors Indexed</h3>
            <div className="metric-value">{health.vector_count}</div>
          </div>
          <div className="metric-card">
            <h3>Retrieved Chunks</h3>
            <div className="metric-value">{lastMetadata?.retrieved_chunks || 0}</div>
          </div>
          <div className="metric-card">
            <h3>Response Time</h3>
            <div className="metric-value">{lastMetadata?.response_time ? `${lastMetadata.response_time}s` : 'N/A'}</div>
          </div>
          <div className="metric-card">
            <h3>Backend URL</h3>
            <div className="metric-value" style={{fontSize: '0.85rem'}}>http://localhost:8000</div>
          </div>
        </div>
        <button className="create-ticket-btn" onClick={() => setIsSidebarOpen(false)}>
          Close Panel
        </button>
      </div>

      {/* Main Chat */}
      <div className="main-chat">
        <div className="chat-content-wrapper">
          {/* Header */}
          <header className="chat-header">
            <div className="header-left">
              <div className="brand">
                Nexus <span style={{fontWeight: 'normal', fontSize: '1rem'}}>ai</span> <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)', alignSelf: 'flex-start', marginTop: '4px'}}>beta</span>
              </div>
              
              <div className="health-widget">
                <div className="health-status">
                  <div className={`status-dot ${health.status === 'healthy' ? 'online' : 'offline'}`}></div>
                  {health.status === 'healthy' ? 'Online' : 'Offline'}
                </div>
                {health.status === 'healthy' && (
                  <>
                    <span>Docs: {health.document_count}</span>
                    <span>Vectors: {health.vector_count}</span>
                  </>
                )}
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <TerminalSquare size={16} /> Developer Mode
            </button>
          </header>

          {/* Message List */}
          <div className="message-list">
            
            {messages.length === 0 && (
              <div className="empty-state">
                <h1>Welcome to Nexus AI</h1>
                <p>Ask questions about:</p>
                <div className="suggestion-chips">
                  {suggestionChips.map(chip => (
                    <button key={chip} className="suggestion-chip" onClick={() => setInputValue(chip)}>
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message-wrapper ${msg.role}`}
                >
                  <div className={`message-bubble ${msg.role === 'ai' ? 'ai-content' : ''}`}>
                    {msg.role === 'ai' ? parseMarkdown(msg.text) : <p>{msg.text}</p>}
                  </div>
                  <div className="message-timestamp">{msg.timestamp}</div>
                  
                  {msg.role === 'ai' && msg.id !== 'welcome' && !msg.hideActions && (
                    <>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="sources-container">
                          <div className="sources-meta">Sources Used: {msg.sources.length}</div>
                          <div className="citation-cards">
                            {msg.sources.map((src, i) => (
                              <CitationCard key={i} source={src} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {!msg.ticketCreated ? (
                        <div className="ticket-action-container">
                          <button className="ticket-action-btn" onClick={() => openTicketModal(msg.id)}>
                            <Ticket size={16} /> Create Support Ticket
                          </button>
                        </div>
                      ) : (
                        <div className="ticket-action-container">
                          <div className="ticket-action-btn" style={{cursor: 'default', color: 'var(--accent)', borderColor: 'var(--accent)'}}>
                            <CheckCircle size={16} /> Ticket {msg.ticketId} Created
                          </div>
                        </div>
                      )}

                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="message-wrapper ai">
                <TypingIndicator text={loadingText} />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area-wrapper">
            <form className="input-container" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Ask Nexus"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" className={`send-btn ${inputValue.trim() ? 'active' : ''}`} disabled={!inputValue.trim() || isLoading}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Ticket Modal */}
      <TicketModal 
        isOpen={isTicketModalOpen} 
        onClose={() => setIsTicketModalOpen(false)} 
        onSubmitSuccess={handleTicketSuccess}
      />
    </div>
  );
}
