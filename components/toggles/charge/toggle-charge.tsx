"use client";

import * as React from "react";
const css = `
  @keyframes toggle-charge-pulse { 50% { opacity: 0.45; } }
  .toggle-charge { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-charge__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-charge__track {
    position: relative;
    display: flex;
    gap: 2px;
    width: 58px;
    height: 28px;
    padding: 3px;
    margin-right: 5px;
    border-radius: 6px;
    box-shadow: inset 0 0 0 2px light-dark(#6d7179, #7d8087);
  }
  .toggle-charge__track::after { content: ''; position: absolute; right: -5px; top: 9px; width: 3px; height: 10px; border-radius: 0 2px 2px 0; background: light-dark(#6d7179, #7d8087); }
  .toggle-charge__input:focus-visible + .toggle-charge__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 4px; }
  .toggle-charge__cell {
    flex: 1;
    margin: 1px 0;
    border-radius: 2px;
    background: light-dark(#ebedf0, #232529);
    transition: background-color 0.15s ease calc((4 - var(--i)) * 0.05s);
  }
  .toggle-charge__bolt {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    fill: light-dark(#fbfcfd, #121417);
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 1.5;
    stroke-linejoin: round;
    opacity: 0;
    transform: scale(0.4) rotate(-20deg);
    transition: opacity 0.2s, transform 0.3s;
  }
  /* Cells fill left to right, then the bolt drops in and the last cell keeps charging. */
  .toggle-charge__input:checked + .toggle-charge__track .toggle-charge__cell { background: light-dark(#42454c, #e5e6e9); transition-delay: calc(var(--i) * 0.09s); }
  .toggle-charge__input:checked + .toggle-charge__track .toggle-charge__cell:last-of-type { animation: toggle-charge-pulse 1.2s ease-in-out 0.6s infinite; }
  .toggle-charge__input:checked + .toggle-charge__track .toggle-charge__bolt { opacity: 1; transform: none; transition: opacity 0.2s 0.45s, transform 0.4s cubic-bezier(0.34, 1.8, 0.64, 1) 0.45s; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-charge__track * { transition-duration: 0.01s !important; transition-delay: 0s !important; animation: none !important; }
  }
`;

export function ChargeToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-charge">
        <input className="toggle-charge__input" type="checkbox" role="switch" />
        <span className="toggle-charge__track" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="toggle-charge__cell" style={{ '--i': i } as React.CSSProperties} />
          ))}
          <svg className="toggle-charge__bolt" viewBox="0 0 24 24">
            <path d="M13.5 2L5 13.5h6L10 22l9-12h-6.5z" />
          </svg>
        </span>
        Fast charge
      </label>
    </>
  );
}
