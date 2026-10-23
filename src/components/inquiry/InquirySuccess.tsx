"use client";

import { useEffect } from "react";

/** 접수 완료 안내 본문 — 문의 Bottom Sheet 안과 InquirySuccessModal 에서 똑같이 쓴다 */
export function InquirySuccessContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="inquiry-sheet-success" role="status" aria-live="polite">
      <span className="inquiry-sheet-success-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <p className="inquiry-sheet-success-title">문의가 접수되었습니다</p>
      <p className="inquiry-sheet-success-desc">
        담당자가 확인 후 입력하신 연락처로
        <br />
        빠르게 연락드리겠습니다.
      </p>
      <button type="button" className="inquiry-sheet-success-btn" onClick={onClose}>
        확인
      </button>
    </div>
  );
}

/** 인라인 폼/스티키 바처럼 Bottom Sheet 밖에서 제출했을 때 띄우는 같은 모양의 접수 완료 팝업 */
export function InquirySuccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="inquiry-success-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="inquiry-success-card" role="dialog" aria-modal="true">
        <InquirySuccessContent onClose={onClose} />
      </div>
    </div>
  );
}
