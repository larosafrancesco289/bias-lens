#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "Installing dependencies"
npm install

echo "Installing Playwright Chromium"
npx --yes playwright install chromium

echo "Done"


