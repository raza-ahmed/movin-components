"use client";

import { useState } from 'react';

const css = `
  .toggle-orbit { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-orbit__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-orbit__track { position: relative; width: 84px; height: 40px; border-radius: 999px; }
  .toggle-orbit__input:focus-visible + .toggle-orbit__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-orbit__ring { position: absolute; left: 10px; right: 10px; top: 6px; bottom: 6px; border-radius: 50%; border: 1px dashed light-dark(#cbced3, #393c41); }
  .toggle-orbit__star {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 10px;
    margin: -5px 0 0 -5px;
    border-radius: 50%;
    background: light-dark(#6d7179, #7d8087);
    transition: background-color 0.4s 0.6s, box-shadow 0.4s 0.6s;
  }
  /* The planet rides the orbit: each press sends it half a lap further, always forward. */
  .toggle-orbit__planet {
    position: absolute;
    left: 0;
    top: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2) 80%);
    offset-path: path('M10 20 A32 14 0 1 1 74 20 A32 14 0 1 1 10 20 Z');
    offset-rotate: 0deg;
    transition: offset-distance 0.9s cubic-bezier(0.45, 0, 0.3, 1);
  }
  .toggle-orbit__input:checked + .toggle-orbit__track .toggle-orbit__star { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 10px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 55%, transparent); }
  .toggle-orbit__input:checked + .toggle-orbit__track .toggle-orbit__ring { border-color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-orbit__track * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function OrbitToggle() {
  const [laps, setLaps] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-orbit">
        <input className="toggle-orbit__input" type="checkbox" role="switch" onChange={() => setLaps((n) => n + 1)} />
        <span className="toggle-orbit__track" aria-hidden="true">
          <span className="toggle-orbit__ring" />
          <span className="toggle-orbit__star" />
          <span className="toggle-orbit__planet" style={{ offsetDistance: `${laps * 50}%` }} />
        </span>
        Orbit sync
      </label>
    </>
  );
}
