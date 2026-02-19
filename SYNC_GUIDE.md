# Sync Guide

첨부하신 Finder 경로(이미지 기준) 순서를 그대로 반영한 동기화 안내입니다.

- 위치: `Documents > Inbox > exam-memorization-app > 나를믿는사람들을위해`
- 실제 경로: `$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents/Inbox/exam-memorization-app/나를믿는사람들을위해`

## 1) 동기화 실행

```bash
cd /workspace/exam-memorization-app
./scripts/sync_to_target.sh "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents/Inbox/exam-memorization-app/나를믿는사람들을위해"
```

## 2) 반영 확인

아래 명령으로 대상 폴더에 주요 파일이 복사되었는지 확인합니다.

```bash
TARGET="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents/Inbox/exam-memorization-app/나를믿는사람들을위해"
ls -la "$TARGET"
test -f "$TARGET/index.html" && echo "SYNC_OK"
```

## 3) 주의사항

- 스크립트는 `.git`, `node_modules`, `.DS_Store`를 제외하고 동기화합니다.
- `rsync`가 있으면 `--delete`로 미러링하고, 없으면 fallback 복사를 수행합니다.
- 대상 경로를 바꿀 경우 인자만 교체하면 됩니다.
