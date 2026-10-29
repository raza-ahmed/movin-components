"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-pushpin-in { 0% { transform: translate(6px, -18px) scale(1.5); opacity: 0; } 60% { transform: translate(0, 1px) scale(0.94); opacity: 1; } 100% { transform: none; opacity: 1; } }
  .cb-pushpin { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-pushpin__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-pushpin__box { position: relative; width: 40px; height: 40px; }
  .cb-pushpin__input:focus-visible + .cb-pushpin__box { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 6px; }
  .cb-pushpin__card {
    position: absolute;
    inset: 6px 4px 4px;
    padding: 8px 5px 0;
    border-radius: 2px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 3px 6px 8px -4px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    transform-origin: 50% 4px;
    transform: rotate(-11deg) translateY(2px);
    transition: transform 0.6s cubic-bezier(0.3, 1.6, 0.4, 1), box-shadow 0.4s;
  }
  .cb-pushpin__card span { display: block; height: 2px; margin-bottom: 4px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); }
  .cb-pushpin__card span + span { width: 65%; }
  .cb-pushpin__pin { position: absolute; left: 15px; top: 0; width: 12px; height: 16px; overflow: visible; opacity: 0; }
  .cb-pushpin__head { fill: light-dark(#373a40, #f1f2f3); }
  .cb-pushpin__needle { stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.3; stroke-linecap: round; }
  .cb-pushpin__input:checked + .cb-pushpin__box .cb-pushpin__pin { opacity: 1; }
  .cb-pushpin__input:checked + .cb-pushpin__box .cb-pushpin__card { transform: none; box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 1px 3px 4px -2px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); transition-delay: 0.18s; }
  .cb-pushpin[data-armed] .cb-pushpin__input:checked + .cb-pushpin__box .cb-pushpin__pin { animation: cb-pushpin-in 0.3s cubic-bezier(0.5, 0, 0.6, 1.3) both; }
  .cb-pushpin[data-armed] .cb-pushpin__input:not(:checked) + .cb-pushpin__box .cb-pushpin__pin { transition: opacity 0.2s, transform 0.2s; transform: translate(6px, -12px); }
  @media (prefers-reduced-motion: reduce) {
    .cb-pushpin * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function PushpinCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-pushpin" data-armed={armed || undefined}>
        <input className="cb-pushpin__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-pushpin__box" aria-hidden="true">
          <span className="cb-pushpin__card">
            <span />
            <span />
          </span>
          <svg className="cb-pushpin__pin" viewBox="0 0 12 16">
            <line className="cb-pushpin__needle" x1="6" y1="9" x2="6" y2="15" />
            <path className="cb-pushpin__head" d="M2 1h8l-1.5 3.5L11 8H1l2.5-3.5Z" />
          </svg>
        </span>
        Pin to board
      </label>
    </>
  );
}
