"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-shade { --slider-shade-c: color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--slider-shade-v) * 100%), light-dark(#fbfcfd, #121417)); display: grid; gap: 14px; width: 220px; }
  .slider-shade__head { display: flex; align-items: center; gap: 12px; }
  .slider-shade__swatch { width: 56px; height: 56px; border-radius: 14px; background: var(--slider-shade-c); box-shadow: inset 0 0 0 1px color-mix(in oklab, light-dark(#6d7179, #7d8087) 50%, transparent), 0 8px 18px -10px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .slider-shade__meta { display: grid; gap: 2px; }
  .slider-shade__name { color: light-dark(#42454c, #e5e6e9); font-size: 13px; font-weight: 600; }
  .slider-shade__val { color: light-dark(#5f626a, #a7abb2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-variant-numeric: tabular-nums; }
  .slider-shade__track { position: relative; height: 26px; }
  .slider-shade__rail { position: absolute; left: 0; right: 0; top: 6px; height: 14px; border-radius: 7px; background: linear-gradient(90deg, light-dark(#fbfcfd, #121417), light-dark(#373a40, #f1f2f3)); box-shadow: inset 0 0 0 1px color-mix(in oklab, light-dark(#6d7179, #7d8087) 50%, transparent); }
  .slider-shade__thumb {
    position: absolute;
    top: 1px;
    left: calc(var(--slider-shade-v) * (100% - 24px));
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--slider-shade-c);
    box-shadow: 0 0 0 3px light-dark(#373a40, #f1f2f3), 0 0 0 4px light-dark(#cbced3, #393c41), 0 3px 8px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45));
    transition: transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-shade__track:active .slider-shade__thumb { transform: scale(1.18); }
  .slider-shade:has(.slider-shade__input:focus-visible) .slider-shade__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 5px; }
  .slider-shade__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-shade__input::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; }
  .slider-shade__input::-moz-range-thumb { width: 24px; height: 24px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-shade__thumb { transition: none; }
  }
`;

export function ShadeSlider() {
  const [v, setV] = useState(62);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-shade" style={{ '--slider-shade-v': v / 100 } as React.CSSProperties}>
        <div className="slider-shade__head" aria-hidden="true">
          <span className="slider-shade__swatch" />
          <span className="slider-shade__meta">
            <span className="slider-shade__name">Ink</span>
            <span className="slider-shade__val">{v}%</span>
          </span>
        </div>
        <div className="slider-shade__track">
          <span className="slider-shade__rail" />
          <span className="slider-shade__thumb" />
          <input className="slider-shade__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Ink strength" />
        </div>
      </div>
    </>
  );
}
