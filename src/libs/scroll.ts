/** 네비게이션/CTA 의 [data-target] 스무스 스크롤 — 모바일 메뉴가 열려있으면 함께 닫는다 */
export function scrollToSection(id: string) {
  const targetEl = document.getElementById(id);
  if (!targetEl) return;
  targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("siteNav")?.classList.remove("nav-open");
}
