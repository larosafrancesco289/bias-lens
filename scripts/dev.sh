#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

if [ ! -f .env.local ]; then
  echo ".env.local not found. Copying from env.example"
  cp env.example .env.local
  echo "Please edit .env.local and set OPENAI_API_KEY"
fi

npm run dev


