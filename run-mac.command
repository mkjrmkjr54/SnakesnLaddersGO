#!/bin/bash
set -e
cd "$(dirname "$0")"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Install Node.js 18+ (recommended 20 LTS) and rerun this script."
  exit 1
fi

echo "Installing dependencies..."
npm install

echo "Starting dev server..."
npm run dev
