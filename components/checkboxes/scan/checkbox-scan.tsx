"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes cb-scan-sweep {
    0% { opacity: 0; transform: translateY(-2px); }
    10% { opacity: 1; }
    45% { transform: translateY(26px); }
    70% { transform: translateY(2px); opacity: 1; }
    80%, 100% { opacity: 0; transform: translateY(2px); }
  }
  @keyframes cb-scan-flash { 0%, 66% { opacity: 0; } 72% { opacity: 0.6; } 100% { opacity: 0; } }
  .cb-scan { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-scan__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-scan__box {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41);
    transition: box-shadow 0.3s;
  }
  .cb-scan__input:focus-visible + .cb-scan__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-scan__cell {
    position: absolute;
    width: 3.4px;
    height: 3.4px;
    background: light-dark(#5f626a, #a7abb2);
    /* Unticking, the code reassembles cell by cell. */
    transition: transform 0.2s ease calc(var(--i) * 0.008s), opacity 0.2s ease calc(var(--i) * 0.008s);
  }
  .cb-scan__tick { position: absolute; inset: 0; width: 32px; height: 32px; }
  .cb-scan__tick path {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 0.15s ease;
  }
  .cb-scan__beam {
    position: absolute;
    left: 2px;
    right: 2px;
    top: 2px;
    height: 2px;
    border-radius: 1px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 6px 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent);
    opacity: 0;
  }
  .cb-scan__flash { position: absolute; inset: 0; border-radius: 6px; background: light-dark(#373a40, #f1f2f3); opacity: 0; }
  .cb-scan__input:checked + .cb-scan__box { box-shadow: inset 0 0 0 1.5px light-dark(#50535b, #c6c8cd); }
  .cb-scan__input:checked + .cb-scan__box .cb-scan__cell { transform: scale(0); opacity: 0; transition-delay: calc(0.55s + var(--i) * 0.006s); }
  .cb-scan__input:checked + .cb-scan__box .cb-scan__tick path { stroke-dashoffset: 0; transition: stroke-dashoffset 0.3s ease 0.7s; }
  .cb-scan[data-armed] .cb-scan__input:checked + .cb-scan__box .cb-scan__beam { animation: cb-scan-sweep 0.8s ease-in-out; }
  .cb-scan[data-armed] .cb-scan__input:checked + .cb-scan__box .cb-scan__flash { animation: cb-scan-flash 0.8s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .cb-scan__box * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// A 7×7 code with three finder corners. Fixed, so it renders the same on the server and in the browser.
const CODE = ['1110111', '1011101', '1110111', '0101101', '1110010', '1011011', '1110101'];
const CELLS = CODE.flatMap((row, y) => [...row].map((c, x) => (c === '1' ? { x, y } : null)).filter((c) => c !== null));

export function ScanCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-scan" data-armed={armed || undefined}>
        <input className="cb-scan__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-scan__box" aria-hidden="true">
          {CELLS.map((c, i) => (
            <span
              key={`${c.x}-${c.y}`}
              className="cb-scan__cell"
              style={{ left: 4 + c.x * 3.5, top: 4 + c.y * 3.5, '--i': i } as React.CSSProperties}
            />
          ))}
          <svg className="cb-scan__tick" viewBox="0 0 32 32">
            <path pathLength={1} d="M9 16.5L13.5 21L23 10.5" />
          </svg>
          <span className="cb-scan__flash" />
          <span className="cb-scan__beam" />
        </span>
        Ticket scanned
      </label>
    </>
  );
}
