---
name: feedback_review-before-commit
description: "커밋/푸시 요청을 받으면 반드시 먼저 코드 리뷰(/code-review)를 거친다 — 리뷰 대상이 설정·문서뿐이어도 생략하지 않는다"
metadata:
  type: feedback
---

2026-10-23, "커밋/푸쉬해줘" 요청에 리뷰 없이 바로 커밋/푸시했다(변경이 `.mcp.json`·`CLAUDE.md`뿐이라
리뷰할 코드가 없다고 스스로 판단). 사용자가 "커밋/푸쉬 전에 코드 리뷰 필수 규칙이 있는 걸 못 봤냐"고
짚었고, 당시엔 그런 규칙이 어디에도 없었으므로 이후 CLAUDE.md에 명시 규칙으로 추가했다.

**Why**: 사용자는 커밋 전 리뷰를 기본 절차로 기대한다. 변경 규모·종류로 생략 여부를 AI가 정하길 원하지 않는다.

**How to apply**: 커밋/푸시 요청 시 `git commit` 전에 `/code-review` 스킬(또는 `code-reviewer` 에이전트)을 먼저 실행하고,
지적 사항을 반영하거나 보고한 뒤 커밋한다. [[feedback_commit-all-means-literal]]의 "큐레이션 없이 전부 스테이지"와는
별개로 적용된다(무엇을 커밋할지와 리뷰 여부는 다른 문제).
