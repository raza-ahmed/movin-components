"use client";

import { useId } from 'react';

const OPTIONS = [{"value": "warm", "label": "Warm"}, {"value": "flat", "label": "Flat"}, {"value": "bright", "label": "Bright"}];

const css = `
  .radio-eq { --i: 1; display: grid; justify-items: center; gap: 12px; width: 260px; }
  .radio-eq:has(.radio-eq__opt:nth-child(1) input:checked) { --i: 0; }
  .radio-eq:has(.radio-eq__opt:nth-child(2) input:checked) { --i: 1; }
  .radio-eq:has(.radio-eq__opt:nth-child(3) input:checked) { --i: 2; }
  .radio-eq__graph { position: relative; width: 220px; }
  .radio-eq__graph svg { display: block; width: 220px; height: 80px; overflow: visible; }
  .radio-eq__grid { stroke: light-dark(#ebedf0, #232529); stroke-width: 1; }
  .radio-eq__mid { stroke: light-dark(#dbdde1, #2e3035); stroke-dasharray: 2 3; }
  .radio-eq__area { fill: color-mix(in oklab, light-dark(#50535b, #c6c8cd) 16%, transparent); transition: d 0.6s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .radio-eq__line { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; stroke-linecap: round; transition: d 0.6s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .radio-eq:has(.radio-eq__opt:nth-child(1) input:checked) .radio-eq__line { d: path('M0 22C40 22 70 32 110 42S180 56 220 56'); }
  .radio-eq:has(.radio-eq__opt:nth-child(1) input:checked) .radio-eq__area { d: path('M0 22C40 22 70 32 110 42S180 56 220 56L220 80L0 80Z'); }
  .radio-eq:has(.radio-eq__opt:nth-child(2) input:checked) .radio-eq__line { d: path('M0 40C40 40 70 40 110 40S180 40 220 40'); }
  .radio-eq:has(.radio-eq__opt:nth-child(2) input:checked) .radio-eq__area { d: path('M0 40C40 40 70 40 110 40S180 40 220 40L220 80L0 80Z'); }
  .radio-eq:has(.radio-eq__opt:nth-child(3) input:checked) .radio-eq__line { d: path('M0 56C40 56 70 50 110 40S180 22 220 20'); }
  .radio-eq:has(.radio-eq__opt:nth-child(3) input:checked) .radio-eq__area { d: path('M0 56C40 56 70 50 110 40S180 22 220 20L220 80L0 80Z'); }
  .radio-eq__axis { display: flex; justify-content: space-between; margin-top: 4px; color: light-dark(#5f626a, #a7abb2); font-size: 10px; }
  @media (prefers-reduced-motion: reduce) {
    .radio-eq__area, .radio-eq__line { transition: none; }
  }
  .radio-eq__opts { display: flex; gap: 3px; padding: 4px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-eq__opt { position: relative; flex: 1; padding: 7px 10px; border-radius: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; text-align: center; white-space: nowrap; cursor: pointer; transition: background-color 0.25s, color 0.25s; }
  .radio-eq__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-eq__opt:has(input:checked) { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .radio-eq__opt:has(input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .radio-eq__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
`;

export function EqRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-eq">
        <div className="radio-eq__graph" aria-hidden="true">
          <svg viewBox="0 0 220 80">
            {[0, 55, 110, 165, 220].map((x) => (
              <line key={x} className="radio-eq__grid" x1={x} y1="0" x2={x} y2="80" />
            ))}
            <line className="radio-eq__mid" x1="0" y1="40" x2="220" y2="40" />
            <path className="radio-eq__area" d="M0 40C40 40 70 40 110 40S180 40 220 40L220 80L0 80Z" />
            <path className="radio-eq__line" d="M0 40C40 40 70 40 110 40S180 40 220 40" />
          </svg>
          <div className="radio-eq__axis">
            <span>60 Hz</span>
            <span>1 kHz</span>
            <span>10 kHz</span>
          </div>
        </div>
        <div className="radio-eq__opts" role="radiogroup" aria-label="Sound">
          {OPTIONS.map((o, i) => (
            <label key={o.value} className="radio-eq__opt">
              <input className="radio-eq__input" type="radio" name={name} value={o.value} defaultChecked={i === 1} />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
