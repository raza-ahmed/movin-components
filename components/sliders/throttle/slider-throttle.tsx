"use client";

import * as React from "react";
import { useState } from 'react';

const STREAKS = [
  { x: 18, d: 0 },
  { x: 40, d: -0.22 },
  { x: 96, d: -0.11 },
  { x: 118, d: -0.33 },
  { x: 64, d: -0.4 },
];

const css = `
  @keyframes slider-throttle-streak { from { transform: translateY(-24px); } to { transform: translateY(170px); } }
  @keyframes slider-throttle-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(calc(var(--slider-throttle-v) * var(--slider-throttle-v) * 1.6px)); } 75% { transform: translateX(calc(var(--slider-throttle-v) * var(--slider-throttle-v) * -1.6px)); } }
  @keyframes slider-throttle-flicker { from { transform: scaleY(0.82) scaleX(1.05); } to { transform: scaleY(1.08) scaleX(0.94); } }
  @keyframes slider-throttle-puff { from { transform: translateX(0) scale(0.6); opacity: calc(var(--slider-throttle-v) * 0.9); } to { transform: translateX(var(--dx)) scale(1.4); opacity: 0; } }
  .slider-throttle { display: grid; justify-items: center; gap: 12px; width: 220px; }
  .slider-throttle__sky { position: relative; width: 150px; height: 150px; overflow: hidden; border-radius: 16px; background: linear-gradient(light-dark(#fbfcfd, #121417), light-dark(#f3f4f7, #1a1c1f)); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .slider-throttle__streak { position: absolute; top: 0; width: 1.5px; height: 18px; border-radius: 1px; background: light-dark(#5f626a, #a7abb2); opacity: clamp(0, calc(var(--slider-throttle-v) * 2 - 0.8), 1); animation: slider-throttle-streak 0.45s linear infinite; transition: opacity 0.3s; }
  .slider-throttle__pad { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 1px 0 light-dark(#dbdde1, #2e3035); }
  .slider-throttle__puff { position: absolute; bottom: 8px; left: 66px; width: 18px; height: 18px; border-radius: 50%; background: light-dark(#cbced3, #393c41); opacity: 0; animation: slider-throttle-puff 0.9s ease-out infinite; }
  .slider-throttle__craft { position: absolute; left: 50%; bottom: 14px; width: 30px; height: 64px; margin-left: -15px; transform: translateY(calc(var(--slider-throttle-v) * -54px)); transition: transform 0.6s cubic-bezier(0.3, 1.1, 0.5, 1); }
  .slider-throttle__shake { position: absolute; inset: 0; animation: slider-throttle-shake 0.09s linear infinite; }
  .slider-throttle__rocket { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .slider-throttle__body { fill: light-dark(#42454c, #e5e6e9); }
  .slider-throttle__fin { fill: light-dark(#6d7179, #7d8087); }
  .slider-throttle__port { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.5; }
  .slider-throttle__flame {
    position: absolute;
    left: 50%;
    top: 58px;
    width: 12px;
    height: calc(4px + var(--slider-throttle-v) * 44px);
    margin-left: -6px;
    border-radius: 40% 40% 50% 50% / 20% 20% 80% 80%;
    background: linear-gradient(light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd) 45%, transparent);
    opacity: min(1, calc(var(--slider-throttle-v) * 8));
    transform-origin: 50% 0;
    animation: slider-throttle-flicker 0.07s linear infinite alternate;
    transition: height 0.3s, opacity 0.2s;
  }
  .slider-throttle__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .slider-throttle__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; font-variant-numeric: tabular-nums; }
  .slider-throttle__track { position: relative; width: 100%; height: 26px; }
  .slider-throttle__rail { position: absolute; left: 0; right: 0; top: 9px; height: 8px; border-radius: 4px; background: repeating-linear-gradient(90deg, light-dark(#ebedf0, #232529) 0 6px, light-dark(#f3f4f7, #1a1c1f) 6px 8px); }
  .slider-throttle__fill { position: absolute; left: 0; top: 9px; height: 8px; border-radius: 4px; width: calc(11px + var(--slider-throttle-v) * (100% - 22px)); background: linear-gradient(90deg, light-dark(#6d7179, #7d8087), light-dark(#373a40, #f1f2f3)); }
  .slider-throttle__thumb { position: absolute; top: 2px; left: calc(var(--slider-throttle-v) * (100% - 22px)); width: 22px; height: 22px; border-radius: 6px; background: light-dark(#373a40, #f1f2f3); box-shadow: inset 0 -3px 0 light-dark(#50535b, #c6c8cd), 0 3px 8px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45)); }
  .slider-throttle:has(.slider-throttle__input:focus-visible) .slider-throttle__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-throttle__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-throttle__input::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; }
  .slider-throttle__input::-moz-range-thumb { width: 22px; height: 22px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-throttle * { animation: none !important; }
    .slider-throttle__craft { transition: none; }
  }
`;

export function ThrottleSlider() {
  const [v, setV] = useState(45);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-throttle" style={{ '--slider-throttle-v': v / 100 } as React.CSSProperties}>
        <span className="slider-throttle__sky" aria-hidden="true">
          {STREAKS.map((s) => (
            <span key={s.x} className="slider-throttle__streak" style={{ left: s.x, animationDelay: `${s.d}s` }} />
          ))}
          <span className="slider-throttle__puff" style={{ '--dx': '-34px' } as React.CSSProperties} />
          <span className="slider-throttle__puff" style={{ '--dx': '34px', animationDelay: '-0.45s' } as React.CSSProperties} />
          <span className="slider-throttle__pad" />
          <span className="slider-throttle__craft">
            <span className="slider-throttle__shake">
              <span className="slider-throttle__flame" />
              <svg className="slider-throttle__rocket" viewBox="0 0 30 64">
                <path className="slider-throttle__fin" d="M7 40L0 56L8 52ZM23 40L30 56L22 52Z" />
                <path className="slider-throttle__body" d="M15 0C24 10 25 26 23 58H7C5 26 6 10 15 0Z" />
                <circle className="slider-throttle__port" cx="15" cy="24" r="4.5" />
              </svg>
            </span>
          </span>
        </span>
        <span className="slider-throttle__read" aria-hidden="true">
          Thrust <b>{v}%</b>
        </span>
        <div className="slider-throttle__track">
          <span className="slider-throttle__rail" />
          <span className="slider-throttle__fill" />
          <span className="slider-throttle__thumb" />
          <input className="slider-throttle__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Thrust" aria-valuetext={`${v} percent`} />
        </div>
      </div>
    </>
  );
}
