"use client";

import { openInquirySheet } from "@/hooks/useInquirySheetTrigger";

export function InquiryFab() {
  return (
    <button type="button" className="inquiry-fab" aria-label="문의하기" onClick={openInquirySheet}>
      <span className="inquiry-fab__label">문의하기</span>
    </button>
  );
}
