#!/bin/bash
# 🔄 GitHub ↔ iCloud 동기화 스크립트
# 사용법: ./sync.sh [push|pull|status]

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}  📚 행정법 암기전략앱 동기화 도구${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

case "${1:-auto}" in
  push)
    echo -e "${YELLOW}📤 로컬 → GitHub Push${NC}"
    git add -A
    git commit -m "update: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo -e "${GREEN}✅ 변경사항 없음${NC}"
    git push origin main
    echo -e "${GREEN}✅ Push 완료!${NC}"
    ;;
  pull)
    echo -e "${YELLOW}📥 GitHub → 로컬 Pull${NC}"
    git pull origin main
    echo -e "${GREEN}✅ Pull 완료! iCloud를 통해 iPad에 자동 동기화됩니다.${NC}"
    ;;
  status)
    echo -e "${YELLOW}📊 현재 상태${NC}"
    git status
    echo ""
    echo -e "${BLUE}🌐 GitHub Pages: https://leodin0717.github.io/exam-memorization-app/${NC}"
    ;;
  auto)
    echo -e "${YELLOW}🔄 자동 동기화 (Pull → 변경감지 → Push)${NC}"
    echo ""
    # 1. Pull
    echo -e "${BLUE}Step 1: GitHub에서 최신 변경사항 가져오기...${NC}"
    git pull origin main --rebase 2>/dev/null || git pull origin main
    echo ""
    # 2. Check & Push
    if [ -n "$(git status --porcelain)" ]; then
      echo -e "${BLUE}Step 2: 로컬 변경사항 Push...${NC}"
      git add -A
      git commit -m "sync: $(date '+%Y-%m-%d %H:%M')"
      git push origin main
      echo ""
      echo -e "${GREEN}✅ 동기화 완료! 변경사항이 Push되었습니다.${NC}"
    else
      echo -e "${GREEN}✅ 이미 최신 상태입니다.${NC}"
    fi
    echo ""
    echo -e "${BLUE}🌐 웹앱 URL: https://leodin0717.github.io/exam-memorization-app/${NC}"
    echo -e "${BLUE}📱 iPad에서 위 URL로 접속하세요!${NC}"
    ;;
  *)
    echo "사용법: ./sync.sh [push|pull|status|auto]"
    echo "  auto   - 자동 동기화 (기본값)"
    echo "  push   - 로컬 변경사항을 GitHub에 Push"
    echo "  pull   - GitHub 변경사항을 로컬로 Pull"
    echo "  status - 현재 상태 확인"
    ;;
esac
echo ""
