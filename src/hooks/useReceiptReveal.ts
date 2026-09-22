"use client";

import { useEffect } from "react";

/**
 * 03 수익분석 섹션의 영수증은 #profit 자체가 아니라 그 앞 02 메뉴 섹션의 셀프바 그리드
 * (#selfbarGrid) 상단을 기준으로 미리 펼쳐진다: 뷰포트 상단이 그 지점을 지나는 순간 펼쳐지고,
 * 다시 위로 스크롤을 올려야 접힌다 — 그 지점을 지날 때마다 반복 재생한다.
 */
export function useReceiptReveal() {
  useEffect(() => {
    const section = document.getElementById("profit");
    if (!section) return;
    const cols = Array.from(section.querySelectorAll<HTMLElement>(".receipt-col"));
    if (!cols.length) return;

    const trigger = document.getElementById("selfbarGrid") || section;
    let wasRevealed = false;

    const update = () => {
      const triggerTop = trigger.getBoundingClientRect().top + window.scrollY;
      const revealed = window.scrollY >= triggerTop;
      if (revealed === wasRevealed) return;
      wasRevealed = revealed;
      cols.forEach((col) => col.classList.toggle("in-view", revealed));
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
