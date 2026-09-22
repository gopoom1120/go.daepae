"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, A11y, Keyboard } from "swiper/modules";
import { dataFetch } from "@/libs/api";

interface PopupItem {
  id: string | number;
  title?: string;
  content?: string;
  image_url?: string;
  link_url?: string;
}

interface PopupsResponse {
  data?: PopupItem[];
}

const todayKey = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
};

let popupsCache: Promise<PopupItem[]> | null = null;
const fetchPopups = (): Promise<PopupItem[]> => {
  if (!popupsCache) {
    popupsCache = dataFetch("/public/franchise-popups", { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: PopupsResponse) => json.data || [])
      .catch((err) => {
        console.warn("[고품격대패] 팝업/공지 로드 실패", err);
        return [] as PopupItem[];
      });
  }
  return popupsCache;
};

function PopupSlide({ item }: { item: PopupItem }) {
  const { title, content, image_url, link_url } = item;
  const inner = (
    <>
      {image_url && <img className="popup-image" src={image_url} alt={title || ""} />}
      {title && !image_url && <h3 className="popup-title">{title}</h3>}
      {content && <p className="popup-content">{content}</p>}
    </>
  );
  if (link_url) {
    return (
      <a className="popup-slide" href={link_url} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <div className="popup-slide">{inner}</div>;
}

/**
 * CMS(franchise_popups) 공개 목록을 mount 시 fetch 해 오늘 "보지 않기"로 닫지 않은 항목만
 * Swiper 슬라이드로 노출한다. 2개 이상이면 좌우 화살표/점 페이지네이션이 나타난다.
 */
export function CmsPopupModal() {
  const [items, setItems] = useState<PopupItem[] | null>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissToday, setDismissToday] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const swiperElRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPopups().then((all) => {
      if (cancelled) return;
      const filtered = all.filter(
        (p) => localStorage.getItem("popupDismiss:" + p.id) !== todayKey(),
      );
      setItems(filtered);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const multiple = (items?.length ?? 0) > 1;

  useEffect(() => {
    if (!items || !items.length) return;
    setVisible(true);
    requestAnimationFrame(() => setOpen(true));
  }, [items]);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
  }, [visible]);

  const centerPopupNav = () => {
    const swiperEl = swiperElRef.current;
    const modalEl = modalRef.current;
    if (!swiperEl || !modalEl) return;
    const prevBtn = swiperEl.querySelector<HTMLElement>(".swiper-button-prev");
    const nextBtn = swiperEl.querySelector<HTMLElement>(".swiper-button-next");
    if (!prevBtn || !nextBtn || prevBtn.hidden) return;

    const swiperRect = swiperEl.getBoundingClientRect();
    const modalRect = modalEl.getBoundingClientRect();
    const centerY = Math.round(modalRect.top + modalRect.height / 2 - swiperRect.top);
    prevBtn.style.top = `${centerY}px`;
    nextBtn.style.top = `${centerY}px`;
  };

  useEffect(() => {
    if (!open || !multiple) return;
    const swiperEl = swiperElRef.current;
    const wrapper = swiperEl?.querySelector<HTMLElement>(".swiper-wrapper");

    centerPopupNav();
    window.addEventListener("resize", centerPopupNav);

    let resizeObserver: ResizeObserver | undefined;
    if (wrapper && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(centerPopupNav);
      resizeObserver.observe(wrapper);
    }

    const images = Array.from(wrapper?.querySelectorAll("img") ?? []);
    images.forEach((img) => img.addEventListener("load", centerPopupNav));

    const timers = [0, 60, 150, 300, 600].map((ms) => setTimeout(centerPopupNav, ms));

    return () => {
      window.removeEventListener("resize", centerPopupNav);
      resizeObserver?.disconnect();
      images.forEach((img) => img.removeEventListener("load", centerPopupNav));
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, multiple, items]);

  const close = () => {
    if (dismissToday && items) {
      items.forEach((p) => localStorage.setItem("popupDismiss:" + p.id, todayKey()));
    }
    setOpen(false);
    setTimeout(() => setVisible(false), 350);
  };

  useEffect(() => {
    if (!open) return;
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dismissToday, items]);

  if (!visible || !items || !items.length) return null;

  return (
    <div
      className={`popup-backdrop${open ? " is-open" : ""}`}
      id="popupBackdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="popup-modal" id="popupModal" role="dialog" aria-modal="true" ref={modalRef}>
        <button type="button" className="popup-close" aria-label="닫기" onClick={close}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="swiper popup-swiper" id="popupSwiper" ref={swiperElRef}>
          <Swiper
            modules={[Navigation, Pagination, EffectFade, A11y, Keyboard]}
            loop={multiple}
            speed={reduceMotion ? 0 : 350}
            autoHeight
            effect="fade"
            fadeEffect={{ crossFade: true }}
            navigation={
              multiple
                ? {
                    prevEl: "#popupSwiper .swiper-button-prev",
                    nextEl: "#popupSwiper .swiper-button-next",
                  }
                : false
            }
            pagination={
              multiple ? { el: "#popupSwiper .popup-pagination", clickable: true } : false
            }
            a11y={{ enabled: true }}
            keyboard={{ enabled: true }}
            onSlideChangeTransitionEnd={centerPopupNav}
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <PopupSlide item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
          {multiple && (
            <>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
              <div className="swiper-pagination popup-pagination"></div>
            </>
          )}
        </div>
        <div className="popup-footer">
          <label className="popup-dismiss-today">
            <input
              type="checkbox"
              checked={dismissToday}
              onChange={(e) => setDismissToday(e.target.checked)}
            />
            <span>오늘 하루 보지 않기</span>
          </label>
          <button type="button" className="popup-footer-close" onClick={close}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
