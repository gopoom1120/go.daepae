"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { MeatItem, SelfbarItem } from "@/types/content";

interface MenuProps {
  meat: MeatItem[];
  selfbar: SelfbarItem[];
}

export function Menu({ meat, selfbar }: MenuProps) {
  const meatRef = useRef<HTMLDivElement>(null);
  const selfbarRef = useRef<HTMLDivElement>(null);
  useScrollReveal(meatRef, ".meat-card");
  useScrollReveal(selfbarRef, ".sb-item");

  return (
    <section className="menu" id="menu">
      <div className="wrap">
        <div className="section-head">
          <div className="kicker">02 · MENU</div>
          <h2>
            고기 종류 <span className="h2-accent accent-impact">9가지</span>
          </h2>
          <p>모듬 한판부터 ++꽃등심 대패까지, 다양한 부위를 대패 방식으로 즐길 수 있습니다.</p>
        </div>
        <div className="meat-grid" id="meatGrid" ref={meatRef}>
          {meat.map((item) => (
            <div className="meat-card" key={item.name}>
              <div className="meat-card__circle">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="meat-card__label">{item.name}</div>
            </div>
          ))}
        </div>

        <div className="selfbar-note">
          <b>셀프바 25종 이상</b>
          <span>
            상차림이 제공되지 않아 고객이 직접 셀프바를 이용합니다 · 상권에 맞게 일부 변경 가능
          </span>
        </div>
        <div className="selfbar-grid" id="selfbarGrid" ref={selfbarRef}>
          {selfbar.map((item) => (
            <div className="sb-item" key={item.name}>
              <div className="circle">
                <img src={item.image} alt={item.name} />
              </div>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
