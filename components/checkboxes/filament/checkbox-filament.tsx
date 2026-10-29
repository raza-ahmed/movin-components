"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-filament-flicker {
    0% { opacity: 0.2; }
    8% { opacity: 1; }
    14% { opacity: 0.35; }
    22% { opacity: 1; }
    30% { opacity: 0.6; }
    40%, 100% { opacity: 1; }
  }
  .cb-filament { position: relative; display: inline-flex; align-items: center; gap: 10px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-filament__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-filament__bulb { position: relative; width: 30px; height: 40px; border-radius: 15px 15px 6px 6px; }
  .cb-filament__input:focus-visible + .cb-filament__bulb { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-filament__halo {
    position: absolute;
    left: -12px;
    top: -12px;
    width: 54px;
    height: 46px;
    border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 26%, transparent), transparent);
    opacity: 0;
    transition: opacity 1.1s ease;
  }
  .cb-filament__bulb svg { position: absolute; inset: 0; width: 30px; height: 40px; overflow: visible; }
  .cb-filament__glass { fill: transparent; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.2; transition: fill 0.8s, stroke 0.8s; }
  .cb-filament__base { fill: light-dark(#cbced3, #393c41); }
  .cb-filament__thread { fill: none; stroke: light-dark(#ebedf0, #232529); stroke-width: 1; }
  .cb-filament__wire { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 0.8; }
  .cb-filament__coil {
    fill: none;
    stroke: light-dark(#cbced3, #393c41);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    /* Off, it cools slowly, like a real filament. */
    transition: stroke 1.1s ease, filter 1.1s ease;
  }
  .cb-filament__input:checked + .cb-filament__bulb .cb-filament__halo { opacity: 1; transition-duration: 0.3s; }
  .cb-filament__input:checked + .cb-filament__bulb .cb-filament__glass { fill: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 8%, transparent); stroke: light-dark(#50535b, #c6c8cd); transition-duration: 0.3s; }
  .cb-filament__input:checked + .cb-filament__bulb .cb-filament__coil {
    stroke: light-dark(#373a40, #f1f2f3);
    filter: drop-shadow(0 0 1.5px light-dark(#373a40, #f1f2f3)) drop-shadow(0 0 4px light-dark(#50535b, #c6c8cd));
    transition-duration: 0.15s;
  }
  .cb-filament[data-armed] .cb-filament__input:checked + .cb-filament__bulb .cb-filament__coil,
  .cb-filament[data-armed] .cb-filament__input:checked + .cb-filament__bulb .cb-filament__halo { animation: cb-filament-flicker 0.6s linear; }
  @media (prefers-reduced-motion: reduce) {
    .cb-filament__bulb * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

export function FilamentCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-filament" data-armed={armed || undefined}>
        <input className="cb-filament__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-filament__bulb" aria-hidden="true">
          <span className="cb-filament__halo" />
          <svg viewBox="0 0 30 40">
            <path
              className="cb-filament__glass"
              d="M15 2A12 12 0 0 1 22.6 23.3C21 24.7 20 26.3 20 28.3V29.5H10V28.3C10 26.3 9 24.7 7.4 23.3A12 12 0 0 1 15 2Z"
            />
            <rect className="cb-filament__base" x="10" y="30" width="10" height="7" rx="1.5" />
            <path className="cb-filament__thread" d="M10 32.3H20M10 34.6H20" />
            <path className="cb-filament__wire" d="M12.6 29.5L9.5 14.5M17.4 29.5L21.5 10.5" />
            <path className="cb-filament__coil" d="M9.5 14.5L13.5 19L21.5 10.5" />
          </svg>
        </span>
        Keep the lights on
      </label>
    </>
  );
}
