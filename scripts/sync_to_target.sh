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

if [[ -f "$SOURCE_DIR/index.html" && -f "$TARGET_DIR/index.html" ]]; then
  SRC_HASH="$(sha256sum "$SOURCE_DIR/index.html" | awk '{print $1}')"
  DST_HASH="$(sha256sum "$TARGET_DIR/index.html" | awk '{print $1}')"
  if [[ "$SRC_HASH" != "$DST_HASH" ]]; then
    echo "[ERROR] index.html hash mismatch after sync" >&2
    echo "  source: $SRC_HASH" >&2
    echo "  target: $DST_HASH" >&2
    exit 2
  fi
fi

COMMIT_SHA="$(git -C "$SOURCE_DIR" rev-parse --short HEAD 2>/dev/null || echo 'no-git')"
SYNC_TIME="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
cat > "$TARGET_DIR/.sync-meta.txt" <<META
source_dir=$SOURCE_DIR
target_dir=$TARGET_DIR
commit=$COMMIT_SHA
synced_at_utc=$SYNC_TIME
META

echo "Sync complete: $SOURCE_DIR -> $TARGET_DIR"
echo "Verification: index.html hash matched"
echo "Meta file: $TARGET_DIR/.sync-meta.txt"
