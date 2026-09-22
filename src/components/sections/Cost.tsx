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
            투명하게 안내하는
            <br />
            <span className="h2-accent accent-impact">창업 준비 항목</span>
          </h2>
          <p>
            정확한 창업비용은 상권·평수·업종변경 여부에 따라 달라지므로, 상담을 통해 정확히
            안내드립니다.
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
