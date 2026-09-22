"use client";

import { useEffect } from "react";

const EVENT_NAME = "open-inquiry-sheet";

/** 헤더/히어로/창업비용/05 CTA/FAB 등 여러 위치의 버튼이 InquirySheet 를 열도록 트리거한다 */
export function openInquirySheet() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useInquirySheetOpenListener(onOpen: () => void) {
  useEffect(() => {
    const handler = () => onOpen();
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [onOpen]);
}
