"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  @keyframes radio-spice-rise { 0% { opacity: 0; transform: translateY(6px); } 40% { opacity: var(--radio-spice-heat); } 100% { opacity: 0; transform: translateY(-12px); } }
  @keyframes radio-spice-shake { 0%, 100% { transform: rotate(var(--r)); } 25% { transform: rotate(calc(var(--r) - 8deg)); } 75% { transform: rotate(calc(var(--r) + 8deg)); } }
  .radio-spice { --radio-spice-n: 1; --radio-spice-heat: 0; display: grid; justify-items: center; gap: 12px; }
  .radio-spice:has(.radio-spice__input[value='hot']:checked) { --radio-spice-n: 2; --radio-spice-heat: 0.5; }
  .radio-spice:has(.radio-spice__input[value='fire']:checked) { --radio-spice-n: 3; --radio-spice-heat: 1; }
  .radio-spice__row { position: relative; display: flex; gap: 6px; padding-top: 24px; }
  .radio-spice__heat { position: absolute; left: 0; right: 0; top: 0; height: 24px; display: flex; justify-content: center; gap: 14px; }
  .radio-spice__wave { width: 8px; height: 20px; overflow: visible; animation: radio-spice-rise 1.2s ease-out infinite; animation-delay: var(--d); opacity: 0; }
  .radio-spice__wave path { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.5; stroke-linecap: round; }
  .radio-spice__chilli {
    width: 34px;
    height: 34px;
    transform: rotate(var(--r));
    transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1) calc(var(--i) * 80ms);
  }
  .radio-spice__body { fill: light-dark(#dbdde1, #2e3035); transition: fill 0.3s ease calc(var(--i) * 80ms); }
  .radio-spice__calyx { fill: light-dark(#6d7179, #7d8087); }
  .radio-spice__stem { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 2; stroke-linecap: round; }
  .radio-spice__shine { fill: none; stroke: transparent; stroke-width: 1.5; stroke-linecap: round; transition: stroke 0.3s ease calc(var(--i) * 80ms); }
  /* A chilli is lit while its number is within the chosen heat. */
  .radio-spice__chilli--1 .radio-spice__body,
  .radio-spice:not(:has(.radio-spice__input[value='mild']:checked)) .radio-spice__chilli--2 .radio-spice__body,
  .radio-spice:has(.radio-spice__input[value='fire']:checked) .radio-spice__chilli--3 .radio-spice__body { fill: light-dark(#42454c, #e5e6e9); }
  .radio-spice__chilli--1 .radio-spice__shine,
  .radio-spice:not(:has(.radio-spice__input[value='mild']:checked)) .radio-spice__chilli--2 .radio-spice__shine,
  .radio-spice:has(.radio-spice__input[value='fire']:checked) .radio-spice__chilli--3 .radio-spice__shine { stroke: light-dark(#373a40, #f1f2f3); }
  .radio-spice:has(.radio-spice__input[value='fire']:checked) .radio-spice__chilli { animation: radio-spice-shake 0.18s linear infinite; }
  .radio-spice__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-spice__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-spice__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-spice__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-spice__opt:has(.radio-spice__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-spice__opt:has(.radio-spice__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-spice * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const LEVELS = [
  { value: 'mild', label: 'Mild' },
  { value: 'hot', label: 'Hot' },
  { value: 'fire', label: 'Fire' },
];

export function SpiceRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-spice">
        <span className="radio-spice__row" aria-hidden="true">
          <span className="radio-spice__heat">
            {['0s', '0.4s', '0.8s'].map((d) => (
              <svg key={d} className="radio-spice__wave" viewBox="0 0 8 20" style={{ '--d': d } as React.CSSProperties}>
                <path d="M4 19C1 15 7 12 4 8S7 2 4 1" />
              </svg>
            ))}
          </span>
          {[1, 2, 3].map((n) => (
            <svg
              key={n}
              className={`radio-spice__chilli radio-spice__chilli--${n}`}
              viewBox="0 0 34 34"
              style={{ '--i': n - 1, '--r': `${(n - 2) * 10}deg` } as React.CSSProperties}
            >
              <path className="radio-spice__body" d="M7 11C9 7 14 7 17 10C22 15 25 22 27 31C22 28 15 23 10 18C7 15 6 13 7 11Z" />
              <path className="radio-spice__shine" d="M11 12C14 13 18 17 20 21" />
              <path className="radio-spice__calyx" d="M6 11C6 8 9 6 12 7C13 9 11 11 8 12Z" />
              <path className="radio-spice__stem" d="M9 7C8 4 9 2 12 1" />
            </svg>
          ))}
        </span>
        <div className="radio-spice__opts" role="radiogroup" aria-label="Heat">
          {LEVELS.map((l, i) => (
            <label key={l.value} className="radio-spice__opt">
              <input className="radio-spice__input" type="radio" name={name} value={l.value} defaultChecked={i === 0} />
              {l.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
