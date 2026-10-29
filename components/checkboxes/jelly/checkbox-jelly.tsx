"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-jelly-wobble {
    0% { transform: scale(1, 1); }
    14% { transform: scale(1.28, 0.72); }
    30% { transform: scale(0.82, 1.2); }
    45% { transform: scale(1.12, 0.9); }
    60% { transform: scale(0.95, 1.05); }
    76% { transform: scale(1.03, 0.97); }
    100% { transform: scale(1, 1); }
  }
  @keyframes cb-jelly-wobble-b {
    0% { transform: scale(1, 1); }
    14% { transform: scale(1.2, 0.8); }
    32% { transform: scale(0.88, 1.12); }
    50% { transform: scale(1.06, 0.95); }
    70% { transform: scale(0.98, 1.02); }
    100% { transform: scale(1, 1); }
  }
  @keyframes cb-jelly-shadow { 0%, 100% { transform: scaleX(1); } 14% { transform: scaleX(1.3); } 30% { transform: scaleX(0.85); } 45% { transform: scaleX(1.1); } }
  .cb-jelly { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-jelly__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-jelly__box { position: relative; width: 30px; height: 34px; border-radius: 9px; }
  .cb-jelly__input:focus-visible + .cb-jelly__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-jelly__shadow {
    position: absolute;
    left: 2px;
    right: 2px;
    bottom: 0;
    height: 5px;
    border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent), transparent);
  }
  .cb-jelly__cube {
    position: absolute;
    left: 2px;
    bottom: 2px;
    width: 26px;
    height: 26px;
    border-radius: 9px 9px 7px 7px;
    background: linear-gradient(160deg, light-dark(#cbced3, #393c41), light-dark(#dbdde1, #2e3035));
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087), inset 0 -4px 6px -2px light-dark(#ebedf0, #232529);
    transform-origin: 50% 100%;
    transition: background 0.3s;
  }
  .cb-jelly__cube::before {
    content: '';
    position: absolute;
    left: 5px;
    top: 3px;
    width: 9px;
    height: 4px;
    border-radius: 50%;
    background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent);
    transform: rotate(-12deg);
  }
  .cb-jelly__cube svg { position: absolute; inset: 0; width: 26px; height: 26px; }
  .cb-jelly__cube path {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0;
    transform: translateY(-6px) scale(0.6);
    transform-origin: 13px 14px;
    transition: transform 0.2s ease-in, opacity 0.2s;
  }
  .cb-jelly__input:checked + .cb-jelly__box .cb-jelly__cube { background: linear-gradient(160deg, light-dark(#5f626a, #a7abb2), light-dark(#cbced3, #393c41)); }
  .cb-jelly__input:checked + .cb-jelly__box .cb-jelly__cube path { opacity: 1; transform: none; transition: transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1) 0.06s, opacity 0.1s ease 0.06s; }
  .cb-jelly[data-armed] .cb-jelly__input:checked + .cb-jelly__box .cb-jelly__cube { animation: cb-jelly-wobble 0.75s ease-out; }
  .cb-jelly[data-armed] .cb-jelly__input:not(:checked) + .cb-jelly__box .cb-jelly__cube { animation: cb-jelly-wobble-b 0.6s ease-out; }
  .cb-jelly[data-armed] .cb-jelly__input:checked + .cb-jelly__box .cb-jelly__shadow { animation: cb-jelly-shadow 0.75s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .cb-jelly__box * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function JellyCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-jelly" data-armed={armed || undefined}>
        <input className="cb-jelly__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-jelly__box" aria-hidden="true">
          <span className="cb-jelly__shadow" />
          <span className="cb-jelly__cube">
            <svg viewBox="0 0 26 26">
              <path d="M7.5 13.5L11.3 17.2L18.5 9" />
            </svg>
          </span>
        </span>
        Wiggle room
      </label>
    </>
  );
}
