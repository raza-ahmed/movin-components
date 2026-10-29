"use client";

import * as React from "react";
import { useId, useState } from 'react';

const N = 6;

const css = `
  @keyframes field-postal-stamp { 0% { transform: scale(1.5) rotate(-8deg); opacity: 0; } 55% { transform: scale(0.92) rotate(2deg); opacity: 1; } 100% { transform: rotate(var(--r)); opacity: 1; } }
  @keyframes field-postal-frank { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  .field-postal { width: 260px; }
  .field-postal__label { display: block; margin-bottom: 8px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-postal__row { position: relative; display: flex; gap: 6px; cursor: text; }
  .field-postal__input { position: absolute; inset: 0; width: 100%; height: 100%; padding: 0; border: 0; opacity: 0; font-size: 16px; }
  /* A stamp: perforated edge from a scalloped mask, a printed frame inside. */
  .field-postal__stamp {
    position: relative;
    display: grid;
    place-items: center;
    width: 36px;
    height: 44px;
    background: light-dark(#ebedf0, #232529);
    -webkit-mask: radial-gradient(circle at 3px 3px, transparent 1.6px, #000 1.8px) -3px -3px / 6px 6px, linear-gradient(#000, #000) 3px 3px / calc(100% - 6px) calc(100% - 6px) no-repeat;
    mask: radial-gradient(circle at 3px 3px, transparent 1.6px, #000 1.8px) -3px -3px / 6px 6px, linear-gradient(#000, #000) 3px 3px / calc(100% - 6px) calc(100% - 6px) no-repeat;
  }
  .field-postal__stamp::before { content: ''; position: absolute; inset: 5px; border: 1px solid light-dark(#cbced3, #393c41); }
  .field-postal__stamp[data-next] { background: light-dark(#dbdde1, #2e3035); }
  .field-postal__stamp[data-next]::after { content: ''; position: absolute; bottom: 9px; width: 12px; height: 1.5px; background: light-dark(#50535b, #c6c8cd); }
  .field-postal__ch { position: relative; color: light-dark(#373a40, #f1f2f3); font: 600 18px/1 ui-monospace, SFMono-Regular, Menlo, monospace; transform: rotate(var(--r)); animation: field-postal-stamp 0.3s cubic-bezier(0.4, 0, 0.4, 1) both; }
  .field-postal__frank { position: absolute; left: -4px; right: -4px; top: 6px; height: 34px; width: calc(100% + 8px); overflow: visible; pointer-events: none; }
  .field-postal__frank path { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.3; stroke-dasharray: 1; animation: field-postal-frank 0.6s ease-out both; }
  .field-postal__frank path + path { animation-delay: 0.08s; }
  .field-postal__row:focus-within .field-postal__stamp[data-next] { background: light-dark(#cbced3, #393c41); }
  .field-postal__row:focus-within { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 6px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) {
    .field-postal__ch, .field-postal__frank path { animation: none !important; }
  }
`;

export function PostalInput() {
  const id = useId();
  const [v, setV] = useState('');
  const full = v.length === N;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-postal">
        <label className="field-postal__label" htmlFor={id}>
          Postcode
        </label>
        <div className="field-postal__row">
          {Array.from({ length: N }, (_, i) => (
            <span key={i} className="field-postal__stamp" data-next={i === v.length || undefined} aria-hidden="true">
              {v[i] && (
                <span key={v[i] + i} className="field-postal__ch" style={{ '--r': `${((i * 7) % 5) - 2}deg` } as React.CSSProperties}>
                  {v[i]}
                </span>
              )}
            </span>
          ))}
          {full && (
            <svg className="field-postal__frank" viewBox="0 0 260 34" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 12C20 6 40 18 60 12S100 6 120 12S160 18 180 12S220 6 260 12" pathLength={1} />
              <path d="M0 22C20 16 40 28 60 22S100 16 120 22S160 28 180 22S220 16 260 22" pathLength={1} />
            </svg>
          )}
          <input
            id={id}
            className="field-postal__input"
            value={v}
            maxLength={N}
            autoComplete="postal-code"
            autoCapitalize="characters"
            onChange={(e) => setV(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, N))}
          />
        </div>
      </div>
    </>
  );
}
