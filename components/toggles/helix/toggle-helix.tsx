"use client";

import * as React from "react";
const css = `
  @keyframes toggle-helix-twist { 0% { transform: scaleY(1); } 50% { transform: scaleY(-1); } 100% { transform: scaleY(1); } }
  .toggle-helix { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-helix__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-helix__track {
    position: relative;
    width: 88px;
    height: 34px;
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .toggle-helix__input:focus-visible + .toggle-helix__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-helix__rung {
    position: absolute;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: light-dark(#dbdde1, #2e3035);
    transition: background-color 0.3s;
  }
  .toggle-helix__rung::before, .toggle-helix__rung::after {
    content: '';
    position: absolute;
    left: -1.5px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }
  .toggle-helix__rung::before { top: -3px; background: light-dark(#5f626a, #a7abb2); }
  .toggle-helix__rung::after { bottom: -3px; background: light-dark(#cbced3, #393c41); }
  /* Off, the strands lie flat and parallel. On, each rung turns a little behind the last, so the ladder twists into a helix. */
  .toggle-helix__input:checked + .toggle-helix__track .toggle-helix__rung {
    background: light-dark(#6d7179, #7d8087);
    animation: toggle-helix-twist 1.8s ease-in-out infinite;
    animation-delay: calc(var(--i) * -0.14s);
  }
  .toggle-helix__input:checked + .toggle-helix__track .toggle-helix__rung::before { background: light-dark(#373a40, #f1f2f3); }
  .toggle-helix__input:checked + .toggle-helix__track .toggle-helix__rung::after { background: light-dark(#50535b, #c6c8cd); }
  @media (prefers-reduced-motion: reduce) {
    .toggle-helix__input:checked + .toggle-helix__track .toggle-helix__rung { animation: none; }
  }
`;

export function HelixToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-helix">
        <input className="toggle-helix__input" type="checkbox" role="switch" />
        <span className="toggle-helix__track" aria-hidden="true">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className="toggle-helix__rung" style={{ left: 13 + i * 6.2, '--i': i } as React.CSSProperties} />
          ))}
        </span>
        Sync
      </label>
    </>
  );
}
