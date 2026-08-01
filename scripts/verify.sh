#!/usr/bin/env bash

set -euo pipefail

echo
echo "========================================"
echo "Engineering OS Verification"
echo "========================================"

echo
echo "==> Formatting"
npm run format

echo
echo "==> Lint & TypeScript"
npm run check

echo
echo "==> Tests"
npm test

echo
echo "==> Build"
npm run build

echo
echo "========================================"
echo "✅ Verification successful"
echo "========================================"
