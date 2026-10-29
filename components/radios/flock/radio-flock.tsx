"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  @keyframes radio-flock-flap { from { transform: scaleY(1); } to { transform: scaleY(0.15); } }
  .radio-flock { display: grid; justify-items: center; gap: 12px; }
  .radio-flock__sky { position: relative; width: 190px; height: 104px; }
  .radio-flock__bird {
    position: absolute;
    left: 0;
    top: 0;
    width: 22px;
    height: 11px;
    margin: -5.5px 0 0 -11px;
    transform: translate(var(--radio-flock-lx), var(--radio-flock-ly));
    transition: transform 0.85s cubic-bezier(0.45, 0, 0.25, 1) calc(var(--i) * 45ms);
  }
  .radio-flock:has(.radio-flock__input[value='v']:checked) .radio-flock__bird { transform: translate(var(--radio-flock-vx), var(--radio-flock-vy)); }
  .radio-flock:has(.radio-flock__input[value='ring']:checked) .radio-flock__bird { transform: translate(var(--radio-flock-rx), var(--radio-flock-ry)); }
  .radio-flock__bird svg { display: block; width: 22px; height: 11px; overflow: visible; transform-origin: 50% 80%; animation: radio-flock-flap 0.32s ease-in-out infinite alternate; animation-delay: var(--d); }
  .radio-flock__bird path { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .radio-flock__bird:first-child path { stroke: light-dark(#373a40, #f1f2f3); }
  .radio-flock__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-flock__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-flock__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-flock__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-flock__opt:has(.radio-flock__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-flock__opt:has(.radio-flock__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-flock * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// Each bird's place in every formation, rounded so the server and the browser agree.
const V = [[95, 20], [74, 36], [116, 36], [53, 52], [137, 52], [32, 68], [158, 68]];
const BIRDS = V.map(([vx, vy], i) => {
  const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
  return {
    '--radio-flock-lx': `${23 + i * 24}px`,
    '--radio-flock-ly': '52px',
    '--radio-flock-vx': `${vx}px`,
    '--radio-flock-vy': `${vy}px`,
    '--radio-flock-rx': `${(95 + Math.cos(a) * 40).toFixed(1)}px`,
    '--radio-flock-ry': `${(52 + Math.sin(a) * 40).toFixed(1)}px`,
    '--i': i,
    '--d': `${(i * -0.11).toFixed(2)}s`,
  } as React.CSSProperties;
});
const FORMATIONS = [
  { value: 'line', label: 'Line' },
  { value: 'v', label: 'V' },
  { value: 'ring', label: 'Ring' },
];

export function FlockRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-flock">
        <span className="radio-flock__sky" aria-hidden="true">
          {BIRDS.map((style, i) => (
            <span key={i} className="radio-flock__bird" style={style}>
              <svg viewBox="0 0 22 11">
                <path d="M1 8Q5.5 1 11 8Q16.5 1 21 8" />
              </svg>
            </span>
          ))}
        </span>
        <div className="radio-flock__opts" role="radiogroup" aria-label="Formation">
          {FORMATIONS.map((f, i) => (
            <label key={f.value} className="radio-flock__opt">
              <input className="radio-flock__input" type="radio" name={name} value={f.value} defaultChecked={i === 1} />
              {f.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
