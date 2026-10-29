"use client";

import * as React from "react";
import { useState } from 'react';

const MIN = 40;
const MAX = 120;
const PX = 8; // pixels per kilogram
const NUMS = Array.from({ length: (MAX - MIN) / 10 + 1 }, (_, i) => MIN + i * 10);

const css = `
  .slider-ruler { display: grid; justify-items: center; gap: 8px; width: 230px; }
  .slider-ruler__read { display: flex; align-items: baseline; gap: 4px; color: light-dark(#373a40, #f1f2f3); }
  .slider-ruler__num { font-size: 34px; font-weight: 600; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1; }
  .slider-ruler__unit { color: light-dark(#5f626a, #a7abb2); font-size: 13px; }
  .slider-ruler__window {
    position: relative;
    width: 230px;
    height: 64px;
    overflow: hidden;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529);
    -webkit-mask: linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent);
    mask: linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent);
  }
  .slider-ruler__strip {
    position: absolute;
    left: 115px;
    top: 0;
    width: ${(MAX - MIN) * PX + 1}px;
    height: 100%;
    background:
      linear-gradient(90deg, light-dark(#42454c, #e5e6e9) 1.5px, transparent 1.5px) 0 0 / ${PX * 10}px 26px repeat-x,
      linear-gradient(90deg, light-dark(#5f626a, #a7abb2) 1.5px, transparent 1.5px) 0 0 / ${PX * 5}px 18px repeat-x,
      linear-gradient(90deg, light-dark(#cbced3, #393c41) 1px, transparent 1px) 0 0 / ${PX}px 11px repeat-x;
    transform: translateX(calc(var(--slider-ruler-v) * ${-(MAX - MIN) * PX}px));
    transition: transform 0.2s cubic-bezier(0.3, 1.2, 0.5, 1);
  }
  .slider-ruler__label { position: absolute; top: 34px; width: 30px; margin-left: -15px; color: light-dark(#5f626a, #a7abb2); font-size: 10px; text-align: center; font-variant-numeric: tabular-nums; }
  .slider-ruler__marker { position: absolute; left: 114px; top: 0; width: 2px; height: 40px; border-radius: 1px; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 8px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent); }
  .slider-ruler__marker::after { content: ''; position: absolute; left: -4px; bottom: -6px; border: 5px solid transparent; border-bottom-color: light-dark(#373a40, #f1f2f3); transform: rotate(180deg); }
  .slider-ruler:has(.slider-ruler__input:focus-visible) .slider-ruler__window { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-ruler__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; -webkit-appearance: none; appearance: none; background: none; }
  .slider-ruler__input::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 64px; }
  .slider-ruler__input::-moz-range-thumb { width: 10px; height: 64px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-ruler__strip { transition: none; }
  }
`;

export function RulerSlider() {
  const [kg, setKg] = useState(72);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-ruler" style={{ '--slider-ruler-v': (kg - MIN) / (MAX - MIN) } as React.CSSProperties}>
        <span className="slider-ruler__read" aria-hidden="true">
          <span className="slider-ruler__num">{kg}</span>
          <span className="slider-ruler__unit">kg</span>
        </span>
        <span className="slider-ruler__window">
          <span className="slider-ruler__strip" aria-hidden="true">
            {NUMS.map((n) => (
              <span key={n} className="slider-ruler__label" style={{ left: (n - MIN) * PX }}>
                {n}
              </span>
            ))}
          </span>
          <span className="slider-ruler__marker" aria-hidden="true" />
          <input className="slider-ruler__input" type="range" min={MIN} max={MAX} value={kg} onChange={(e) => setKg(+e.target.value)} aria-label="Weight" aria-valuetext={`${kg} kilograms`} />
        </span>
      </div>
    </>
  );
}
