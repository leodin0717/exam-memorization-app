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
cat "$TARGET/.sync-meta.txt"
```

## 3) 앱 화면에서 즉시 확인하는 방법

앱 하단에 `앱 반영 확인 코드: sync-check-2026-02-19-v2`가 보이면 최신 파일이 열린 것입니다.

## 4) 계속 반영이 안 보일 때 점검

- 다른 폴더의 `index.html`을 열고 있을 가능성이 큽니다.
- iPad/Documents 앱에서 현재 열려 있는 파일의 경로가 위 TARGET과 정확히 같은지 확인하세요.
- 필요 시 아래로 동일 이름 파일 위치를 찾은 뒤, 올바른 폴더의 파일을 다시 여세요.

```bash
find "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents" -name 'index.html'
```

## 5) 주의사항

- 스크립트는 `.git`, `node_modules`, `.DS_Store`를 제외하고 동기화합니다.
- `rsync`가 있으면 `--delete`로 미러링하고, 없으면 fallback 복사를 수행합니다.
- 동기화 후 `index.html` 해시를 자동 검증하고 `.sync-meta.txt`를 기록합니다.
