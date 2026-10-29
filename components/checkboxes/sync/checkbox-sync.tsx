"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-sync-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(540deg); } }
  @keyframes cb-sync-unspin { 0% { transform: rotate(-180deg); } 100% { transform: rotate(0deg); } }
  @keyframes cb-sync-arrows-out { 0%, 55% { opacity: 1; } 75%, 100% { opacity: 0; } }
  .cb-sync { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-sync__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-sync__box { position: relative; width: 28px; height: 28px; border-radius: 50%; }
  .cb-sync__input:focus-visible + .cb-sync__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-sync__box svg { width: 28px; height: 28px; overflow: visible; }
  .cb-sync__arrows { transform-box: view-box; transform-origin: 14px 14px; transition: opacity 0.2s; }
  .cb-sync__arrows path { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .cb-sync__ring {
    fill: none;
    stroke: light-dark(#50535b, #c6c8cd);
    stroke-width: 2;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transform: rotate(-90deg);
    transform-box: view-box;
    transform-origin: 14px 14px;
    transition: stroke-dashoffset 0.25s ease;
  }
  .cb-sync__tick { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.15s ease; }
  .cb-sync__input:checked + .cb-sync__box .cb-sync__arrows { opacity: 0; }
  .cb-sync__input:checked + .cb-sync__box .cb-sync__ring { stroke-dashoffset: 0; transition: stroke-dashoffset 0.35s ease 0.45s; }
  .cb-sync__input:checked + .cb-sync__box .cb-sync__tick { stroke-dashoffset: 0; transition: stroke-dashoffset 0.25s ease 0.62s; }
  .cb-sync[data-armed] .cb-sync__input:checked + .cb-sync__box .cb-sync__arrows { animation: cb-sync-spin 0.75s cubic-bezier(0.5, 0, 0.3, 1), cb-sync-arrows-out 0.75s linear; }
  .cb-sync[data-armed] .cb-sync__input:not(:checked) + .cb-sync__box .cb-sync__arrows { animation: cb-sync-unspin 0.45s cubic-bezier(0.2, 0.8, 0.3, 1); }
  @media (prefers-reduced-motion: reduce) {
    .cb-sync__box * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// One arc arrow running clockwise round a circle of radius 9; the second is the same turned half a turn.
const ARC = 'M5.54 10.92A9 9 0 0 1 20.89 8.21M20.59 4.72L20.89 8.21L17.51 7.31';

export function SyncCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-sync" data-armed={armed || undefined}>
        <input className="cb-sync__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-sync__box" aria-hidden="true">
          <svg viewBox="0 0 28 28">
            <g className="cb-sync__arrows">
              <path d={ARC} />
              <path d={ARC} transform="rotate(180 14 14)" />
            </g>
            <circle className="cb-sync__ring" cx="14" cy="14" r="11.5" pathLength={1} />
            <path className="cb-sync__tick" pathLength={1} d="M9.5 14.5L12.8 17.8L18.8 10.8" />
          </svg>
        </span>
        Sync this folder
      </label>
    </>
  );
}
