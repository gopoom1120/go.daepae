"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { CompetencyItem, TrustItem } from "@/types/content";

interface CompetitivenessProps {
  competency: CompetencyItem[];
  trust: TrustItem[];
}

export function Competitiveness({ competency, trust }: CompetitivenessProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  useScrollReveal(gridRef, ".comp-card");
  useScrollReveal(trustRef, ".trust-item");

  return (
    <section className="competency" id="competitiveness">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">01 · COMPETITIVENESS</div>
          <div className="comp-stars" aria-hidden="true">
            ★ ★ ★
          </div>
          <h2 className="comp-title">
            <span className="cline cline--light">이름값을 증명하는</span>
            <br />
            <span className="cline cline--accent accent-impact">세 가지 기준</span>
          </h2>
          <p>
            단순히 유행을 따르는 브랜드가 아닌, 오랫동안 사랑받을 수 있는 브랜드 고품격대패가
            추구하는 가치입니다.
          </p>
        </div>
        <div className="comp-grid" ref={gridRef}>
          {competency.map((item) => (
            <div className="comp-card" key={item.title}>
              <div className="comp-num">{item.num}</div>
              <h3>{item.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: item.desc ?? "" }} />
            </div>
          ))}
        </div>
        <div className="trust-strip" ref={trustRef}>
          {trust.map((item, i) => (
            <div className="trust-item" key={item.label}>
              <span className="trust-num">{String(i + 1).padStart(2, "0")}</span>
              <h5>{item.label}</h5>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
