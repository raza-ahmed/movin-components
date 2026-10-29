"use client";

import { useId, useState } from 'react';

const css = `
  @keyframes radio-brush-draw-a { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes radio-brush-draw-b { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes radio-brush-tip-a { 0% { offset-distance: 0%; opacity: 1; } 95% { opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } }
  @keyframes radio-brush-tip-b { 0% { offset-distance: 0%; opacity: 1; } 95% { opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } }
  .radio-brush { --radio-brush-w: 4px; display: grid; justify-items: center; gap: 12px; }
  .radio-brush:has(.radio-brush__input[value='m']:checked) { --radio-brush-w: 9px; }
  .radio-brush:has(.radio-brush__input[value='l']:checked) { --radio-brush-w: 16px; }
  .radio-brush__canvas {
    position: relative;
    width: 220px;
    height: 76px;
    border-radius: 10px;
    background:
      radial-gradient(circle, color-mix(in oklab, light-dark(#6d7179, #7d8087) 40%, transparent) 0.8px, transparent 1px) 0 0 / 10px 10px,
      light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .radio-brush__canvas svg { position: absolute; inset: 0; width: 220px; height: 76px; overflow: visible; }
  .radio-brush__stroke {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: var(--radio-brush-w);
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    transition: stroke-width 0.3s ease;
  }
  .radio-brush[data-flip='a'] .radio-brush__stroke { animation: radio-brush-draw-a 0.65s cubic-bezier(0.5, 0, 0.4, 1); }
  .radio-brush[data-flip='b'] .radio-brush__stroke { animation: radio-brush-draw-b 0.65s cubic-bezier(0.5, 0, 0.4, 1); }
  .radio-brush__tip {
    position: absolute;
    left: 0;
    top: 0;
    width: calc(var(--radio-brush-w) + 6px);
    height: calc(var(--radio-brush-w) + 6px);
    border-radius: 50%;
    box-shadow: 0 0 0 1.5px light-dark(#50535b, #c6c8cd);
    offset-path: path('M14 46C40 14 64 14 82 38S124 62 146 34S186 14 206 30');
    offset-rotate: 0deg;
    opacity: 0;
  }
  .radio-brush[data-flip='a'] .radio-brush__tip { animation: radio-brush-tip-a 0.65s cubic-bezier(0.5, 0, 0.4, 1); }
  .radio-brush[data-flip='b'] .radio-brush__tip { animation: radio-brush-tip-b 0.65s cubic-bezier(0.5, 0, 0.4, 1); }
  .radio-brush__opts { display: flex; align-items: center; gap: 8px; }
  .radio-brush__opt {
    position: relative;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    cursor: pointer;
    transition: box-shadow 0.2s;
  }
  .radio-brush__opt:hover { box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087); }
  .radio-brush__dot { border-radius: 50%; background: light-dark(#5f626a, #a7abb2); transition: background-color 0.2s; }
  .radio-brush__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-brush__opt:has(.radio-brush__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-brush__opt:has(.radio-brush__input:checked) { box-shadow: inset 0 0 0 1.5px light-dark(#42454c, #e5e6e9); }
  .radio-brush__opt:has(.radio-brush__input:checked) .radio-brush__dot { background: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .radio-brush * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

const PATH = 'M14 46C40 14 64 14 82 38S124 62 146 34S186 14 206 30';
const SIZES = [
  { value: 's', name: 'Small', dot: 5 },
  { value: 'm', name: 'Medium', dot: 10 },
  { value: 'l', name: 'Large', dot: 16 },
];

export function BrushRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-brush" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onChange={() => setFlip((f) => f + 1)}>
        <span className="radio-brush__canvas" aria-hidden="true">
          <svg viewBox="0 0 220 76">
            <path className="radio-brush__stroke" pathLength={1} d={PATH} />
          </svg>
          <span className="radio-brush__tip" />
        </span>
        <div className="radio-brush__opts" role="radiogroup" aria-label="Brush size">
          {SIZES.map((s, i) => (
            <label key={s.value} className="radio-brush__opt">
              <input className="radio-brush__input" type="radio" name={name} value={s.value} aria-label={s.name} defaultChecked={i === 0} />
              <span className="radio-brush__dot" style={{ width: s.dot, height: s.dot }} aria-hidden="true" />
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
