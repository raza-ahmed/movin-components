"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  .radio-chart { display: grid; justify-items: center; gap: 14px; }
  .radio-chart__plot { position: relative; width: 190px; height: 88px; }
  .radio-chart__plot::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: light-dark(#cbced3, #393c41); }
  .radio-chart__grid { position: absolute; inset: 0 0 1px; background: repeating-linear-gradient(transparent 0 21px, color-mix(in oklab, light-dark(#cbced3, #393c41) 45%, transparent) 21px 22px); }
  .radio-chart__mark {
    position: absolute;
    left: calc(var(--x) * 1px);
    bottom: 0;
    width: 18px;
    height: calc(var(--v) * 1px);
    border-radius: 4px 4px 1px 1px;
    background: linear-gradient(light-dark(#42454c, #e5e6e9), light-dark(#5f626a, #a7abb2));
    transform: translateX(-50%);
    transition: bottom 0.45s cubic-bezier(0.4, 0, 0.2, 1) calc(var(--i) * 30ms), height 0.45s cubic-bezier(0.4, 0, 0.2, 1) calc(var(--i) * 30ms), width 0.3s ease, border-radius 0.3s ease;
  }
  /* Line and area: each bar shrinks to a point at its own top. */
  .radio-chart:not(:has(.radio-chart__input[value='bar']:checked)) .radio-chart__mark {
    bottom: calc(var(--v) * 1px - 4px);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
  }
  .radio-chart__plot svg { position: absolute; inset: 0; width: 190px; height: 88px; overflow: visible; }
  .radio-chart__line { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 2; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 0.2s ease; }
  .radio-chart__area { fill: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 16%, transparent); opacity: 0; transform: scaleY(0); transform-origin: 0 88px; transition: opacity 0.3s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
  .radio-chart:not(:has(.radio-chart__input[value='bar']:checked)) .radio-chart__line { stroke-dashoffset: 0; transition: stroke-dashoffset 0.55s cubic-bezier(0.5, 0, 0.3, 1) 0.35s; }
  .radio-chart:has(.radio-chart__input[value='area']:checked) .radio-chart__area { opacity: 1; transform: none; transition-delay: 0.45s; }
  .radio-chart__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-chart__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-chart__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-chart__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-chart__opt:has(.radio-chart__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-chart__opt:has(.radio-chart__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-chart * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const DATA = [24, 46, 34, 60, 50, 74];
const POINTS = DATA.map((v, i) => `${15 + i * 32} ${88 - v}`);
const TYPES = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'area', label: 'Area' },
];

export function ChartRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-chart">
        <span className="radio-chart__plot" aria-hidden="true">
          <span className="radio-chart__grid" />
          <svg viewBox="0 0 190 88">
            <path className="radio-chart__area" d={`M${POINTS.join('L')}L175 88H15Z`} />
            <path className="radio-chart__line" pathLength={1} d={`M${POINTS.join('L')}`} />
          </svg>
          {DATA.map((v, i) => (
            <span key={i} className="radio-chart__mark" style={{ '--x': 15 + i * 32, '--v': v, '--i': i } as React.CSSProperties} />
          ))}
        </span>
        <div className="radio-chart__opts" role="radiogroup" aria-label="Chart type">
          {TYPES.map((t, i) => (
            <label key={t.value} className="radio-chart__opt">
              <input className="radio-chart__input" type="radio" name={name} value={t.value} defaultChecked={i === 0} />
              {t.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
