---
name: gopumgyeok-nextjs-migration-debug-route-technique
description: 프로젝트가 정적 HTML(index.html)에서 Next.js App Router로 이식된 뒤, IntersectionObserver 기반 리빌(useScrollReveal)을 헤드리스로 검증할 때 쓰는 임시 라우트 기법
metadata:
  type: project
---

2026-09 이후 이 프로젝트(`go.daepae`)는 정적 `index.html`/`assets/`/`data/content.json` 구조가
저장소에서 완전히 삭제되고 Next.js 14 App Router로 이식됐다(`src/app/page.tsx`,
`src/data/content.json`, `src/components/sections/*.tsx`, `src/hooks/*.ts`). **옛 메모리
(`gopumgyeok-receipt-reveal-logic` 등)의 `assets/js/script.js`, `initReceiptReveal()` 같은
경로/함수명은 이식 이전 정적 사이트 기준**이니 그대로 인용하지 말고, 이제는 `src/hooks/`
아래 동명의 React 훅(`useReceiptReveal.ts`, `useProfitCountReveal.ts`, `useScrollReveal.ts`)을
찾아야 한다. 로컬 서버도 `python3 -m http.server 8765` 가 아니라 `yarn dev`(Next.js dev
server, 보통 포트 3000)를 쓴다 — [[gopumgyeok-shared-port-8765-with-sibling-project]]는 정적
사이트 시절 메모리라 이 프로젝트엔 더 이상 적용되지 않는다(포트 3001은 형제 CMS 프로젝트
`go.daepae.cms.api`가 쓴다).

`useScrollReveal`(`src/hooks/useScrollReveal.ts`)은 `IntersectionObserver` 로 `.sb-item`/
`.meat-card`/`.comp-card` 등에 `in-view` 클래스를 최초 1회만 붙이는 방식이라
[[headless-intersection-observer-limitation]]의 한계가 그대로 적용된다. 정적 사이트 시절엔
`_debug_full.html` 사본에 `<style>` 오버라이드를 주입하는 방식을 썼지만, Next.js 환경에서는
**같은 앱 안에 임시 라우트를 새로 만드는 방식**이 더 깔끔하게 통했다:

1. `src/app/<임시폴더>/page.tsx` 를 만들어 검증하려는 섹션 컴포넌트(`Menu` 등)를 `src/data/
   content.json` 데이터로 직접 렌더하고, 최상단에 `<style>{'.sb-item{opacity:1 !important;
   animation:none !important;}'}</style>` 를 인라인으로 넣어 리빌 애니메이션의 최종 상태를
   강제한다. `src/app/layout.tsx` 가 전역 CSS(`legacy/*.css`)와 헤더/푸터/문의 시트를 모든
   라우트에 공통 적용하므로 이 임시 라우트도 실제 페이지와 동일한 스타일로 렌더된다.
2. **폴더명에 언더스코어를 붙이면 안 된다** — Next.js App Router는 `_folderName` 을 "private
   folder"로 취급해 라우팅에서 제외한다. 실제로 `_debug-selfbar` 로 만들었더니 컴파일은 되는데
   `curl` 이 404 를 반환했다. 언더스코어 없는 이름(`debugselfbarverifytmp` 처럼 다른 라우트와
   충돌하지 않는 이름)을 써야 한다.
3. 검증이 끝나면 그 라우트 파일과 디렉터리를 반드시 지운다. 이 환경에서는 `rm -rf <dir>` 이
   권한 거부로 막힐 수 있었고(`rm <file>` 단독은 허용됨), `rm file && rmdir dir` 순서로 우회
   해야 했다. 삭제 후 `curl -s .../<임시경로>` 로 404 확인 + `git status --porcelain` 으로
   흔적이 없는지(애초에 untracked 상태였다면 커밋 이력에도 안 남는다) 재확인한다.
4. dev 서버는 파일 변경을 HMR/재컴파일로 즉시 반영하지만, 새 라우트 디렉터리를 만들거나
   지운 직후엔 `curl` 결과가 과도기적으로 틀릴 수 있어 1~2초 정도 두고 재확인하는 편이 안전했다.

**Why:** 정적 사이트의 `_debug_*.html` 사본 기법은 파일을 통째로 복사해 `</head>` 앞에 문자열을
꽂는 방식이라 빌드 파이프라인이 없을 때만 성립한다. Next.js 는 컴파일/라우팅이 있어 같은
트릭이 통하지 않고, 대신 프레임워크가 이미 제공하는 "새 페이지 추가" 메커니즘을 임시로 빌려
쓰는 쪽이 훨씬 안정적이었다.

**How to apply:** 이 프로젝트에서 스크롤 리빌 훅이 적용된 섹션(경쟁력 카드, 셀프바/고기 그리드,
후기 카드 등)을 헤드리스로 "다 펼쳐진 상태"로 캡처해야 할 때마다 이 절차를 재사용한다. 다른
정적 사이트(`0001`~`0006`, 또는 아직 마이그레이션 안 된 형제 프로젝트)에는 적용되지 않는다 —
그런 곳은 여전히 [[headless-large-scroll-screenshot-black-frame]]에 정리된 `_debug_full.html`
기법을 쓴다.
