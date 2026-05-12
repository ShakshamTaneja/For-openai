const { spawn } = require('child_process');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

class VoidlexInstaller {
  constructor() {
    this.downloadRequest = null;
    this.pullRequest = null;
  }

  // 1. Download and run Ollama Setup installer
  downloadOllama(onProgress, onComplete, onError) {
    const isMac = process.platform === 'darwin';
    const installerUrl = isMac
      ? 'https://ollama.com/download/Ollama-darwin.zip'
      : 'https://ollama.com/download/OllamaSetup.exe';
    const tempDir = os.tmpdir();
    const savePath = path.join(tempDir, isMac ? 'Ollama-darwin.zip' : 'OllamaSetup.exe');

    console.log(`[Installer] Downloading Ollama from ${installerUrl} to ${savePath}`);
    const file = fs.createWriteStream(savePath);
    
    this.downloadRequest = https.get(installerUrl, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        https.get(response.headers.location, (redirectResponse) => {
          this._pipeDownloadStream(redirectResponse, file, savePath, onProgress, onComplete, onError);
        }).on('error', (err) => {
          fs.unlinkSync(savePath);
          onError(err.message);
        });
      } else {
        this._pipeDownloadStream(response, file, savePath, onProgress, onComplete, onError);
      }
    });

    this.downloadRequest.on('error', (err) => {
      file.close();
      if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
      onError(err.message);
    });
  }

  _pipeDownloadStream(response, file, savePath, onProgress, onComplete, onError) {
    const totalBytes = parseInt(response.headers['content-length'], 10) || 0;
    let downloadedBytes = 0;

    response.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (totalBytes > 0) {
        const percent = Math.round((downloadedBytes / totalBytes) * 100);
        onProgress(percent);
      }
    });

    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log('[Installer] Ollama Download Complete. Running setup...');
      this.runOllamaSetup(savePath, onComplete, onError);
    });

    file.on('error', (err) => {
      fs.unlinkSync(savePath);
      onError(err.message);
    });
  }

  runOllamaSetup(installerPath, onComplete, onError) {
    console.log(`[Installer] Spawning installer process: ${installerPath}`);
    try {
      const isMac = process.platform === 'darwin';
      if (isMac) {
        const extractDir = '/Applications';
        console.log(`[Installer] Extracting Ollama-darwin.zip to ${extractDir}...`);
        
        const unzip = spawn('unzip', ['-o', installerPath, '-d', extractDir]);
        
        unzip.on('close', (code) => {
          if (code === 0) {
            console.log('[Installer] Unzip complete. Launching Ollama.app...');
            const launch = spawn('open', ['-a', 'Ollama']);
            launch.on('close', () => {
              onComplete();
            });
          } else {
            const fallbackDir = path.join(os.homedir(), 'Applications');
            if (!fs.existsSync(fallbackDir)) {
              fs.mkdirSync(fallbackDir, { recursive: true });
            }
            console.log(`[Installer] Extraction to /Applications failed (code ${code}). Trying ${fallbackDir}...`);
            const unzipFallback = spawn('unzip', ['-o', installerPath, '-d', fallbackDir]);
            unzipFallback.on('close', (fallbackCode) => {
              if (fallbackCode === 0) {
                const launchFallback = spawn('open', [path.join(fallbackDir, 'Ollama.app')]);
                launchFallback.on('close', () => onComplete());
              } else {
                onError(`Failed to extract Ollama: unzip exited with code ${fallbackCode}`);
              }
            });
          }
        });
        
        unzip.on('error', (err) => {
          onError(`Failed to start unzip: ${err.message}`);
        });
      } else {
        const setup = spawn(installerPath, [], { detached: true, stdio: 'ignore' });
        setup.on('error', (err) => {
          console.error('[Installer] Ollama setup launch error:', err);
          onError(err.message);
        });
        setup.unref();

        // Give installer some seconds to launch, then complete
        setTimeout(() => {
          onComplete();
        }, 5000);
      }
    } catch (err) {
      console.error('[Installer] Sync exception launching Ollama setup:', err);
      onError(err.message);
    }
  }

  // 2. Start local Ollama service background process
  startOllamaService() {
    return new Promise((resolve) => {
      const isMac = process.platform === 'darwin';
      
      if (isMac) {
        const paths = [
          '/Applications/Ollama.app/Contents/Resources/bin/ollama',
          path.join(os.homedir(), 'Applications', 'Ollama.app', 'Contents/Resources/bin/ollama'),
          '/usr/local/bin/ollama',
          '/opt/homebrew/bin/ollama'
        ];
        
        let exePath = '';
        for (const p of paths) {
          if (fs.existsSync(p)) {
            exePath = p;
            break;
          }
        }
        
        if (exePath) {
          console.log(`[Installer] Starting Ollama executable on macOS: ${exePath}`);
          try {
            if (exePath.includes('Ollama.app')) {
              const appPath = exePath.split('.app')[0] + '.app';
              console.log(`[Installer] Opening app bundle: ${appPath}`);
              const proc = spawn('open', ['-g', appPath], { stdio: 'ignore' });
              proc.on('error', (err) => {
                console.error('[Installer] Error launching Ollama app bundle via open:', err);
              });
            } else {
              const proc = spawn(exePath, ['serve'], { detached: true, stdio: 'ignore' });
              proc.on('error', (err) => {
                console.error('[Installer] Error launching Ollama executable:', err);
              });
              proc.unref();
            }
            
            setTimeout(() => {
              resolve(true);
            }, 3000);
          } catch (err) {
            console.error('[Installer] Exception launching Ollama executable:', err);
            resolve(false);
          }
        } else {
          try {
            console.log('[Installer] Spawning global ollama service command on macOS');
            const proc = spawn('ollama', ['serve'], { detached: true, stdio: 'ignore' });
            proc.on('error', (err) => {
              console.error('[Installer] Global ollama command not found or failed to launch:', err);
              resolve(false);
            });
            proc.unref();
            setTimeout(() => resolve(true), 3000);
          } catch (e) {
            console.error('[Installer] Sync exception spawning global ollama command:', e);
            resolve(false);
          }
        }
      } else {
        const appData = path.join(os.homedir(), 'AppData', 'Local', 'Programs', 'Ollama', 'ollama.exe');
        const progFiles = path.join('C:', 'Program Files', 'Ollama', 'ollama.exe');
        let exePath = '';

        if (fs.existsSync(appData)) exePath = appData;
        else if (fs.existsSync(progFiles)) exePath = progFiles;
        
        if (exePath) {
          console.log(`[Installer] Starting Ollama executable: ${exePath}`);
          try {
            const process = spawn(exePath, [], { detached: true, stdio: 'ignore' });
            process.on('error', (err) => {
              console.error('[Installer] Error launching Ollama executable:', err);
              resolve(false);
            });
            process.unref();
            
            // Wait 3 seconds for service to bind to 11434
            setTimeout(() => {
              resolve(true);
            }, 3000);
          } catch (err) {
            console.error('[Installer] Exception launching Ollama executable:', err);
            resolve(false);
          }
        } else {
          // Fallback: try executing raw command on systems path
          try {
            console.log('[Installer] Spawning global ollama service command');
            const process = spawn('ollama', ['serve'], { detached: true, stdio: 'ignore' });
            process.on('error', (err) => {
              console.error('[Installer] Global ollama command not found or failed to launch:', err);
              resolve(false);
            });
            process.unref();
            setTimeout(() => resolve(true), 3000);
          } catch (e) {
            console.error('[Installer] Sync exception spawning global ollama command:', e);
            resolve(false);
          }
        }
      }
    });
  }

  // 3. Pull or Create required model with live progress
  pullModel(modelName, onProgress, onComplete, onError) {
    console.log(`[Installer] Building or pulling model: ${modelName}`);
    
    // If the model is 'voidlex', we create it locally from the backend Modelfile!
    if (modelName === 'voidlex') {
      console.log('[Installer] Creating custom voidlex model from local Modelfile...');
      
      let modelfileContent = '';
      try {
        const { app } = require('electron');
        const appPath = app.getAppPath();
        const baseDir = appPath.endsWith('app.asar') ? appPath + '.unpacked' : appPath;

        const possiblePaths = [
          path.join(baseDir, 'backend', 'Modelfile'),
          path.join(__dirname, '..', '..', 'backend', 'Modelfile'),
          path.join(__dirname, '..', 'backend', 'Modelfile'),
          path.join(__dirname, 'backend', 'Modelfile'),
          'd:\\OneDrive_2026-05-09\\void lex\\legal-voidlex-desktop\\backend\\Modelfile'
        ];
        let foundPath = null;
        for (const p of possiblePaths) {
          if (fs.existsSync(p)) {
            foundPath = p;
            break;
          }
        }
        if (foundPath) {
          modelfileContent = fs.readFileSync(foundPath, 'utf8');
          console.log(`[Installer] Found Modelfile at: ${foundPath}`);
        } else {
          throw new Error('Modelfile not found in any possible paths.');
        }
      } catch (e) {
        console.error('[Installer] Error reading Modelfile, using inline fallback:', e);
        modelfileContent = `FROM llama3.2:latest\nSYSTEM "You are VOIDLEX, an elite strategic legal intelligence engine operating exclusively for Imperial Eminence Cyberguard Corporation (IECC)."` ;
      }

      const postData = JSON.stringify({ name: 'voidlex', modelfile: modelfileContent, stream: true });
      const options = {
        hostname: '127.0.0.1',
        port: 11434,
        path: '/api/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      this.pullRequest = http.request(options, (res) => {
        res.setEncoding('utf8');
        
        let buffer = '';
        res.on('data', (chunk) => {
          buffer += chunk;
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (line.trim() === '') continue;
            try {
              const data = JSON.parse(line);
              
              if (data.status) {
                // If Ollama automatically pulls base model, show progress
                if (data.status.includes('downloading') && data.total) {
                  const completed = data.completed || 0;
                  const total = data.total;
                  const percent = Math.round((completed / total) * 100);
                  onProgress(percent, `Downloading base weights: ${percent}%`);
                } else {
                  onProgress(0, data.status);
                }
              }
            } catch (e) {
              console.error('[Create stream JSON parse error]', e, line);
            }
          }
        });

        res.on('end', () => {
          console.log('[Installer] Model create API connection closed.');
          onComplete();
        });
      });

      this.pullRequest.on('error', (err) => {
        console.error('[Installer] Model create request failed:', err);
        onError(err.message);
      });

      this.pullRequest.write(postData);
      this.pullRequest.end();
      return;
    }

    // Fallback standard pulling for other models
    const postData = JSON.stringify({ name: modelName, stream: true });
    const options = {
      hostname: '127.0.0.1',
      port: 11434,
      path: '/api/pull',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    this.pullRequest = http.request(options, (res) => {
      res.setEncoding('utf8');
      
      let buffer = '';
      res.on('data', (chunk) => {
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim() === '') continue;
          try {
            const data = JSON.parse(line);
            if (data.status === 'downloading' && data.total) {
              const completed = data.completed || 0;
              const total = data.total;
              const percent = Math.round((completed / total) * 100);
              onProgress(percent, `Downloading weights: ${percent}%`);
            } else if (data.status) {
              onProgress(0, data.status);
            }
          } catch (e) {
            console.error('[Pull stream JSON parse error]', e, line);
          }
        }
      });

      res.on('end', () => {
        console.log('[Installer] Model Pull API connection closed.');
        onComplete();
      });
    });

    this.pullRequest.on('error', (err) => {
      console.error('[Installer] Model pull request failed:', err);
      onError(err.message);
    });

    this.pullRequest.write(postData);
    this.pullRequest.end();
  }

  downloadPython(onProgress, onComplete, onError) {
    const isMac = process.platform === 'darwin';
    const pythonUrl = isMac
      ? 'https://www.python.org/ftp/python/3.11.8/python-3.11.8-macos11.pkg'
      : 'https://www.python.org/ftp/python/3.11.8/python-3.11.8-amd64.exe';
    const tempDir = os.tmpdir();
    const savePath = path.join(tempDir, isMac ? 'python-3.11.8-macos11.pkg' : 'python-3.11.8-amd64.exe');

    console.log(`[Installer] Downloading Python from ${pythonUrl} to ${savePath}`);
    const file = fs.createWriteStream(savePath);
    
    this.downloadRequest = https.get(pythonUrl, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          this._pipePythonDownload(res, file, savePath, onProgress, onComplete, onError);
        }).on('error', (err) => {
          fs.unlinkSync(savePath);
          onError(err.message);
        });
      } else {
        this._pipePythonDownload(response, file, savePath, onProgress, onComplete, onError);
      }
    });

    this.downloadRequest.on('error', (err) => {
      file.close();
      if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
      onError(err.message);
    });
  }

  _pipePythonDownload(response, file, savePath, onProgress, onComplete, onError) {
    const totalBytes = parseInt(response.headers['content-length'], 10) || 0;
    let downloadedBytes = 0;

    response.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (totalBytes > 0) {
        const percent = Math.round((downloadedBytes / totalBytes) * 100);
        onProgress(percent);
      }
    });

    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log('[Installer] Python Download Complete. Starting silent installation...');
      this.runPythonSetup(savePath, onComplete, onError);
    });

    file.on('error', (err) => {
      if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
      onError(err.message);
    });
  }

  runPythonSetup(installerPath, onComplete, onError) {
    const isMac = process.platform === 'darwin';
    if (isMac) {
      console.log(`[Installer] Launching macOS Python package installer: ${installerPath}`);
      const setup = spawn('open', [installerPath]);
      setup.on('close', (code) => {
        console.log(`[Installer] macOS package installer open exited with code ${code}`);
        onComplete();
      });
      setup.on('error', (err) => {
        onError(err.message);
      });
    } else {
      console.log(`[Installer] Installing Python silently: ${installerPath}`);
      const setup = spawn(installerPath, ['/quiet', 'InstallAllUsers=1', 'PrependPath=1', 'Include_test=0'], {
        detached: true,
        stdio: 'ignore'
      });
      setup.on('close', (code) => {
        console.log(`[Installer] Python silent installer exited with code ${code}`);
        onComplete();
      });
      setup.on('error', (err) => {
        onError(err.message);
      });
    }
  }

  cancelActiveActions() {
    if (this.downloadRequest) {
      this.downloadRequest.destroy();
      this.downloadRequest = null;
    }
    if (this.pullRequest) {
      this.pullRequest.destroy();
      this.pullRequest = null;
    }
  }
}

module.exports = new VoidlexInstaller();
