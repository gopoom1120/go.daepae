"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { SelectField } from "@/components/inquiry/SelectField";
import { PhoneInput } from "@/components/inquiry/PhoneInput";
import { FRANCHISE_TYPE_OPTIONS } from "@/components/inquiry/franchiseTypes";
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import { useInquirySheetOpenListener } from "@/hooks/useInquirySheetTrigger";

const initialValues = {
  name: "",
  phone: "",
  franchiseType: "",
  region: "",
  website: "",
  agree: false,
};

/**
 * 문의하기 Bottom Sheet — 헤더/히어로/창업비용/05 CTA/FAB 등 [data-open-inquiry] 트리거들이
 * useInquirySheetTrigger 의 CustomEvent 를 통해 이 컴포넌트를 연다. hidden(visible=false → 렌더 안 함)
 * 을 뗀 다음 프레임에 .is-open 을 붙여야 CSS transition 이 시작값을 인식한다.
 */
export function InquirySheet() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const { disabled, buttonText, submit } = useInquirySubmit();
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const typeLabelId = useId();
  const titleId = useId();

  const openSheet = () => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setVisible(true);
    requestAnimationFrame(() => setOpen(true));
  };

  useInquirySheetOpenListener(openSheet);

  const closeSheet = () => {
    setOpen(false);
    lastFocusedRef.current?.focus();
    setTimeout(() => setVisible(false), 350);
  };

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    formRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(
      {
        name: values.name,
        phone: values.phone,
        franchiseType: values.franchiseType,
        region: values.region,
        website: values.website,
      },
      () => setValues(initialValues),
    );
  };

  if (!visible) return null;

  return (
    <div
      className={`inquiry-sheet-backdrop${open ? " is-open" : ""}`}
      id="inquirySheetBackdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSheet();
      }}
    >
      <div
        className="inquiry-sheet"
        id="inquirySheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="inquiry-sheet-close"
          aria-label="닫기"
          onClick={closeSheet}
        >
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
        <div className="inquiry-sheet-scroll">
          <div className="inquiry-sheet-brand">
            <img src="/assets/imgs/logo_gold.png" alt="고품격대패" />
          </div>
          <p className="inquiry-sheet-desc" id={titleId}>
            창업 전문가가 직접 상담해드려요
          </p>
          <form
            id="inquirySheetForm"
            className="inquiry-sheet-form"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="website"
              className="hp-field"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={values.website}
              onChange={(e) => setValues((v) => ({ ...v, website: e.target.value }))}
            />
            <div className="field">
              <label htmlFor="inqName">이름</label>
              <input
                type="text"
                id="inqName"
                placeholder="성함을 입력해주세요"
                required
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label htmlFor="inqPhone">연락처</label>
              <PhoneInput
                id="inqPhone"
                value={values.phone}
                onChange={(phone) => setValues((v) => ({ ...v, phone }))}
                required
              />
            </div>
            <div className="field">
              <label id={typeLabelId}>창업유형</label>
              <SelectField
                labelledBy={typeLabelId}
                listAriaLabel="창업유형"
                placeholder="창업유형 선택"
                options={FRANCHISE_TYPE_OPTIONS}
                value={values.franchiseType}
                onChange={(franchiseType) => setValues((v) => ({ ...v, franchiseType }))}
              />
            </div>
            <div className="field">
              <label htmlFor="inqRegion">창업희망지역</label>
              <input
                type="text"
                id="inqRegion"
                placeholder="창업 희망 지역을 '시/도'로 알려주세요."
                value={values.region}
                onChange={(e) => setValues((v) => ({ ...v, region: e.target.value }))}
              />
            </div>
            <div className="form-agree-row">
              <label className="form-agree">
                <input
                  type="checkbox"
                  id="inqAgree"
                  required
                  className="form-agree-input"
                  checked={values.agree}
                  onChange={(e) => setValues((v) => ({ ...v, agree: e.target.checked }))}
                />
                <span className="form-agree-check" aria-hidden="true">
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
                <span>개인정보처리방침 동의</span>
              </label>
              <a href="#" className="form-agree-more">
                전문보기
              </a>
            </div>
          </form>
        </div>
        <button
          type="submit"
          form="inquirySheetForm"
          className="inquiry-sheet-submit"
          disabled={disabled}
        >
          {buttonText("문의 남기기")}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
