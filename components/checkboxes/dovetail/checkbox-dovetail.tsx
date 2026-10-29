"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-dovetail-thud { 0%, 70% { transform: none; } 80% { transform: translateY(1.5px); } 100% { transform: none; } }
  .cb-dovetail { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-dovetail__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-dovetail__box { position: relative; width: 30px; height: 30px; border-radius: 4px; }
  .cb-dovetail__input:focus-visible + .cb-dovetail__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-dovetail__piece { position: absolute; inset: 0; }
  .cb-dovetail__piece--a {
    clip-path: polygon(0 0, 13px 0, 13px 5px, 19px 3px, 19px 13px, 13px 11px, 13px 18px, 19px 16px, 19px 26px, 13px 24px, 13px 30px, 0 30px);
    background:
      repeating-linear-gradient(97deg, transparent 0 4px, color-mix(in oklab, light-dark(#6d7179, #7d8087) 45%, transparent) 4px 5px),
      light-dark(#dbdde1, #2e3035);
  }
  .cb-dovetail__piece--b {
    clip-path: polygon(13px 0, 30px 0, 30px 30px, 13px 30px, 13px 24px, 19px 26px, 19px 16px, 13px 18px, 13px 11px, 19px 13px, 19px 3px, 13px 5px);
    background:
      repeating-linear-gradient(8deg, transparent 0 4px, color-mix(in oklab, light-dark(#5f626a, #a7abb2) 35%, transparent) 4px 5px),
      light-dark(#cbced3, #393c41);
    opacity: 0.3;
    transform: translateY(-13px);
    transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.3s;
  }
  .cb-dovetail__piece svg { position: absolute; inset: 0; width: 30px; height: 30px; }
  .cb-dovetail__piece path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
  .cb-dovetail__piece--a path { stroke: light-dark(#5f626a, #a7abb2); transition: stroke 0.25s; }
  .cb-dovetail__input:checked + .cb-dovetail__box .cb-dovetail__piece--b { opacity: 1; transform: none; transition: transform 0.32s cubic-bezier(0.5, 0, 0.9, 0.5), opacity 0.12s; }
  .cb-dovetail__input:checked + .cb-dovetail__box .cb-dovetail__piece--a path { stroke: light-dark(#373a40, #f1f2f3); transition-delay: 0.3s; }
  .cb-dovetail[data-armed] .cb-dovetail__input:checked + .cb-dovetail__box { animation: cb-dovetail-thud 0.45s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .cb-dovetail__box, .cb-dovetail__box * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const TICK = 'M7.5 15.5L12.5 20.5L22.5 9';

export function DovetailCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-dovetail" data-armed={armed || undefined}>
        <input className="cb-dovetail__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-dovetail__box" aria-hidden="true">
          <span className="cb-dovetail__piece cb-dovetail__piece--a">
            <svg viewBox="0 0 30 30">
              <path d={TICK} />
            </svg>
          </span>
          <span className="cb-dovetail__piece cb-dovetail__piece--b">
            <svg viewBox="0 0 30 30">
              <path d={TICK} />
            </svg>
          </span>
        </span>
        Lock it in
      </label>
    </>
  );
}
