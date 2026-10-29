"use client";

import * as React from "react";
import { useState } from 'react';

// 22 periods of 44 units: enough to fill the screen at the highest pitch (a quarter of the scale) plus one to loop.
const WAVE = `M0 48 ${Array.from({ length: 44 }, (_, i) => `Q${i * 22 + 11} ${i % 2 ? 108 : -12} ${(i + 1) * 22} 48`).join(' ')}`;

const css = `
  @keyframes slider-pitch-run { to { transform: translateX(-44px); } }
  .slider-pitch { display: grid; gap: 12px; width: 220px; }
  .slider-pitch__screen {
    position: relative;
    height: 96px;
    overflow: hidden;
    border-radius: 10px;
    background:
      linear-gradient(light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 -1px / 100% 24px,
      linear-gradient(90deg, light-dark(#ebedf0, #232529) 1px, transparent 1px) -1px 0 / 22px 100%,
      light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), inset 0 0 24px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
  }
  .slider-pitch__screen svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .slider-pitch__freq { transform: scaleX(calc(1 / (1 + var(--slider-pitch-v) * 3))); transition: transform 0.35s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .slider-pitch__line { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; vector-effect: non-scaling-stroke; filter: drop-shadow(0 0 3px light-dark(#50535b, #c6c8cd)); animation: slider-pitch-run 0.8s linear infinite; }
  .slider-pitch__hz { position: absolute; right: 8px; top: 6px; color: light-dark(#42454c, #e5e6e9); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-variant-numeric: tabular-nums; }
  .slider-pitch__track { position: relative; height: 24px; }
  .slider-pitch__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: repeating-linear-gradient(90deg, light-dark(#dbdde1, #2e3035) 0 2px, transparent 2px 6px); }
  .slider-pitch__thumb { position: absolute; top: 2px; left: calc(var(--slider-pitch-v) * (100% - 12px)); width: 12px; height: 20px; border-radius: 4px; background: light-dark(#42454c, #e5e6e9); box-shadow: inset 0 -2px 0 light-dark(#5f626a, #a7abb2), 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-pitch:has(.slider-pitch__input:focus-visible) .slider-pitch__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-pitch__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-pitch__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 20px; }
  .slider-pitch__input::-moz-range-thumb { width: 12px; height: 20px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-pitch__line { animation: none; }
  }
`;

export function PitchSlider() {
  const [v, setV] = useState(33);
  const hz = Math.round(110 * 2 ** ((v / 100) * 3));
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-pitch" style={{ '--slider-pitch-v': v / 100 } as React.CSSProperties}>
        <div className="slider-pitch__screen" aria-hidden="true">
          <svg viewBox="0 0 220 96" preserveAspectRatio="none">
            <g className="slider-pitch__freq">
              <path className="slider-pitch__line" d={WAVE} />
            </g>
          </svg>
          <span className="slider-pitch__hz">{hz} Hz</span>
        </div>
        <div className="slider-pitch__track">
          <span className="slider-pitch__rail" />
          <span className="slider-pitch__thumb" />
          <input
            className="slider-pitch__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Frequency"
            aria-valuetext={`${hz} hertz`}
          />
        </div>
      </div>
    </>
  );
}
