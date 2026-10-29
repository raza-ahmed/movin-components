"use client";

import * as React from "react";
const css = `
  @keyframes toggle-hyperdrive-streak {
    0% { transform: translateX(16px) scaleX(1); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translateX(-70px) scaleX(9); opacity: 0; }
  }
  .toggle-hyperdrive { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-hyperdrive__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-hyperdrive__track {
    position: relative;
    width: 80px;
    height: 32px;
    border-radius: 999px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    transition: background-color 0.4s;
  }
  .toggle-hyperdrive__input:focus-visible + .toggle-hyperdrive__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-hyperdrive__star {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: 2px;
    height: 2px;
    border-radius: 1px;
    background: light-dark(#50535b, #c6c8cd);
    opacity: 0.55;
    transform-origin: 100% 50%;
  }
  .toggle-hyperdrive__thumb {
    position: absolute;
    left: 4px;
    top: 4px;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: light-dark(#50535b, #c6c8cd);
    color: light-dark(#fbfcfd, #121417);
    transition: transform 0.5s cubic-bezier(0.8, 0, 0.2, 1), background-color 0.3s, box-shadow 0.4s;
  }
  .toggle-hyperdrive__thumb svg { width: 12px; height: 12px; }
  .toggle-hyperdrive__input:checked + .toggle-hyperdrive__track { background: light-dark(#f3f4f7, #1a1c1f); }
  /* At warp, every star stretches into a streak flying past. */
  .toggle-hyperdrive__input:checked + .toggle-hyperdrive__track .toggle-hyperdrive__star { animation: toggle-hyperdrive-streak 0.55s linear infinite var(--d); }
  .toggle-hyperdrive__input:checked + .toggle-hyperdrive__track .toggle-hyperdrive__thumb {
    transform: translateX(48px);
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: -10px 0 12px -4px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    .toggle-hyperdrive__input:checked + .toggle-hyperdrive__track .toggle-hyperdrive__star { animation: none; }
    .toggle-hyperdrive__thumb { transition-duration: 0.01s; }
  }
`;

const STARS = [
  [12, 7], [22, 22], [31, 12], [40, 25], [47, 6], [55, 17], [63, 9], [70, 23], [26, 4], [60, 27],
];

export function HyperdriveToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-hyperdrive">
        <input className="toggle-hyperdrive__input" type="checkbox" role="switch" />
        <span className="toggle-hyperdrive__track" aria-hidden="true">
          {STARS.map(([x, y], i) => (
            <span
              key={i}
              className="toggle-hyperdrive__star"
              style={{ '--x': `${x}px`, '--y': `${y}px`, '--d': `${-((i * 0.37) % 0.55).toFixed(2)}s` } as React.CSSProperties}
            />
          ))}
          <span className="toggle-hyperdrive__thumb">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l6 6-6 6M13 6l6 6-6 6" />
            </svg>
          </span>
        </span>
        Warp
      </label>
    </>
  );
}
