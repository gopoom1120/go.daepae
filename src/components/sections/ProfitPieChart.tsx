"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import type { ProfitCostBreakdown } from "@/types/content";

interface ProfitPieChartProps {
  cost: ProfitCostBreakdown;
  rate: number;
}

const SIZE = 400;
const CENTER = 200;
const RADIUS = 50;
const STROKE_WIDTH = 100;
const OUTER_R = RADIUS + STROKE_WIDTH / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type CostKey = keyof ProfitCostBreakdown;

/* 2026-10, 사용자가 준 레퍼런스 파이차트 이미지에서 픽셀 샘플링한 색이다 — 11개 토큰 중
   이 톤을 내는 게 없어 배지 배경(#ebe0d1) 때와 같은 방식으로 리터럴 hex 를 쓴다.
   textColor 는 각 라벨이 실제로 깔리는 배경(다크 섹션 배경, 조각 자체가 아니다 — 라벨은
   OUTER_R+26 위치로 링 밖에 나가 있다) 기준으로 정한다. 2026-10, 인건비 라벨이 잉크색이라
   다크 배경에 거의 안 보이던 걸 사용자가 지적해 크림색으로 통일했다. */
const INK = "#14120f";
const CREAM = "#dfdad3";
const SLICE_DEFS: Array<{
  key: CostKey;
  label: string;
  color: string;
  textColor: string;
  leader?: boolean;
}> = [
  { key: "food", label: "식자재", color: "#7e674a", textColor: CREAM },
  { key: "meat", label: "고기", color: "#a18564", textColor: CREAM },
  { key: "labor", label: "인건비", color: "#dfdad3", textColor: CREAM },
  { key: "utilities", label: "기타 공과금", color: "#393b3b", textColor: CREAM },
  { key: "drink", label: "음료", color: "#7d7f82", textColor: INK, leader: true },
  { key: "alcohol", label: "주류", color: "#14120f", textColor: INK, leader: true },
];

/** angleDeg: 12시 방향이 0, 시계방향으로 증가 */
const toXY = (angleDeg: number, r: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + r * Math.sin(rad), y: CENTER - r * Math.cos(rad) };
};

const pct = (n: number) => `${(n / SIZE) * 100}%`;

/** 음료·주류 리더선 라벨은 각도 기반으로 두면 기타공과금 라벨과 겹치므로
    좌하단 고정 지점으로 꺾어 보낸다(실제 차트의 "독레그" 리더선 방식). */
const LEADER_LABEL_POS = { x: SIZE * 0.1, y: SIZE * 0.96 };

export function ProfitPieChart({ cost, rate }: ProfitPieChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, 0.35);

  let cumulative = 0;
  const costSlices = SLICE_DEFS.map((def, i) => {
    const value = cost[def.key];
    const c = cumulative;
    cumulative += value;
    return {
      ...def,
      value,
      i,
      c,
      length: (CIRCUMFERENCE * value) / 100,
      dashoffset: -((CIRCUMFERENCE * c) / 100),
      angle: ((c + value / 2) / 100) * 360,
    };
  });
  const profitSlice = {
    key: "profit" as const,
    label: "순수익",
    color: "#c6af8f",
    value: rate,
    i: costSlices.length,
    length: (CIRCUMFERENCE * rate) / 100,
    dashoffset: -((CIRCUMFERENCE * cumulative) / 100),
    angle: ((cumulative + rate / 2) / 100) * 360,
  };

  const outsideSlices = costSlices.filter((s) => !s.leader);
  const leaderSlices = costSlices.filter((s) => s.leader);
  const leaderStart = leaderSlices[0]?.c ?? 0;
  const leaderEnd = leaderSlices.length
    ? leaderSlices[leaderSlices.length - 1].c + leaderSlices[leaderSlices.length - 1].value
    : 0;
  const leaderMidAngle = ((leaderStart + leaderEnd) / 2 / 100) * 360;
  const leaderLabel = leaderSlices.map((s) => s.label).join("·");
  /* 순수익 조각은 폭이 넓어(120~145도) 각도상 중앙(단순 평균)에 라벨을 두면 0도(식자재 경계)
     쪽으로 치우쳐 텍스트 일부가 옆 조각과 겹친다 — 경계에서 먼 쪽으로 약간 민다. */
  const overlayPos = toXY(profitSlice.angle - 15, RADIUS + 4);

  return (
    <div className={`profit-pie${inView ? " in-view" : ""}`} ref={wrapRef}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="profit-pie__svg" aria-hidden="true">
        <g style={{ transform: "rotate(-90deg)", transformOrigin: `${CENTER}px ${CENTER}px` }}>
          {[...costSlices, profitSlice].map((s) => (
            <circle
              key={s.key}
              className="pie-slice"
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              stroke={s.color}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDashoffset={s.dashoffset}
              style={
                {
                  "--len": s.length,
                  "--circumference": CIRCUMFERENCE,
                  "--i": s.i,
                } as CSSProperties
              }
            />
          ))}
        </g>
        {leaderSlices.length > 0 &&
          (() => {
            const from = toXY(leaderMidAngle, OUTER_R);
            const bend = toXY(leaderMidAngle, OUTER_R + 14);
            return (
              <polyline
                className="profit-pie__leader"
                points={`${from.x},${from.y} ${bend.x},${bend.y} ${LEADER_LABEL_POS.x},${LEADER_LABEL_POS.y}`}
                fill="none"
              />
            );
          })()}
      </svg>

      {outsideSlices.map((s) => {
        const { x, y } = toXY(s.angle, OUTER_R + 26);
        const dx = x - CENTER;
        const align = dx > 10 ? "left" : dx < -10 ? "right" : "center";
        return (
          <div
            key={s.key}
            className={`profit-pie__slice-label profit-pie__slice-label--${align}`}
            style={{ left: pct(x), top: pct(y), color: s.textColor }}
          >
            <span>{s.label}</span>
            <b>{s.value}%</b>
          </div>
        );
      })}

      {leaderSlices.length > 0 && (
        <div
          className="profit-pie__leader-label"
          style={{ left: pct(LEADER_LABEL_POS.x), top: pct(LEADER_LABEL_POS.y) }}
        >
          {leaderLabel}
        </div>
      )}

      <div
        className="profit-pie__overlay"
        style={{ left: pct(overlayPos.x), top: pct(overlayPos.y) }}
      >
        <span className="profit-pie__label">순수익</span>
        <b className="profit-pie__pct">{profitSlice.value}%</b>
      </div>
    </div>
  );
}
