---
name: gopumgyeok-shared-port-8765-with-sibling-project
description: python3 -m http.server 8765 가 0007 이 아니라 형제 폴더(0007-B 등)를 서빙하고 있을 때가 있다 — 매 스크린샷 전 콘텐츠를 curl 로 확인해야 함
metadata:
  type: feedback
---

`component-zip` 저장소 안에 `0007`과 `0007-B`(카탈로그 라이트 시안) 같은 형제 폴더가 동시에
존재하고, 사용자 또는 다른 세션이 그쪽에서도 `python3 -m http.server 8765`를 띄워 작업할 수
있다. 포트는 하나뿐이라 **먼저 바인드에 성공한 프로세스가 그 포트를 계속 쥐고, 내가 같은 포트로
새로 띄운 서버는 조용히 bind 실패한다**(`&> /dev/null`로 stderr를 버리면 실패 사실도 안 보인다).
이 상태에서 `curl http://localhost:8765/index.html`은 200을 반환하지만 **전혀 다른 프로젝트의
HTML**(예: 0007의 다크 골드 히어로 대신 0007-B의 라이트 아이보리 "카탈로그" 레이아웃)을 돌려준다.
헤드리스 스크린샷도 그 잘못된 콘텐츠를 그대로 캡처하므로, 화면에 있어야 할 요소(예: `.inquiry-fab`
탭)가 통째로 안 보여 "레이아웃이 깨졌다"고 오판하기 쉽다.

**Why:** 실제로 이 세션에서 `.inquiry-fab` 모바일 캡처가 몇 차례 반복해서 원인 불명으로
실패/이상한 화면이 나왔는데, 원인 중 하나가 바로 이거였다 — `lsof -a -p <PID> -d cwd`로 서버
프로세스의 실제 작업 디렉토리를 찍어보고서야 발견했다.

**How to apply:**
1. 서버를 (재)시작한 직후 스크린샷을 찍기 전에 **항상**
   `curl -s http://localhost:8765/index.html | grep -c '<확인하려는 셀렉터/고유 클래스명>'`
   같은 커맨드로 지금 이 포트가 진짜 0007을 서빙 중인지 콘텐츠 기준으로 확인한다. HTTP 200만
   보고 안심하지 않는다.
2. 의심스러우면 `lsof -nP -iTCP:8765 -sTCP:LISTEN -t`로 PID를 뽑고
   `lsof -a -p <PID> -d cwd`로 그 프로세스의 실제 cwd가 `0007`인지 대조한다.
3. 이 프로젝트는 다른 세션과 같은 호스트/포트를 공유할 수 있다는 전제([[gopumgyeok-live-edit-during-verification]]와 같은 계열의 위험) 아래, 서버 시작·콘텐츠 확인·스크린샷 촬영을 가능한 한
   **같은 Bash 호출 안에서 연달아** 수행해 그 사이에 다른 프로세스가 포트를 가로챌 시간을 줄인다.
