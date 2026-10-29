"use client";

import { useState } from 'react';

const css = `
  @keyframes toggle-tumble-go {
    0% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(11px, -5px) rotate(45deg); }
    50% { transform: translate(22px, 0) rotate(90deg); }
    75% { transform: translate(33px, -5px) rotate(135deg); }
    100% { transform: translate(44px, 0) rotate(180deg); }
  }
  @keyframes toggle-tumble-back {
    0% { transform: translate(44px, 0) rotate(180deg); }
    25% { transform: translate(33px, -5px) rotate(135deg); }
    50% { transform: translate(22px, 0) rotate(90deg); }
    75% { transform: translate(11px, -5px) rotate(45deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  .toggle-tumble { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-tumble__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-tumble__track { position: relative; width: 74px; height: 34px; border-radius: 6px; }
  .toggle-tumble__input:focus-visible + .toggle-tumble__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-tumble__floor { position: absolute; left: 0; right: 0; bottom: 2px; height: 3px; border-radius: 2px; background: light-dark(#dbdde1, #2e3035); }
  .toggle-tumble__floor::after { content: ''; position: absolute; right: 0; top: 0; width: 26px; height: 3px; border-radius: 2px; background: light-dark(#373a40, #f1f2f3); transform: scaleX(0); transform-origin: 100% 50%; transition: transform 0.3s; }
  .toggle-tumble__die {
    position: absolute;
    left: 4px;
    bottom: 5px;
    width: 22px;
    height: 22px;
    border-radius: 5px;
    background: light-dark(#50535b, #c6c8cd);
    box-shadow: inset 0 -2px 0 color-mix(in oklab, light-dark(#fbfcfd, #121417) 25%, transparent);
    transition: background-color 0.3s;
  }
  /* Two pips on a diagonal, so every quarter turn reads. */
  .toggle-tumble__die::before, .toggle-tumble__die::after { content: ''; position: absolute; width: 5px; height: 5px; border-radius: 50%; background: light-dark(#f3f4f7, #1a1c1f); }
  .toggle-tumble__die::before { left: 4px; top: 4px; }
  .toggle-tumble__die::after { right: 4px; bottom: 4px; }
  .toggle-tumble__input:checked + .toggle-tumble__track .toggle-tumble__die { transform: translate(44px, 0) rotate(180deg); background: light-dark(#373a40, #f1f2f3); }
  .toggle-tumble__input:checked + .toggle-tumble__track .toggle-tumble__floor::after { transform: none; transition-delay: 0.45s; }
  .toggle-tumble[data-armed] .toggle-tumble__input:checked + .toggle-tumble__track .toggle-tumble__die { animation: toggle-tumble-go 0.6s cubic-bezier(0.45, 0, 0.55, 1); }
  .toggle-tumble[data-armed] .toggle-tumble__input:not(:checked) + .toggle-tumble__track .toggle-tumble__die { animation: toggle-tumble-back 0.6s cubic-bezier(0.45, 0, 0.55, 1); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-tumble__track *, .toggle-tumble__track *::after { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

export function TumbleToggle() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-tumble" data-armed={armed || undefined}>
        <input className="toggle-tumble__input" type="checkbox" role="switch" onChange={() => setArmed(true)} />
        <span className="toggle-tumble__track" aria-hidden="true">
          <span className="toggle-tumble__floor" />
          <span className="toggle-tumble__die" />
        </span>
        Shuffle
      </label>
    </>
  );
}
