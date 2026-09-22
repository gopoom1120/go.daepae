"use client";

import { useEffect, type RefObject } from "react";

/** 컨테이너 안에서 selector 에 매치되는 요소들을 처음 뷰포트에 들어올 때 한 번만 in-view 클래스로 떠오르게 한다 */
export function useScrollReveal(containerRef: RefObject<HTMLElement>, selector: string) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const targets = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [containerRef, selector]);
}
