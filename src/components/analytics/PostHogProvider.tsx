"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

/** PostHog 초기화 — 키가 없으면(로컬 등) 아무것도 하지 않는다 */
export function PostHogProvider() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
    });
  }, []);
  return null;
}
