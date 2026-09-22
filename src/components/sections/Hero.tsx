"use client";

import { openInquirySheet } from "@/hooks/useInquirySheetTrigger";
import { scrollToSection } from "@/libs/scroll";

export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg" role="img" aria-label="고품격대패 상차림"></div>
      <div className="hero-overlay"></div>

      <div className="hero-center">
        <div className="hero-eyebrow2">
          &quot;대패의 격&quot;이 다르다. 고기의 기준을 바로 세우다.
        </div>
        <h1 className="hero-wordmark">고품격대패</h1>
        <p className="hero-sub2">
          프리미엄 냉삼과 풍성한 셀프바로 완성하는
          <br />
          <b>대패삼겹의 새로운 기준</b>
        </p>
        <div className="hero-cta-group">
          <button type="button" className="btn-primary" onClick={openInquirySheet}>
            창업 문의하기
          </button>
          <a
            className="btn-ghost"
            href="#menu"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("menu");
            }}
          >
            메뉴 보기
          </a>
        </div>
        <div className="hero-badge-phone">
          <span className="dot"></span> 창업문의 <b>1877-1960</b>
        </div>
      </div>
    </section>
  );
}
