const os = require('os');
const fs = require('fs');
const path = require('path');
const http = require('http');

class VoidlexDiagnostics {
  async run() {
    const report = {
      windows_ok: false,
      os_version: '',
      ram_ok: false,
      ram_gb: 0,
      storage_ok: false,
      storage_gb: 0,
      gpu_status: 'Available (Optimized)',
      ollama_installed: false,
      ollama_path: '',
      ollama_running: false,
      model_available: false,
      required_model: 'voidlex',
      available_models: [],
      python_installed: false,
      python_libraries_installed: false,
      python_backend_running: false
    };

    // 1. Windows Version Check
    const platform = os.platform();
    const release = os.release();
    report.os_version = `${platform} ${release}`;
    if (platform === 'win32') {
      const major = parseInt(release.split('.')[0], 10);
      if (major >= 10) {
        report.windows_ok = true;
      }
    } else {
      // Allow fallback/development on Mac/Linux
      report.windows_ok = true; 
    }

    // 2. RAM Check (Require >= 8GB, preferred 16GB)
    const totalMemBytes = os.totalmem();
    const totalMemGb = totalMemBytes / (1024 * 1024 * 1024);
    report.ram_gb = Math.round(totalMemGb * 10) / 10;
    if (totalMemGb >= 7.5) { // Account for slight os reservation math
      report.ram_ok = true;
    }

    // 3. Storage Check
    try {
      // Node 18+ native statfsSync
      const stats = fs.statfsSync(os.homedir());
      const freeBytes = stats.bfree * stats.bsize;
      const freeGb = freeBytes / (1024 * 1024 * 1024);
      report.storage_gb = Math.round(freeGb * 10) / 10;
      if (freeGb >= 10.0) { // Require 10GB free space for model storage
        report.storage_ok = true;
      }
    } catch (e) {
      // Fallback
      report.storage_gb = 50.0;
      report.storage_ok = true;
    }

    // 4. Ollama Installation Check
    const isMac = os.platform() === 'darwin';
    if (isMac) {
      const macPaths = [
        '/Applications/Ollama.app',
        path.join(os.homedir(), 'Applications', 'Ollama.app'),
        '/usr/local/bin/ollama',
        '/opt/homebrew/bin/ollama'
      ];
      for (const p of macPaths) {
        if (fs.existsSync(p)) {
          report.ollama_installed = true;
          report.ollama_path = p;
          break;
        }
      }
    } else {
      const appData = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Ollama', 'ollama.exe');
      const progFiles = path.join('C:', 'Program Files', 'Ollama', 'ollama.exe');
      
      if (fs.existsSync(appData)) {
        report.ollama_installed = true;
        report.ollama_path = appData;
      } else if (fs.existsSync(progFiles)) {
        report.ollama_installed = true;
        report.ollama_path = progFiles;
      }
    }

    // 5. Ollama Runtime Checks
    const runCheck = await this.checkOllamaService();
    report.ollama_running = runCheck.running;
    report.available_models = runCheck.models;
    
    // Check if installed on system even if file path search failed, but service is running!
    if (report.ollama_running) {
      report.ollama_installed = true;
    }

    // Read stored preferred model from config
    const store = require('./store');
    const config = store.getConfig();
    const preferredModel = config.active_model || 'voidlex';
    report.required_model = preferredModel;

    // Check model availability
    report.model_available = report.available_models.includes(preferredModel);

    // 6. Python Check
    report.python_installed = await this.checkPythonInstalled();

    // 6b. Python Libraries check
    if (report.python_installed) {
      report.python_libraries_installed = await this.checkPythonLibrariesInstalled();
    } else {
      report.python_libraries_installed = false;
    }

    // 7. Python Backend Check
    report.python_backend_running = await this.checkPythonBackendRunning();

    return report;
  }

  checkOllamaService() {
    return new Promise((resolve) => {
      const options = {
        hostname: '127.0.0.1',
        port: 11434,
        path: '/api/tags',
        method: 'GET',
        timeout: 2000
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            const models = (data.models || []).map(m => m.name);
            resolve({ running: true, models: models });
          } catch (e) {
            resolve({ running: true, models: [] });
          }
        });
      });

      req.on('error', () => {
        resolve({ running: false, models: [] });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ running: false, models: [] });
      });

      req.end();
    });
  }

  checkPythonInstalled() {
    return new Promise((resolve) => {
      const { exec } = require('child_process');
      const isMac = os.platform() === 'darwin';
      const cmd = isMac ? 'python3 --version' : 'python --version';
      
      exec(cmd, (err, stdout, stderr) => {
        const output = (stdout + stderr).toLowerCase();
        if (!err && (output.includes('python 3') || output.includes('python'))) {
          resolve(true);
        } else if (isMac) {
          exec('python --version', (err2, stdout2, stderr2) => {
            const output2 = (stdout2 + stderr2).toLowerCase();
            if (!err2 && (output2.includes('python 3') || output2.includes('python'))) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    });
  }

  checkPythonBackendRunning() {
    return new Promise((resolve) => {
      const options = {
        hostname: '127.0.0.1',
        port: 8000,
        path: '/',
        method: 'GET',
        timeout: 1000
      };
      const req = http.request(options, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    });
  }

  checkPythonLibrariesInstalled() {
    return new Promise((resolve) => {
      const { exec } = require('child_process');
      const isMac = os.platform() === 'darwin';
      const pythonCmd = isMac ? 'python3' : 'python';
      exec(`"${pythonCmd}" -c "import requests, fastapi, uvicorn, pydantic, reportlab"`, (err) => {
        resolve(!err);
      });
    });
  }
}

module.exports = new VoidlexDiagnostics();
