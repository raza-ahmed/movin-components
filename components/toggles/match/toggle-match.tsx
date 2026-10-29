"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .toggle-match { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-match__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-match__scene { position: relative; flex: none; }
  .toggle-match__input:focus-visible + .toggle-match__scene { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 8px; }
  @keyframes toggle-match-strike { 0% { transform: translateX(0) rotate(-35deg); } 40% { transform: translateX(26px) rotate(-35deg); } 100% { transform: translateX(26px) rotate(-12deg); } }
  @keyframes toggle-match-catch { 0%, 38% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.5, 1.2); opacity: 1; } 100% { transform: none; opacity: 1; } }
  @keyframes toggle-match-flicker { 0%, 100% { transform: scale(1) rotate(-3deg); } 50% { transform: scale(0.92, 1.08) rotate(3deg); } }
  @keyframes toggle-match-spark { 0% { transform: translate(0, 0); opacity: 1; } 100% { transform: translate(var(--x), var(--y)); opacity: 0; } }
  @keyframes toggle-match-smoke { 0% { stroke-dashoffset: 1; opacity: 0.8; } 100% { stroke-dashoffset: 0; opacity: 0; transform: translateY(-8px); } }
  .toggle-match__scene { width: 76px; height: 52px; }
  .toggle-match__strip { position: absolute; left: 4px; bottom: 6px; width: 46px; height: 8px; border-radius: 2px; background: repeating-linear-gradient(90deg, light-dark(#cbced3, #393c41) 0 2px, light-dark(#6d7179, #7d8087) 2px 3px); }
  .toggle-match__stick { position: absolute; left: 6px; bottom: 16px; width: 40px; height: 4px; border-radius: 2px; background: light-dark(#50535b, #c6c8cd); transform-origin: 100% 50%; transform: rotate(-12deg) translateX(26px); }
  .toggle-match__stick::before { content: ''; position: absolute; left: -5px; top: -2.5px; width: 9px; height: 9px; border-radius: 50%; background: light-dark(#6d7179, #7d8087); transition: background-color 0.3s 0.3s; }
  .toggle-match__flame { position: absolute; left: -8px; top: -20px; width: 12px; height: 20px; transform-origin: 50% 100%; opacity: 0; }
  .toggle-match__flame span { position: absolute; inset: 0; border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; background: radial-gradient(ellipse at 50% 74%, light-dark(#fbfcfd, #121417) 0 18%, light-dark(#373a40, #f1f2f3) 45%, light-dark(#50535b, #c6c8cd)); animation: toggle-match-flicker 0.7s ease-in-out infinite; }
  .toggle-match__spark { position: absolute; left: -2px; top: 0; width: 2px; height: 2px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); opacity: 0; }
  .toggle-match__smoke { position: absolute; left: -12px; top: -30px; width: 16px; height: 28px; overflow: visible; }
  .toggle-match__smoke path { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.2; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; }
  .toggle-match__input:checked + .toggle-match__scene .toggle-match__flame { opacity: 1; }
  .toggle-match__input:checked + .toggle-match__scene .toggle-match__stick::before { background: light-dark(#dbdde1, #2e3035); }
  .toggle-match[data-armed] .toggle-match__input:checked + .toggle-match__scene .toggle-match__stick { animation: toggle-match-strike 0.5s cubic-bezier(0.5, 0, 0.3, 1) both; }
  .toggle-match[data-armed] .toggle-match__input:checked + .toggle-match__scene .toggle-match__flame { animation: toggle-match-catch 0.6s ease-out both; }
  .toggle-match[data-armed] .toggle-match__input:checked + .toggle-match__scene .toggle-match__spark { animation: toggle-match-spark 0.4s ease-out 0.18s; }
  .toggle-match[data-armed] .toggle-match__input:not(:checked) + .toggle-match__scene .toggle-match__smoke path { animation: toggle-match-smoke 1.1s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-match * { animation: none !important; transition: none !important; }
  }
`;

export function MatchToggle() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-match" data-armed={armed || undefined}>
        <input className="toggle-match__input" type="checkbox" role="switch" onChange={() => setArmed(true)} />
        <span className="toggle-match__scene" aria-hidden="true">
          <span className="toggle-match__strip" />
          <span className="toggle-match__stick">
            <svg className="toggle-match__smoke" viewBox="0 0 16 28">
              <path d="M8 26C5 21 11 18 8 13S11 6 8 2" pathLength={1} />
            </svg>
            <span className="toggle-match__flame">
              <span />
            </span>
            {[
              [-10, -8],
              [-4, -14],
              [-14, 2],
            ].map(([x, y]) => (
              <span key={x} className="toggle-match__spark" style={{ '--x': `${x}px`, '--y': `${y}px` } as React.CSSProperties} />
            ))}
          </span>
        </span>
        Fire it up
      </label>
    </>
  );
}
