"use client";

import * as React from "react";
import { useState } from 'react';

const WORDS = ['Awful', 'Bad', 'Okay', 'Good', 'Great'];

const css = `
  .slider-mood { display: grid; justify-items: center; gap: 10px; width: 220px; }
  .slider-mood__face { width: 96px; height: 96px; overflow: visible; transform: rotate(calc((var(--slider-mood-v) - 0.5) * 10deg)); transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .slider-mood__head { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2; }
  .slider-mood__eye { fill: light-dark(#373a40, #f1f2f3); }
  .slider-mood__brow, .slider-mood__mouth { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 3; stroke-linecap: round; }
  .slider-mood__cheek { fill: light-dark(#6d7179, #7d8087); opacity: clamp(0, calc((var(--slider-mood-v) - 0.65) * 3), 0.8); }
  .slider-mood__word { color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; }
  .slider-mood__track { position: relative; width: 100%; height: 26px; }
  .slider-mood__rail { position: absolute; left: 0; right: 0; top: 10px; height: 6px; border-radius: 3px; background: linear-gradient(90deg, light-dark(#dbdde1, #2e3035), light-dark(#42454c, #e5e6e9)); }
  .slider-mood__thumb { position: absolute; top: 2px; left: calc(var(--slider-mood-v) * (100% - 22px)); width: 22px; height: 22px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f), 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-mood:has(.slider-mood__input:focus-visible) .slider-mood__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; }
  .slider-mood__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-mood__input::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; }
  .slider-mood__input::-moz-range-thumb { width: 22px; height: 22px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-mood__face { transition: none; }
  }
`;

export function MoodSlider() {
  const [v, setV] = useState(70);
  const t = v / 100;
  const f = (n: number) => n.toFixed(1);
  const curve = -14 + t * 32; // mouth: frown below zero, grin above
  // Brows: the inner ends lift when it is bad (worried), and both sit level and raised when it is good.
  const browOuter = 28 - t * 3;
  const browInner = 28 - (1 - t) * 7 - t * 3;
  const arch = t * 4;
  const eye = 5.5 - t * 2.5;
  const word = WORDS[Math.min(4, Math.floor(t * 5))];
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-mood" style={{ '--slider-mood-v': t } as React.CSSProperties}>
        <svg className="slider-mood__face" viewBox="0 0 96 96" aria-hidden="true">
          <circle className="slider-mood__head" cx="48" cy="48" r="44" />
          <ellipse className="slider-mood__cheek" cx="24" cy="58" rx="7" ry="4" />
          <ellipse className="slider-mood__cheek" cx="72" cy="58" rx="7" ry="4" />
          <ellipse className="slider-mood__eye" cx="34" cy="40" rx="4" ry={f(eye)} />
          <ellipse className="slider-mood__eye" cx="62" cy="40" rx="4" ry={f(eye)} />
          <path className="slider-mood__brow" d={`M26 ${f(browOuter)}Q33 ${f((browOuter + browInner) / 2 - arch)} 40 ${f(browInner)}`} />
          <path className="slider-mood__brow" d={`M70 ${f(browOuter)}Q63 ${f((browOuter + browInner) / 2 - arch)} 56 ${f(browInner)}`} />
          <path className="slider-mood__mouth" d={`M32 ${f(64 - curve * 0.25)}Q48 ${f(64 + curve)} 64 ${f(64 - curve * 0.25)}`} />
        </svg>
        <span className="slider-mood__word" aria-hidden="true">
          {word}
        </span>
        <div className="slider-mood__track">
          <span className="slider-mood__rail" />
          <span className="slider-mood__thumb" />
          <input className="slider-mood__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="How was it?" aria-valuetext={word} />
        </div>
      </div>
    </>
  );
}
