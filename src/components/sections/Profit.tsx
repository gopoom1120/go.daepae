"use client";

import type { CSSProperties } from "react";
import { useReceiptReveal } from "@/hooks/useReceiptReveal";
import { useProfitCountReveal } from "@/hooks/useProfitCountReveal";
import { formatWon } from "@/libs/format";
import type { ProfitItem } from "@/types/content";

interface ProfitProps {
  profit: ProfitItem[];
}

export function Profit({ profit }: ProfitProps) {
  useReceiptReveal();
  useProfitCountReveal();

  return (
    <section className="profit" id="profit">
      <div className="wrap">
        <div className="profit-head">
          <div className="kicker">03 · PROFIT ANALYSIS</div>
          <h2>
            가맹점주님들의
            <br />
            <em className="accent-impact">거짓 없는 선택!</em>
          </h2>
          <p className="profit-sub">
            전 가맹점 <span className="underline-mark">거짓 없이 공개하는</span> 안정적인 월 매출
          </p>
        </div>
        <div id="profitCards" className="receipt-track">
          {profit.map((item, i) => (
            <div
              className={`receipt-col${item.tall ? " center" : ""}`}
              style={{ "--d": `${i * 140}ms` } as CSSProperties}
              key={item.name}
            >
              <div className="printer-bar">
                <div className="printer-slot"></div>
              </div>
              <div className="receipt-mask">
                <div className="receipt-body">
                  <div className="receipt-paper">
                    <div className="r-label">운영형태 [ 홀 / 셀프바 ]</div>
                    <div className="r-store">{item.name}</div>
                    <div className="r-sales" data-value={item.salesWon}>
                      {formatWon(0)}
                    </div>
                    <div className="r-divider"></div>
                    <div className="r-sub">
                      순수익률 <b>{item.rate}%</b>
                    </div>
                    <div className="r-divider"></div>
                    <div className="r-date">{item.open} 기준</div>
                    <div className="r-barcode"></div>
                  </div>
                  <div className="receipt-scallop"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="profit-footnote">
          * 카탈로그에 명시된 실제 운영 데이터 기준입니다. 상권·평수·운영 방식에 따라 매장별 수치는
          달라질 수 있습니다.
        </p>
      </div>
    </section>
  );
}
