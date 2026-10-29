"use client";

import * as React from "react";
const css = `
  @keyframes toggle-arc-flicker { 0% { opacity: 1; } 33%, 100% { opacity: 0; } }
  @keyframes toggle-arc-hum { 50% { box-shadow: 0 0 10px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent); } }
  .toggle-arc { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-arc__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-arc__track {
    position: relative;
    width: 80px;
    height: 32px;
    border-radius: 999px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: background-color 0.3s;
  }
  .toggle-arc__input:focus-visible + .toggle-arc__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-arc__node {
    position: absolute;
    top: 9px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, light-dark(#5f626a, #a7abb2), light-dark(#dbdde1, #2e3035));
    transition: background-color 0.3s;
  }
  .toggle-arc__node--a { left: 7px; }
  .toggle-arc__node--b { right: 7px; }
  .toggle-arc__bolts { position: absolute; inset: 0; width: 80px; height: 32px; }
  .toggle-arc__bolts path {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 1.4;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 2px light-dark(#50535b, #c6c8cd));
    opacity: 0;
  }
  .toggle-arc__input:checked + .toggle-arc__track { background: radial-gradient(ellipse at center, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 12%, light-dark(#fbfcfd, #121417)), light-dark(#fbfcfd, #121417) 70%); }
  .toggle-arc__input:checked + .toggle-arc__track .toggle-arc__node { background: radial-gradient(circle at 35% 35%, light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2)); animation: toggle-arc-hum 0.3s linear infinite; }
  /* Three bolts take turns, so the arc never holds still. */
  .toggle-arc__input:checked + .toggle-arc__track .toggle-arc__bolts path { animation: toggle-arc-flicker 0.24s steps(1) infinite var(--d); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-arc__input:checked + .toggle-arc__track .toggle-arc__node { animation: none; }
    .toggle-arc__input:checked + .toggle-arc__track .toggle-arc__bolts path { animation: none; }
    .toggle-arc__input:checked + .toggle-arc__track .toggle-arc__bolts path:first-child { opacity: 1; }
  }
`;

const BOLTS = [
  'M21 16 L27 12 L33 19 L40 13 L46 20 L53 14 L59 16',
  'M21 16 L26 20 L32 13 L39 18 L45 11 L52 18 L59 16',
  'M21 16 L28 14 L34 21 L41 15 L47 17 L54 12 L59 16',
];

export function ArcToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-arc">
        <input className="toggle-arc__input" type="checkbox" role="switch" />
        <span className="toggle-arc__track" aria-hidden="true">
          <span className="toggle-arc__node toggle-arc__node--a" />
          <span className="toggle-arc__node toggle-arc__node--b" />
          <svg className="toggle-arc__bolts" viewBox="0 0 80 32">
            {BOLTS.map((d, i) => (
              <path key={i} d={d} style={{ '--d': `${i * 0.08}s` } as React.CSSProperties} />
            ))}
          </svg>
        </span>
        High voltage
      </label>
    </>
  );
}
