"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-tide { display: grid; justify-items: center; gap: 12px; width: 220px; }
  @keyframes slider-tide-bob { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(2px) rotate(2deg); } }
  @keyframes slider-tide-swell { from { transform: translateX(0); } to { transform: translateX(-24px); } }
  .slider-tide__harbour { position: relative; width: 200px; height: 112px; overflow: hidden; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .slider-tide__wall { position: absolute; left: 0; top: 0; bottom: 0; width: 38px; background: repeating-linear-gradient(light-dark(#dbdde1, #2e3035) 0 11px, light-dark(#ebedf0, #232529) 11px 12px), light-dark(#dbdde1, #2e3035); box-shadow: inset -1px 0 0 light-dark(#cbced3, #393c41); }
  .slider-tide__mark { position: absolute; left: 26px; width: 12px; height: 1px; background: light-dark(#5f626a, #a7abb2); }
  .slider-tide__mark span { position: absolute; right: 14px; top: -5px; color: light-dark(#5f626a, #a7abb2); font-size: 8px; }
  .slider-tide__ring { position: absolute; left: 34px; top: 26px; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid light-dark(#50535b, #c6c8cd); }
  .slider-tide__water { position: absolute; left: 0; right: -24px; bottom: 0; height: calc(16px + var(--slider-tide-v) * 62px); background: color-mix(in oklab, light-dark(#6d7179, #7d8087) 45%, transparent); transition: height 0.6s cubic-bezier(0.3, 1.1, 0.5, 1); }
  .slider-tide__water::before { content: ''; position: absolute; left: 0; right: 0; top: -1px; height: 1.5px; background: repeating-linear-gradient(90deg, light-dark(#50535b, #c6c8cd) 0 14px, color-mix(in oklab, light-dark(#50535b, #c6c8cd) 30%, transparent) 14px 24px); animation: slider-tide-swell 2.4s linear infinite; }
  .slider-tide__boat { position: absolute; left: 92px; width: 64px; height: 30px; bottom: calc(10px + var(--slider-tide-v) * 62px); transition: bottom 0.6s cubic-bezier(0.3, 1.1, 0.5, 1); }
  .slider-tide__boat svg { width: 100%; height: 100%; overflow: visible; animation: slider-tide-bob 2.4s ease-in-out infinite; transform-origin: 50% 100%; }
  .slider-tide__hull { fill: light-dark(#42454c, #e5e6e9); }
  .slider-tide__cabin { fill: light-dark(#5f626a, #a7abb2); }
  .slider-tide__rope { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .slider-tide__rope path { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.2; }
  @media (prefers-reduced-motion: reduce) {
    .slider-tide * { animation: none !important; transition: none !important; }
  }
  .slider-tide__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-tide__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-tide__track { position: relative; width: 100%; height: 24px; }
  .slider-tide__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-tide__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-tide-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-tide__thumb { position: absolute; top: 2px; left: calc(var(--slider-tide-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-tide:has(.slider-tide__input:focus-visible) .slider-tide__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-tide__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-tide__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-tide__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function TideSlider() {
  const [v, setV] = useState(18);
  const t = (v - 0) / (60 - 0);
  const m = (v / 10).toFixed(1);
  // The mooring line: from the ring on the wall to the bow; slack at low water, nearly straight at high.
  const by = 96 - t * 62;
  const sag = (1 - t) * 18 + 2;
  const rope = `M40 30Q${(40 + 100) / 2} ${(30 + by - 8) / 2 + sag} 100 ${(by - 8).toFixed(1)}`;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-tide" style={{ '--slider-tide-v': t } as React.CSSProperties}>
        <div className="slider-tide__harbour" aria-hidden="true">
          <span className="slider-tide__water" />
          <span className="slider-tide__wall">
            {[0, 2, 4, 6].map((n) => (
              <span key={n} className="slider-tide__mark" style={{ bottom: 16 + (n / 6) * 62 }}>
                <span>{n}</span>
              </span>
            ))}
          </span>
          <span className="slider-tide__ring" />
          <svg className="slider-tide__rope" viewBox="0 0 200 112">
            <path d={rope} />
          </svg>
          <span className="slider-tide__boat">
            <svg viewBox="0 0 64 30">
              <path className="slider-tide__cabin" d="M22 6H40L44 16H20Z" />
              <path className="slider-tide__hull" d="M2 16H62L54 28H12Z" />
            </svg>
          </span>
        </div>
        <span className="slider-tide__read" aria-hidden="true">
          <b>{m} m</b> · {v < 15 ? 'Low water' : v < 45 ? 'Rising' : 'High water'}
        </span>
        <div className="slider-tide__track">
          <span className="slider-tide__rail" />
          <span className="slider-tide__fill" />
          <span className="slider-tide__thumb" />
          <input
            className="slider-tide__input"
            type="range"
            min={0}
            max={60}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Tide height"
            aria-valuetext={`${m} metres`}
          />
        </div>
      </div>
    </>
  );
}
