"use client";

import { openInquirySheet } from "@/hooks/useInquirySheetTrigger";
import type { CostSection } from "@/types/content";

interface CostProps {
  cost: CostSection;
}

export function Cost({ cost }: CostProps) {
  return (
    <section className="cost" id="cost">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">04 · FRANCHISE COST</div>
          <h2>
            <span className="cost-title-line1">점주들의 의한 고품격 이벤트</span>
            <br />
            <span className="h2-accent accent-impact">7호점까지!!</span>
          </h2>
          <p>
            가맹비 전액 무료
            <br />
            전수창업으로 인한 마진률 극대화 기회
          </p>
        </div>
        <div className="cost-table" id="costTable">
          <div className="cost-row cost-head">
            <span>{cost.head.item}</span>
            <span>{cost.head.detail}</span>
            <span>{cost.head.price}</span>
          </div>
          {cost.rows.map((row) => (
            <div className="cost-row" key={row.item}>
              <span>{row.item}</span>
              <span>{row.detail}</span>
              <span>{row.price}</span>
            </div>
          ))}
        </div>
        <div className="cost-note">
          <div className="cost-badge">전수창업 7호점 한정</div>
          <p>
            안정적인 브랜드 운영과 체계적인 시스템 구축을 위해 전수창업은 7호점까지만 제한적으로
            운영됩니다. 브랜드의 방향성과 완성도를 충분히 갖춘 이후, 본격적인 프랜차이즈 확장을 통해
            더 큰 성장을 이어갈 예정입니다.
          </p>
        </div>
        <button type="button" className="btn-primary cost-cta" onClick={openInquirySheet}>
          정확한 비용 상담받기
        </button>
      </div>
    </section>
  );
}
