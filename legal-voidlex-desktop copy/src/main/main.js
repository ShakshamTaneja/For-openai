const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const http = require('http');
const store = require('./store');
const diagnostics = require('./diagnostics');
const installer = require('./installer');
const pdfGenerator = require('./pdf');
const prompts = require('./prompts');

let mainWindow = null;
let splashWindow = null;
const isDev = !app.isPackaged;

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
let pythonProcess = null;
let pythonErrorMsg = '';

// macOS Environment PATH Patching for Finder/launchd double-click execution
if (process.platform === 'darwin') {
  process.env.PATH = `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH || ''}`;
}

function startPythonBackend() {
  const isMac = process.platform === 'darwin';
  const pythonCmd = isMac ? 'python3' : 'python';

  // Resolve base app path - unpack-aware for packaged ASAR builds
  let appPath = app.getAppPath();
  if (appPath.endsWith('app.asar')) {
    appPath = appPath + '.unpacked';
  }

  // Pre-cleaning port 8000 on macOS to prevent binding crashes from stale uvicorn instances!
  if (isMac) {
    try {
      console.log('[Python Backend] Pre-cleaning port 8000 to clear stale uvicorn processes...');
      spawnSync('kill -9 $(lsof -t -i:8000)', { shell: true });
    } catch (e) {
      console.error('[Python Backend] Pre-cleaning port 8000 failed:', e);
    }
  }

  // Dynamic path discovery
  const possibleCwds = [
    appPath,
    path.join(appPath, '..'),
    path.join(__dirname, '../../'),
    path.join(__dirname, '../../../'),
    '/Users/tc_shaksham/Downloads/legal-voidlex-desktop' // Current dev path
  ];

  let chosenCwd = null;
  for (const dir of possibleCwds) {
    const backendPath = path.join(dir, 'backend');
    if (fs.existsSync(backendPath)) {
      chosenCwd = dir;
      break;
    }
  }

  if (!chosenCwd) {
    console.error('[Python Backend] Could not locate backend directory.');
    return;
  }

  console.log(`[Python Backend] Launching FastAPI with ${pythonCmd} in ${chosenCwd}...`);
  const spawnEnv = { ...process.env, PYTHONPATH: chosenCwd };
  try {
    pythonProcess = spawn(pythonCmd, ['-m', 'uvicorn', 'backend.main:app', '--host', '127.0.0.1', '--port', '8000'], {
      cwd: chosenCwd,
      env: spawnEnv,
      shell: false // Set to false to bypass Windows certification container subshell restrictions
    });

    pythonProcess.on('error', (err) => {
      console.error('[Python Backend] Spawn error caught asynchronously:', err);
      pythonErrorMsg += `\nFailed to start Python backend process: ${err.message}`;
    });
  } catch (e) {
    console.error('[Python Backend] Spawn exception caught synchronously:', e);
    pythonErrorMsg += `\nFailed to initiate Python spawn: ${e.message}`;
  }

  if (pythonProcess) {
    pythonProcess.stdout.on('data', (data) => {
      console.log(`[Python Backend STDOUT]: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      const text = data.toString();
      console.error(`[Python Backend STDERR]: ${text}`);
      if (text.includes('Error') || text.includes('Traceback') || text.includes('Exception') || text.includes('ModuleNotFoundError')) {
        pythonErrorMsg += text;
      }
    });

    pythonProcess.on('close', (code) => {
      console.log(`[Python Backend] exited with code ${code}`);
      if (code !== 0 && code !== null) {
        pythonErrorMsg += `\nProcess exited with status code ${code}`;
      }
    });
  }
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 600,
    height: 420,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    splashWindow.loadURL('http://localhost:5173/#splash');
  } else {
    splashWindow.loadFile(path.join(__dirname, '../../dist-renderer/index.html'), { hash: 'splash' });
  }

  splashWindow.on('closed', () => {
    splashWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'VOIDLEX',
    show: false, // Show once ready
    backgroundColor: '#05070a',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Hide default menu
  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173/#main');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist-renderer/index.html'), { hash: 'main' });
  }

  mainWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.close();
    }
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Ensure single instance lock
const additionalData = { myKey: 'voidlex' };
const gotTheLock = app.requestSingleInstanceLock(additionalData);

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    // Auto-launch local Ollama service background process on boot!
    console.log('[Main App] Booting Ollama service background runtime...');
    await installer.startOllamaService();

    startPythonBackend();
    createSplashWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createSplashWindow();
    });
  });
}

app.on('will-quit', () => {
  if (pythonProcess) {
    console.log('[Python Backend] Stopping FastAPI subprocess...');
    pythonProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC HANDLERS ---

// 1. Diagnostics IPCs
ipcMain.handle('diagnostics:run', async () => {
  try {
    const report = await diagnostics.run();
    report.python_error = pythonErrorMsg;
    return report;
  } catch (err) {
    return { error: err.message, python_error: pythonErrorMsg };
  }
});

// 2. Installer IPCs
ipcMain.on('installer:download-ollama', (event) => {
  installer.downloadOllama(
    (percent) => event.sender.send('installer:download-progress', percent),
    async () => {
      event.sender.send('installer:download-progress', 100);
      event.sender.send('installer:download-status', 'Starting service...');
      const started = await installer.startOllamaService();
      event.sender.send('installer:complete', started);
    },
    (err) => {
      event.sender.send('installer:error', err);
    }
  );
});

ipcMain.on('installer:download-python', (event) => {
  installer.downloadPython(
    (percent) => event.sender.send('installer:python-progress', percent),
    () => {
      event.sender.send('installer:python-progress', 100);
      event.sender.send('installer:python-complete');
    },
    (err) => {
      event.sender.send('installer:python-error', err);
    }
  );
});

ipcMain.on('installer:start-ollama', async (event) => {
  const started = await installer.startOllamaService();
  event.sender.send('installer:start-complete', started);
});

ipcMain.on('installer:pull-model', (event, modelName) => {
  installer.pullModel(
    modelName,
    (percent, status) => {
      event.sender.send('installer:pull-progress', { percent, status });
    },
    () => {
      event.sender.send('installer:pull-progress', { percent: 100, status: 'Model ready!' });
      event.sender.send('installer:pull-complete', true);
    },
    (err) => {
      event.sender.send('installer:pull-error', err);
    }
  );
});

ipcMain.on('installer:install-python-dependencies', (event) => {
  const isMac = process.platform === 'darwin';
  const pythonCmd = isMac ? 'python3' : 'python';
  const args = ['install', 'requests', 'fastapi', 'uvicorn', 'pydantic', 'reportlab'];
  if (isMac) {
    args.push('--break-system-packages');
  }

  console.log('[Installer] Asynchronously installing python dependency layers...');
  const child = spawn(pythonCmd, ['-m', 'pip', ...args]);

  child.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(`[pip stdout]: ${text}`);
    event.sender.send('installer:python-dependency-progress', text);
  });

  child.stderr.on('data', (data) => {
    console.error(`[pip stderr]: ${data.toString()}`);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('[Installer] Python dependencies installed successfully! Restarting FastAPI server...');
      startPythonBackend();
      event.sender.send('installer:python-dependency-complete', true);
    } else {
      console.error(`[Installer] Pip install failed with code ${code}`);
      event.sender.send('installer:python-dependency-error', `Installation exited with error status ${code}`);
    }
  });
});

// 3. Store Config IPCs
ipcMain.handle('store:get-config', () => {
  return store.getConfig();
});

ipcMain.handle('store:save-terms-acceptance', (event, version) => {
  return store.updateConfig({
    accepted_terms: true,
    terms_version: version,
    accepted_timestamp: new Date().toISOString()
  });
});

ipcMain.handle('store:update-config', (event, updates) => {
  return store.updateConfig(updates);
});

// 4. Case DB IPCs
ipcMain.handle('store:list-cases', async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/history');
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (err) {
    console.error('[list-cases error]', err);
    return [];
  }
});

ipcMain.handle('store:clear-cases', async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/clear-all', {
      method: 'POST'
    });
    if (response.ok) {
      return { success: true };
    }
    return { error: 'Failed to clear database in backend.' };
  } catch (err) {
    console.error('[clear-cases error]', err);
    return { error: err.message };
  }
});

ipcMain.handle('store:get-case', async (event, serial) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/case/${serial}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (err) {
    console.error('[get-case error]', err);
    return null;
  }
});

ipcMain.handle('store:save-case', (event, { intake, strategy }) => {
  return strategy.case_serial || 'VLX-STRAT-001';
});

ipcMain.handle('store:update-chat', (event, { serial, chat_history }) => {
  return true;
});

// 5. PDF generation IPC
ipcMain.handle('pdf:generate', async (event, caseRecord) => {
  try {
    const serial = caseRecord.case_serial;
    const url = `http://127.0.0.1:8000/export-pdf${serial ? `?case_serial=${serial}` : ''}`;

    const { dialog } = require('electron');
    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Voidlex Strategic Synthesis',
      defaultPath: `VOIDLEX_STRATEGY_${(caseRecord.intake?.last_name || 'CASE').toUpperCase()}.pdf`,
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
    });

    if (!filePath) return null; // Cancelled

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Python PDF export failed: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (err) {
    console.error('[PDF Export Error]', err);
    return { error: err.message };
  }
});

// 6. Transition from Splash Screen to Dashboard UI
ipcMain.on('app:boot-dashboard', () => {
  createMainWindow();
});

// 7. Ollama Direct Integrations (Analyze & Chat)
const callLocalOllama = (payload) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const options = {
      hostname: '127.0.0.1',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 180000 // 3 minutes timeout for heavy LLMs
    };

    const req = http.request(options, (res) => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data.response);
        } catch (e) {
          // If response was streamed, let's assemble it from lines
          try {
            const lines = body.split('\n');
            let combined = '';
            for (const line of lines) {
              if (line.trim()) {
                const parsed = JSON.parse(line);
                if (parsed.response) combined += parsed.response;
              }
            }
            resolve(combined);
          } catch (parseErr) {
            reject(new Error('Failed to parse Ollama response.'));
          }
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Ollama request timed out. Make sure service is responsive.'));
    });

    req.write(postData);
    req.end();
  });
};

ipcMain.handle('ollama:analyze', async (event, { intake, model }) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intake)
    });

    if (!response.ok) {
      throw new Error(`Python Backend Error: ${response.statusText}`);
    }

    const resultData = await response.json();
    return { success: true, result: resultData };
  } catch (err) {
    console.error('[Ollama Analyze Error]', err);
    return { success: false, error: err.message };

  }
});

ipcMain.handle('ollama:chat', async (event, { messages, caseSerial }) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        case_serial: caseSerial || null
      })
    });

    if (!response.ok) {
      throw new Error(`Python Chat Error: ${response.statusText}`);
    }

    const responseText = await response.text();
    return { success: true, response: responseText };
  } catch (err) {
    console.error('[Ollama Chat Error]', err);
    return { success: false, error: err.message };
  }
});
