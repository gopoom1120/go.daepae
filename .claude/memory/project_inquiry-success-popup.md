---
name: project-inquiry-success-popup
description: 문의 접수 완료 팝업(InquirySuccess.tsx) 구조와 함정 — 어두운 섹션 안에서 렌더되면 --text 가 밝은색이라 글자가 안 보임, 인라인/스티키 폼도 같은 팝업을 띄움
metadata:
  type: project
---

2026-10-23, 문의 전송 성공 시 버튼 글자만 바뀌어 사용자가 성공을 못 알아챈다는 피드백으로
접수 완료 팝업을 추가했다. `src/components/inquiry/InquirySuccess.tsx` 의 `InquirySuccessContent`
(본문)를 Bottom Sheet 내부 오버레이와 `InquirySuccessModal`(인라인 폼·스티키 바용 중앙 팝업)이
공유하고, 완료 상태(`done`/`dismiss`)는 `useInquirySubmit` 훅이 들고 있다. 문의 버튼 문구는
"문의하기" 하나로 통일했다(헤더·히어로·창업비용·FAB·시트/인라인/스티키 제출 버튼).

**Why:** 05 매장위치 인라인 폼 안에서 렌더되는 팝업은 어두운 섹션 스코프(`--text` 가 밝은 베이지로
재선언) 안에 있어, `var(--text)` 를 쓴 완료 문구가 흰 카드 위에서 안 보이는 회귀가 났다. 같은 이유로
전역 `input` 글자색도 흰 입력칸 위에서 안 보였다(`#111` 로 고정). [[feedback_css-specificity-scoped-vs-global]] 와 같은 계열.

**How to apply:** 흰 배경 카드/입력칸을 다크 섹션 자손으로 렌더하는 새 UI는 `--text`/`--text-dim` 대신
색을 직접 지정하거나 스코프를 다시 뒤집는다. 시트 안 드롭다운은 `position: static` 으로 흐름 안에
펼쳐 하단 고정 제출 버튼과 겹치지 않게 했다 — absolute 로 되돌리지 않는다.
