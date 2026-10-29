"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-candle { display: grid; justify-items: center; gap: 12px; width: 220px; }
  @keyframes slider-candle-flicker { 0%, 100% { transform: scale(1, 1) rotate(-2deg); } 30% { transform: scale(0.94, 1.08) rotate(2deg); } 60% { transform: scale(1.05, 0.94) rotate(-1deg); } }
  .slider-candle__stand { position: relative; width: 120px; height: 116px; }
  .slider-candle__glow { position: absolute; left: 50%; width: 70px; height: 70px; margin: -35px; border-radius: 50%; background: radial-gradient(circle, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 22%, transparent), transparent 65%); top: calc(14px + var(--slider-candle-v) * 58px + 4px); transition: top 0.5s; }
  /* The candle melts down from 76px to a stub; drips grow down its side as it goes. */
  .slider-candle__wax { position: absolute; left: 50%; bottom: 10px; width: 30px; height: calc(88px - var(--slider-candle-v) * 62px); margin-left: -15px; border-radius: 4px 4px 2px 2px; background: linear-gradient(90deg, light-dark(#6d7179, #7d8087), light-dark(#50535b, #c6c8cd) 40%, light-dark(#6d7179, #7d8087)); transition: height 0.5s cubic-bezier(0.3, 1.1, 0.5, 1); }
  .slider-candle__wax::before { content: ''; position: absolute; left: 50%; top: -6px; width: 2px; height: 7px; margin-left: -1px; border-radius: 1px; background: light-dark(#dbdde1, #2e3035); }
  .slider-candle__drip { position: absolute; top: 0; width: 6px; border-radius: 0 0 3px 3px; background: light-dark(#50535b, #c6c8cd); height: calc(4px + var(--slider-candle-v) * var(--len)); transition: height 0.5s; }
  .slider-candle__flame { position: absolute; left: 50%; top: -24px; width: 12px; height: 19px; margin-left: -6px; border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; background: radial-gradient(ellipse at 50% 72%, light-dark(#fbfcfd, #121417) 0 18%, light-dark(#373a40, #f1f2f3) 45%, light-dark(#50535b, #c6c8cd)); transform-origin: 50% 100%; animation: slider-candle-flicker 1s ease-in-out infinite; }
  .slider-candle__dish { position: absolute; left: 50%; bottom: 0; width: 76px; height: 12px; margin-left: -38px; border-radius: 0 0 38px 38px; background: light-dark(#cbced3, #393c41); box-shadow: inset 0 2px 0 light-dark(#6d7179, #7d8087); }
  @media (prefers-reduced-motion: reduce) {
    .slider-candle__flame { animation: none; }
    .slider-candle * { transition: none !important; }
  }
  .slider-candle__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-candle__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-candle__track { position: relative; width: 100%; height: 24px; }
  .slider-candle__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-candle__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-candle-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-candle__thumb { position: absolute; top: 2px; left: calc(var(--slider-candle-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-candle:has(.slider-candle__input:focus-visible) .slider-candle__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-candle__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-candle__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-candle__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function CandleSlider() {
  const [v, setV] = useState(2);
  const t = (v - 0) / (8 - 0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-candle" style={{ '--slider-candle-v': t } as React.CSSProperties}>
        <div className="slider-candle__stand" aria-hidden="true">
          <span className="slider-candle__glow" />
          <span className="slider-candle__wax">
            <span className="slider-candle__flame" />
            <span className="slider-candle__drip" style={{ left: 3, '--len': '22px' } as React.CSSProperties} />
            <span className="slider-candle__drip" style={{ right: 6, '--len': '14px' } as React.CSSProperties} />
            <span className="slider-candle__drip" style={{ left: 13, '--len': '8px' } as React.CSSProperties} />
          </span>
          <span className="slider-candle__dish" />
        </div>
        <span className="slider-candle__read" aria-hidden="true">
          <b>{8 - v} h</b> of light left
        </span>
        <div className="slider-candle__track">
          <span className="slider-candle__rail" />
          <span className="slider-candle__fill" />
          <span className="slider-candle__thumb" />
          <input
            className="slider-candle__input"
            type="range"
            min={0}
            max={8} step={0.5}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Hours burned"
            aria-valuetext={`${8 - v} hours left`}
          />
        </div>
      </div>
    </>
  );
}
