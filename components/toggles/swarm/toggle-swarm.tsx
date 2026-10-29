"use client";

import * as React from "react";
const css = `
  @keyframes toggle-swarm-drift { to { transform: translate(var(--dx), var(--dy)); } }
  .toggle-swarm { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-swarm__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-swarm__track {
    position: relative;
    width: 84px;
    height: 32px;
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .toggle-swarm__input:focus-visible + .toggle-swarm__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-swarm__fly {
    position: absolute;
    left: -2px;
    top: -2px;
    width: 4px;
    height: 4px;
    transform: translate(var(--x0), var(--y0));
    transition: transform 0.9s cubic-bezier(0.5, 0, 0.2, 1) var(--d);
  }
  .toggle-swarm__fly i {
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: light-dark(#6d7179, #7d8087);
    animation: toggle-swarm-drift 1.6s ease-in-out var(--d) infinite alternate;
    transition: background-color 0.4s, box-shadow 0.4s;
  }
  /* On: they fly over and gather into the thumb, glowing. */
  .toggle-swarm__input:checked + .toggle-swarm__track .toggle-swarm__fly { transform: translate(var(--x1), var(--y1)); }
  .toggle-swarm__input:checked + .toggle-swarm__track .toggle-swarm__fly i { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 5px 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent); transition-delay: 0.5s; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-swarm__fly { transition-duration: 0.01s; transition-delay: 0s; }
    .toggle-swarm__fly i { animation: none; }
  }
`;

const SCATTER = [
  [8, 9], [14, 21], [20, 12], [24, 25], [29, 7], [33, 17], [38, 26], [42, 10], [12, 15], [27, 19], [36, 5], [46, 20],
];

// Gathered positions: a small ring round the on-side centre, with a few inside it.
const FLIES = SCATTER.map(([x, y], i) => {
  const a = (i / SCATTER.length) * Math.PI * 2;
  const r = i % 3 === 0 ? 3 : 8;
  return {
    x0: x,
    y0: y,
    x1: 66 + Math.cos(a) * r,
    y1: 16 + Math.sin(a) * r,
    d: ((i * 7) % 12) * 0.035,
    dx: (((i * 5) % 7) - 3) * 0.9,
    dy: (((i * 3) % 7) - 3) * 0.9,
  };
});

export function SwarmToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-swarm">
        <input className="toggle-swarm__input" type="checkbox" role="switch" />
        <span className="toggle-swarm__track" aria-hidden="true">
          {FLIES.map((f, i) => (
            <span
              key={i}
              className="toggle-swarm__fly"
              style={
                {
                  '--x0': `${f.x0}px`,
                  '--y0': `${f.y0}px`,
                  '--x1': `${f.x1.toFixed(1)}px`,
                  '--y1': `${f.y1.toFixed(1)}px`,
                  '--d': `${f.d.toFixed(2)}s`,
                  '--dx': `${f.dx.toFixed(1)}px`,
                  '--dy': `${f.dy.toFixed(1)}px`,
                } as React.CSSProperties
              }
            >
              <i />
            </span>
          ))}
        </span>
        Night lights
      </label>
    </>
  );
}
