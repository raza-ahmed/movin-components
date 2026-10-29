"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-marble-in {
    0% { transform: translate(2px, -2.5px) rotate(0deg); animation-timing-function: cubic-bezier(0.45, 0, 0.9, 0.7); }
    55% { transform: translate(28px, 7px) rotate(330deg); animation-timing-function: linear; }
    68% { transform: translate(40px, 4px) rotate(420deg); animation-timing-function: cubic-bezier(0.5, 0, 1, 0.6); }
    84% { transform: translate(51px, 15px) rotate(500deg); animation-timing-function: ease-out; }
    92% { transform: translate(51px, 12.5px) rotate(520deg); animation-timing-function: ease-in; }
    100% { transform: translate(51px, 15px) rotate(530deg); }
  }
  @keyframes cb-marble-out {
    0% { transform: translate(51px, 15px) rotate(530deg); animation-timing-function: ease-out; }
    40% { transform: translate(30px, -14px) rotate(380deg); animation-timing-function: ease-in; }
    100% { transform: translate(2px, -2.5px) rotate(0deg); }
  }
  @keyframes cb-marble-ring { 0%, 82% { box-shadow: inset 0 1px 3px light-dark(#fbfcfd, #121417), 0 0 0 0 light-dark(#50535b, #c6c8cd); } 90% { box-shadow: inset 0 1px 3px light-dark(#fbfcfd, #121417), 0 0 0 3px color-mix(in oklab, light-dark(#50535b, #c6c8cd) 50%, transparent); } 100% { box-shadow: inset 0 1px 3px light-dark(#fbfcfd, #121417), 0 0 0 6px transparent; } }
  .cb-marble { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-marble__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-marble__track { position: relative; width: 72px; height: 38px; }
  .cb-marble__ramp { position: absolute; left: 0; top: 0; width: 40px; height: 24px; overflow: visible; }
  .cb-marble__ramp path { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .cb-marble__box {
    position: absolute;
    right: 0;
    top: 6px;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41);
  }
  .cb-marble__input:focus-visible + .cb-marble__track .cb-marble__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-marble__hole {
    position: absolute;
    left: 7px;
    top: 7px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 1px 3px light-dark(#fbfcfd, #121417);
  }
  .cb-marble__ball {
    position: absolute;
    left: 0;
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd) 45%, light-dark(#cbced3, #393c41));
    transform: translate(2px, -2.5px);
    z-index: 1;
  }
  .cb-marble__ball::after { content: ''; position: absolute; left: 2px; top: 5px; width: 8px; height: 1.5px; border-radius: 1px; background: color-mix(in oklab, light-dark(#6d7179, #7d8087) 70%, transparent); }
  .cb-marble__input:checked + .cb-marble__track .cb-marble__ball { transform: translate(51px, 15px) rotate(530deg); }
  .cb-marble[data-armed] .cb-marble__input:checked + .cb-marble__track .cb-marble__ball { animation: cb-marble-in 0.85s; }
  .cb-marble[data-armed] .cb-marble__input:not(:checked) + .cb-marble__track .cb-marble__ball { animation: cb-marble-out 0.55s; }
  .cb-marble[data-armed] .cb-marble__input:checked + .cb-marble__track .cb-marble__hole { animation: cb-marble-ring 0.85s linear; }
  @media (prefers-reduced-motion: reduce) {
    .cb-marble__track * { animation: none !important; }
  }
`;

export function MarbleCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-marble" data-armed={armed || undefined}>
        <input className="cb-marble__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-marble__track" aria-hidden="true">
          <svg className="cb-marble__ramp" viewBox="0 0 40 24">
            <path d="M1 8L36 20.5" />
          </svg>
          <span className="cb-marble__box">
            <span className="cb-marble__hole" />
          </span>
          <span className="cb-marble__ball" />
        </span>
        Count me in
      </label>
    </>
  );
}
