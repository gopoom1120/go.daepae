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
/* 2026-10, 레퍼런스 이미지는 원이 카드 폭을 거의 꽉 채운다는 사용자 피드백으로
   RADIUS/STROKE_WIDTH 를 키워 바깥 라벨 여백을 줄이고 링 자체를 확대했다
   (기존 50/100 → 80/150, OUTER_R 100→155). */
const RADIUS = 80;
const STROKE_WIDTH = 150;
const OUTER_R = RADIUS + STROKE_WIDTH / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type CostKey = keyof ProfitCostBreakdown;

/* 2026-10, 사용자가 준 레퍼런스 파이차트 이미지에서 픽셀 샘플링한 색이다 — 11개 토큰 중
   이 톤을 내는 게 없어 배지 배경(#ebe0d1) 때와 같은 방식으로 리터럴 hex 를 쓴다.
   textColor 는 레퍼런스처럼 라벨이 해당 조각 위에 직접 앉으므로 그 조각 색 기준으로
   정한다(밝은 조각엔 잉크색, 어두운 조각엔 크림색). 음료·주류는 조각이 너무 가늘어
   여전히 링 밖 리더선 라벨을 쓰므로 거기 깔리는 다크 섹션 배경 기준 잉크/크림과 무관하게
   별도 CSS(.profit-pie__leader-label)로 색을 관리한다. */
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
  { key: "labor", label: "인건비", color: "#dfdad3", textColor: INK },
  { key: "utilities", label: "기타 공과금", color: "#393b3b", textColor: CREAM },
  { key: "drink", label: "음료", color: "#14120f", textColor: INK, leader: true },
  { key: "alcohol", label: "주류", color: "#7d7f82", textColor: INK, leader: true },
];

/** angleDeg: 12시 방향이 0, 시계방향으로 증가 */
const toXY = (angleDeg: number, r: number) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CENTER + r * Math.sin(rad), y: CENTER - r * Math.cos(rad) };
};

const pct = (n: number) => `${(n / SIZE) * 100}%`;

/** 음료·주류 리더선 라벨은 각도 기반으로 두면 기타공과금 라벨과 겹치므로
    좌하단 고정 지점으로 꺾어 보낸다(실제 차트의 "독레그" 리더선 방식). */
/* 2026-10, 다른 4개 라벨이 조각 안으로 들어와 바깥 공간을 쓸 일이 줄어든 만큼
   리더선이 불필요하게 길어 보인다는 피드백으로 링에 더 가깝게 당겼다(1.1→0.88). */
/* 2026-10, "음료·주류" 합성 라벨 + 선 1개를 레퍼런스처럼 각 조각이 자기 선을 갖는
   형태(음료 선 1개, 주류 선 1개, 라벨도 각각 별도 텍스트)로 분리했다. 두 라벨은
   나란히 놓이되 겹치지 않도록 x 를 떨어뜨린다. */
const LEADER_LABEL_POS: Record<"drink" | "alcohol", { x: number; y: number }> = {
  drink: { x: SIZE * 0.1, y: SIZE * 0.88 },
  alcohol: { x: SIZE * 0.26, y: SIZE * 0.88 },
};
/* 2026-10, 선 끝과 텍스트가 맞닿아 겹쳐 보인다는 피드백으로, 선은 LEADER_LABEL_POS 에서
   멈추고 텍스트는 그보다 살짝 아래(이 간격만큼)에서 시작하도록 띄웠다.
   2026-10, 0.035 는 간격이 너무 벌어져 보인다는 피드백으로 더 좁혔다. */
const LEADER_LABEL_GAP = SIZE * 0.015;

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
  /* 2026-10, 음료·주류 각 조각의 실제 중심각에서 선을 바로 뽑으면 두 조각이 맞닿은
     순서(음료가 더 오른쪽/아래, 주류가 더 왼쪽/위)와 라벨을 읽는 순서(음료 왼쪽, 주류
     오른쪽)가 어긋나 선 두 개가 X 자로 교차했다. 한 점(apex)에서 포크로 갈라지게 했던
     중간 시도는 레퍼런스처럼 "선 2개가 각자 다른 지점에서 시작"하는 모양이 아니었다.
     이 두 조각을 합친 가는 쐐기(utilities 와 profit 사이)의 양쪽 끝 경계를 그대로 쓰면
     출발점이 서로 너무 멀어져 한쪽은 위로, 한쪽은 아래로 치우쳐 보였다 — 피드백으로
     쐐기의 중심각(leaderMidAngle) 쪽으로 당겨 두 출발점이 조각들이 만나는 꼭짓점
     가까이에 모이도록 좁혔다(LEADER_START_NARROW). 오른쪽(아래)점→오른쪽 라벨(주류),
     왼쪽(위)점→왼쪽 라벨(음료)로 잇는 순서는 유지해 교차는 여전히 없다. */
  const leaderStart = leaderSlices[0]?.c ?? 0;
  const leaderEnd = leaderSlices.length
    ? leaderSlices[leaderSlices.length - 1].c + leaderSlices[leaderSlices.length - 1].value
    : 0;
  const leaderMidAngle = ((leaderStart + leaderEnd) / 2 / 100) * 360;
  const leaderHalfSpan = (((leaderEnd - leaderStart) / 100) * 360) / 2;
  const LEADER_START_NARROW = 0.35;
  const leaderRightEdge = toXY(leaderMidAngle - leaderHalfSpan * LEADER_START_NARROW, OUTER_R);
  const leaderLeftEdge = toXY(leaderMidAngle + leaderHalfSpan * LEADER_START_NARROW, OUTER_R);
  const leaderFrom: Record<"drink" | "alcohol", { x: number; y: number }> = {
    drink: leaderLeftEdge,
    alcohol: leaderRightEdge,
  };
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
        {leaderSlices.map((s) => {
          const key = s.key as "drink" | "alcohol";
          const pos = LEADER_LABEL_POS[key];
          const from = leaderFrom[key];
          /* 2026-10, 다른 4개 라벨의 독레그 리더선과 통일감을 주기 위해 한 번 꺾이게
             했다 — 조각 경계에서 비스듬히 내려오다(1 구간) 라벨 바로 위에서 수직으로
             꺾여 떨어진다(2 구간). bend.x 를 라벨의 x 와 같게 두면 2 구간이 자동으로
             수직선이 된다. 2026-10, 사용자가 준 레퍼런스는 왼쪽(음료) 선은 꺾임 지점까지
             비스듬한 구간이 길고, 오른쪽(주류) 선은 거의 수직에 가깝다 — 꺾이는 비율을
             좌우 다르게 줘서 그 느낌을 재현했다. */
          const bendRatio = key === "drink" ? 0.55 : 0.2;
          const bend = { x: pos.x, y: from.y + (pos.y - from.y) * bendRatio };
          return (
            <polyline
              key={s.key}
              className="profit-pie__leader"
              points={`${from.x},${from.y} ${bend.x},${bend.y} ${pos.x},${pos.y}`}
              fill="none"
            />
          );
        })}
      </svg>

      {/* 2026-10, 레퍼런스처럼 라벨을 링 밖이 아니라 조각 안에 직접 앉힌다 — 링 밖 배치
         시절의 좌/우 정렬 분기(align)는 더 이상 필요 없다. 정확히 센터라인(RADIUS)이
         아니라 +20 바깥쪽에 두는 이유는, 센터라인에 두면 좁은 모바일 박스에서 중앙
         "순수익 N%" 오버레이와 겹치기 때문이다. */}
      {outsideSlices.map((s) => {
        const { x, y } = toXY(s.angle, RADIUS + 20);
        return (
          <div
            key={s.key}
            className="profit-pie__slice-label"
            style={{ left: pct(x), top: pct(y), color: s.textColor }}
          >
            <span>
              {/* "기타 공과금"처럼 공백이 있는 라벨은 레퍼런스처럼 단어 단위로 줄바꿈한다
                 (좁은 조각 안에서 옆 라벨과 겹치지 않도록) */}
              {s.label.split(" ").map((word, idx) => (
                <span key={idx} style={{ display: "block" }}>
                  {word}
                </span>
              ))}
            </span>
            <b>{s.value}%</b>
          </div>
        );
      })}

      {leaderSlices.map((s) => {
        const pos = LEADER_LABEL_POS[s.key as "drink" | "alcohol"];
        return (
          <div
            key={s.key}
            className="profit-pie__leader-label"
            style={{ left: pct(pos.x), top: pct(pos.y + LEADER_LABEL_GAP) }}
          >
            {s.label}
          </div>
        );
      })}

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
