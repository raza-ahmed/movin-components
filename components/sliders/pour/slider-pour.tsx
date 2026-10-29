"use client";

import * as React from "react";
import { useState } from 'react';

const SURFACE = 'M0 6 Q10 0 20 6 T40 6 T60 6 T80 6 T100 6 T120 6 T140 6 T160 6 V20 H0Z';

const css = `
  @keyframes slider-pour-roll { to { transform: translateX(-40px); } }
  @keyframes slider-pour-rise {
    from { transform: translateY(0); opacity: 0; }
    20% { opacity: 0.9; }
    to { transform: translateY(calc(var(--slider-pour-v) * -100px)); opacity: 0; }
  }
  .slider-pour { display: flex; align-items: center; gap: 22px; }
  .slider-pour__glass { position: relative; width: 84px; height: 118px; }
  .slider-pour__inside { position: absolute; inset: 4px 4px 6px; overflow: hidden; clip-path: polygon(0 0, 100% 0, 88% 100%, 12% 100%); }
  .slider-pour__water { position: absolute; left: 0; right: 0; bottom: 0; height: calc(var(--slider-pour-v) * 100%); background: color-mix(in oklab, light-dark(#50535b, #c6c8cd) 75%, transparent); transition: height 0.55s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .slider-pour__surface { position: absolute; left: 0; top: -6px; width: 160px; height: 20px; fill: color-mix(in oklab, light-dark(#50535b, #c6c8cd) 75%, transparent); opacity: min(1, calc(var(--slider-pour-v) * 20)); animation: slider-pour-roll 1.4s linear infinite; }
  .slider-pour__bubble { position: absolute; bottom: 4px; width: 5px; height: 5px; border-radius: 50%; box-shadow: inset 0 0 0 1px light-dark(#373a40, #f1f2f3); opacity: 0; animation: slider-pour-rise 2.2s ease-in infinite; }
  .slider-pour__outline { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2; stroke-linejoin: round; }
  .slider-pour__shine { fill: none; stroke: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent); stroke-width: 3; stroke-linecap: round; }
  .slider-pour__level { position: relative; width: 26px; height: 118px; }
  .slider-pour__scale { position: absolute; inset: 6px 0 6px auto; width: 8px; background: repeating-linear-gradient(to top, light-dark(#6d7179, #7d8087) 0 1px, transparent 1px 10.6px); }
  .slider-pour__mark { position: absolute; left: 0; bottom: calc(6px + var(--slider-pour-v) * (100% - 12px)); width: 0; height: 0; border: 6px solid transparent; border-left: 8px solid light-dark(#373a40, #f1f2f3); transform: translateY(50%); transition: bottom 0.55s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .slider-pour:has(.slider-pour__input:focus-visible) .slider-pour__glass { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 6px; border-radius: 6px; }
  .slider-pour__input {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 118px;
    height: 84px;
    margin: 0;
    transform: translate(-50%, -50%) rotate(-90deg);
    opacity: 0;
    cursor: ns-resize;
    -webkit-appearance: none;
    appearance: none;
    background: none;
  }
  .slider-pour__input::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 84px; }
  .slider-pour__input::-moz-range-thumb { width: 10px; height: 84px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-pour__surface, .slider-pour__bubble { animation: none; }
    .slider-pour__water, .slider-pour__mark { transition: none; }
  }
`;

export function PourSlider() {
  const [v, setV] = useState(45);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-pour" style={{ '--slider-pour-v': v / 100 } as React.CSSProperties}>
        <span className="slider-pour__glass">
          <span className="slider-pour__inside" aria-hidden="true">
            <span className="slider-pour__water">
              <svg className="slider-pour__surface" viewBox="0 0 160 20">
                <path d={SURFACE} />
              </svg>
              <span className="slider-pour__bubble" style={{ left: 22 }} />
              <span className="slider-pour__bubble" style={{ left: 44, animationDelay: '-0.8s' }} />
              <span className="slider-pour__bubble" style={{ left: 56, animationDelay: '-1.5s' }} />
            </span>
          </span>
          <svg className="slider-pour__outline" viewBox="0 0 84 118" aria-hidden="true">
            <path d="M2 2H82L72 116H12Z" />
            <path className="slider-pour__shine" d="M12 14L18 96" />
          </svg>
          <input
            className="slider-pour__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Water"
            aria-valuetext={`${v} percent full`}
          />
        </span>
        <span className="slider-pour__level" aria-hidden="true">
          <span className="slider-pour__scale" />
          <span className="slider-pour__mark" />
        </span>
      </div>
    </>
  );
}
