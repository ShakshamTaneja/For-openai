const { spawn } = require('child_process');
const http = require('http');

// Start Vite dev server
const vite = spawn('npx', ['vite'], { shell: true });

vite.stdout.on('data', (data) => {
  console.log(`[Vite] ${data}`);
});

vite.stderr.on('data', (data) => {
  console.error(`[Vite Error] ${data}`);
});

// Helper to wait for dev server port to open
const waitForVite = () => {
  const req = http.request({ host: 'localhost', port: 5173, timeout: 1000 }, (res) => {
    console.log('[Dev Script] Vite is live! Starting Electron...');
    
    // Start Electron
    const electron = spawn('npx', ['electron', '.'], { shell: true });

    electron.stdout.on('data', (data) => {
      console.log(`[Electron] ${data}`);
    });

    electron.stderr.on('data', (data) => {
      console.error(`[Electron Error] ${data}`);
    });

    electron.on('close', (code) => {
      console.log('[Dev Script] Electron closed. Exiting Vite...');
      vite.kill();
      process.exit(code);
    });
  });

  req.on('error', () => {
    setTimeout(waitForVite, 300); // Poll every 300ms
  });

  req.end();
};

waitForVite();
