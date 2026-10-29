"use client";

import * as React from "react";
const css = `
  .cb-tiles { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-tiles__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-tiles__box { position: relative; width: 30px; height: 30px; border-radius: 7px; }
  .cb-tiles__input:focus-visible + .cb-tiles__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-tiles__tile {
    position: absolute;
    width: 14.5px;
    height: 14.5px;
    overflow: hidden;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transform: rotate(var(--r));
    /* Scrambling, the tiles turn away in reverse order. */
    transition: transform 0.35s cubic-bezier(0.5, 0, 0.5, 1) calc((3 - var(--i)) * 0.05s), background-color 0.3s;
  }
  .cb-tiles__tile svg { position: absolute; width: 30px; height: 30px; }
  .cb-tiles__tile path { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 3.4; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.3s; }
  .cb-tiles__input:checked + .cb-tiles__box .cb-tiles__tile {
    transform: rotate(0deg);
    background: light-dark(#cbced3, #393c41);
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087);
    transition: transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1) calc(var(--i) * 0.09s), background-color 0.3s ease 0.4s;
  }
  .cb-tiles__input:checked + .cb-tiles__box .cb-tiles__tile path { stroke: light-dark(#373a40, #f1f2f3); transition-delay: 0.4s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-tiles__box * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// Each tile shows its quarter of one tick; scrambled, each sits turned by its own angle.
const TILES = [
  { x: 0, y: 0, r: 90, radius: '7px 0 0 0' },
  { x: 15.5, y: 0, r: 180, radius: '0 7px 0 0' },
  { x: 15.5, y: 15.5, r: 270, radius: '0 0 7px 0' },
  { x: 0, y: 15.5, r: 90, radius: '0 0 0 7px' },
];

export function TilesCheckbox() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-tiles">
        <input className="cb-tiles__input" type="checkbox" />
        <span className="cb-tiles__box" aria-hidden="true">
          {TILES.map((t, i) => (
            <span
              key={i}
              className="cb-tiles__tile"
              style={{ left: t.x, top: t.y, borderRadius: t.radius, '--r': `${t.r}deg`, '--i': i } as React.CSSProperties}
            >
              <svg viewBox="0 0 30 30" style={{ left: -t.x, top: -t.y }}>
                <path d="M7.5 15.5L12.5 20.5L22.5 9" />
              </svg>
            </span>
          ))}
        </span>
        Everything fits
      </label>
    </>
  );
}
