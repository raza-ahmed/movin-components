"use client";

import * as React from "react";
import { useId, useState } from 'react';

const OPTIONS = [{"value": "light", "label": "Light"}, {"value": "medium", "label": "Medium"}, {"value": "dark", "label": "Dark"}];
const BEANS = [{ x: 46, r: -24 }, { x: 100, r: 8 }, { x: 154, r: 30 }];
const CRACKS = [-40, -10, 20, 50];

const css = `
  .radio-roast { --i: 1; display: grid; justify-items: center; gap: 12px; width: 260px; }
  .radio-roast:has(.radio-roast__opt:nth-child(1) input:checked) { --i: 0; }
  .radio-roast:has(.radio-roast__opt:nth-child(2) input:checked) { --i: 1; }
  .radio-roast:has(.radio-roast__opt:nth-child(3) input:checked) { --i: 2; }
  @keyframes radio-roast-crack-a { 0% { opacity: 0; transform: rotate(var(--a)) translateY(-26px) scaleY(0.3); } 30% { opacity: 1; } 100% { opacity: 0; transform: rotate(var(--a)) translateY(-36px) scaleY(1); } }
  @keyframes radio-roast-crack-b { 0% { opacity: 0; transform: rotate(var(--a)) translateY(-26px) scaleY(0.3); } 30% { opacity: 1; } 100% { opacity: 0; transform: rotate(var(--a)) translateY(-36px) scaleY(1); } }
  .radio-roast__tray { position: relative; width: 200px; height: 96px; }
  .radio-roast__bean { position: absolute; top: 48px; width: 40px; height: 54px; margin: -27px -20px; transform: rotate(var(--r)) scale(var(--s)); transition: transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1); }
  .radio-roast__bean svg { width: 100%; height: 100%; overflow: visible; }
  .radio-roast__shell { fill: light-dark(#cbced3, #393c41); stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.2; }
  .radio-roast__crease { fill: none; stroke: light-dark(#f3f4f7, #1a1c1f); stroke-width: 2.2; stroke-linecap: round; }
  /* Oil comes to the surface the darker it goes: a sheen that grows from a glint to a gloss. */
  .radio-roast__oil { fill: light-dark(#373a40, #f1f2f3); opacity: var(--o); transition: opacity 0.5s; }
  .radio-roast__crack { position: absolute; left: 50%; top: 50%; width: 2px; height: 6px; margin: -3px -1px; border-radius: 1px; background: light-dark(#50535b, #c6c8cd); opacity: 0; }
  .radio-roast[data-flip='a'] .radio-roast__crack { animation: radio-roast-crack-a 0.5s ease-out var(--d) var(--n); }
  .radio-roast[data-flip='b'] .radio-roast__crack { animation: radio-roast-crack-b 0.5s ease-out var(--d) var(--n); }
  .radio-roast:has(.radio-roast__opt:nth-child(1) input:checked) { --s: 1.0; --o: 0.1; --n: 1; }
  .radio-roast:has(.radio-roast__opt:nth-child(2) input:checked) { --s: 1.06; --o: 0.4; --n: 2; }
  .radio-roast:has(.radio-roast__opt:nth-child(3) input:checked) { --s: 1.12; --o: 0.85; --n: 3; }
  .radio-roast__read { display: grid; color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .radio-roast__read > * { grid-area: 1 / 1; text-align: center; opacity: 0; transform: translateY(4px); transition: opacity 0.25s, transform 0.3s; }
  .radio-roast:has(.radio-roast__opt:nth-child(1) input:checked) .radio-roast__read > :nth-child(1) { opacity: 1; transform: none; }
  .radio-roast:has(.radio-roast__opt:nth-child(2) input:checked) .radio-roast__read > :nth-child(2) { opacity: 1; transform: none; }
  .radio-roast:has(.radio-roast__opt:nth-child(3) input:checked) .radio-roast__read > :nth-child(3) { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .radio-roast * { transition: none !important; animation: none !important; }
  }
  .radio-roast__opts { display: flex; gap: 3px; padding: 4px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-roast__opt { position: relative; flex: 1; padding: 7px 10px; border-radius: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; text-align: center; white-space: nowrap; cursor: pointer; transition: background-color 0.25s, color 0.25s; }
  .radio-roast__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-roast__opt:has(input:checked) { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .radio-roast__opt:has(input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .radio-roast__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
`;

export function RoastRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-roast" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}>
        <div className="radio-roast__tray" aria-hidden="true">
          {BEANS.map((b, i) => (
            <span key={b.x} className="radio-roast__bean" style={{ left: b.x, '--r': `${b.r}deg` } as React.CSSProperties}>
              <svg viewBox="0 0 40 54">
                <ellipse className="radio-roast__shell" cx="20" cy="27" rx="18" ry="25" />
                <path className="radio-roast__crease" d="M19 5C26 16 13 30 21 49" />
                <ellipse className="radio-roast__oil" cx="12" cy="16" rx="3" ry="7" transform="rotate(-18 12 16)" />
              </svg>
              {CRACKS.map((a, k) => (
                <span key={a} className="radio-roast__crack" style={{ '--a': `${a}deg`, '--d': `${i * 0.12 + k * 0.05}s` } as React.CSSProperties} />
              ))}
            </span>
          ))}
        </div>
        <span className="radio-roast__read" aria-hidden="true">
          <span>196 °C · first crack</span>
          <span>210 °C · rolling</span>
          <span>224 °C · second crack</span>
        </span>
        <div className="radio-roast__opts" role="radiogroup" aria-label="Roast" onChange={() => setFlip((f) => f + 1)}>
          {OPTIONS.map((o, i) => (
            <label key={o.value} className="radio-roast__opt">
              <input className="radio-roast__input" type="radio" name={name} value={o.value} defaultChecked={i === 1} />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
