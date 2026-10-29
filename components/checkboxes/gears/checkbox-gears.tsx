"use client";

import * as React from "react";
const css = `
  .cb-gears { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-gears__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-gears__box { position: relative; width: 48px; height: 38px; border-radius: 6px; }
  .cb-gears__input:focus-visible + .cb-gears__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-gears__gear { position: absolute; overflow: visible; transition: transform 0.75s cubic-bezier(0.35, 1.25, 0.5, 1); }
  .cb-gears__gear--big { left: 1px; top: 6px; width: 32px; height: 32px; transform: rotate(-144deg); }
  .cb-gears__gear--small { left: 25px; top: -1px; width: 20px; height: 20px; transform: rotate(var(--s0)); }
  .cb-gears__teeth { fill: light-dark(#cbced3, #393c41); transition: fill 0.4s; }
  .cb-gears__gear--small .cb-gears__teeth { fill: light-dark(#dbdde1, #2e3035); }
  .cb-gears__hub { fill: light-dark(#ebedf0, #232529); }
  .cb-gears__axle { fill: light-dark(#6d7179, #7d8087); }
  .cb-gears__tick { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.4s; }
  .cb-gears__input:checked + .cb-gears__box .cb-gears__gear--big { transform: rotate(0deg); }
  .cb-gears__input:checked + .cb-gears__box .cb-gears__gear--small { transform: rotate(var(--s1)); }
  .cb-gears__input:checked + .cb-gears__box .cb-gears__gear--big .cb-gears__teeth { fill: light-dark(#6d7179, #7d8087); }
  .cb-gears__input:checked + .cb-gears__box .cb-gears__tick { stroke: light-dark(#373a40, #f1f2f3); transition-delay: 0.45s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-gears__box * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

/** A gear outline centred on the origin. Rounded so the server and the browser print the same path. */
function gear(teeth: number, outer: number, inner: number) {
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    for (const [f, r] of [[0, inner], [0.18, outer], [0.48, outer], [0.66, inner]]) {
      const a = (i + f) * step;
      pts.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
    }
  }
  return `M${pts.join('L')}Z`;
}

const BIG = gear(10, 15.5, 12.5);
const SMALL = gear(6, 9.5, 6.8);
// The small gear turns the other way, 10/6 as far. Its phase is set so the teeth mesh.
const PHASE = 14;
const SMALL_VARS = { '--s0': `${PHASE + 240}deg`, '--s1': `${PHASE}deg` } as React.CSSProperties;

export function GearsCheckbox() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-gears">
        <input className="cb-gears__input" type="checkbox" />
        <span className="cb-gears__box" aria-hidden="true">
          <svg className="cb-gears__gear cb-gears__gear--small" viewBox="-10 -10 20 20" style={SMALL_VARS}>
            <path className="cb-gears__teeth" d={SMALL} />
            <circle className="cb-gears__hub" r="3.4" />
            <circle className="cb-gears__axle" r="1.4" />
          </svg>
          <svg className="cb-gears__gear cb-gears__gear--big" viewBox="-16 -16 32 32">
            <path className="cb-gears__teeth" d={BIG} />
            <circle className="cb-gears__hub" r="10" />
            <path className="cb-gears__tick" d="M-5.5 0.5L-1.8 4.2L5.5 -4" />
          </svg>
        </span>
        Automate this
      </label>
    </>
  );
}
