"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  @keyframes radio-seasons-leaf {
    0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
    10% { opacity: 1; }
    50% { transform: translate(8px, 26px) rotate(120deg); }
    90% { opacity: 1; }
    100% { opacity: 0; transform: translate(-4px, 54px) rotate(260deg); }
  }
  @keyframes radio-seasons-snow { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translateY(96px); } }
  .radio-seasons { --radio-seasons-s: 0.5; --radio-seasons-c: light-dark(#50535b, #c6c8cd); display: grid; justify-items: center; gap: 12px; }
  .radio-seasons:has(.radio-seasons__input[value='summer']:checked) { --radio-seasons-s: 1; --radio-seasons-c: light-dark(#6d7179, #7d8087); }
  .radio-seasons:has(.radio-seasons__input[value='autumn']:checked) { --radio-seasons-s: 0.85; --radio-seasons-c: light-dark(#5f626a, #a7abb2); }
  .radio-seasons:has(.radio-seasons__input[value='winter']:checked) { --radio-seasons-s: 0; }
  .radio-seasons__tree { position: relative; width: 120px; height: 100px; overflow: hidden; }
  .radio-seasons__ground { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: light-dark(#dbdde1, #2e3035); transition: height 0.6s, background-color 0.6s; }
  .radio-seasons:has(.radio-seasons__input[value='winter']:checked) .radio-seasons__ground { height: 5px; background: light-dark(#42454c, #e5e6e9); }
  .radio-seasons__trunk { position: absolute; left: 57px; bottom: 0; width: 6px; height: 54px; border-radius: 3px 3px 0 0; background: light-dark(#cbced3, #393c41); }
  .radio-seasons__branch { position: absolute; bottom: 30px; width: 4px; height: 26px; border-radius: 2px; background: light-dark(#cbced3, #393c41); transform-origin: 50% 100%; }
  .radio-seasons__branch::after { content: ''; position: absolute; left: -1px; top: -2px; width: 6px; height: 3px; border-radius: 2px; background: light-dark(#42454c, #e5e6e9); opacity: 0; transition: opacity 0.5s 0.3s; }
  .radio-seasons:has(.radio-seasons__input[value='winter']:checked) .radio-seasons__branch::after { opacity: 1; }
  .radio-seasons__leaf {
    position: absolute;
    width: 16px;
    height: 16px;
    margin: -8px;
    border-radius: 50% 0 50% 50%;
    background: var(--radio-seasons-c);
    transform: rotate(var(--r)) scale(var(--radio-seasons-s));
    transition: transform 0.55s cubic-bezier(0.35, 1.35, 0.5, 1) calc(var(--i) * 25ms), background-color 0.6s ease calc(var(--i) * 25ms);
  }
  .radio-seasons__fall, .radio-seasons__flake { position: absolute; opacity: 0; }
  .radio-seasons__fall { width: 7px; height: 7px; border-radius: 50% 0 50% 50%; background: light-dark(#5f626a, #a7abb2); }
  .radio-seasons__flake { top: -4px; width: 3px; height: 3px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); }
  .radio-seasons:has(.radio-seasons__input[value='autumn']:checked) .radio-seasons__fall { animation: radio-seasons-leaf 2.6s ease-in-out infinite; animation-delay: var(--d); }
  .radio-seasons:has(.radio-seasons__input[value='winter']:checked) .radio-seasons__flake { animation: radio-seasons-snow 2.4s linear infinite; animation-delay: var(--d); }
  .radio-seasons__opts { display: flex; gap: 3px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-seasons__opt {
    position: relative;
    padding: 5px 9px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-seasons__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-seasons__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-seasons__opt:has(.radio-seasons__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-seasons__opt:has(.radio-seasons__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-seasons * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// Fixed positions round the crown, so the server and the browser agree.
const LEAVES = [
  [60, 14], [47, 18], [73, 18], [38, 28], [52, 26], [66, 26], [82, 28],
  [34, 40], [46, 38], [60, 36], [74, 38], [86, 40], [42, 50], [56, 48], [68, 50], [80, 50],
];
const FALLS = [
  { x: 40, y: 44, d: '0s' },
  { x: 76, y: 40, d: '0.9s' },
  { x: 58, y: 50, d: '1.7s' },
];
const FLAKES = [8, 22, 36, 50, 66, 80, 94, 108];
const SEASONS = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'winter', label: 'Winter' },
];

export function SeasonsRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-seasons">
        <span className="radio-seasons__tree" aria-hidden="true">
          <span className="radio-seasons__trunk" />
          <span className="radio-seasons__branch" style={{ left: 50, transform: 'rotate(-38deg)' }} />
          <span className="radio-seasons__branch" style={{ left: 66, transform: 'rotate(40deg)' }} />
          {LEAVES.map(([x, y], i) => (
            <span key={i} className="radio-seasons__leaf" style={{ left: x, top: y, '--i': i, '--r': `${(i * 47) % 360}deg` } as React.CSSProperties} />
          ))}
          {FALLS.map((f) => (
            <span key={f.d} className="radio-seasons__fall" style={{ left: f.x, top: f.y, '--d': f.d } as React.CSSProperties} />
          ))}
          {FLAKES.map((x, i) => (
            <span key={x} className="radio-seasons__flake" style={{ left: x, '--d': `${((i * 0.37) % 2.4).toFixed(2)}s` } as React.CSSProperties} />
          ))}
          <span className="radio-seasons__ground" />
        </span>
        <div className="radio-seasons__opts" role="radiogroup" aria-label="Season">
          {SEASONS.map((s, i) => (
            <label key={s.value} className="radio-seasons__opt">
              <input className="radio-seasons__input" type="radio" name={name} value={s.value} defaultChecked={i === 0} />
              {s.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
