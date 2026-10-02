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
            다양한 <span className="h2-accent accent-impact">고기종류</span>
          </h2>
          <p>돼지고기 소고기 오리고기 등 다양한 부위를 대패로 즐길 수 있습니다.</p>
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
          <span>단돈 2000원으로 즐기는 나만의 상차림 (상권에 따라 일부 셀프바 변경 가능)</span>
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
