"use client";

import { useId, useState, type FormEvent } from "react";
import { SelectField } from "@/components/inquiry/SelectField";
import { PhoneInput } from "@/components/inquiry/PhoneInput";
import { FRANCHISE_TYPE_OPTIONS } from "@/components/inquiry/franchiseTypes";
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import type { ContactInfo } from "@/types/content";

interface InlineInquiryFormProps {
  contact: ContactInfo;
}

const initialValues = {
  name: "",
  phone: "",
  franchiseType: "",
  region: "",
  website: "",
  agree: false,
};

/** 05 매장위치 맨 아래 문의 폼 */
export function InlineInquiryForm({ contact }: InlineInquiryFormProps) {
  const [values, setValues] = useState(initialValues);
  const { disabled, buttonText, submit } = useInquirySubmit();
  const typeLabelId = useId();

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
    <div className="inquiry-grid">
      <div className="inquiry-left">
        <h3>
          지금, 고품격대패와
          <br />
          <em className="accent-impact">함께하세요</em>
        </h3>
        <p>방문 예약, 창업 상담, 제휴 문의까지 남겨주시면 담당자가 순차적으로 연락드립니다.</p>
        <div id="contactLines">
          <div className="contact-line">
            <span className="k">창업문의</span>
            <span className="v">{contact.phone}</span>
          </div>
          <div className="contact-line">
            <span className="k">Instagram</span>
            <span className="v">
              {contact.instagramUrl ? (
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer">
                  {contact.instagram}
                </a>
              ) : (
                contact.instagram
              )}
            </span>
          </div>
        </div>
      </div>
      <form id="inquiryForm" onSubmit={handleSubmit}>
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
        <div className="field-row">
          <div>
            <label htmlFor="inlineName">이름</label>
            <input
              type="text"
              id="inlineName"
              placeholder="성함을 입력해주세요"
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="inlinePhone">연락처</label>
            <PhoneInput
              id="inlinePhone"
              value={values.phone}
              onChange={(phone) => setValues((v) => ({ ...v, phone }))}
              required
            />
          </div>
        </div>
        <div>
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
        <div>
          <label htmlFor="inlineRegion">창업희망지역</label>
          <input
            type="text"
            id="inlineRegion"
            placeholder="창업 희망 지역을 '시/도'로 알려주세요."
            value={values.region}
            onChange={(e) => setValues((v) => ({ ...v, region: e.target.value }))}
          />
        </div>
        <div className="form-agree-row">
          <label className="form-agree">
            <input
              type="checkbox"
              id="agree"
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
        <button className="submit-btn" type="submit" disabled={disabled}>
          {buttonText("문의 남기기")}
        </button>
      </form>
    </div>
  );
}
