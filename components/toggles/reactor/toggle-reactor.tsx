"use client";

import * as React from "react";
const css = `
  @keyframes toggle-reactor-ring {
    from { transform: rotate(var(--r)) rotateX(72deg) rotate(0deg); }
    to { transform: rotate(var(--r)) rotateX(72deg) rotate(360deg); }
  }
  @keyframes toggle-reactor-flow { to { background-position: 16px 0; } }
  .toggle-reactor { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-reactor__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-reactor__track {
    position: relative;
    width: 72px;
    height: 34px;
    border-radius: 999px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: background-color 0.4s;
  }
  .toggle-reactor__input:focus-visible + .toggle-reactor__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  /* Energy streaming along the track once the core is live. */
  .toggle-reactor__track::before {
    content: '';
    position: absolute;
    inset: 9px 8px;
    border-radius: 999px;
    background: repeating-linear-gradient(90deg, light-dark(#6d7179, #7d8087) 0 1px, transparent 1px 8px) 0 0 / 16px 100%;
    opacity: 0;
    transition: opacity 0.4s;
    animation: toggle-reactor-flow 0.5s linear infinite paused;
  }
  .toggle-reactor__thumb { position: absolute; left: 3px; top: 3px; width: 28px; height: 28px; transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .toggle-reactor__core {
    position: absolute;
    inset: 7px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, light-dark(#50535b, #c6c8cd), light-dark(#cbced3, #393c41));
    transition: box-shadow 0.4s;
  }
  .toggle-reactor__ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1.5px solid light-dark(#5f626a, #a7abb2);
    opacity: 0.45;
    transition: opacity 0.4s, border-color 0.4s;
    animation: toggle-reactor-ring 1.4s linear infinite paused;
  }
  .toggle-reactor__ring + .toggle-reactor__ring { animation-duration: 1.9s; animation-direction: reverse; }
  .toggle-reactor__input:checked + .toggle-reactor__track { background: light-dark(#dbdde1, #2e3035); }
  .toggle-reactor__input:checked + .toggle-reactor__track::before { opacity: 0.55; animation-play-state: running; }
  .toggle-reactor__input:checked + .toggle-reactor__track .toggle-reactor__thumb { transform: translateX(38px); }
  .toggle-reactor__input:checked + .toggle-reactor__track .toggle-reactor__core {
    background: radial-gradient(circle at 40% 35%, light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2));
    box-shadow: 0 0 8px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 55%, transparent);
  }
  .toggle-reactor__input:checked + .toggle-reactor__track .toggle-reactor__ring { opacity: 1; border-color: light-dark(#373a40, #f1f2f3); animation-play-state: running; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-reactor__track *, .toggle-reactor__track::before { transition-duration: 0.01s !important; animation: none !important; }
  }
`;

export function ReactorToggle() {
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-reactor">
        <input className="toggle-reactor__input" type="checkbox" role="switch" />
        <span className="toggle-reactor__track" aria-hidden="true">
          <span className="toggle-reactor__thumb">
            <span className="toggle-reactor__core" />
            <span className="toggle-reactor__ring" style={{ '--r': '35deg' } as React.CSSProperties} />
            <span className="toggle-reactor__ring" style={{ '--r': '-35deg' } as React.CSSProperties} />
          </span>
        </span>
        Core power
      </label>
    </>
  );
}
