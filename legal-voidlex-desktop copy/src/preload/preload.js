const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // 1. Diagnostics System
  runDiagnostics: () => ipcRenderer.invoke('diagnostics:run'),
  
  // 2. Automated Ollama & Python Setup
  downloadOllama: () => ipcRenderer.send('installer:download-ollama'),
  onDownloadProgress: (callback) => ipcRenderer.on('installer:download-progress', (e, percent) => callback(percent)),
  onDownloadStatus: (callback) => ipcRenderer.on('installer:download-status', (e, status) => callback(status)),
  
  downloadPython: () => ipcRenderer.send('installer:download-python'),
  onPythonProgress: (callback) => ipcRenderer.on('installer:python-progress', (e, percent) => callback(percent)),
  onPythonComplete: (callback) => ipcRenderer.on('installer:python-complete', (e) => callback()),
  onPythonError: (callback) => ipcRenderer.on('installer:python-error', (e, err) => callback(err)),

  installPythonDependencies: () => ipcRenderer.send('installer:install-python-dependencies'),
  onPythonDependencyProgress: (callback) => ipcRenderer.on('installer:python-dependency-progress', (e, text) => callback(text)),
  onPythonDependencyComplete: (callback) => ipcRenderer.on('installer:python-dependency-complete', (e) => callback()),
  onPythonDependencyError: (callback) => ipcRenderer.on('installer:python-dependency-error', (e, err) => callback(err)),
  
  startOllama: () => ipcRenderer.send('installer:start-ollama'),
  onStartComplete: (callback) => ipcRenderer.on('installer:start-complete', (e, started) => callback(started)),
  
  pullModel: (modelName) => ipcRenderer.send('installer:pull-model', modelName),
  onPullProgress: (callback) => ipcRenderer.on('installer:pull-progress', (e, data) => callback(data)),
  onPullComplete: (callback) => ipcRenderer.on('installer:pull-complete', (e, success) => callback(success)),
  onPullError: (callback) => ipcRenderer.on('installer:pull-error', (e, err) => callback(err)),

  // 3. Persistent Local Storage Configuration
  getConfig: () => ipcRenderer.invoke('store:get-config'),
  saveTermsAcceptance: (version) => ipcRenderer.invoke('store:save-terms-acceptance', version),
  updateConfig: (updates) => ipcRenderer.invoke('store:update-config', updates),

  // 4. Case Database SQLite Mirror
  listCases: () => ipcRenderer.invoke('store:list-cases'),
  getCase: (serial) => ipcRenderer.invoke('store:get-case', serial),
  saveCase: (intake, strategy) => ipcRenderer.invoke('store:save-case', { intake, strategy }),
  updateChat: (serial, chatHistory) => ipcRenderer.invoke('store:update-chat', { serial, chat_history: chatHistory }),
  clearCases: () => ipcRenderer.invoke('store:clear-cases'),

  // 5. Native PDF Generation
  generatePDF: (caseRecord) => ipcRenderer.invoke('pdf:generate', caseRecord),

  // 6. Application State Switch
  bootDashboard: () => ipcRenderer.send('app:boot-dashboard'),

  // 7. Ollama Direct Integrations
  analyzeCase: (intake, model) => ipcRenderer.invoke('ollama:analyze', { intake, model }),
  sendChat: (messages, caseSerial, model) => ipcRenderer.invoke('ollama:chat', { messages, case_serial: caseSerial, model }),

  // 8. General cleanup helper for IPC events
  removeListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
