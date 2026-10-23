"use client";

import { useEffect, useRef, useState } from "react";
import { dataFetch } from "@/libs/api";
import { track } from "@/libs/analytics";

export type InquiryPayload = {
  name: string;
  phone: string;
  franchiseType: string;
  region: string;
  website: string;
};

type Status = "idle" | "sending" | "success" | "error";

/** 가맹문의 폼 3곳(인라인/Bottom Sheet/스티키바) 공통 제출 처리 — CMS API로 전송한다 */
export function useInquirySubmit(successText = "접수되었습니다") {
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState<string | null>(null);
  /** 접수 완료 팝업 노출 여부 — 버튼 글자 복귀(2.5초)와 별개로 사용자가 닫을 때까지 유지 */
  const [done, setDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const submit = async (payload: InquiryPayload, onSuccess: () => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStatus("sending");
    setErrorText(null);

    let res: Response;
    try {
      res = await dataFetch("/franchise-inquiries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("[고품격대패] 문의 접수 실패(네트워크)", err);
      setErrorText("잠시 후 다시 시도해주세요");
      setStatus("error");
      timeoutRef.current = setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    if (res.ok) {
      track("inquiry_submit", { franchise_type: payload.franchiseType });
      setStatus("success");
      setDone(true);
      timeoutRef.current = setTimeout(() => {
        setStatus("idle");
        onSuccess();
      }, 2500);
      return;
    }

    const data = await res.json().catch(() => ({}) as { error?: string });
    console.error("[고품격대패] 문의 접수 실패", res.status, data);
    setErrorText(data.error || "잠시 후 다시 시도해주세요");
    setStatus("error");
    timeoutRef.current = setTimeout(() => setStatus("idle"), 3000);
  };

  const buttonText = (idleText: string) => {
    if (status === "sending") return "전송 중...";
    if (status === "success") return successText;
    if (status === "error") return errorText || "잠시 후 다시 시도해주세요";
    return idleText;
  };

  const disabled = status === "sending" || status === "success";

  const dismiss = () => setDone(false);

  return { status, done, dismiss, disabled, buttonText, submit };
}
