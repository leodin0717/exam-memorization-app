#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "사용법: $0 <동기화_대상_폴더_경로>"
  exit 1
fi

SRC_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DST_DIR="$1"

mkdir -p "$DST_DIR"

if command -v rsync >/dev/null 2>&1; then
  rsync -av --delete \
    --exclude='.git' \
    --exclude='node_modules' \
    "$SRC_DIR/" "$DST_DIR/"
else
  find "$DST_DIR" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
  cp -a "$SRC_DIR/." "$DST_DIR/"
  rm -rf "$DST_DIR/.git"
fi

echo "동기화 완료: $SRC_DIR -> $DST_DIR"
