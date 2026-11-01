"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const MAX = 20;
const TOP = 8;
const BOT = 40;
const STEP = (W - 12) / MAX;
const pos = (v: number) => 6 + v * STEP;
// A steady hand, not a ruler: every mark gets its own small wobble.
const wob = (k: number, n: number) => {
  const s = Math.sin(k * 12.9898 + n * 78.233) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

function markPath(k: number) {
  if (k % 5) {
    const x = pos(k) - STEP / 2;
    const [x0, x1] = [x + wob(k, 1) * 1.2, x + wob(k, 2) * 1.6];
    return `M${x0} ${TOP + 1 + wob(k, 3) * 1.5}Q${(x0 + x1) / 2 + wob(k, 4) * 1.4} ${(TOP + BOT) / 2} ${x1} ${BOT + wob(k, 5) * 1.5}`;
  }
  // Every fifth mark strikes through the four before it.
  const [g0, g1] = [pos(k - 4) - STEP / 2 - 5, pos(k - 1) - STEP / 2 + 5];
  return `M${g0} ${BOT - 3 + wob(k, 6) * 2}Q${(g0 + g1) / 2} ${(TOP + BOT) / 2 + 3 + wob(k, 7) * 2} ${g1} ${TOP + 5 + wob(k, 8) * 2}`;
}
const MARKS = Array.from({ length: MAX }, (_, i) => ({ k: i + 1, d: markPath(i + 1) }));

const css = `
  .slider-tally { position: relative; width: ${W}px; height: 72px; }
  .slider-tally__svg { display: block; width: ${W}px; height: 48px; overflow: visible; }
  .slider-tally__slot { fill: light-dark(#dbdde1, #2e3035); transition: opacity 0.2s; }
  .slider-tally__mark {
    fill: none;
    stroke: light-dark(#42454c, #e5e6e9);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-dasharray: 1 1;
    stroke-dashoffset: 1;
    opacity: 0;
    transition: stroke-dashoffset 0.22s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.22s;
  }
  .slider-tally__mark--on { stroke-dashoffset: 0; opacity: 1; }
  .slider-tally__pen {
    position: absolute;
    top: 2px;
    left: calc(var(--slider-tally-x) - 1px);
    width: 2px;
    height: 42px;
    border-radius: 1px;
    background: light-dark(#6d7179, #7d8087);
    transform-origin: 50% 100%;
    transition: left 0.18s cubic-bezier(0.3, 1.3, 0.5, 1), transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1), background-color 0.2s;
  }
  .slider-tally:has(.slider-tally__input:active) .slider-tally__pen { transform: rotate(14deg); background: light-dark(#373a40, #f1f2f3); }
  .slider-tally:has(.slider-tally__input:focus-visible) .slider-tally__pen { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-tally__count { position: absolute; left: 0; top: 54px; font-size: 13px; color: light-dark(#5f626a, #a7abb2); }
  .slider-tally__count b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-tally__input { position: absolute; left: 0; top: 0; width: 100%; height: 48px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-tally__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 48px; }
  .slider-tally__input::-moz-range-thumb { width: 12px; height: 48px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-tally__mark, .slider-tally__pen { transition: none; }
  }
`;

export function TallySlider() {
  const [v, setV] = useState(12);
  const prev = useRef(v);
  const from = prev.current;
  useEffect(() => {
    prev.current = v;
  }, [v]);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-tally" style={{ '--slider-tally-x': `${pos(v)}px` } as React.CSSProperties}>
        <svg className="slider-tally__svg" aria-hidden="true">
          {MARKS.filter((m) => m.k % 5).map((m) => (
            <circle key={m.k} className="slider-tally__slot" cx={pos(m.k) - STEP / 2} cy={BOT + 6} r={1.2} style={{ opacity: m.k <= v ? 0 : 1 }} />
          ))}
          {MARKS.map((m) => {
            // New marks draw in order from the last one; removed ones rub out from the end back.
            const delay = m.k > from ? (m.k - from - 1) * 55 : (from - m.k) * 35;
            return (
              <path
                key={m.k}
                className={`slider-tally__mark${m.k <= v ? ' slider-tally__mark--on' : ''}`}
                d={m.d}
                pathLength={1}
                style={{ transitionDelay: `${Math.max(0, delay)}ms` }}
              />
            );
          })}
        </svg>
        <span className="slider-tally__pen" aria-hidden="true" />
        <p className="slider-tally__count" aria-hidden="true">
          <b>{v}</b> {v === 1 ? 'day' : 'days'} in a row
        </p>
        <input
          className="slider-tally__input"
          type="range"
          min={0}
          max={MAX}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Streak"
          aria-valuetext={`${v} ${v === 1 ? 'day' : 'days'}`}
        />
      </div>
    </>
  );
}
