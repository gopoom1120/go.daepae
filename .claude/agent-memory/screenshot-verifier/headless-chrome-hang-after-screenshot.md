---
name: headless-chrome-hang-after-screenshot
description: --screenshot/--dump-dom 완료 후에도 headless Chrome 프로세스가 자동 종료되지 않고 몇 분씩 걸리거나 무한 대기하는 경우가 흔함 — 파일이 이미 써졌는지 먼저 확인하고 필요하면 강제 kill
metadata:
  type: feedback
---

`--headless=new --disable-gpu ... --screenshot=out.png` 나 `--dump-dom` 을 단발성으로 실행해도,
출력 파일은 이미 완성돼 디스크에 써졌는데 Chrome 프로세스 자체(및 zygote/GPU/network 헬퍼들)는
수 분간 종료되지 않는 경우가 이 환경에서 반복적으로 관찰됐다(`--headless` 레거시 모드에서도 동일).
`wait $PID` 로 기다리면 하염없이 블로킹된다.

**Why:** 정확한 원인은 특정하지 못했지만, `--virtual-time-budget` 만료 후 스크린샷/덤프를 쓰는
시점과 프로세스 자체의 정상 종료 시퀀스가 분리되어 있어, 렌더링 파이프라인이 사이트별로(특히
`swiper` 같은 외부 CDN 스크립트나 다수의 fetch 를 쓰는 페이지에서) 완전히 idle 상태가 되지 않으면
자동 종료 트리거가 늦게 걸리거나 아예 안 걸리는 것으로 보인다.

**How to apply:** 스크린샷/덤프 작업을 스크립트화할 때는 항상 이 패턴을 쓴다 — 프로세스를 `&` 로
백그라운드 실행하고, **출력 파일이 nonzero 크기로 생성됐는지를 폴링**해서 확인한 뒤(생성 직후
쓰기가 아직 안 끝났을 수 있으니 1~2초 추가 대기), `kill -9 $CPID` 로 강제 종료하고
`pkill -9 -f "<이번 실행에 쓴 고유 --user-data-dir 이름>"` 으로 헬퍼 프로세스까지 같이 정리한다.
`wait` 로 프로세스 종료를 기다리지 않는다 — 영원히 안 끝날 수 있다. 매 실행마다 **고유한
`--user-data-dir`** 를 스크래치패드 아래 지정해서, 강제 kill 로 인한 프로필 손상이 다음 실행에
영향을 주지 않게 격리한다.
