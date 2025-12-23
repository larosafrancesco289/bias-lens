#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "Installing dependencies"
bun install

echo "Installing Playwright Chromium"
bunx --yes playwright install chromium

echo "Done"