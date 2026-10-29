"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  @keyframes radio-wind-flutter {
    from { transform: rotate(calc(var(--radio-wind-f) * -1)); }
    to { transform: rotate(var(--radio-wind-f)); }
  }
  @keyframes radio-wind-sway {
    from { transform: rotate(calc(var(--radio-wind-g) - var(--radio-wind-f))); }
    to { transform: rotate(calc(var(--radio-wind-g) + var(--radio-wind-f))); }
  }
  .radio-wind { --radio-wind-a: 76deg; --radio-wind-f: 1.5deg; --radio-wind-t: 1.6s; --radio-wind-g: 2deg; display: grid; justify-items: center; gap: 12px; }
  .radio-wind:has(.radio-wind__input[value='breeze']:checked) { --radio-wind-a: 34deg; --radio-wind-f: 4deg; --radio-wind-t: 0.7s; --radio-wind-g: 14deg; }
  .radio-wind:has(.radio-wind__input[value='gale']:checked) { --radio-wind-a: 2deg; --radio-wind-f: 3deg; --radio-wind-t: 0.22s; --radio-wind-g: 32deg; }
  .radio-wind__field { position: relative; width: 170px; height: 100px; }
  .radio-wind__pole { position: absolute; left: 30px; top: 8px; bottom: 0; width: 3px; border-radius: 2px; background: light-dark(#6d7179, #7d8087); }
  .radio-wind__mount { position: absolute; left: 32px; top: 12px; width: 0; height: 0; transform: rotate(var(--radio-wind-a)); transition: transform 0.9s cubic-bezier(0.35, 1.3, 0.5, 1); }
  .radio-wind__sock { position: absolute; left: 0; top: -12px; display: flex; align-items: center; height: 24px; transform-origin: 0 50%; animation: radio-wind-flutter var(--radio-wind-t) ease-in-out infinite alternate; }
  .radio-wind__band { height: calc(24px - var(--i) * 3px); width: 18px; background: light-dark(#6d7179, #7d8087); }
  .radio-wind__band:nth-child(odd) { background: light-dark(#42454c, #e5e6e9); }
  .radio-wind__band:first-child { border-radius: 2px 0 0 2px; }
  .radio-wind__band:last-child { border-radius: 0 3px 3px 0; }
  .radio-wind__grass { position: absolute; bottom: 0; width: 2px; height: 14px; border-radius: 1px; background: light-dark(#cbced3, #393c41); transform-origin: 50% 100%; animation: radio-wind-sway var(--radio-wind-t) ease-in-out infinite alternate; animation-delay: var(--d); }
  .radio-wind__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-wind__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-wind__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-wind__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-wind__opt:has(.radio-wind__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-wind__opt:has(.radio-wind__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-wind * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

const GRASS = [56, 70, 84, 98, 112, 126, 140, 154];
const WINDS = [
  { value: 'calm', label: 'Calm' },
  { value: 'breeze', label: 'Breeze' },
  { value: 'gale', label: 'Gale' },
];

export function WindRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-wind">
        <span className="radio-wind__field" aria-hidden="true">
          {GRASS.map((x, i) => (
            <span key={x} className="radio-wind__grass" style={{ left: x, height: 10 + (i % 3) * 4, '--d': `${(i * -0.09).toFixed(2)}s` } as React.CSSProperties} />
          ))}
          <span className="radio-wind__pole" />
          <span className="radio-wind__mount">
            <span className="radio-wind__sock">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="radio-wind__band" style={{ '--i': i } as React.CSSProperties} />
              ))}
            </span>
          </span>
        </span>
        <div className="radio-wind__opts" role="radiogroup" aria-label="Wind">
          {WINDS.map((w, i) => (
            <label key={w.value} className="radio-wind__opt">
              <input className="radio-wind__input" type="radio" name={name} value={w.value} defaultChecked={i === 0} />
              {w.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
