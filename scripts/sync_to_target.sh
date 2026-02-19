#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <target-directory>" >&2
  exit 1
fi

TARGET_DIR="$1"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "$TARGET_DIR"

if command -v rsync >/dev/null 2>&1; then
  rsync -av --delete \
    --exclude='.git/' \
    --exclude='node_modules/' \
    --exclude='.DS_Store' \
    "$SOURCE_DIR/" "$TARGET_DIR/"
else
  echo "rsync not found. Using fallback copy strategy..."

  if [[ -d "$TARGET_DIR" ]]; then
    find "$TARGET_DIR" -mindepth 1 -maxdepth 1 \
      ! -name '.git' \
      ! -name 'node_modules' \
      -exec rm -rf {} +
  fi

  cp -a "$SOURCE_DIR/." "$TARGET_DIR/"
  rm -rf "$TARGET_DIR/.git" "$TARGET_DIR/node_modules"
  find "$TARGET_DIR" -name '.DS_Store' -delete
fi

echo "Sync complete: $SOURCE_DIR -> $TARGET_DIR"
