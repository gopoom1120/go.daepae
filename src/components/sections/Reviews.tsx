"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function Reviews() {
  const gridRef = useRef<HTMLDivElement>(null);
  useScrollReveal(gridRef, ".review-item");

  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">REAL REVIEW</div>
          <h2>
            손님이 남긴
            <br />
            <span className="h2-accent accent-impact">소비자 찐후기</span>
          </h2>
          <p>
            네이버 지도에 실제로 남겨주신 방문 후기를 그대로 옮겨왔습니다 과장도, 삭제도 없습니다.
          </p>
        </div>
        <div className="review-grid" ref={gridRef}>
          <div className="review-item">
            <div className="review-badge">
              시흥 은계점 <b>리뷰 116+</b>
            </div>
            <div className="review-phone">
              <img
                className="review-phone__screen"
                src="/assets/imgs/review1.png"
                alt="고품격대패 시흥 은계점 방문 후기 캡처"
              />
              <img
                className="review-phone__frame"
                src="/assets/imgs/iphone.png"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="review-item">
            <div className="review-badge">
              왕십리 본점 <b>리뷰 675+</b>
            </div>
            <div className="review-phone">
              <img
                className="review-phone__screen"
                src="/assets/imgs/review2.png"
                alt="고품격대패 왕십리 본점 방문 후기 캡처"
              />
              <img
                className="review-phone__frame"
                src="/assets/imgs/iphone.png"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="review-item">
            <div className="review-badge">
              천호 직영점 <b>리뷰 24+</b>
            </div>
            <div className="review-phone">
              <img
                className="review-phone__screen"
                src="/assets/imgs/review3.png"
                alt="고품격대패 천호 직영점 방문 후기 캡처"
              />
              <img
                className="review-phone__frame"
                src="/assets/imgs/iphone.png"
                alt=""
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
