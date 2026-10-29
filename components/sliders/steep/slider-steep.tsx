"use client";

import * as React from "react";
import { useState } from 'react';

const WORDS = ['Weak', 'Light', 'Medium', 'Strong', 'Bold'];

const css = `
  @keyframes slider-steep-bob { 50% { transform: translateY(4px) rotate(3deg); } }
  @keyframes slider-steep-curl { from { transform: translate(0, 0) scale(0.6); opacity: 0; } 30% { opacity: calc(var(--slider-steep-v) * 0.9); } to { transform: translate(var(--dx), 1px) scale(1.6, 0.9); opacity: 0; } }
  @keyframes slider-steep-steam { from { transform: translateY(6px); opacity: 0; } 40% { opacity: 0.7; } to { transform: translateY(-16px); opacity: 0; } }
  .slider-steep { display: grid; justify-items: center; gap: 8px; width: 220px; }
  .slider-steep__scene { position: relative; width: 150px; height: 130px; }
  .slider-steep__scene > svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .slider-steep__cup { fill: light-dark(#42454c, #e5e6e9); }
  .slider-steep__saucer { fill: light-dark(#5f626a, #a7abb2); }
  .slider-steep__rim { fill: light-dark(#50535b, #c6c8cd); }
  .slider-steep__handle { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 6; }
  .slider-steep__tea { fill: color-mix(in oklab, light-dark(#ebedf0, #232529) calc(var(--slider-steep-v) * 100%), light-dark(#5f626a, #a7abb2)); transition: fill 0.4s; }
  .slider-steep__steam { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 2; stroke-linecap: round; animation: slider-steep-steam 2.2s ease-out infinite; }
  .slider-steep__bag { transform-box: view-box; transform-origin: 96px 8px; animation: slider-steep-bob 2.4s ease-in-out infinite; }
  .slider-steep__string { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1; }
  .slider-steep__pouch { fill: light-dark(#5f626a, #a7abb2); }
  .slider-steep__tag { fill: light-dark(#373a40, #f1f2f3); }
  .slider-steep__curl { position: absolute; width: 16px; height: 6px; border-radius: 50%; background: radial-gradient(closest-side, light-dark(#dbdde1, #2e3035), transparent); animation: slider-steep-curl 2s ease-out infinite; }
  .slider-steep__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .slider-steep__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-steep__track { position: relative; width: 100%; height: 24px; }
  .slider-steep__rail { position: absolute; left: 0; right: 0; top: 8px; height: 8px; border-radius: 4px; background: linear-gradient(90deg, light-dark(#6d7179, #7d8087), light-dark(#ebedf0, #232529)); }
  .slider-steep__thumb { position: absolute; top: 2px; left: calc(var(--slider-steep-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f), 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-steep:has(.slider-steep__input:focus-visible) .slider-steep__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; }
  .slider-steep__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-steep__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-steep__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-steep * { animation: none !important; }
  }
`;

export function SteepSlider() {
  const [v, setV] = useState(50);
  const word = WORDS[Math.min(4, Math.floor(v / 20))];
  const mins = 1 + Math.round((v / 100) * 5);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-steep" style={{ '--slider-steep-v': v / 100 } as React.CSSProperties}>
        <span className="slider-steep__scene" aria-hidden="true">
          <svg viewBox="0 0 150 130">
            <path className="slider-steep__steam" d="M52 34c-4-6 4-10 0-16" />
            <path className="slider-steep__steam" d="M66 34c-4-6 4-10 0-16" style={{ animationDelay: '-1.1s' }} />
            <path className="slider-steep__handle" d="M112 62c14 0 14 26 0 26" />
            <path className="slider-steep__cup" d="M24 46h92l-8 58a12 12 0 0 1-12 10H44a12 12 0 0 1-12-10Z" />
            <ellipse className="slider-steep__rim" cx="70" cy="46" rx="46" ry="8" />
            <ellipse className="slider-steep__tea" cx="70" cy="47" rx="41" ry="5.5" />
            <ellipse className="slider-steep__saucer" cx="70" cy="118" rx="56" ry="6" />
            <g className="slider-steep__bag">
              <path className="slider-steep__string" d="M96 8C92 22 90 34 86 47" />
              <rect className="slider-steep__tag" x="91" y="2" width="12" height="9" rx="1.5" />
            </g>
          </svg>
          <span className="slider-steep__curl" style={{ left: 80, top: 44, '--dx': '-26px' } as React.CSSProperties} />
          <span className="slider-steep__curl" style={{ left: 84, top: 45, '--dx': '12px', animationDelay: '-0.7s' } as React.CSSProperties} />
          <span className="slider-steep__curl" style={{ left: 76, top: 46, '--dx': '-40px', animationDelay: '-1.4s' } as React.CSSProperties} />
        </span>
        <span className="slider-steep__read" aria-hidden="true">
          <b>{word}</b> · {mins} min
        </span>
        <div className="slider-steep__track">
          <span className="slider-steep__rail" />
          <span className="slider-steep__thumb" />
          <input
            className="slider-steep__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Tea strength"
            aria-valuetext={`${word}, ${mins} minutes`}
          />
        </div>
      </div>
    </>
  );
}
