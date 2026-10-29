"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes cb-pencil-write {
    0% { opacity: 0; transform: translate(10px, -34px); }
    12% { opacity: 1; transform: translate(6px, -26px); }
    40% { transform: translate(11px, -20px); }
    85% { opacity: 1; transform: translate(21px, -34px); }
    100% { opacity: 0; transform: translate(27px, -42px); }
  }
  @keyframes cb-pencil-erase {
    0% { opacity: 0; transform: translate(4px, -22px); }
    15% { opacity: 1; transform: translate(7px, -25px); }
    30% { transform: translate(14px, -21px); }
    45% { transform: translate(9px, -25px); }
    60% { transform: translate(18px, -29px); }
    75% { opacity: 1; transform: translate(12px, -25px); }
    100% { opacity: 0; transform: translate(20px, -40px); }
  }
  @keyframes cb-pencil-crumb {
    0% { opacity: 0; transform: translate(0, 0); }
    25% { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--dx), 16px); }
  }
  .cb-pencil { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-pencil__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-pencil__box {
    position: relative;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1.5px light-dark(#6d7179, #7d8087);
    transition: box-shadow 0.2s;
  }
  .cb-pencil__input:focus-visible + .cb-pencil__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-pencil__input:checked + .cb-pencil__box { box-shadow: inset 0 0 0 1.5px light-dark(#50535b, #c6c8cd); }
  .cb-pencil__tick { position: absolute; inset: 0; width: 26px; height: 26px; overflow: visible; }
  .cb-pencil__tick path {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    opacity: 0;
    transition: opacity 0.3s ease 0.15s, stroke-dashoffset 0s linear 0.6s;
  }
  .cb-pencil__input:checked + .cb-pencil__box .cb-pencil__tick path {
    stroke-dashoffset: 0;
    opacity: 1;
    transition: stroke-dashoffset 0.44s linear 0.07s, opacity 0s;
  }
  .cb-pencil__tool { position: absolute; left: 0; top: 0; width: 30px; height: 40px; overflow: visible; opacity: 0; pointer-events: none; z-index: 1; }
  .cb-pencil[data-armed] .cb-pencil__input:checked + .cb-pencil__box .cb-pencil__tool--lead { animation: cb-pencil-write 0.6s linear; }
  .cb-pencil[data-armed] .cb-pencil__input:not(:checked) + .cb-pencil__box .cb-pencil__tool--eraser { animation: cb-pencil-erase 0.6s ease-in-out; }
  .cb-pencil__k100 { fill: light-dark(#373a40, #f1f2f3); }
  .cb-pencil__k300 { fill: light-dark(#50535b, #c6c8cd); }
  .cb-pencil__k400 { fill: light-dark(#5f626a, #a7abb2); }
  .cb-pencil__k500 { fill: light-dark(#6d7179, #7d8087); }
  .cb-pencil__k600 { fill: light-dark(#cbced3, #393c41); }
  .cb-pencil__crumb { position: absolute; left: 13px; top: 18px; width: 2px; height: 2px; border-radius: 1px; background: light-dark(#5f626a, #a7abb2); opacity: 0; }
  .cb-pencil[data-armed] .cb-pencil__input:not(:checked) + .cb-pencil__box .cb-pencil__crumb { animation: cb-pencil-crumb 0.5s ease-in var(--d); }
  @media (prefers-reduced-motion: reduce) {
    .cb-pencil__box * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const CRUMBS = [
  { dx: '-5px', d: '0.12s', left: 10 },
  { dx: '3px', d: '0.24s', left: 15 },
  { dx: '-1px', d: '0.36s', left: 19 },
];

export function PencilCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-pencil" data-armed={armed || undefined}>
        <input className="cb-pencil__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-pencil__box" aria-hidden="true">
          <svg className="cb-pencil__tick" viewBox="0 0 26 26">
            <path pathLength={1} d="M6 14C7.5 15.6 9.5 18.4 11 20C13.5 15.5 17 10 21 6" />
          </svg>
          {/* Drawn lying along +x, tip at the origin, then turned to write up and to the right. */}
          <svg className="cb-pencil__tool cb-pencil__tool--lead" viewBox="0 0 30 40">
            <g transform="translate(0 40) rotate(-45)">
              <path d="M0 0L3 -1.2V1.2Z" className="cb-pencil__k100" />
              <path d="M3 -1.2L9 -3.5V3.5L3 1.2Z" className="cb-pencil__k400" />
              <rect x="9" y="-3.5" width="20" height="7" className="cb-pencil__k500" />
              <rect x="9" y="-3.5" width="20" height="2" className="cb-pencil__k400" />
              <rect x="29" y="-3.5" width="3" height="7" className="cb-pencil__k300" />
              <rect x="32" y="-3.5" width="4.5" height="7" rx="1.5" className="cb-pencil__k600" />
            </g>
          </svg>
          <svg className="cb-pencil__tool cb-pencil__tool--eraser" viewBox="0 0 30 40">
            <g transform="translate(0 40) rotate(-45)">
              <rect x="0" y="-3.5" width="4.5" height="7" rx="1.5" className="cb-pencil__k600" />
              <rect x="4.5" y="-3.5" width="3" height="7" className="cb-pencil__k300" />
              <rect x="7.5" y="-3.5" width="20" height="7" className="cb-pencil__k500" />
              <rect x="7.5" y="-3.5" width="20" height="2" className="cb-pencil__k400" />
              <path d="M27.5 -3.5L33.5 -1.2V1.2L27.5 3.5Z" className="cb-pencil__k400" />
              <path d="M33.5 -1.2L36.5 0L33.5 1.2Z" className="cb-pencil__k100" />
            </g>
          </svg>
          {CRUMBS.map((c) => (
            <span key={c.left} className="cb-pencil__crumb" style={{ left: c.left, '--dx': c.dx, '--d': c.d } as React.CSSProperties} />
          ))}
        </span>
        Draft the outline
      </label>
    </>
  );
}
