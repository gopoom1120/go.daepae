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
        <div className="menu-banner">
          <div
            className="menu-banner__bg"
            role="img"
            aria-label="고품격대패 매장 물결형 인테리어 월사인"
          ></div>
          <div className="menu-banner__overlay" />
        </div>
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
          <span>
            단돈 2000원으로 즐기는 나만의 상차림 *계절과 식재료 시세에 맞춰 각 지점에서 셀프바
            구성을 탄력적으로 운영해 안정적인 수익성을 유지합니다.
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
