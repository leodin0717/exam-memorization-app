# iCloud 폴더 동기화 가이드

Codex 작업 환경의 `/workspace/exam-memorization-app`는 로컬 iCloud 폴더와 자동으로 연결되지 않을 수 있습니다.

아래 명령으로 현재 저장소 내용을 iCloud 폴더로 반영하세요.

```bash
cd /workspace/exam-memorization-app
./scripts/sync_to_target.sh "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents by Readdle/나를믿는사람들을위해/exam-memorization-app"
```

## 확인 방법

```bash
# iCloud 폴더 파일 확인
ls "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents by Readdle/나를믿는사람들을위해/exam-memorization-app"

# 변경 반영 여부 확인(예시)
cat "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents by Readdle/나를믿는사람들을위해/exam-memorization-app/script.js" | head
```
