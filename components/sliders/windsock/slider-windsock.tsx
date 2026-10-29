"use client";

import * as React from "react";
import { useState } from 'react';

const STRIPES = [0, 1, 2, 3, 4];
const BEAUFORT = ['Calm', 'Light air', 'Light breeze', 'Gentle breeze', 'Moderate breeze', 'Fresh breeze', 'Strong breeze', 'Near gale'];

const css = `
  .slider-windsock { display: grid; justify-items: center; gap: 12px; width: 220px; }
  @keyframes slider-windsock-flap { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(calc(var(--slider-windsock-v) * 2.4px)) scaleY(calc(1 - var(--slider-windsock-v) * 0.12)); } }
  .slider-windsock__field { position: relative; width: 200px; height: 112px; }
  .slider-windsock__pole { position: absolute; left: 30px; top: 14px; bottom: 0; width: 3px; border-radius: 2px; background: light-dark(#5f626a, #a7abb2); }
  .slider-windsock__pole::before { content: ''; position: absolute; left: -3px; top: -4px; width: 9px; height: 9px; border-radius: 50%; background: light-dark(#50535b, #c6c8cd); }
  /* The sock hangs from the top of the pole: limp and drooping in calm air, level and full at speed. */
  .slider-windsock__sock { position: absolute; left: 32px; top: 18px; display: flex; align-items: center; transform-origin: 0 50%; transform: rotate(calc((1 - var(--slider-windsock-v)) * 72deg)) scaleX(calc(0.7 + var(--slider-windsock-v) * 0.3)); transition: transform 0.6s cubic-bezier(0.3, 1.3, 0.5, 1); }
  .slider-windsock__stripe { width: 26px; height: calc(30px - var(--k) * 4px); margin-left: -1px; background: light-dark(#42454c, #e5e6e9); clip-path: polygon(0 0, 100% 7%, 100% 93%, 0 100%); animation: slider-windsock-flap calc(1.4s - var(--slider-windsock-v) * 0.9s) ease-in-out infinite calc(var(--k) * -0.12s); }
  .slider-windsock__stripe:nth-child(even) { background: light-dark(#cbced3, #393c41); }
  .slider-windsock__gust { position: absolute; height: 1.5px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); opacity: calc(var(--slider-windsock-v) * 0.9); }
  @media (prefers-reduced-motion: reduce) {
    .slider-windsock__stripe { animation: none; }
    .slider-windsock__sock { transition: none; }
  }
  .slider-windsock__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-windsock__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-windsock__track { position: relative; width: 100%; height: 24px; }
  .slider-windsock__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-windsock__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-windsock-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-windsock__thumb { position: absolute; top: 2px; left: calc(var(--slider-windsock-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-windsock:has(.slider-windsock__input:focus-visible) .slider-windsock__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-windsock__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-windsock__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-windsock__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function WindsockSlider() {
  const [v, setV] = useState(12);
  const t = (v - 0) / (30 - 0);
  const word = BEAUFORT[Math.min(BEAUFORT.length - 1, Math.floor(v / 4))];
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-windsock" style={{ '--slider-windsock-v': t } as React.CSSProperties}>
        <div className="slider-windsock__field" aria-hidden="true">
          <span className="slider-windsock__gust" style={{ left: 120, top: 30, width: 40 }} />
          <span className="slider-windsock__gust" style={{ left: 140, top: 46, width: 28 }} />
          <span className="slider-windsock__pole" />
          <span className="slider-windsock__sock">
            {STRIPES.map((k) => (
              <span key={k} className="slider-windsock__stripe" style={{ '--k': k } as React.CSSProperties} />
            ))}
          </span>
        </div>
        <span className="slider-windsock__read" aria-hidden="true">
          <b>{v} knots</b> · {word}
        </span>
        <div className="slider-windsock__track">
          <span className="slider-windsock__rail" />
          <span className="slider-windsock__fill" />
          <span className="slider-windsock__thumb" />
          <input
            className="slider-windsock__input"
            type="range"
            min={0}
            max={30}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Wind speed"
            aria-valuetext={`${v} knots, ${word.toLowerCase()}`}
          />
        </div>
      </div>
    </>
  );
}
