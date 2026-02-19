# Sync Guide

리포지토리에서 수정한 내용이 사용자 로컬 폴더(예: iCloud Drive)로 실제 반영되도록 아래 순서대로 동기화하세요.

## 1) 동기화 실행

```bash
cd /workspace/exam-memorization-app
./scripts/sync_to_target.sh "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents by Readdle/나를믿는사람들을위해/exam-memorization-app"
```

## 2) 반영 확인

아래 명령으로 대상 폴더에 주요 파일이 복사되었는지 확인할 수 있습니다.

```bash
TARGET="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents by Readdle/나를믿는사람들을위해/exam-memorization-app"
ls -la "$TARGET"
test -f "$TARGET/index.html" && echo "SYNC_OK"
```

## 3) 주의사항

- 스크립트는 `.git`, `node_modules`, `.DS_Store`를 제외하고 동기화합니다.
- `rsync`가 있으면 `--delete`로 미러링하고, 없으면 fallback 복사를 수행합니다.
- 대상 경로를 바꾸고 싶다면 인자로 전달하는 경로만 변경하면 됩니다.
