// ===== 고품격대패 랜딩페이지 — ES6 스크립트 =====
//
// 화면에 뿌리는 콘텐츠(메뉴·셀프바·수익·창업비용·매장 등)는 전부 data/content.json 에 있다.
// 이 파일에는 데이터를 두지 않는다 — 값을 바꾸려면 JSON 만 고치면 된다.
//
// ⚠ fetch 를 쓰므로 index.html 을 file:// 로 더블클릭해 열면 CORS 로 막힌다.
//   반드시 로컬 서버로 볼 것:  python3 -m http.server 8765

const DATA_URL = 'data/content.json';

// 백오피스(go_daepae.cms.api) 와의 통신(dataFetch(), CMS_API_BASE_URL)은 assets/js/dataFetch.js
// 에 있다 — index.html 에서 이 파일보다 먼저 로드된다.

// ---- 공통 유틸 ----

/** 숫자를 3자리 콤마 형식으로 변환한다 */
const formatWon = (n) => n.toLocaleString('ko-KR');

// esc() 는 assets/js/regexr.js 에 있다(이 파일보다 먼저 로드된다).

/** id 로 엘리먼트를 찾아 html 을 채운다. 대상이 없으면 조용히 넘어간다 */
const fill = (id, html) => {
  const target = document.getElementById(id);
  if (target) target.innerHTML = html;
};

// ---- 섹션별 렌더러 ----

/** 01 경쟁력 — 3대 핵심경쟁력 카드 */
const renderCompetency = (list = []) => fill('compGrid', list.map(({ num, title, desc }) => `
  <div class="comp-card">
    <div class="comp-num">${esc(num)}</div>
    <h3>${esc(title)}</h3>
    <p>${desc ?? ''}</p>
  </div>`).join(''));

/** 01 경쟁력 — 하단 트러스트 스트립 (번호는 데이터가 아니라 순서에서 생성) */
const renderTrust = (list = []) => fill('trustStrip', list.map(({ label, desc }, i) => `
  <div class="trust-item">
    <span class="trust-num">${String(i + 1).padStart(2, '0')}</span>
    <h5>${esc(label)}</h5>
    <p>${esc(desc)}</p>
  </div>`).join(''));

/** 02 메뉴 — 고기 그리드 */
const renderMeat = (list = []) => fill('meatGrid', list.map(({ image, name }) => `
  <div class="meat-card">
    <div class="meat-card__circle"><img src="${esc(image)}" alt="${esc(name)}"></div>
    <div class="meat-card__label">${esc(name)}</div>
  </div>`).join(''));

/** 02 메뉴 — 셀프바 원형 그리드 */
const renderSelfbar = (list = []) => fill('selfbarGrid', list.map(({ image, name }) => `
  <div class="sb-item">
    <div class="circle"><img src="${esc(image)}" alt="${esc(name)}"></div>
    <span>${esc(name)}</span>
  </div>`).join(''));

/** 03 수익분석 — 매장별 수익을 영수증(리시트) 롤 스타일 카드로 렌더링한다 */
const renderProfitCards = (list = []) => fill('profitCards', list.map(({ name, open, salesWon, rate, tall }, i) => `
  <div class="receipt-col${tall ? ' center' : ''}" style="--d:${i * 140}ms">
    <div class="printer-bar">
      <div class="printer-slot"></div>
    </div>
    <div class="receipt-mask">
      <div class="receipt-body">
        <div class="receipt-paper">
          <div class="r-label">운영형태 [ 홀 / 셀프바 ]</div>
          <div class="r-store">${esc(name)}</div>
          <div class="r-sales" data-value="${salesWon}">${formatWon(0)}</div>
          <div class="r-divider"></div>
          <div class="r-sub">순수익률 <b>${esc(rate)}%</b></div>
          <div class="r-divider"></div>
          <div class="r-date">${esc(open)} 기준</div>
          <div class="r-barcode"></div>
        </div>
        <div class="receipt-scallop"></div>
      </div>
    </div>
  </div>`).join(''));

/** 04 창업비용 — 항목표 */
const renderCost = ({ head, rows = [] } = {}) => {
  const headRow = head
    ? `<div class="cost-row cost-head"><span>${esc(head.item)}</span><span>${esc(head.detail)}</span><span>${esc(head.price)}</span></div>`
    : '';
  const body = rows.map(({ item, detail, price }) => `
    <div class="cost-row"><span>${esc(item)}</span><span>${esc(detail)}</span><span>${esc(price)}</span></div>`).join('');
  fill('costTable', headRow + body);
};

/** 05 매장위치 — 매장 카드 + 지점별 네이버 지도 버튼 */
const PIN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>';

/**
 * 05 매장위치 — 카드는 사진만 담고, 이름·오픈일·지도 버튼은 좌측 컬럼의 .store-caption 으로
 * 옮겼다(2026-09-03). 캐러셀이 넘어갈 때마다 initStoreSwiper 가 이 마크업을 다시 그린다 —
 * 슬라이드 쪽 data-name/date/map-url 속성을 그대로 읽어서 쓰므로 데이터 형태가 여기 하나뿐이다.
 */
const storeCaptionHTML = ({ name, date, mapUrl }) => `
  <h4>${esc(name)}</h4>
  <div class="date">${esc(date)}</div>
  ${mapUrl ? `<a class="map-btn" href="${esc(mapUrl)}" target="_blank" rel="noopener noreferrer"
     aria-label="${esc(name)} 네이버 지도에서 보기 (새 창)">${PIN_SVG} 네이버 지도로 보기</a>` : ''}`;

const renderStores = (list = []) => fill('storeGrid', list.map(({ name, date, image, mapUrl }) => `
  <div class="swiper-slide" data-name="${esc(name)}" data-date="${esc(date)}" data-map-url="${esc(mapUrl || '')}">
    <div class="store-card">
      <div class="photo"><img src="${esc(image)}" alt="${esc(name)}"></div>
    </div>
  </div>`).join(''));

/** 05 매장위치 — 연락처 라인 */
const renderContact = ({ phone, instagram, instagramUrl } = {}) => fill('contactLines', `
  <div class="contact-line"><span class="k">창업문의</span><span class="v">${esc(phone)}</span></div>
  <div class="contact-line"><span class="k">Instagram</span><span class="v">${
    instagramUrl ? `<a href="${esc(instagramUrl)}" target="_blank" rel="noopener noreferrer">${esc(instagram)}</a>` : esc(instagram)
  }</span></div>`);

// ---- 인터랙션 ----

/**
 * 수익분석 섹션의 영수증은 "03. 수익분석" 섹션(#profit) 자체가 아니라, 그 바로 앞
 * 02 메뉴 섹션의 셀프바 그리드(#selfbarGrid — 상추 등 메뉴가 있는 영역) 상단을
 * 기준으로 미리 펼쳐진다: 뷰포트 상단이 셀프바 그리드 상단을 지나는 순간 펼쳐지고,
 * 이후 03 섹션에 도착해서도 계속 펼쳐진 채로 유지되며, 다시 그 지점(셀프바 그리드
 * 상단) 위로 스크롤을 올려야 접힌다 — 그 지점을 지날 때마다 반복 재생한다.
 * IntersectionObserver 의 "요소 자신의 높이 구간에서만 true" 특성으로는 셀프바
 * 그리드를 지나자마자(03 섹션 도달 전에) 다시 false 가 되어버려 이 요건을 표현할
 * 수 없다 — 대신 스크롤 위치와 셀프바 그리드의 문서 좌표를 직접 비교한다.
 */
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * .r-sales 매출 숫자를 0 → 실제값으로 카운트업한다 (ease-out cubic, 1.1s).
 * 빠르게 스크롤을 들락날락하면 이전 rAF 루프가 끝나기 전에 다시 호출될 수 있어, 시작할 때
 * 그 요소에 걸려 있던 이전 루프를 반드시 취소한다 — 안 그러면 두 루프가 같은 textContent를
 * 번갈아 덮어써 숫자가 널뛰는 것처럼 보인다.
 */
const animateSalesCount = (el, target, duration = 1100) => {
  if (el.__salesRaf) cancelAnimationFrame(el.__salesRaf);
  if (prefersReducedMotion()) { el.textContent = formatWon(target); return; }
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatWon(Math.round(target * eased));
    el.__salesRaf = progress < 1 ? requestAnimationFrame(step) : null;
  };
  el.__salesRaf = requestAnimationFrame(step);
};

const initReceiptReveal = () => {
  const section = document.getElementById('profit');
  if (!section) return;
  const cols = [...section.querySelectorAll('.receipt-col')];
  if (!cols.length) return;

  const trigger = document.getElementById('selfbarGrid') || section;
  let wasRevealed = false;

  const update = () => {
    const triggerTop = trigger.getBoundingClientRect().top + window.scrollY;
    const revealed = window.scrollY >= triggerTop;
    if (revealed === wasRevealed) return;
    wasRevealed = revealed;
    cols.forEach((col) => col.classList.toggle('in-view', revealed));
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
};

/**
 * 매출 숫자 카운트업은 종이 펼침(initReceiptReveal)과 트리거를 일부러 분리한다.
 * 종이는 셀프바 그리드 상단을 지나자마자(03 섹션에 도착하기 한참 전에) 미리 펼쳐지므로,
 * 같은 트리거에 숫자 카운트업을 묶으면 사용자가 실제로 03 섹션에 눈을 두기도 전에
 * 애니메이션이 끝나버려 "인터랙션이 아예 없다"고 느껴진다(2026-09-09, 실제로 보고된 문제).
 * 그래서 숫자 카드(.receipt-col) 자신이 뷰포트에 40% 이상 보일 때를 기준으로 카운트업/리셋을
 * 토글한다. IntersectionObserver 가 아니라 initReceiptReveal 과 같은 scroll 리스너 +
 * getBoundingClientRect 방식을 쓴다 — 이 프로젝트 헤드리스 검증 환경에서 프로그래매틱
 * scrollTo 뒤에는 IntersectionObserver 콜백이 재발화하지 않는 한계가 확인됐고
 * (`.claude/agent-memory/screenshot-verifier/headless-intersection-observer-limitation.md`),
 * 실제 브라우저에서도 scroll 리스너 쪽이 이 코드베이스에서 이미 검증된 패턴이라 일관되게
 * 맞춘다. unobserve 없이 계속 관찰해 드나들 때마다 반복 재생된다.
 */
const initProfitCountReveal = () => {
  const cols = [...document.querySelectorAll('#profit .receipt-col')];
  if (!cols.length) return;

  const wasInView = new WeakMap();

  const update = () => {
    const vh = window.innerHeight;
    cols.forEach((col) => {
      const salesEl = col.querySelector('.r-sales');
      if (!salesEl) return;
      const rect = col.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      const inView = rect.height > 0 && visible / rect.height >= 0.4;
      if (inView === (wasInView.get(salesEl) || false)) return;
      wasInView.set(salesEl, inView);
      if (inView) {
        animateSalesCount(salesEl, Number(salesEl.dataset.value));
      } else {
        if (salesEl.__salesRaf) cancelAnimationFrame(salesEl.__salesRaf);
        salesEl.textContent = formatWon(0);
      }
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
};

/**
 * 01 경쟁력 섹션의 카드/트러스트 항목을 스크롤로 처음 들어올 때 한 번만 떠오르게 한다
 * (수익분석 영수증과 달리 반복 재생할 필요는 없어 한 번 보이면 관찰을 끊는다).
 */
const initGridReveal = () => {
  const targets = [
    ...document.querySelectorAll('#compGrid .comp-card'),
    ...document.querySelectorAll('#trustStrip .trust-item'),
    ...document.querySelectorAll('.review-grid .review-item'),
    ...document.querySelectorAll('#meatGrid .meat-card'),
    ...document.querySelectorAll('#selfbarGrid .sb-item'),
  ];
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  targets.forEach((el) => observer.observe(el));
};

/**
 * 05 매장위치 — Swiper 캐러셀. prefers-reduced-motion 을 존중해 자동재생을 아예 켜지 않고,
 * 일시정지 토글 버튼은 클릭할 때마다 swiper.autoplay 를 멈추고/다시 시작한다.
 * 2026-09-03: 자동재생은 #location 섹션이 30% 이상 뷰포트에 들어왔을 때만 돈다 — 화면 밖
 * 캐러셀이 계속 넘어가는 걸 막기 위해 IntersectionObserver 로 진입/이탈에 맞춰 시작/정지한다.
 * "뷰포트 안에 있음"과 "사용자가 일시정지 버튼을 누르지 않음" 둘 다 만족해야 재생되고,
 * 토글 버튼 아이콘/aria-label 은 사용자의 의도(userPaused)만 반영한다 — 화면 밖으로 나가서
 * 조용히 멈춘 것까지 아이콘에 반영하면(예: 스크롤만 했는데 재생 아이콘이 바뀜) 오히려 헷갈린다.
 */
const initStoreSwiper = () => {
  const track = document.getElementById('storeGrid');
  if (!track || typeof Swiper === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggleBtn = document.getElementById('storeAutoplayToggle');

  const swiper = new Swiper('.store-swiper', {
    slidesPerView: 1.08,
    spaceBetween: 20,
    loop: true,
    speed: reduceMotion ? 0 : 550,
    autoplay: reduceMotion ? false : { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: { prevEl: '.store-nav-prev', nextEl: '.store-nav-next' },
    a11y: { enabled: true },
    breakpoints: { 1025: { slidesPerView: 1.35, spaceBetween: 28 } },
  });

  const ring = document.querySelector('.store-nav-toggle__ring');
  if (ring && swiper.autoplay) {
    swiper.on('autoplayTimeLeft', (_s, _timeLeft, percentage) => {
      ring.style.setProperty('--store-timer', percentage);
    });
  }

  /* 카드 안에 있던 이름·오픈일·지도 버튼을 좌측 컬럼(.store-caption)으로 옮겼다(2026-09-03) —
     loop:true 라 activeIndex 는 복제된 슬라이드를 가리킬 수도 있지만, Swiper 가 복제할 때
     원본 슬라이드의 data-* 속성까지 그대로 복사하므로 realIndex 를 따로 계산할 필요 없이
     swiper.slides[activeIndex] 에서 바로 읽으면 된다. */
  const captionEl = document.getElementById('storeCaption');
  const syncCaption = () => {
    const slide = captionEl && swiper.slides[swiper.activeIndex];
    if (!slide) return;
    captionEl.innerHTML = storeCaptionHTML({
      name: slide.dataset.name,
      date: slide.dataset.date,
      mapUrl: slide.dataset.mapUrl,
    });
  };
  syncCaption();
  swiper.on('slideChange', syncCaption);

  if (!toggleBtn || !swiper.autoplay) return;

  let userPaused = reduceMotion;
  let inView = false;
  const syncAutoplay = () => {
    if (inView && !userPaused) swiper.autoplay.start();
    else swiper.autoplay.stop();
  };

  swiper.autoplay.stop();   // 관찰자가 진입을 감지하기 전까지는 재생하지 않는다
  toggleBtn.classList.toggle('is-paused', userPaused);
  toggleBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    toggleBtn.classList.toggle('is-paused', userPaused);
    toggleBtn.setAttribute('aria-label', userPaused ? '자동 재생 시작' : '자동 재생 일시정지');
    syncAutoplay();
  });

  if (reduceMotion) return;   // autoplay 자체가 꺼져 있으므로 관찰할 필요가 없다
  const section = document.getElementById('location');
  if (!section) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting;
        syncAutoplay();
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(section);
};

/** 네비게이션 스크롤 이동 */
const initSmoothScroll = () => {
  const links = document.querySelectorAll('[data-target]');
  const nav = document.getElementById('siteNav');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetEl = document.getElementById(link.dataset.target);
      if (!targetEl) return;

      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nav.classList.remove('nav-open');   // 모바일 메뉴 열려있으면 닫기
    });
  });
};

/** 모바일 메뉴 토글 */
const initMobileNav = () => {
  const nav = document.getElementById('siteNav');
  const toggle = document.getElementById('navToggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
  });
};

/** 스크롤 시 헤더 배경 + 스크롤스파이(active 표시) */
const initScrollSpy = () => {
  const nav = document.getElementById('siteNav');
  const sections = [...document.querySelectorAll('main section[id], section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a[data-target]')];

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.target === id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
};

/**
 * 문의하기 Bottom Sheet — [data-open-inquiry] 트리거(헤더/히어로/우측 하단 FAB/창업비용/
 * 05 매장위치 CTA) 클릭으로만 열린다(2026-09-09, 02 메뉴 섹션 진입 시 자동으로 뜨던
 * 동작은 사용자 요청으로 제거하고 우측 하단 고정 버튼으로 바꿨다). hidden 을 뗀 다음
 * 프레임에 .is-open 을 붙여야 CSS transition 이 시작값을 인식한다 — 같은 프레임에 같이
 * 붙이면 애니메이션 없이 바로 최종 상태로 뛴다. 목업 제출은 기존 인라인 폼과 동일하게 버튼
 * 텍스트만 바꾸고 끝낸다(실제 전송 없음). 05 섹션 맨 아래의 원래 문의 폼(#inquiryForm)과는
 * 별개 — 이 시트는 자체 폼(#inquirySheetForm)을 쓴다.
 */
/** 성공 접수 후 필드 초기화 — 네이티브 input/select/textarea 는 form.reset() 이 처리하고,
 *  커스텀 드롭다운(.select-field)은 별도 상태(선택 표시 클래스/placeholder 문구)를 직접
 *  되돌려야 한다 — form.reset() 은 실제 <select> 가 아닌 이 컴포넌트를 모른다. */
const resetInquiryForm = (form) => {
  if (!form) return;
  form.reset();
  form.querySelectorAll('.select-field').forEach((el) => {
    el.classList.remove('has-value');
    const valueEl = el.querySelector('.select-field-value');
    el.querySelectorAll('.select-field-item').forEach((item) => {
      item.classList.remove('selected');
      item.setAttribute('aria-selected', 'false');
    });
    if (valueEl && valueEl.dataset.placeholder) valueEl.textContent = valueEl.dataset.placeholder;
  });
};

/** 가맹문의 폼 3곳(인라인/Bottom Sheet/스티키바) 공통 제출 처리 — CMS API로 전송한다 */
const submitInquiry = async (payload, btn, successText, form) => {
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '전송 중...';

  const resetAfterDelay = (text) => {
    btn.textContent = text;
    btn.disabled = false;
    setTimeout(() => { btn.textContent = originalText; }, 3000);
  };

  let res;
  try {
    res = await dataFetch('/franchise-inquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[고품격대패] 문의 접수 실패(네트워크)', err);
    resetAfterDelay('잠시 후 다시 시도해주세요');
    return;
  }

  if (res.ok) {
    btn.textContent = successText;
    // "접수되었습니다" 문구를 잠깐 보여준 뒤 버튼 텍스트와 입력 필드를 전부 초기 상태로
    // 되돌린다 — 계속 남아 있으면 같은 값으로 다시 제출한 것처럼 보이거나, 다음 문의를
    // 입력하려는 사용자가 기존 값을 일일이 지워야 하는 불편이 있었다.
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      resetInquiryForm(form);
    }, 2500);
    return;
  }

  const data = await res.json().catch(() => ({}));
  console.error('[고품격대패] 문의 접수 실패', res.status, data);
  resetAfterDelay(data.error || '잠시 후 다시 시도해주세요');
};

const initInquirySheet = () => {
  const backdrop = document.getElementById('inquirySheetBackdrop');
  if (!backdrop) return;

  const form = document.getElementById('inquirySheetForm');
  const closeBtn = document.getElementById('inquirySheetClose');
  const openers = document.querySelectorAll('[data-open-inquiry]');

  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => backdrop.classList.add('is-open'));
    form?.querySelector('input, select, textarea')?.focus();
  };

  const close = () => {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    lastFocused?.focus();
    setTimeout(() => { backdrop.hidden = true; }, 350);
  };

  openers.forEach((btn) => btn.addEventListener('click', open));
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) close();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('inquirySheetSubmit');
    submitInquiry({
      name: document.getElementById('inqName').value,
      phone: document.getElementById('inqPhone').value,
      franchiseType: form.querySelector('input[name="franchiseType"]').value,
      region: document.getElementById('inqRegion').value,
      website: form.querySelector('input[name="website"]').value,
    }, btn, '접수되었습니다', form);
  });
};

/** 05 매장위치 맨 아래 문의 폼 */
const initInquiryForm = () => {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.submit-btn');
    submitInquiry({
      name: document.getElementById('inlineName').value,
      phone: document.getElementById('inlinePhone').value,
      franchiseType: form.querySelector('input[name="franchiseType"]').value,
      region: document.getElementById('inlineRegion').value,
      website: form.querySelector('input[name="website"]').value,
    }, btn, '접수되었습니다', form);
  });
};

/** shadcn/ui Select 참고 커스텀 드롭다운(.select-field, #inquiryForm·.inquiry-sheet-form·
 *  .sticky-inquiry-bar 세 곳 공용) — 열기/닫기, 방향키 탐색, 선택 상태를 관리한다. 패널이
 *  트리거 위/아래 어느 쪽으로 펼쳐지는지는 CSS 가 컨텍스트별로 결정하므로 여기서는
 *  열림/선택 상태만 다룬다. */
const initCustomSelects = () => {
  const selects = document.querySelectorAll('.select-field');
  if (!selects.length) return;

  const closeAll = () => {
    selects.forEach((el) => {
      el.classList.remove('open');
      el.querySelector('.select-field-trigger')?.setAttribute('aria-expanded', 'false');
    });
  };

  selects.forEach((el) => {
    const trigger = el.querySelector('.select-field-trigger');
    const valueEl = el.querySelector('.select-field-value');
    const list = el.querySelector('.select-field-list');
    const hidden = el.querySelector('input[type="hidden"]');
    const items = Array.from(el.querySelectorAll('.select-field-item'));
    // 제출 후 폼을 초기화할 때(resetInquiryForm) 이 문구로 되돌리기 위해 최초 placeholder를
    // 데이터 속성에 미리 저장해둔다 — selectItem() 이 곧 이 textContent를 선택값으로 덮어쓴다.
    if (valueEl) valueEl.dataset.placeholder = valueEl.textContent;

    const selectItem = (item) => {
      items.forEach((i) => { i.classList.remove('selected'); i.setAttribute('aria-selected', 'false'); });
      item.classList.add('selected');
      item.setAttribute('aria-selected', 'true');
      valueEl.textContent = item.dataset.value;
      el.classList.add('has-value');
      if (hidden) hidden.value = item.dataset.value;
    };

    const open = () => {
      closeAll();
      el.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      (el.querySelector('.select-field-item.selected') || items[0])?.focus();
    };

    const close = (refocusTrigger) => {
      el.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (refocusTrigger) trigger.focus();
    };

    trigger.addEventListener('click', () => {
      el.classList.contains('open') ? close(false) : open();
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); }
    });

    items.forEach((item, i) => {
      item.addEventListener('click', () => { selectItem(item); close(true); });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); selectItem(item); close(true);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault(); items[Math.min(i + 1, items.length - 1)].focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault(); items[Math.max(i - 1, 0)].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault(); close(true);
        } else if (e.key === 'Tab') {
          close(false);
        }
      });
    });

    list.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(true); });
  });

  document.addEventListener('click', (e) => {
    selects.forEach((el) => { if (!el.contains(e.target)) el.classList.remove('open'); });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
};

// formatPhoneNumber() 는 assets/js/regexr.js 에 있다(이 파일보다 먼저 로드된다).

/** 가맹문의 폼 3곳의 연락처 입력란(#inlinePhone/#inqPhone/#sibPhone)에 공통으로 붙인다. */
const initPhoneAutoFormat = () => {
  ['inlinePhone', 'inqPhone', 'sibPhone'].forEach((id) => {
    const input = document.getElementById(id);
    input?.addEventListener('input', () => {
      input.value = formatPhoneNumber(input.value);
    });
  });
};

/** 하단 고정 문의 폼 바 */
const initStickyInquiryForm = () => {
  const form = document.getElementById('stickyInquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.sticky-inquiry-submit');
    submitInquiry({
      name: document.getElementById('sibName').value,
      phone: document.getElementById('sibPhone').value,
      franchiseType: form.querySelector('input[name="franchiseType"]').value,
      region: document.getElementById('sibRegion').value,
      website: form.querySelector('input[name="website"]').value,
    }, btn, '접수되었습니다', form);
  });
};

/** 오늘 날짜(YYYY-MM-DD, 로컬 타임존) — 팝업 "오늘 하루 보지 않기" 판단 기준 */
const todayKey = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

/** CMS(franchise_popups) 공개 목록 — initPopup() 이 쓴다 */
const fetchPopups = (() => {
  let cache = null;
  return () => {
    if (!cache) {
      cache = dataFetch('/public/franchise-popups', { cache: 'no-cache' })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json) => json.data || [])
        .catch((err) => {
          console.warn('[고품격대패] 팝업/공지 로드 실패', err);
          return [];
        });
    }
    return cache;
  };
})();

/** 팝업 한 장(.swiper-slide 안쪽) 마크업 — 링크가 있으면 <a>, 없으면 <div>로 감싼다.
 *  content 가 없으면 렌더링을 생략한다. title 은 이미지가 있는 카드형 팝업(포스터 이미지 자체에
 *  문구가 이미 들어있는 경우)에서는 값이 있어도 표시하지 않는다 — 이미지 없는 팝업에서만 노출. */
const popupSlideHtml = ({ title, content, image_url, link_url }) => {
  const img = image_url ? `<img class="popup-image" src="${esc(image_url)}" alt="${esc(title || '')}">` : '';
  const titleHtml = title && !image_url ? `<h3 class="popup-title">${esc(title)}</h3>` : '';
  const contentHtml = content ? `<p class="popup-content">${esc(content)}</p>` : '';
  const tag = link_url ? 'a' : 'div';
  const linkAttrs = link_url ? ` href="${esc(link_url)}" target="_blank" rel="noopener"` : '';
  return `<div class="swiper-slide"><${tag} class="popup-slide"${linkAttrs}>${img}${titleHtml}${contentHtml}</${tag}></div>`;
};

/** 좌우 화살표를 .popup-modal(팝업 전체 — 이미지/제목/본문 + 하단 footer 까지) 세로 중앙에
 *  맞춘다. 버튼은 #popupSwiper 의 absolute 자식이라, top 좌표는 swiperEl 기준 상대값으로
 *  변환해서 써야 한다. Swiper 기본 top:50%는 CSS에서 건드리지 않고 여기서 인라인 top(px)으로
 *  덮어써 우선시킨다. */
const centerPopupNav = () => {
  const swiperEl = document.getElementById('popupSwiper');
  const modalEl = document.getElementById('popupModal');
  const prevBtn = document.getElementById('popupPrev');
  const nextBtn = document.getElementById('popupNext');
  if (!swiperEl || !modalEl || prevBtn.hidden) return;

  const swiperRect = swiperEl.getBoundingClientRect();
  const modalRect = modalEl.getBoundingClientRect();
  const centerY = Math.round(modalRect.top + modalRect.height / 2 - swiperRect.top);

  prevBtn.style.top = `${centerY}px`;
  nextBtn.style.top = `${centerY}px`;
};

/** CMS 팝업 모달 — franchise_popups 중 오늘 "보지 않기"로 닫지 않은 항목 전체를 Swiper 슬라이드로
 *  노출한다(05 매장위치와 같은 Swiper.js 재사용, initStoreSwiper 참고). 2개 이상이면 좌우
 *  화살표(.swiper-button-prev/next)와 점 페이지네이션(.swiper-pagination)이 나타난다. */
const initPopup = async () => {
  const backdrop = document.getElementById('popupBackdrop');
  if (!backdrop || typeof Swiper === 'undefined') return;

  const all = await fetchPopups();
  const items = all.filter((p) => localStorage.getItem('popupDismiss:' + p.id) !== todayKey());
  if (!items.length) return;

  const wrapper = document.getElementById('popupSwiperWrapper');
  const pagination = document.getElementById('popupPagination');
  const prevBtn = document.getElementById('popupPrev');
  const nextBtn = document.getElementById('popupNext');
  const multiple = items.length > 1;

  wrapper.innerHTML = items.map(popupSlideHtml).join('');
  pagination.hidden = !multiple;
  prevBtn.hidden = !multiple;
  nextBtn.hidden = !multiple;

  const reduceMotion = prefersReducedMotion();
  const swiper = new Swiper('#popupSwiper', {
    loop: multiple,
    speed: reduceMotion ? 0 : 350,
    autoHeight: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    navigation: { prevEl: '#popupPrev', nextEl: '#popupNext', enabled: multiple },
    pagination: { el: '#popupPagination', clickable: true, enabled: multiple },
    a11y: { enabled: true },
    keyboard: { enabled: true },
  });

  if (multiple) {
    centerPopupNav();
    swiper.on('slideChangeTransitionEnd', centerPopupNav);
    window.addEventListener('resize', centerPopupNav);
    wrapper.querySelectorAll('.popup-image').forEach((img) => img.addEventListener('load', centerPopupNav));
    // autoHeight 는 슬라이드마다 이미지 비율이 달라 모달 높이가 바뀌는데, 그 애니메이션이
    // slideChangeTransitionEnd 와 정확히 같은 프레임에 끝난다는 보장이 없다(둘 다 350ms 지만
    // 별개의 내부 타이머라 어긋날 수 있음) — 이때 화살표가 이전 슬라이드의 높이 기준 좌표에
    // 멈춰 있어 짧은 슬라이드에서 바닥 쪽에 붙어 보이는 버그가 났다. wrapper 실제 높이 변화를
    // 직접 관찰해 항상 최신 값으로 재계산한다.
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(centerPopupNav).observe(wrapper);
    }
    // 팝업이 처음 열릴 때는 이미지가 아직 디코딩 전이라 autoHeight 가 실제 값보다 훨씬 작은
    // 높이(예: 60px대)로 한 번 잡히고, 그 뒤 63→750→780px 처럼 몇 단계를 거쳐 최종 높이에
    // 도달한다 — 이 초기 정착 과정이 ResizeObserver 콜백 타이밍과 어긋나면(실측 결과 재현됨)
    // 화살표가 중간 단계 높이에 멈춰버려 팝업을 열자마자(클릭 등 상호작용 전) 위치가 눈에
    // 띄게 어긋나 보인다. 위 옵저버/이벤트 만으로는 이 최초 정착을 항상 못 잡아서, 짧은 지연
    // 재계산을 몇 차례 더 걸어 안전하게 맞춘다.
    [0, 60, 150, 300, 600].forEach((ms) => setTimeout(centerPopupNav, ms));
  }

  const closeBtn = document.getElementById('popupClose');
  const footerCloseBtn = document.getElementById('popupFooterClose');
  const dismissToday = document.getElementById('popupDismissToday');

  const close = () => {
    if (dismissToday.checked) {
      items.forEach((p) => localStorage.setItem('popupDismiss:' + p.id, todayKey()));
    }
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { backdrop.hidden = true; }, 350);
  };

  closeBtn.addEventListener('click', close);
  footerCloseBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) close();
  });

  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => backdrop.classList.add('is-open'));
};

// ---- 부팅 ----

/** JSON 을 못 읽었을 때(대개 file:// 로 연 경우) 화면에 이유를 남긴다 */
const showDataError = (err) => {
  const isFile = location.protocol === 'file:';
  const msg = isFile
    ? 'data/content.json 을 file:// 에서는 읽을 수 없습니다. 로컬 서버로 열어주세요 — python3 -m http.server 8765'
    : `data/content.json 을 불러오지 못했습니다 (${err.message}).`;

  console.error('[고품격대패]', msg, err);
  document.querySelectorAll('[data-content]').forEach((el) => {
    el.innerHTML = `<p style="color:#B3A995; font-size:18px; line-height:1.8;">${msg}</p>`;
  });
};

const renderAll = (data) => {
  renderCompetency(data.competency);
  renderTrust(data.trust);
  renderMeat(data.meat);
  renderSelfbar(data.selfbar);
  renderProfitCards(data.profit);
  renderCost(data.cost);
  renderStores(data.stores);
  renderContact(data.contact);
};

const boot = async () => {
  // 데이터와 무관한 인터랙션은 먼저 붙인다 — JSON 로드가 실패해도 동작해야 한다
  initSmoothScroll();
  initMobileNav();
  initScrollSpy();
  initInquiryForm();
  initInquirySheet();
  initCustomSelects();
  initPhoneAutoFormat();
  initStickyInquiryForm();
  initPopup();

  try {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    renderAll(await res.json());
  } catch (err) {
    showDataError(err);
    return;
  }

  // 카드가 DOM 에 올라온 뒤에 관찰을 시작해야 한다
  initReceiptReveal();
  initProfitCountReveal();
  initGridReveal();
  initStoreSwiper();
};

document.addEventListener('DOMContentLoaded', boot);
