"use client";

import * as React from "react";
import { useState } from 'react';

// Each cloud comes in from its own side once the cover passes its share.
const CLOUDS = [
  { k: 0, x: 40, y: 22, w: 54, from: -120 },
  { k: 1, x: 112, y: 34, w: 64, from: 140 },
  { k: 2, x: 8, y: 52, w: 60, from: -140 },
  { k: 3, x: 128, y: 8, w: 48, from: 150 },
  { k: 4, x: 66, y: 44, w: 70, from: -160 },
];

const css = `
  .slider-overcast { display: grid; justify-items: center; gap: 12px; width: 220px; }
  .slider-overcast__sky { position: relative; width: 200px; height: 104px; overflow: hidden; border-radius: 12px; background: linear-gradient(color-mix(in oklab, light-dark(#6d7179, #7d8087) calc((1 - var(--slider-overcast-v)) * 70%), light-dark(#dbdde1, #2e3035)), light-dark(#ebedf0, #232529)); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: background 0.4s; }
  .slider-overcast__sun { position: absolute; left: 72px; top: 18px; width: 38px; height: 38px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 calc((1 - var(--slider-overcast-v)) * 26px) calc((1 - var(--slider-overcast-v)) * 8px) color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent); opacity: calc(1 - var(--slider-overcast-v) * 0.65); transition: opacity 0.4s, box-shadow 0.4s; }
  .slider-overcast__cloud {
    --on: clamp(0, calc((var(--slider-overcast-v) * 5 - var(--k)) * 1.5), 1);
    position: absolute;
    height: 18px;
    border-radius: 10px;
    background: light-dark(#50535b, #c6c8cd);
    box-shadow: inset 0 -4px 0 light-dark(#5f626a, #a7abb2);
    transform: translateX(calc((1 - var(--on)) * var(--from)));
    opacity: var(--on);
    transition: transform 0.6s cubic-bezier(0.3, 1, 0.4, 1), opacity 0.4s;
  }
  .slider-overcast__cloud::before, .slider-overcast__cloud::after { content: ''; position: absolute; bottom: 6px; border-radius: 50%; background: inherit; }
  .slider-overcast__cloud::before { left: 18%; width: 40%; height: 22px; }
  .slider-overcast__cloud::after { left: 46%; width: 32%; height: 16px; }
  @media (prefers-reduced-motion: reduce) {
    .slider-overcast * { transition: none !important; }
  }
  .slider-overcast__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-overcast__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-overcast__track { position: relative; width: 100%; height: 24px; }
  .slider-overcast__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-overcast__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-overcast-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-overcast__thumb { position: absolute; top: 2px; left: calc(var(--slider-overcast-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-overcast:has(.slider-overcast__input:focus-visible) .slider-overcast__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-overcast__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-overcast__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-overcast__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function OvercastSlider() {
  const [v, setV] = useState(35);
  const t = (v - 0) / (100 - 0);
  const word = v < 10 ? 'Clear' : v < 35 ? 'Mostly sunny' : v < 65 ? 'Partly cloudy' : v < 90 ? 'Mostly cloudy' : 'Overcast';
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-overcast" style={{ '--slider-overcast-v': t } as React.CSSProperties}>
        <div className="slider-overcast__sky" aria-hidden="true">
          <span className="slider-overcast__sun" />
          {CLOUDS.map((c) => (
            <span
              key={c.k}
              className="slider-overcast__cloud"
              style={{ left: c.x, top: c.y + 14, width: c.w, '--k': c.k, '--from': `${c.from}px` } as React.CSSProperties}
            />
          ))}
        </div>
        <span className="slider-overcast__read" aria-hidden="true">
          <b>{v}%</b> · {word}
        </span>
        <div className="slider-overcast__track">
          <span className="slider-overcast__rail" />
          <span className="slider-overcast__fill" />
          <span className="slider-overcast__thumb" />
          <input
            className="slider-overcast__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Cloud cover"
            aria-valuetext={`${v} percent, ${word.toLowerCase()}`}
          />
        </div>
      </div>
    </>
  );
}
