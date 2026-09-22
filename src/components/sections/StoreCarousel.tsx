"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Autoplay, A11y } from "swiper/modules";
import type { StoreItem } from "@/types/content";

const PIN_PATH =
  "M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z";

interface StoreCarouselProps {
  stores: StoreItem[];
}

/**
 * 05 매장위치 — Swiper 캐러셀. prefers-reduced-motion 을 존중해 자동재생을 아예 켜지 않고,
 * #location 섹션이 30% 이상 뷰포트에 들어왔을 때만 자동재생이 돈다(사용자 일시정지 토글과
 * 별개 조건). 캐러셀이 넘어갈 때마다 좌측 캡션(store-caption)을 realIndex 기준으로 동기화한다.
 */
export function StoreCarousel({ stores }: StoreCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const ringRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mql.matches);
    setUserPaused(mql.matches);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const section = document.getElementById("location");
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold: 0.3 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !swiper.autoplay) return;
    if (inView && !userPaused) swiper.autoplay.start();
    else swiper.autoplay.stop();
  }, [inView, userPaused]);

  const activeStore = stores[activeIndex] ?? stores[0];

  return (
    <div className="location-layout">
      <div className="location-left">
        <div className="section-head">
          <div className="kicker">05 · STORE LOCATIONS</div>
          <h2>
            세 곳의 매장,
            <br />
            <span className="h2-accent accent-impact">확장을 증명하는 기록</span>
          </h2>
          <p>
            왕십리를 시작으로 천호, 시흥 은계까지 꾸준히 늘어난 매장이 브랜드의 신뢰를 증명합니다.
          </p>
        </div>
        <div className="store-bottom">
          <div className="store-caption" aria-live="polite">
            {activeStore && (
              <>
                <h4>{activeStore.name}</h4>
                <div className="date">{activeStore.date}</div>
                {activeStore.mapUrl && (
                  <a
                    className="map-btn"
                    href={activeStore.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${activeStore.name} 네이버 지도에서 보기 (새 창)`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d={PIN_PATH} />
                    </svg>
                    네이버 지도로 보기
                  </a>
                )}
              </>
            )}
          </div>
          <div className="store-nav">
            <button type="button" className="store-nav-btn store-nav-prev" aria-label="이전 매장">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className={`store-nav-btn store-nav-toggle${userPaused ? " is-paused" : ""}`}
              aria-label={userPaused ? "자동 재생 시작" : "자동 재생 일시정지"}
              onClick={() => setUserPaused((p) => !p)}
            >
              <svg
                ref={ringRef}
                className="store-nav-toggle__ring"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <circle cx="24" cy="24" r="21" />
              </svg>
              <svg
                className="icon-pause"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="14" y="3" width="5" height="18" rx="1" />
                <rect x="5" y="3" width="5" height="18" rx="1" />
              </svg>
              <svg
                className="icon-play"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
              </svg>
            </button>
            <button type="button" className="store-nav-btn store-nav-next" aria-label="다음 매장">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="location-right">
        <div className="swiper store-swiper">
          <Swiper
            modules={[Navigation, Autoplay, A11y]}
            slidesPerView={1.08}
            spaceBetween={20}
            loop
            speed={reduceMotion ? 0 : 550}
            autoplay={
              reduceMotion
                ? false
                : { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true }
            }
            navigation={{ prevEl: ".store-nav-prev", nextEl: ".store-nav-next" }}
            a11y={{ enabled: true }}
            breakpoints={{ 1025: { slidesPerView: 1.35, spaceBetween: 28 } }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.autoplay?.stop();
              setActiveIndex(swiper.realIndex);
              swiper.on("autoplayTimeLeft", (_s, _timeLeft, percentage) => {
                ringRef.current?.style.setProperty("--store-timer", String(percentage));
              });
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {stores.map((store) => (
              <SwiperSlide key={store.name}>
                <div className="store-card">
                  <div className="photo">
                    <img src={store.image} alt={store.name} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
