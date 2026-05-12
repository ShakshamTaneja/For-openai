import React, { useState, useEffect } from 'react';
import { Scale, MessageSquare, Plus, Database, Cpu, HardDrive, History, ArrowRight } from 'lucide-react';
import logoImg from '../logo.png';

export default function Sidebar({
  config,
  onConfigUpdate,
  cases,
  activeCase,
  onSelectCase,
  onNewCase,
  activeTab,
  onChangeTab,
  systemReport,
  onClearCases
}) {
  const [modelOptions, setModelOptions] = useState([]);
  const [selectedModel, setSelectedModel] = useState('voidlex');

  useEffect(() => {
    if (config) {
      setSelectedModel(config.active_model || 'voidlex');
    }
  }, [config]);

  useEffect(() => {
    if (systemReport && systemReport.available_models) {
      setModelOptions(systemReport.available_models);
    } else {
      // Fallback
      setModelOptions(['voidlex']);
    }
  }, [systemReport]);

  const handleModelChange = async (e) => {
    const val = e.target.value;
    setSelectedModel(val);
    try {
      const updated = await window.api.updateConfig({ active_model: val });
      onConfigUpdate(updated);
    } catch (err) {
      console.error('Failed to change model:', err);
    }
  };

  return (
    <div style={{
      width: '320px',
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-dim)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid var(--border-dim)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(3, 4, 6, 0.4)'
      }}>
        <img src={logoImg} alt="VOIDLEX Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        <div>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--gold-primary)',
            letterSpacing: '3px',
            textTransform: 'uppercase'
          }}>VOIDLEX</h1>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Sovereign Legal Engine
          </p>
        </div>
      </div>

      {/* Model Selector Shift */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-dim)' }}>
        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 600 }}>
          Active Local Model Core
        </label>
        <div style={{ position: 'relative' }}>
          <select 
            value={selectedModel}
            onChange={handleModelChange}
            className="select-premium"
            style={{
              padding: '10px 14px',
              fontSize: '0.85rem',
              color: 'var(--gold-primary)',
              border: '1.5px solid var(--border-gold)',
              background: 'var(--bg-tertiary)',
              textTransform: 'lowercase',
              fontWeight: 500
            }}
          >
            {modelOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Nav Actions */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          className="btn-premium"
          onClick={onNewCase}
          style={{
            padding: '12px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            textTransform: 'capitalize'
          }}
        >
          <Plus size={16} />
          <span>New Case Analysis</span>
        </button>

        <button 
          className="btn-secondary"
          disabled={!activeCase}
          onClick={() => onChangeTab('chat')}
          style={{
            padding: '12px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            background: activeTab === 'chat' ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
            borderColor: activeTab === 'chat' ? 'var(--gold-primary)' : 'var(--border-dim)',
            color: activeTab === 'chat' ? 'var(--gold-primary)' : 'var(--text-bright)'
          }}
        >
          <MessageSquare size={16} />
          <span>Tactical Wargaming Chat</span>
        </button>
      </div>

      {/* Case Archives List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            <History size={12} />
            <span>Case History Archive</span>
          </div>
          {cases && cases.length > 0 && (
            <button
              onClick={onClearCases}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.72rem',
                fontFamily: 'Space Grotesk, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
                borderRadius: '4px',
                transition: 'all 0.2s',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Clear All
            </button>
          )}
        </div>
        
        {cases.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', borderRadius: '4px', border: '1px dashed var(--border-dim)' }}>
            No saved case profiles.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {cases.map((c) => {
              const isActive = activeCase && activeCase.case_serial === c.case_serial;
              return (
                <div 
                  key={c.case_serial}
                  onClick={() => onSelectCase(c)}
                  style={{
                    padding: '12px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(212, 175, 55, 0.04)' : 'var(--bg-tertiary)',
                    border: isActive ? '1px solid var(--gold-primary)' : '1px solid var(--border-dim)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  className="case-archive-item"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>
                      {c.case_serial}
                    </span>
                    <span className="badge-dim" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                      {c.category}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-bright)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.client_name} vs {c.opponent_name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Diagnostics Health Status Bar */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid var(--border-dim)',
        background: 'rgba(3, 4, 6, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={12} color={systemReport && systemReport.python_backend_running ? "var(--success-color)" : "var(--danger-color)"} />
            <span>Local Service</span>
          </div>
          <span className={systemReport && systemReport.python_backend_running ? "badge-success" : "badge-dim"} style={{ 
            fontSize: '0.62rem', 
            padding: '1px 6px',
            backgroundColor: systemReport && systemReport.python_backend_running ? undefined : 'rgba(239, 68, 68, 0.15)',
            borderColor: systemReport && systemReport.python_backend_running ? undefined : 'rgba(239, 68, 68, 0.4)',
            color: systemReport && systemReport.python_backend_running ? undefined : '#ef4444',
            borderWidth: systemReport && systemReport.python_backend_running ? undefined : '1px',
            borderStyle: systemReport && systemReport.python_backend_running ? undefined : 'solid',
            borderRadius: '2px'
          }}>
            {systemReport && systemReport.python_backend_running ? "Online" : "Offline"}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={12} color="var(--gold-primary)" />
            <span>RAM Core</span>
          </div>
          <span style={{ color: 'var(--text-bright)', fontSize: '0.7rem' }}>
            {systemReport ? `${systemReport.ram_gb} GB` : '8.0 GB'}
          </span>
        </div>
      </div>
    </div>
  );
}
