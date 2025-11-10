#!/bin/bash

# The Turkish Chromium - Startup Script
# This script will install dependencies and start the browser

echo "=========================================="
echo "  The Turkish Chromium Browser"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    yarn install
    echo ""
fi

echo "🚀 Starting The Turkish Chromium..."
echo ""
echo "Press Ctrl+C to stop the browser"
echo ""

# Start the browser
yarn start
