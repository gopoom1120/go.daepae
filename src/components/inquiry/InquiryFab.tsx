"use client";

import { openInquirySheet } from "@/hooks/useInquirySheetTrigger";

export function InquiryFab() {
  return (
    <button
      type="button"
      className="inquiry-fab"
      aria-label="창업 문의 상담 신청"
      onClick={openInquirySheet}
    >
      <span className="inquiry-fab__label">창업 문의</span>
    </button>
  );
}
