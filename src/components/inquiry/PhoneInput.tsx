"use client";

import { formatPhoneNumber } from "@/libs/format";

interface PhoneInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

/** 가맹문의 폼 3곳의 연락처 입력란에 공통으로 쓰는 자동 하이픈 포맷 입력 */
export function PhoneInput({
  id,
  value,
  onChange,
  placeholder = "'-' 없이 숫자만 입력해주세요",
  required,
}: PhoneInputProps) {
  return (
    <input
      type="tel"
      id={id}
      value={value}
      placeholder={placeholder}
      required={required}
      onChange={(e) => onChange(formatPhoneNumber(e.target.value))}
    />
  );
}
