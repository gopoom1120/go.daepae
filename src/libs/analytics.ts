import posthog from "posthog-js";

/** PostHog 가 초기화된 경우에만 이벤트를 보낸다. 개인정보(이름/연락처)는 props 에 넣지 않는다 */
export function track(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || !posthog.__loaded) return;
  posthog.capture(event, props);
}
