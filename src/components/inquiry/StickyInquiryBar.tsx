"use client";

import { useState, type FormEvent } from "react";
import { SelectField } from "@/components/inquiry/SelectField";
import { PhoneInput } from "@/components/inquiry/PhoneInput";
import { FRANCHISE_TYPE_OPTIONS } from "@/components/inquiry/franchiseTypes";
import { useInquirySubmit } from "@/hooks/useInquirySubmit";

const initialValues = {
  name: "",
  phone: "",
  franchiseType: "",
  region: "",
  website: "",
  agree: false,
};

/** 하단 고정 문의 폼 바 — 데스크톱(>1024px) 전용, CSS 가 모바일에서 숨긴다 */
export function StickyInquiryBar() {
  const [values, setValues] = useState(initialValues);
  const { disabled, buttonText, submit } = useInquirySubmit();

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

  return (
    <div
      className="sticky-inquiry-bar"
      id="stickyInquiryBar"
      role="complementary"
      aria-label="가맹 문의"
    >
      <a className="sticky-inquiry-brand" href="tel:18771960">
        <img src="/assets/imgs/logo_gold.png" alt="" />
        <strong>가맹 문의 1877-1960</strong>
      </a>
      <form className="sticky-inquiry-form" onSubmit={handleSubmit}>
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
        <input
          type="text"
          id="sibName"
          placeholder="이름"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
        />
        <PhoneInput
          id="sibPhone"
          value={values.phone}
          onChange={(phone) => setValues((v) => ({ ...v, phone }))}
          placeholder="연락처"
          required
        />
        <SelectField
          ariaLabel="창업유형"
          listAriaLabel="창업유형"
          placeholder="창업유형"
          options={FRANCHISE_TYPE_OPTIONS}
          value={values.franchiseType}
          onChange={(franchiseType) => setValues((v) => ({ ...v, franchiseType }))}
        />
        <input
          type="text"
          id="sibRegion"
          name="region"
          placeholder="창업 희망 지역을 '시/도'로 알려주세요."
          value={values.region}
          onChange={(e) => setValues((v) => ({ ...v, region: e.target.value }))}
        />
        <div className="form-agree-row">
          <label className="form-agree">
            <input
              type="checkbox"
              id="sibAgree"
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
        <button type="submit" className="sticky-inquiry-submit" disabled={disabled}>
          {buttonText("문의하기")}
        </button>
      </form>
    </div>
  );
}
