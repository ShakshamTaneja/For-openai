#!/bin/bash

# Move to the project root directory
CD_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$CD_DIR"

echo "========================================================="
echo "   VOIDLEX LOCAL AI LEGAL INTELLIGENCE ENGINE LAUNCHER   "
echo "========================================================="
echo ""

# 1. Force kill any duplicate or stale background processes to prevent port conflicts
echo "[1/4] Pre-cleaning ports and stale threads..."
killall "VOIDLEX Local AI Legal Intelligence Engine" 2>/dev/null || true
pkill -f -i voidlex 2>/dev/null || true
echo "Clean complete."
echo ""

# 2. Verify Node/NPM are installed
echo "[2/4] Verifying local package runtime..."
if ! command -v npm &> /dev/null
then
    echo "ERROR: Node.js/NPM is not installed on this machine."
    echo "Please download and install Node.js from https://nodejs.org/"
    echo "Then re-run this launcher."
    read -p "Press Enter to exit..."
    exit 1
fi
echo "Node/NPM verified."
echo ""

# 3. Check and install dependencies
echo "[3/4] Installing desktop engine package dependencies (if missing)..."
if [ ! -d "node_modules" ]; then
    npm install
else
    # Quick integrity check
    npm install --no-audit --no-fund --quiet
fi
echo "Dependencies checked and ready."
echo ""

# 4. Boot the complete app in Developer mode
echo "[4/4] Launching VOIDLEX Legal Engine..."
echo "---------------------------------------------------------"
npm run start
