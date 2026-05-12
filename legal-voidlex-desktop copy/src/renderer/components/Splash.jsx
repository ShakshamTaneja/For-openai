import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Database, HardDrive, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import logoImg from '../logo.png';

export default function Splash({ onComplete }) {
  const [statusText, setStatusText] = useState('Initializing Sovereign Engine...');
  const [report, setReport] = useState(null);
  const [installStep, setInstallStep] = useState('diagnostics'); // diagnostics, prompt_ollama, installing_ollama, prompt_model, pulling_model, failed
  const [progress, setProgress] = useState(0);
  const [errorText, setErrorText] = useState('');
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    runInitialDiagnostics();
    return () => {
      window.api.removeListeners('installer:download-progress');
      window.api.removeListeners('installer:download-status');
      window.api.removeListeners('installer:complete');
      window.api.removeListeners('installer:pull-progress');
      window.api.removeListeners('installer:pull-complete');
      window.api.removeListeners('installer:pull-error');
      window.api.removeListeners('installer:python-progress');
      window.api.removeListeners('installer:python-complete');
      window.api.removeListeners('installer:python-error');
      window.api.removeListeners('installer:python-dependency-progress');
      window.api.removeListeners('installer:python-dependency-complete');
      window.api.removeListeners('installer:python-dependency-error');
    };
  }, []);

  const runInitialDiagnostics = async () => {
    try {
      setStatusText('Running system audits...');
      const r = await window.api.runDiagnostics();
      setReport(r);

      // Step 1: Enforce OS platform compatibility
      if (!r.windows_ok) {
        setInstallStep('failed');
        setErrorText('Unsupported Operating System: VOIDLEX requires macOS (11+) or Windows 10/11.');
        return;
      }

      if (!r.ram_ok) {
        setInstallStep('failed');
        setErrorText(`Insufficient System RAM: Detected ${r.ram_gb} GB. VOIDLEX requires at least 8 GB of physical memory for local inference.`);
        return;
      }

      // Step 2: Check Ollama installation
      if (!r.ollama_installed) {
        setStatusText('Ollama Runtime missing.');
        setInstallStep('prompt_ollama');
        return;
      }

      // Step 2b: Check Python installation
      if (!r.python_installed) {
        setStatusText('Python Runtime missing.');
        setInstallStep('prompt_python');
        return;
      }

      // Step 2c: Check Python library dependencies
      if (!r.python_libraries_installed) {
        setStatusText('Required Python dependencies missing.');
        setInstallStep('prompt_python_deps');
        return;
      }

      // Step 3: Check Ollama service running
      if (!r.ollama_running) {
        setStatusText('Booting Ollama background runtime...');
        window.api.startOllama();
        window.api.onStartComplete((started) => {
          if (started) {
            checkModelStatus(r, 0);
          } else {
            setInstallStep('failed');
            setErrorText('Failed to start local Ollama service. Please make sure Ollama is accessible on port 11434.');
          }
        });
        return;
      }

      checkModelStatus(r, 0);
    } catch (err) {
      setInstallStep('failed');
      setErrorText(`Diagnostic audit crash: ${err.message}`);
    }
  };

  const checkModelStatus = async (currentReport, attemptCount = 0) => {
    setStatusText('Checking AI core models...');
    // Re-run diagnostics briefly to catch updated service models
    const updated = await window.api.runDiagnostics();
    setReport(updated);

    if (!updated.model_available) {
      // Automatic self-healing model fallback to prevent blocking user!
      if (updated.available_models && updated.available_models.length > 0) {
        const fallbackModel = updated.available_models[0];
        setStatusText(`Model ${updated.required_model} not found. Launching with active core: ${fallbackModel}...`);
        try {
          await window.api.updateConfig({ active_model: fallbackModel });
          setTimeout(() => {
            checkModelStatus(currentReport, attemptCount);
          }, 1000);
          return;
        } catch (e) {
          console.error('[Splash] Auto model fallback config update failed:', e);
        }
      }

      setStatusText(`Local model ${updated.required_model} missing.`);
      setInstallStep('prompt_model');
    } else if (!updated.python_backend_running) {
      if (attemptCount > 8) {
        setInstallStep('failed');
        setErrorText(updated.python_error || 'VOIDLEX Python Strategic Engine failed to respond on port 8000. Please check your local environment and ensure you have no port 8000 conflicts.');
        return;
      }
      setStatusText('Booting Local AI Legal Intelligence Engine...');
      setTimeout(() => {
        checkModelStatus(currentReport, attemptCount + 1);
      }, 1000);
    } else {
      setStatusText('Sovereign Link Active. Passing compliance check...');
      setProgress(100);
      setTimeout(() => {
        onComplete(updated);
      }, 1500);
    }
  };

  const handleInstallPythonApproval = () => {
    setInstallStep('installing_python');
    setStatusText('Downloading Python 3.11 Runtime...');
    setProgress(0);

    window.api.onPythonProgress((percent) => {
      setProgress(percent);
    });

    window.api.onPythonComplete(() => {
      setProgress(100);
      setStatusText('Python Runtime installed successfully! Re-auditing system...');
      setTimeout(() => {
        runInitialDiagnostics();
      }, 1500);
    });

    window.api.onPythonError((err) => {
      setInstallStep('failed');
      setErrorText(`Failed to install Python 3.11 Runtime: ${err}`);
    });

    window.api.downloadPython();
  };

  const handleInstallPythonDepsApproval = () => {
    setInstallStep('installing_python_deps');
    setStatusText('Synchronizing premium Python dependency layers...');
    setProgress(15);

    window.api.onPythonDependencyProgress((text) => {
      // Parse output to find matching install progress
      if (text.includes('Collecting')) {
        const match = text.match(/Collecting\s+(\w+)/);
        if (match) {
          setStatusText(`Gathering dependency: ${match[1]}...`);
        }
      } else if (text.includes('Downloading')) {
        setStatusText('Downloading package resources from secure layers...');
        setProgress((prev) => Math.min(prev + 5, 85));
      } else if (text.includes('Installing')) {
        setStatusText('Installing dependency package configurations...');
        setProgress((prev) => Math.min(prev + 5, 95));
      }
    });

    window.api.onPythonDependencyComplete(() => {
      setProgress(100);
      setStatusText('Python dependencies configured! Performing core audit...');
      setTimeout(() => {
        runInitialDiagnostics();
      }, 1500);
    });

    window.api.onPythonDependencyError((err) => {
      setInstallStep('failed');
      setErrorText(`Failed to synchronize Python dependency layers: ${err}`);
    });

    window.api.installPythonDependencies();
  };

  const handleInstallOllamaApproval = () => {
    setInstallStep('installing_ollama');
    setStatusText('Downloading local AI runtime...');

    // Register IPC hooks for download progress
    window.api.onDownloadProgress((percent) => {
      setProgress(percent);
    });

    window.api.onDownloadStatus((status) => {
      setStatusText(status);
    });

    window.api.onStartComplete((started) => {
      if (started) {
        runInitialDiagnostics();
      } else {
        setInstallStep('failed');
        setErrorText('Ollama installed but failed to initialize background service automatically.');
      }
    });

    window.api.downloadOllama();
  };

  const handlePullModelApproval = () => {
    setInstallStep('pulling_model');
    setStatusText(`Pulling model ${report.required_model}...`);
    setProgress(0);

    window.api.onPullProgress(({ percent, status }) => {
      setProgress(percent);
      setStatusText(status);
    });

    window.api.onPullComplete((success) => {
      if (success) {
        setProgress(100);
        setStatusText('Model weights verified! Booting...');
        setTimeout(() => {
          onComplete(report);
        }, 1500);
      }
    });

    window.api.onPullError((err) => {
      setInstallStep('failed');
      setErrorText(`Failed to download LLM weights: ${err}`);
    });

    window.api.pullModel(report.required_model);
  };

  return (
    <div className="flex-center" style={{
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(circle at center, #0f121e 0%, #030406 100%)',
      flexDirection: 'column',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative cyber backdrop grids */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(#d4af37 0.7px, transparent 0.7px)',
        backgroundSize: '24px 24px',
        opacity: 0.04,
        pointerEvents: 'none'
      }} />

      {/* Main Branding */}
      <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', animation: 'slideInUp 0.6s ease' }}>
        <img src={logoImg} alt="VOIDLEX Logo" style={{ width: '64px', height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))' }} />
        <h1 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '2.4rem',
          fontWeight: 800,
          color: 'var(--gold-primary)',
          letterSpacing: '10px',
          marginRight: '-10px',
          animation: 'textGlow 3s infinite',
          textTransform: 'uppercase',
          margin: 0
        }}>VOIDLEX</h1>
        <p style={{
          fontSize: '0.75rem',
          letterSpacing: '3px',
          color: 'var(--text-bright)',
          opacity: 0.8,
          textTransform: 'uppercase',
          margin: 0
        }}>Local AI Legal Intelligence Engine</p>
      </div>

      {/* Interactive Boot States */}
      <div className="glass-panel" style={{
        width: '520px',
        padding: '30px',
        border: '1px solid var(--border-gold)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 15px var(--gold-glow)',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>

        {installStep === 'diagnostics' && (
          <div style={{ width: '100%' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-bright)', textAlign: 'center', marginBottom: '20px' }}>
              {statusText}
            </p>
            {report && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <Cpu size={14} color={report.windows_ok ? 'var(--success-color)' : 'var(--danger-color)'} />
                  <span>{(report.os_version && report.os_version.toLowerCase().includes('darwin')) ? 'macOS 11+' : 'Windows 10+'}: {report.windows_ok ? 'OK' : 'FAIL'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <Activity size={14} color={report.ram_ok ? 'var(--success-color)' : 'var(--danger-color)'} />
                  <span>RAM ({report.ram_gb}GB): {report.ram_ok ? 'OK' : 'FAIL'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <HardDrive size={14} color={report.storage_ok ? 'var(--success-color)' : 'var(--danger-color)'} />
                  <span>Disk Space: {report.storage_ok ? 'OK' : 'FAIL'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <Database size={14} color={report.ollama_installed ? 'var(--success-color)' : 'var(--warning-color)'} />
                  <span>Ollama: {report.ollama_installed ? 'FOUND' : 'MISSING'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <Cpu size={14} color={report.python_installed ? 'var(--success-color)' : 'var(--warning-color)'} />
                  <span>Python 3.x: {report.python_installed ? 'FOUND' : 'MISSING'}</span>
                </div>
              </div>
            )}
            <div style={{ width: '100%', height: '3px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gold-primary)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        )}

        {installStep === 'prompt_ollama' && (
          <div style={{ textAlign: 'center' }}>
            <Sparkles size={28} color="var(--gold-primary)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--text-bright)', marginBottom: '8px', fontSize: '1.1rem' }}>Local LLM Core Required</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-normal)', marginBottom: '20px', lineHeight: '1.5' }}>
              VOIDLEX operates 100% locally and securely to protect client privilege.
              We need to set up the **Ollama AI Runtime** on your system.
              With your consent, the installer will automatically download (approx. 400MB) and install Ollama Setup.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-bright)' }}>
                <input type="checkbox" checked={consentGranted} onChange={(e) => setConsentGranted(e.target.checked)} style={{ accentColor: 'var(--gold-primary)' }} />
                <span>I approve the secure background installation of local Ollama runtime.</span>
              </label>
              <button className="btn-premium" disabled={!consentGranted} onClick={handleInstallOllamaApproval} style={{ width: '100%', marginTop: '8px' }}>
                Download & Install Ollama
              </button>
            </div>
          </div>
        )}

        {installStep === 'prompt_python' && (
          <div style={{ textAlign: 'center' }}>
            <Cpu size={28} color="var(--gold-primary)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--text-bright)', marginBottom: '8px', fontSize: '1.1rem' }}>Python Runtime Required</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-normal)', marginBottom: '20px', lineHeight: '1.5' }}>
              VOIDLEX requires the **Python 3.x Runtime** to run its local wargaming database and high-precision PDF compiler.
              With your consent, the installer will automatically download and silently configure Python 3.11 for you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <label style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-bright)' }}>
                <input type="checkbox" checked={consentGranted} onChange={(e) => setConsentGranted(e.target.checked)} style={{ accentColor: 'var(--gold-primary)' }} />
                <span>I approve the secure background installation of Python 3.11 runtime.</span>
              </label>
              <button className="btn-premium" disabled={!consentGranted} onClick={handleInstallPythonApproval} style={{ width: '100%', marginTop: '8px' }}>
                Download & Install Python
              </button>
            </div>
          </div>
        )}

        {installStep === 'installing_python' && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Cpu size={28} color="var(--gold-primary)" className="glow-icon" style={{ marginBottom: '12px', animation: 'goldGlowPulse 1.5s infinite' }} />
            <p style={{ color: 'var(--text-bright)', fontSize: '0.9rem', marginBottom: '16px' }}>{statusText}</p>
            <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gold-primary)', transition: 'width 0.2s ease' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress: {progress}%</span>
          </div>
        )}

        {installStep === 'prompt_python_deps' && (
          <div style={{ textAlign: 'center' }}>
            <Database size={28} color="var(--gold-primary)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--text-bright)', marginBottom: '8px', fontSize: '1.1rem' }}>Python Dependency Sync Required</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-normal)', marginBottom: '20px', lineHeight: '1.5' }}>
              Your system lacks the core Python library packages (**fastapi**, **uvicorn**, **requests**, **pydantic**) required to spin up the local tactical database.
              We can securely synchronize and install these modules inside your local space in 1-click.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <button className="btn-premium" onClick={handleInstallPythonDepsApproval} style={{ width: '100%', marginTop: '8px' }}>
                Synchronize Core Libraries
              </button>
            </div>
          </div>
        )}

        {installStep === 'installing_python_deps' && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Activity size={28} color="var(--gold-primary)" className="glow-icon" style={{ marginBottom: '12px', animation: 'goldGlowPulse 1.5s infinite' }} />
            <p style={{ color: 'var(--text-bright)', fontSize: '0.9rem', marginBottom: '16px' }}>{statusText}</p>
            <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gold-primary)', transition: 'width 0.2s ease' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress: {progress}%</span>
          </div>
        )}

        {installStep === 'installing_ollama' && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Database size={28} color="var(--gold-primary)" className="glow-icon" style={{ marginBottom: '12px', animation: 'goldGlowPulse 1.5s infinite' }} />
            <p style={{ color: 'var(--text-bright)', fontSize: '0.9rem', marginBottom: '16px' }}>{statusText}</p>
            <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gold-primary)', transition: 'width 0.2s ease' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress: {progress}%</span>
          </div>
        )}

        {installStep === 'prompt_model' && (
          <div style={{ textAlign: 'center' }}>
            <Sparkles size={28} color="var(--gold-primary)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--text-bright)', marginBottom: '8px', fontSize: '1.1rem' }}>Initialize LLM Weights</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-normal)', marginBottom: '20px', lineHeight: '1.5' }}>
              VOIDLEX requires download of the local legal-wargaming model weight: **{report?.required_model}** (approx 2.0 GB).
              This core will run fully offline in your RAM and GPU. Download weights now?
            </p>
            <button className="btn-premium" onClick={handlePullModelApproval} style={{ width: '100%' }}>
              Download Model Core
            </button>
          </div>
        )}

        {installStep === 'pulling_model' && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <Activity size={28} color="var(--gold-primary)" style={{ marginBottom: '12px', animation: 'goldGlowPulse 1.5s infinite' }} />
            <p style={{ color: 'var(--text-bright)', fontSize: '0.9rem', marginBottom: '16px', wordBreak: 'break-all' }}>{statusText}</p>
            <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gold-primary)' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress: {progress}%</span>
          </div>
        )}

        {installStep === 'failed' && (
          <div style={{ textAlign: 'center' }}>
            <ShieldAlert size={32} color="var(--danger-color)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--text-bright)', marginBottom: '8px', fontSize: '1.1rem' }}>Core Diagnostics Fault</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--danger-color)', marginBottom: '24px', lineHeight: '1.5', background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              {errorText}
            </p>
            <button className="btn-secondary" onClick={() => { setInstallStep('diagnostics'); runInitialDiagnostics(); }} style={{ width: '100%' }}>
              Re-Audit System
            </button>
          </div>
        )}
      </div>

      {/* Footer Branding info */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        color: 'var(--text-muted)',
        fontSize: '0.65rem',
        letterSpacing: '2px',
        textAlign: 'center',
        opacity: 0.6
      }}>
        IMPERIAL EMINENCE CYBERGUARD CORPORATION &copy; 2026. CONFIDENTIAL TACTICAL PRIMITIVE.
      </div>
    </div>
  );
}
