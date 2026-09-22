"use client";

import { useEffect, useState, type RefObject } from "react";

/** ref 대상 요소가 threshold 이상 뷰포트에 보이는지 여부를 반환한다 */
export function useInView<T extends HTMLElement>(ref: RefObject<T>, threshold = 0.3) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setInView(entry.isIntersecting)),
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}
