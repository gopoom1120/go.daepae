"use client";

import { useEffect } from "react";
import { formatWon } from "@/libs/format";

type SalesEl = HTMLElement & { __salesRaf?: number | null };

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** .r-sales 매출 숫자를 0 → 실제값으로 카운트업한다 (ease-out cubic, 1.1s) */
const animateSalesCount = (el: SalesEl, target: number, duration = 1100) => {
  if (el.__salesRaf) cancelAnimationFrame(el.__salesRaf);
  if (prefersReducedMotion()) {
    el.textContent = formatWon(target);
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatWon(Math.round(target * eased));
    el.__salesRaf = progress < 1 ? requestAnimationFrame(step) : null;
  };
  el.__salesRaf = requestAnimationFrame(step);
};

/**
 * 매출 숫자 카운트업은 종이 펼침(useReceiptReveal)과 트리거를 일부러 분리한다 — 카드
 * (.receipt-col) 자신이 뷰포트에 40% 이상 보일 때를 기준으로 카운트업/리셋을 토글한다.
 */
export function useProfitCountReveal() {
  useEffect(() => {
    const cols = Array.from(document.querySelectorAll<HTMLElement>("#profit .receipt-col"));
    if (!cols.length) return;

    const wasInView = new WeakMap<HTMLElement, boolean>();

    const update = () => {
      const vh = window.innerHeight;
      cols.forEach((col) => {
        const salesEl = col.querySelector<SalesEl>(".r-sales");
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

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
}
