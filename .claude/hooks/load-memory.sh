#!/usr/bin/env bash
# SessionStart 훅
# .claude/memory/ 의 노트를 세션 시작 시 컨텍스트로 주입한다.
# (memory 디렉터리는 자동 로드되지 않으므로 이 훅이 다리 역할을 한다)

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MEM="$ROOT/.claude/memory"

[ -d "$MEM" ] || exit 0

content="$(cat "$MEM"/*.md 2>/dev/null)"
[ -n "$content" ] || exit 0

jq -n --arg c "$content" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: ("프로젝트 메모리(.claude/memory/):\n" + $c)
  }
}'
