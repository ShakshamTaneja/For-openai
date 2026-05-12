#!/bin/bash
# Move to the folder where this script is located
cd "$(dirname "$0")"

clear
echo -e "\033[1;33m========================================================="
echo -e "         VOIDLEX INTEL MAC BYPASS LAUNCHER"
echo -e "=========================================================\033[0m"
echo "This script bypasses macOS Gatekeeper blocks on Intel Macs"
echo "by stripping internet quarantine flags. Run this once."
echo ""

# Strip quarantine recursively
echo "⚙️  Authorizing VOIDLEX Local AI Legal Intelligence Engine..."
xattr -cr "VOIDLEX Local AI Legal Intelligence Engine.app" 2>/dev/null
xattr -cr "/Applications/VOIDLEX Local AI Legal Intelligence Engine.app" 2>/dev/null

echo "🚀 Launching VOIDLEX..."
open -a "VOIDLEX Local AI Legal Intelligence Engine" 2>/dev/null || open "VOIDLEX Local AI Legal Intelligence Engine.app" 2>/dev/null

echo -e "\033[1;32mDone! You can now double-click the app directly in the future.\033[0m"
exit 0
