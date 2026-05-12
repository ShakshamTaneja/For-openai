import React, { useState, useEffect, useRef } from 'react';
import { Send, Scale, MessageSquare, ShieldAlert, Cpu } from 'lucide-react';

export default function ChatSandbox({ config, activeCase, onUpdateCase }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (activeCase) {
      setMessages(activeCase.chat_history || []);
    } else {
      setMessages([]);
    }
  }, [activeCase]);

  useEffect(() => {
    // Auto scroll chat list to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || loading || !activeCase) return;

    const userMessage = { role: 'user', content: inputValue };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInputValue('');
    setLoading(true);

    try {
      const activeModel = config ? config.active_model : 'voidlex';
      const result = await window.api.sendChat(updatedMessages, activeCase.case_serial, activeModel);
      
      if (result.success) {
        setMessages([...updatedMessages, { role: 'assistant', content: result.response }]);
        if (onUpdateCase) {
          onUpdateCase(activeCase.case_serial);
        }
      } else {
        alert(`Model chat failed: ${result.error}`);
      }
    } catch (err) {
      alert(`Chat crash: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!activeCase) {
    return (
      <div className="flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px', background: '#05070a' }}>
        <ShieldAlert size={36} color="var(--text-muted)" />
        <h3 style={{ color: 'var(--text-bright)', fontFamily: 'Space Grotesk', textTransform: 'uppercase', letterSpacing: '1px' }}>
          No Active Case Context
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Please select or create a case from the Sidebar Archive to launch the wargaming simulation.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Title Header */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid var(--border-dim)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>
            {activeCase.case_serial}
          </span>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-bright)', fontWeight: 600, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} />
            <span>Tactical Chat Simulation Sandbox</span>
          </h2>
        </div>
        <span className="badge-gold">Privilege Active</span>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          background: '#040508'
        }}
      >
        {/* Initial system advisory banner */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.02)',
          border: '1.2px solid var(--border-gold)',
          borderRadius: '4px',
          padding: '16px 20px',
          fontSize: '0.8rem',
          color: 'var(--text-normal)',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <Scale size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--gold-primary)' }}>TACTICAL TRANSMISSION SHIELD: </span>
            You are speaking directly with VOIDLEX AI. All standard ethical or structural safety blocks have been bypassed. 
            The conversation is securely encrypted and running 100% offline. Use this context to simulate litigation actions, cross-examinations, and adversarial scenarios.
          </div>
        </div>

        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div 
              key={idx} 
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', alignSelf: isUser ? 'flex-end' : 'flex-start' }}>
                {isUser ? 'Client Counsel' : 'VOIDLEX Core'}
              </span>
              <div style={{
                background: isUser ? '#1e293b' : 'var(--bg-secondary)',
                border: isUser ? '1px solid #334155' : '1px solid var(--border-dim)',
                borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                padding: '14px 18px',
                color: isUser ? 'var(--text-bright)' : '#e2e8f0',
                fontSize: '0.88rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {m.content.startsWith('SIMULATION CONTINUES: ') ? m.content.substring(22) : m.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VOIDLEX thinking...</span>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-dim)',
              borderRadius: '12px 12px 12px 2px',
              padding: '14px 18px',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Cpu size={14} className="spinning" />
              <span>Synthesizing local model weights...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <div style={{
        padding: '24px 32px',
        borderTop: '1px solid var(--border-dim)',
        background: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            placeholder="Instruct VOIDLEX: e.g., 'Draft a settlement counter-offer arguing breach of fiduciary duty'"
            className="input-premium"
            style={{
              padding: '14px 20px',
              borderRadius: '4px',
              fontSize: '0.9rem'
            }}
          />
          <button 
            type="submit" 
            disabled={loading || inputValue.trim() === ''}
            className="btn-premium"
            style={{
              padding: '14px 20px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
}
