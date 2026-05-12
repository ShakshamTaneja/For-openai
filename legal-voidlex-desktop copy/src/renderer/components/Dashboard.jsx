import React, { useState, useEffect } from 'react';
import { Scale, FileText, CheckCircle, Shield, Download, FileDown, Clipboard, Play, AlertTriangle } from 'lucide-react';

export default function Dashboard({ config, activeCase, onCaseCreated }) {
  const getSystemCountry = () => {
    try {
      const locale = navigator.language || 'en-GB';
      const code = locale.split('-')[1]?.toUpperCase();
      const countryMap = {
        'GB': 'United Kingdom',
        'US': 'United States',
        'IN': 'India',
        'CA': 'Canada',
        'AU': 'Australia',
        'FR': 'France',
        'DE': 'Germany',
        'SG': 'Singapore',
        'HK': 'Hong Kong',
        'AE': 'United Arab Emirates'
      };
      return countryMap[code] || 'United Kingdom';
    } catch (e) {
      return 'United Kingdom';
    }
  };

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    country: getSystemCountry(),
    opponent: '',
    category: 'General',
    urgency: 'Standard',
    situation: '',
    desired_outcome: '',
    evidence: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1); // 1, 2, 3
  const [pdfStatus, setPdfStatus] = useState('');

  // Handle loading steps simulations
  useEffect(() => {
    let interval = null;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < 3) return prev + 1;
          return prev;
        });
      }, 10000); // Shift every 10 seconds during compilation
    } else {
      setLoadingStep(1);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.situation || !formData.first_name || !formData.last_name) {
      alert('Please fill out client names and situation details.');
      return;
    }

    setLoading(true);
    setPdfStatus('');

    try {
      const activeModel = config ? config.active_model : 'voidlex';
      const response = await window.api.analyzeCase(formData, activeModel);
      
      if (response.success) {
        // Find saved case in database list
        const refreshedCases = await window.api.listCases();
        let savedRecord = refreshedCases.find(c => c.case_serial === response.result.case_serial);
        
        // Robust fallback: if DB save or find had a slight delay, construct on the fly!
        if (!savedRecord) {
          savedRecord = {
            case_serial: response.result.case_serial || 'VLX-STRAT-TEMP',
            client_name: `${formData.first_name} ${formData.last_name}`.trim(),
            opponent_name: formData.opponent || 'N/A',
            category: formData.category || 'General',
            created_at: new Date().toISOString(),
            intake: { ...formData },
            strategy: response.result,
            chat_history: []
          };
        }
        
        setLoading(false);
        if (onCaseCreated) {
          onCaseCreated(savedRecord);
        }
      } else {
        alert(`Analysis pipeline failed: ${response.error}`);
        setLoading(false);
      }
    } catch (err) {
      alert(`General crash: ${err.message}`);
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!activeCase) return;
    setPdfStatus('Initiating PDF compilation...');
    try {
      const result = await window.api.generatePDF(activeCase);
      if (result && !result.error) {
        setPdfStatus(`Report compiled successfully! Saved to: ${result}`);
      } else {
        setPdfStatus(result?.error ? `Export failed: ${result.error}` : 'PDF save cancelled.');
      }
    } catch (e) {
      setPdfStatus(`Export crash: ${e.message}`);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Strategic Section copied to secure clipboard!');
  };

  // --- RENDERING VIEWS ---

  if (loading) {
    return (
      <div className="flex-center" style={{ flex: 1, flexDirection: 'column', gap: '24px', background: '#05070a' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            border: '3px solid var(--border-dim)', borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            border: '3px solid transparent', borderTopColor: 'var(--gold-primary)',
            borderRadius: '50%', animation: 'spin 1s linear infinite'
          }} />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Space Grotesk', color: 'var(--text-bright)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
            {loadingStep === 1 && "Phase I: Strategic Situation Assessment..."}
            {loadingStep === 2 && "Phase II: Drafting Sophisticated Legal Correspondence..."}
            {loadingStep === 3 && "Phase III: Auditing Tactical Strength & Calibrating..."}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            This process runs fully locally using LLM inference. Please do not close VOIDLEX.
          </p>
        </div>
      </div>
    );
  }

  if (activeCase) {
    let s = activeCase.strategy || {};
    console.log("DASHBOARD debug: activeCase =", activeCase);
    console.log("DASHBOARD debug: s =", s);
    if (typeof s === 'string') {
      try {
        s = JSON.parse(s);
        console.log("DASHBOARD debug: parsed s =", s);
      } catch (e) {
        console.error('Error parsing strategy JSON:', e);
        s = {};
      }
    }

    const ensureArray = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        return val.split('\n')
          .map(l => l.replace(/^[•\-\*\s\d\.\)]+/, '').trim())
          .filter(Boolean);
      }
      return [];
    };

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Top Control Bar */}
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
            <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontFamily: 'Space Grotesk', fontWeight: 600 }}>
              {activeCase.case_serial}
            </span>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-bright)', fontWeight: 600, marginTop: '2px' }}>
              Strategic Synthesis: {activeCase.client_name}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn-premium" onClick={handleExportPDF} style={{ padding: '8px 16px', fontSize: '0.8rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileDown size={14} />
              <span>Export PDF Strategic Plan</span>
            </button>
          </div>
        </div>

        {/* Info panel */}
        {pdfStatus && (
          <div style={{
            margin: '12px 32px 0 32px',
            padding: '10px 16px',
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid var(--gold-primary)',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: 'var(--gold-primary)'
          }}>
            {pdfStatus}
          </div>
        )}

        {/* Content scrolling panels */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', gap: '24px' }}>
          
          {/* Main sections block */}
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Section I: Summary */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>I. Executive Summary</span>
                <Clipboard size={14} onClick={() => handleCopyToClipboard(s.executive_summary)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--text-bright)' }}>{s.executive_summary}</p>
            </div>

            {/* Section II: Position */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>II. Legal Position Analysis</span>
                <Clipboard size={14} onClick={() => handleCopyToClipboard(s.legal_position_analysis)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--text-bright)' }}>{s.legal_position_analysis}</p>
            </div>

            {/* Section III & IV: List columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  III. Core Strengths
                </h3>
                <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-bright)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ensureArray(s.strengths).map((item, idx) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                  IV. Strategic Weaknesses
                </h3>
                <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-bright)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ensureArray(s.weaknesses).map((item, idx) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section V: Strategic Recommendations */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                V. Strategic Recommendations
              </h3>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-bright)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ensureArray(s.strategic_recommendations).map((item, idx) => (
                  <li key={idx} style={{ lineHeight: '1.4' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Section VI: Required Documents */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                VI. Required Documents
              </h3>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-bright)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ensureArray(s.required_documents).map((item, idx) => (
                  <li key={idx} style={{ lineHeight: '1.4' }}>📂 {item}</li>
                ))}
              </ul>
            </div>

            {/* Section VII: Immediate Legal Actions */}
            <div className="glass-panel" style={{ padding: '20px', borderLeft: '3px solid var(--gold-primary)' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                VII. Immediate Legal Actions
              </h3>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-bright)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ensureArray(s.immediate_legal_actions).map((item, idx) => (
                  <li key={idx} style={{ lineHeight: '1.4', fontWeight: 500 }}>⚖️ {item}</li>
                ))}
              </ul>
            </div>

            {/* Section VIII: Generated Document Panel (Custom Formal Text) */}
            <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-dim)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '0.92rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} />
                  <span>VIII. {s.draft_document_title || "Draft Strategic Correspondence"}</span>
                </h3>
                <Clipboard size={14} onClick={() => handleCopyToClipboard(s.draft_document_body)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </div>
              <pre style={{
                fontFamily: 'Times-Roman, serif',
                fontSize: '0.95rem',
                color: '#e2e8f0',
                background: '#090b11',
                padding: '24px',
                borderRadius: '4px',
                border: '1.5px solid var(--border-dim)',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.7',
                maxHeight: '600px',
                overflowY: 'auto'
              }}>{s.draft_document_body}</pre>
            </div>

            {/* Section IX: Risk Assessment */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>IX. Risk Assessment</span>
                <Clipboard size={14} onClick={() => handleCopyToClipboard(s.risk_assessment)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'var(--text-bright)' }}>{s.risk_assessment}</p>
            </div>

            {/* Section X: Next Steps */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                X. Next Steps
              </h3>
              <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-bright)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ensureArray(s.next_steps).map((item, idx) => (
                  <li key={idx} style={{ lineHeight: '1.4' }}>➔ {item}</li>
                ))}
              </ul>
            </div>

            {/* Section XIII: Optimization Blueprint */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                XIII. Global Optimization Blueprint (Path to 100%)
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: 'var(--text-bright)', background: 'rgba(212, 175, 55, 0.02)', borderLeft: '3.5px solid var(--gold-primary)', padding: '12px 16px', borderRadius: '0 4px 4px 0' }}>
                {s.global_optimization_blueprint}
              </p>
            </div>

          </div>

          {/* Right Metrics Panel */}
          <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px', flexShrink: 0 }}>
            
            {/* Strategy Readiness Score Gauge */}
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', background: 'radial-gradient(circle at top, rgba(212, 175, 55, 0.08) 0%, var(--bg-secondary) 100%)', border: '1.5px solid var(--border-gold)' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>
                Combat Readiness Value
              </span>
              <div style={{
                fontSize: '4.5rem',
                fontWeight: 800,
                color: 'var(--text-gold)',
                fontFamily: 'Space Grotesk',
                margin: '8px 0',
                textShadow: '0 0 15px var(--gold-glow)'
              }}>
                {s.total_readiness_score || "75"}%
              </div>
              <span className="badge-gold">Audit Active</span>
            </div>

            {/* Strategic Risk Score */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: 600 }}>
                XI. Strategic Risk Score
              </h4>
              <div style={{ fontSize: '1.1rem', color: 'var(--text-bright)', fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: '6px' }}>
                {s.risk_score ? String(s.risk_score).split(' ')[0] : '3.5/10'}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-normal)', lineHeight: '1.4' }}>
                {s.risk_score ? String(s.risk_score).substring(String(s.risk_score).indexOf(' ') + 1) : 'Medium Strategic Risk identified.'}
              </p>
            </div>

            {/* Tactical Audit Ratings Breakdown */}
            {s.section_analysis && (
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: 600 }}>
                  Wargaming Quality Ratings
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(s.section_analysis).map(([key, value]) => (
                    <div key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span style={{ textTransform: 'capitalize', color: 'var(--text-bright)' }}>{key.replace('_', ' ')}</span>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{value.score}/10</span>
                      </div>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                        {value.optimization}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  // Render intake form
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Title block */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '1px solid var(--border-dim)',
        background: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-bright)',
          letterSpacing: '1px'
        }}>Client Case Intake Module</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
          Input the exact parameters of the dispute. Local LLM models will analyze, draft legal responses, and run security audits.
        </p>
      </div>

      {/* Form Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* First Name & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Client First Name
              </label>
              <input 
                type="text" 
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange} 
                className="input-premium" 
                placeholder="Arthur"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Client Last Name
              </label>
              <input 
                type="text" 
                name="last_name" 
                value={formData.last_name} 
                onChange={handleChange} 
                className="input-premium" 
                placeholder="Pendelton"
              />
            </div>
          </div>

          {/* Country & Opponent */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Jurisdiction / Country
              </label>
              <input 
                type="text" 
                name="country" 
                value={formData.country} 
                onChange={handleChange} 
                className="input-premium" 
                placeholder="United Kingdom"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Opponent / Defending Party
              </label>
              <input 
                type="text" 
                name="opponent" 
                value={formData.opponent} 
                onChange={handleChange} 
                className="input-premium" 
                placeholder="Standard Chartered Corp"
              />
            </div>
          </div>

          {/* Category & Urgency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Case Category
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className="select-premium" style={{ background: 'var(--bg-tertiary)', color: '#fff' }}>
                <option value="General">General Litigation</option>
                <option value="Shareholder Disputes">Shareholder Disputes</option>
                <option value="Contract Breaches">Contract Breaches</option>
                <option value="Joint Ventures">Joint Venture Corporate Conflicts</option>
                <option value="Intellectual Property">Intellectual Property Theft</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                Urgency Level
              </label>
              <select name="urgency" value={formData.urgency} onChange={handleChange} className="select-premium" style={{ background: 'var(--bg-tertiary)', color: '#fff' }}>
                <option value="Standard">Standard (General timeline)</option>
                <option value="Medium">Medium (Escalating risk)</option>
                <option value="Critical">Critical (Immediate filing needed)</option>
              </select>
            </div>
          </div>

          {/* Situation description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              Full Situation Description
            </label>
            <textarea 
              name="situation" 
              value={formData.situation} 
              onChange={handleChange} 
              className="input-premium" 
              placeholder="Describe the exact factual situation. Provide numerical contract values, timelines, key occurrences, and specific breach actions."
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Desired outcome */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              Desired Outcome
            </label>
            <textarea 
              name="desired_outcome" 
              value={formData.desired_outcome} 
              onChange={handleChange} 
              className="input-premium" 
              placeholder="What is the ultimate strategic resolution? (e.g. Demand full settlement refund of £250,000 within 14 business days, or force mediation)"
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Evidence */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-bright)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              Supporting Evidence / Materials
            </label>
            <textarea 
              name="evidence" 
              value={formData.evidence} 
              onChange={handleChange} 
              className="input-premium" 
              placeholder="List available email threads, agreements, transcripts, or physical receipts."
              rows={2}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn-premium" style={{ padding: '14px', marginTop: '12px' }}>
            <div className="flex-center" style={{ gap: '10px' }}>
              <Play size={16} />
              <span>Compile Strategic Synthesis (3-Step Local AI Pipeline)</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
