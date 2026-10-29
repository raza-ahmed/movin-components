"use client";

import * as React from "react";
const css = `
  .toggle-circuit { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-circuit__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-circuit__track {
    position: relative;
    width: 86px;
    height: 34px;
    border-radius: 9px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
  }
  .toggle-circuit__input:focus-visible + .toggle-circuit__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-circuit__board { position: absolute; inset: 0; width: 86px; height: 34px; }
  .toggle-circuit__board path { fill: none; stroke-width: 1.5; stroke-linejoin: round; }
  .toggle-circuit__dim { stroke: light-dark(#dbdde1, #2e3035); }
  .toggle-circuit__lit {
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    filter: drop-shadow(0 0 2px light-dark(#50535b, #c6c8cd));
    transition: stroke-dashoffset 0.25s ease;
  }
  .toggle-circuit__led { fill: light-dark(#dbdde1, #2e3035); transition: fill 0.2s; }
  .toggle-circuit__chip {
    position: absolute;
    left: 5px;
    top: 9px;
    width: 26px;
    height: 16px;
    border-radius: 3px;
    background: light-dark(#dbdde1, #2e3035);
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087);
    transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1), background-color 0.3s;
  }
  /* Pins along the top and bottom edges. */
  .toggle-circuit__chip::before, .toggle-circuit__chip::after {
    content: '';
    position: absolute;
    left: 3px;
    right: 3px;
    height: 3px;
    background: repeating-linear-gradient(90deg, light-dark(#5f626a, #a7abb2) 0 2px, transparent 2px 5px);
  }
  .toggle-circuit__chip::before { top: -3px; }
  .toggle-circuit__chip::after { bottom: -3px; }
  .toggle-circuit__dot { position: absolute; left: 4px; top: 4px; width: 4px; height: 4px; border-radius: 50%; background: light-dark(#6d7179, #7d8087); transition: background-color 0.2s, box-shadow 0.2s; }
  .toggle-circuit__input:checked + .toggle-circuit__track .toggle-circuit__chip { transform: translateX(50px); background: light-dark(#cbced3, #393c41); }
  .toggle-circuit__input:checked + .toggle-circuit__track .toggle-circuit__dot { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 5px light-dark(#42454c, #e5e6e9); transition-delay: 0.45s; }
  .toggle-circuit__input:checked + .toggle-circuit__track .toggle-circuit__lit { stroke-dashoffset: 0; transition: stroke-dashoffset 0.6s ease var(--d); }
  .toggle-circuit__input:checked + .toggle-circuit__track .toggle-circuit__led { fill: light-dark(#373a40, #f1f2f3); transition-delay: 0.9s; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-circuit__track *, .toggle-circuit__board * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const TRACES = ['M4 7 H22 L28 13 H56 L62 7 H76', 'M4 27 H18 L24 21 H60 L66 27 H76'];

export function CircuitToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-circuit">
        <input className="toggle-circuit__input" type="checkbox" role="switch" />
        <span className="toggle-circuit__track" aria-hidden="true">
          <svg className="toggle-circuit__board" viewBox="0 0 86 34">
            {TRACES.map((d) => (
              <path key={d} className="toggle-circuit__dim" d={d} />
            ))}
            {TRACES.map((d, i) => (
              <path key={d} className="toggle-circuit__lit" d={d} pathLength={1} style={{ '--d': `${0.2 + i * 0.12}s` } as React.CSSProperties} />
            ))}
            <circle className="toggle-circuit__led" cx="79.5" cy="7" r="2.5" />
            <circle className="toggle-circuit__led" cx="79.5" cy="27" r="2.5" />
          </svg>
          <span className="toggle-circuit__chip">
            <span className="toggle-circuit__dot" />
          </span>
        </span>
        Circuit
      </label>
    </>
  );
}
