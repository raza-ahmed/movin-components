"use client";

import { useState } from 'react';

const css = `
  @keyframes field-constellation-star { from { transform: scale(0); opacity: 0; } 60% { transform: scale(1.8); opacity: 1; } }
  @keyframes field-constellation-twinkle { 50% { opacity: 0.55; } }
  @keyframes field-constellation-line { to { stroke-dashoffset: 0; } }
  .field-constellation { width: 256px; }
  .field-constellation__sky {
    position: relative;
    height: 112px;
    margin-bottom: 8px;
    border-radius: 12px;
    background: radial-gradient(ellipse at 50% 120%, light-dark(#ebedf0, #232529), light-dark(#fbfcfd, #121417) 70%);
    box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529);
    overflow: hidden;
  }
  .field-constellation__sky svg { position: absolute; inset: 0; width: 256px; height: 112px; }
  .field-constellation__line { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 0.8; stroke-dasharray: 1; stroke-dashoffset: 1; animation: field-constellation-line 0.5s ease-out 0.1s forwards; }
  .field-constellation__star { fill: light-dark(#373a40, #f1f2f3); transform-box: fill-box; transform-origin: center; animation: field-constellation-star 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both, field-constellation-twinkle 2.6s ease-in-out 0.5s infinite; }
  .field-constellation__fig { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .field-constellation__dust { fill: light-dark(#cbced3, #393c41); }
  .field-constellation__name { position: absolute; left: 10px; bottom: 7px; color: light-dark(#5f626a, #a7abb2); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; }
  .field-constellation__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-constellation__input {
    width: 100%;
    height: 38px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    border-radius: 9px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 14px;
    transition: box-shadow 0.2s;
  }
  .field-constellation__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) { .field-constellation__line, .field-constellation__star { animation: none; stroke-dashoffset: 0; } }
`;

const W = 256;
const H = 112;
const STEP = 9.4;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// Background dust, fixed.
const r2 = (n: number) => Math.round(n * 100) / 100;
const DUST = Array.from({ length: 26 }, (_, i) => [r2(hash(i) * W), r2(hash(i + 40) * H), r2(0.4 + hash(i + 80) * 0.6)]);

export function ConstellationInput() {
  const [value, setValue] = useState('wish');
  // Each letter becomes a star: across by its position, up and down by the letter itself. Spaces break the line.
  const stars = [...value].map((c, i) => ({
    c,
    x: r2(18 + i * STEP + (hash(i + 7) - 0.5) * 6),
    y: r2(16 + hash(c.charCodeAt(0) * 3.1 + i * 0.7) * (H - 40)),
    r: r2(1.3 + hash(c.charCodeAt(0)) * 1.6),
  }));
  // The whole figure stays centred in the sky, gliding over as it grows.
  const shift = (W - 36 - Math.max(0, value.length - 1) * STEP) / 2;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-constellation">
        <div className="field-constellation__sky" aria-hidden="true">
          <svg viewBox={`0 0 ${W} ${H}`}>
            {DUST.map(([x, y, r], i) => (
              <circle key={i} className="field-constellation__dust" cx={x} cy={y} r={r} />
            ))}
            <g className="field-constellation__fig" style={{ transform: `translateX(${shift}px)` }}>
            {stars.map((s, i) => {
              const p = stars[i - 1];
              if (!p || s.c === ' ' || p.c === ' ') return null;
              return <line key={`l${i}${s.c}${p.c}`} className="field-constellation__line" x1={p.x} y1={p.y} x2={s.x} y2={s.y} pathLength={1} />;
            })}
            {stars.map((s, i) => (s.c === ' ' ? null : <circle key={`s${i}${s.c}`} className="field-constellation__star" cx={s.x} cy={s.y} r={s.r} style={{ animationDelay: `0s, ${(0.5 + hash(i) * 2).toFixed(2)}s` }} />))}
            </g>
          </svg>
          <span className="field-constellation__name">{value.replace(/\s/g, '').length} stars</span>
        </div>
        <label className="field-constellation__label" htmlFor="field-constellation-input">
          Make a wish
        </label>
        <input
          id="field-constellation-input"
          className="field-constellation__input"
          value={value}
          maxLength={24}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </>
  );
}
