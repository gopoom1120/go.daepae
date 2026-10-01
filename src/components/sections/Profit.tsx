import { formatWon } from "@/libs/format";
import { ProfitPieChart } from "@/components/sections/ProfitPieChart";
import type { ProfitItem } from "@/types/content";

interface ProfitProps {
  profit: ProfitItem[];
}

export function Profit({ profit }: ProfitProps) {
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
        <div className="profit-grid">
          {profit.map((item) => (
            <div className="profit-card" key={item.name}>
              <div className="profit-card__tag">{item.name}</div>
              <div className="profit-card__photo">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="profit-badges">
                <div className="profit-badge">
                  순수익률 <b>{item.rate}%</b>
                </div>
                <div className="profit-badge">
                  월 매출 약 <b>{formatWon(item.salesManWon)}</b>만원
                </div>
              </div>
              <div className="profit-connector" aria-hidden="true"></div>
              <ProfitPieChart cost={item.cost} rate={item.rate} />
            </div>
          ))}
        </div>
        <p className="profit-footnote">*실제 데이터 기반으로 작성된 표입니다.</p>
      </div>
    </section>
  );
}
