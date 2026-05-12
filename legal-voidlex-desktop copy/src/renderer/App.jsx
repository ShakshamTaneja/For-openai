import React, { useState, useEffect } from 'react';
import Splash from './components/Splash.jsx';
import LegalModal from './components/LegalModal.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import ChatSandbox from './components/ChatSandbox.jsx';

export default function App() {
  const isSplashWindow = window.location.hash === '#splash';
  const [phase, setPhase] = useState(isSplashWindow ? 'splash' : 'loading'); // splash, loading, legal, dashboard
  const [config, setConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('create_case'); // create_case, chat, archive_detail
  const [activeCase, setActiveCase] = useState(null);
  const [casesList, setCasesList] = useState([]);
  const [systemReport, setSystemReport] = useState(null);

  // Initialize App Config and DB
  useEffect(() => {
    loadAppConfig();
  }, []);

  // Auto-reloader to sync case list as soon as Python server boots up and update diagnostics status
  useEffect(() => {
    let timer = null;
    if (phase === 'dashboard') {
      const checkAndReload = async () => {
        try {
          const report = await window.api.runDiagnostics();
          setSystemReport(report);
          if (report && report.python_backend_running) {
            const list = await window.api.listCases();
            setCasesList(list);
          }
        } catch (e) {
          console.error('[Startup Sync Poll] Error checking backend status:', e);
        }
      };
      
      // Run once immediately
      checkAndReload();
      
      // Then poll every 3 seconds to keep health bar fresh
      timer = setInterval(checkAndReload, 3000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase]);

  const loadAppConfig = async () => {
    try {
      const cfg = await window.api.getConfig();
      setConfig(cfg);
      
      const list = await window.api.listCases();
      setCasesList(list);

      // Determine initial phase for main window once config is loaded
      if (!isSplashWindow) {
        if (cfg && cfg.accepted_terms) {
          setPhase('dashboard');
        } else {
          setPhase('legal');
        }
      }
    } catch (err) {
      console.error('Error initializing app config:', err);
    }
  };

  const handleDiagnosticsComplete = (report) => {
    setSystemReport(report);
    // Boot main app window and let it handle terms gate independently
    window.api.bootDashboard();
  };

  const handleLegalAccepted = async () => {
    try {
      const updatedCfg = await window.api.saveTermsAcceptance('1.0.0');
      setConfig(updatedCfg);
      setPhase('dashboard');
    } catch (err) {
      console.error('Failed to save acceptance state:', err);
    }
  };

  const reloadCases = async () => {
    try {
      const list = await window.api.listCases();
      setCasesList(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCaseSelected = (c) => {
    setActiveCase(c);
    setActiveTab('archive_detail');
  };

  const handleConfigUpdated = (newCfg) => {
    setConfig(newCfg);
  };

  const handleClearCases = async () => {
    const confirmClear = window.confirm("Are you absolutely sure you want to permanently clear all wargaming case files and histories? This action cannot be undone.");
    if (!confirmClear) return;
    try {
      const res = await window.api.clearCases();
      if (res.success) {
        setCasesList([]);
        setActiveCase(null);
        setActiveTab('create_case');
        alert("Database successfully cleared.");
      } else {
        alert("Failed to clear cases: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error clearing cases: " + err.message);
    }
  };

  if (phase === 'loading') {
    return (
      <div className="flex-center" style={{ width: '100vw', height: '100vh', background: '#05070a', color: 'var(--text-muted)' }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
          Loading Core Systems...
        </div>
      </div>
    );
  }

  if (phase === 'splash') {
    return <Splash onComplete={handleDiagnosticsComplete} />;
  }

  if (phase === 'legal') {
    return <LegalModal onAccept={handleLegalAccepted} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#030406' }}>
      {/* Sidebar navigation */}
      <Sidebar 
        config={config}
        onConfigUpdate={handleConfigUpdated}
        cases={casesList}
        activeCase={activeCase}
        onSelectCase={handleCaseSelected}
        onNewCase={() => {
          setActiveCase(null);
          setActiveTab('create_case');
        }}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        systemReport={systemReport}
        onClearCases={handleClearCases}
      />

      {/* Main workspace panels */}
      <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', background: '#05070a', overflow: 'hidden' }}>
        {activeTab === 'create_case' && (
          <Dashboard 
            config={config} 
            activeCase={null} 
            onCaseCreated={(newCase) => {
              reloadCases();
              setActiveCase(newCase);
              setActiveTab('archive_detail');
            }}
          />
        )}

        {activeTab === 'archive_detail' && activeCase && (
          <Dashboard 
            config={config} 
            activeCase={activeCase} 
            onCaseCreated={null}
          />
        )}

        {activeTab === 'chat' && (
          <ChatSandbox 
            config={config}
            activeCase={activeCase}
            onUpdateCase={async (serial) => {
              // Reload active case to catch updated chat history
              const c = await window.api.getCase(serial);
              setActiveCase(c);
              reloadCases();
            }}
          />
        )}
      </div>
    </div>
  );
}
