# go.daepae — Next.js 환경 세팅 (기술스택 전환 1단계)

## Context

`go.daepae`는 지금까지 빌드 도구 없는 정적 파일(`index.html` + `assets/` + `data/content.json`)로만 구성된 랜딩페이지였다. 사용자는 이 프론트엔드의 기술스택 전체를 형제 프로젝트 `go.daepae.cms.api`(고품격대패 프랜차이즈 CMS 어드민 백오피스, Next.js 14 App Router 기반)와 동일하게 맞추기로 했다 — 두 프로젝트가 결국 같은 백엔드(CMS API)를 공유하게 되므로, 프론트엔드도 같은 스택·컨벤션을 쓰는 편이 유지보수와 코드 재사용에 유리하기 때문이다.

이번 작업은 그 전환의 **1단계, "환경 세팅"만**이다. 사용자가 명시적으로 요청한 범위:
- 기존 정적 소스(`index.html`, `assets/`, `data/content.json`)는 **삭제하거나 손대지 않고 그대로 둔다** — 콘텐츠 마이그레이션은 다음 단계.
- Next.js 프로젝트를 **저장소 루트**에 세팅한다(하위 폴더로 분리하지 않음).
- 레퍼런스(`go.daepae.cms.api`)와 **동일 버전**의 패키지를 쓰되, CMS 어드민 전용 라이브러리(Supabase, TanStack Query, react-hook-form+zod, Tiptap, swagger-ui-react 등)는 지금 설치하지 않고 **핵심 스택만** 먼저 설치한다.

레퍼런스 프로젝트 조사 결과, ESLint/Prettier는 `package.json`에 의존성만 있고 실제 설정 파일이 없는 미완성 상태였다 — 이번 세팅에서는 그 부분을 실제로 동작하도록 채워 넣는다(레퍼런스의 결함까지 복제하지는 않음).

## 레퍼런스에서 가져오는 것 / 지금은 제외하는 것

**설치(핵심 스택, 레퍼런스와 동일 버전)**
- `next@14.2.3`, `react@^18`, `react-dom@^18`
- `typescript@^5`, `@types/node@^20`, `@types/react@^18`, `@types/react-dom@^18`
- Tailwind v4: `tailwindcss@^4.3.3`, `@tailwindcss/postcss@^4.3.3`, `postcss@^8.5.19`, `autoprefixer@^10.5.4`, `tailwindcss-animate@^1.0.7`, `tw-animate-css@^1.4.0`
- shadcn/ui 기반: `class-variance-authority@^0.7.1`, `clsx@^2.1.1`, `tailwind-merge@^3.6.0`, `lucide-react@^1.25.0`, `shadcn@^4.13.1`(CLI, devDependency)
- Lint/Format(레퍼런스엔 없던 실제 설정 파일을 새로 작성): `eslint@^8`, `eslint-config-next@14.2.3`, `eslint-config-prettier@^10.1.1`, `eslint-plugin-prettier@^5.1.0`, `prettier@^3.1.1`
- 패키지 매니저: **yarn** (레퍼런스와 동일, `yarn.lock`만 사용, npm 사용 안 함), `engines.node >=22.0.0`

**지금 설치하지 않는 것** (필요해지는 마이그레이션 단계에서 그때그때 추가): `@supabase/*`, `@tanstack/react-query`, `react-hook-form`/`zod`/`@hookform/resolvers`, `@tiptap/*`, `swagger-ui-react`, `axios`, `next-themes`, `sonner`, `date-fns`, `react-day-picker`, 개별 `@radix-ui/*` 패키지(shadcn CLI로 컴포넌트 추가 시 자동 설치됨).

## 만들 파일

저장소 루트에 아래를 신규 생성한다(기존 `index.html`/`assets/`/`data/`는 그대로 유지):

- `package.json` — 위 의존성, `name: "go-daepae"`, scripts: `dev`(`next dev`), `build`, `start`, `lint`(`next lint`), `format`(`prettier --write "src/**/*.{ts,tsx}"`)
- `next.config.mjs` — `reactStrictMode: true`만 있는 최소 설정(레퍼런스의 `transpilePackages`/`images.remotePatterns`는 해당 라이브러리 도입 시 추가)
- `tsconfig.json` — 레퍼런스와 동일(`strict: true`, `paths: { "@/*": ["./src/*"] }`, `target: ES2015` 등)
- `tailwind.config.ts` — `darkMode: 'class'`, `content`는 `src/app/**`, `src/components/**`만(레퍼런스의 죽은 `src/pages/**` 경로는 제외), shadcn 표준 색상 토큰 매핑 + `tailwindcss-animate` 플러그인
- `postcss.config.mjs` — `@tailwindcss/postcss` + `autoprefixer`
- `components.json` — shadcn CLI 설정, 레퍼런스와 동일한 alias 구조(`@/libs/utils`, `@/components/ui` 등), `baseColor: "neutral"`
- `.eslintrc.json` — `next/core-web-vitals` + `prettier` 통합(레퍼런스에 없던 실제 설정을 신규 작성)
- `.prettierrc` — 기본 포맷 규칙(singleQuote, semi, trailingComma 등)
- `src/app/layout.tsx` — 최소 Root Layout(메타데이터만, `ThemeProvider`/`QueryProvider` 등은 해당 라이브러리 도입 전이므로 제외)
- `src/app/page.tsx` — 임시 플레이스홀더 홈페이지("Next.js 환경 세팅 완료" 수준). **기존 랜딩 콘텐츠는 이번 단계에서 이식하지 않는다** — 다음 단계(콘텐츠 마이그레이션)에서 `index.html`/`data/content.json`을 컴포넌트로 옮긴다.
- `src/app/globals.css` — Tailwind v4 `@import "tailwindcss"` + shadcn 표준 CSS 변수(oklch 기반) + `@theme inline`
- `src/libs/utils.ts` — shadcn `cn()` 헬퍼(`clsx` + `tailwind-merge`)
- `next-env.d.ts` — `next dev` 최초 실행 시 자동 생성(수동 작성 안 함)

`.gitignore`는 기존 것이 이미 Node/Next.js 표준 패턴(`node_modules/`, `.next`, `out`, `*.tsbuildinfo` 등)을 포함하고 있어 별도 수정 불필요 — 실행 후 실제로 무시되는지만 확인한다.

## 실행 순서

1. `node -v`로 Node 버전 확인(레퍼런스 `engines.node >=22.0.0` 충족 여부), `yarn -v`로 yarn 사용 가능 여부 확인. yarn이 없으면 `corepack enable` 시도.
2. 위 설정 파일들을 직접 작성(대화형 `create-next-app` 대신 수동 스캐폴딩 — 버전을 정확히 고정하기 위함).
3. `yarn install` 실행, `yarn.lock` 생성 확인.
4. `yarn dev`로 개발 서버 기동 확인(기본 포트 3000 — 기존 `python3 -m http.server 8765`, CMS 프로젝트 3001과 충돌 없음).
5. `yarn build`로 프로덕션 빌드가 TypeScript/ESLint 에러 없이 통과하는지 확인.
6. `yarn lint` 실행해 방금 작성한 `.eslintrc.json`이 실제로 동작하는지 확인.
7. 기존 정적 사이트가 그대로 살아있는지 재확인 — `python3 -m http.server 8765`로 `index.html`이 여전히 정상 렌더되는지 스크린샷으로 확인(회귀 없음 검증).
8. 새 Next.js 플레이스홀더 페이지도 헤드리스 스크린샷으로 한 번 확인.

## 검증

- `yarn install` / `yarn build` / `yarn lint` 모두 에러 없이 종료
- `http://localhost:3000` 접속 시 플레이스홀더 페이지가 Tailwind 스타일이 적용된 채로 렌더됨(헤드리스 스크린샷으로 확인)
- 기존 `http://localhost:8765/index.html`(정적 사이트)이 이전과 동일하게 동작함(회귀 없음)
- `git status`에서 `index.html`/`assets/`/`data/`가 "수정됨"으로 표시되지 않고, 신규 Next.js 관련 파일만 추가된 것으로 표시됨
