"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const css = `
  @property --field-wave-amp { syntax: '<length>'; inherits: true; initial-value: 0px; }
  @keyframes field-wave-ride { 0%, 100% { transform: translateY(calc(var(--field-wave-amp) * 0.6)); } 50% { transform: translateY(calc(var(--field-wave-amp) * -1)); } }
  @keyframes field-wave-in { from { opacity: 0; } }
  .field-wave { width: 250px; }
  .field-wave__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-wave__box {
    position: relative;
    height: 46px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: box-shadow 0.2s, --field-wave-amp 0.6s ease;
  }
  /* Focused, the letters ride a travelling wave; on blur the wave calms to a flat line. */
  .field-wave__box:focus-within { --field-wave-amp: 5px; box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-wave__input, .field-wave__mirror { padding: 0 12px; font-family: inherit; font-size: 16px; font-weight: 600; font-kerning: none; letter-spacing: 0.3px; }
  .field-wave__input { position: relative; z-index: 1; width: 100%; height: 100%; border: 0; outline: 0; background: none; color: transparent; caret-color: light-dark(#373a40, #f1f2f3); }
  .field-wave__mirror { position: absolute; inset: 0; display: flex; align-items: center; overflow: hidden; color: light-dark(#373a40, #f1f2f3); white-space: pre; pointer-events: none; }
  .field-wave__ch { display: inline-block; animation: field-wave-ride 1.1s ease-in-out infinite, field-wave-in 0.3s ease-out; animation-delay: calc(var(--i) * -0.09s), 0s; }
  @media (prefers-reduced-motion: reduce) { .field-wave__ch { animation: none; } }
`;

export function WaveInput() {
  const [value, setValue] = useState('making waves');
  const seq = useRef(0);
  const ids = useRef<number[]>([...'making waves'].map(() => seq.current++));

  const change = (next: string) => {
    let p = 0;
    while (p < value.length && p < next.length && value[p] === next[p]) p++;
    let s = 0;
    while (s < value.length - p && s < next.length - p && value[value.length - 1 - s] === next[next.length - 1 - s]) s++;
    ids.current = [...ids.current.slice(0, p), ...Array.from({ length: next.length - p - s }, () => seq.current++), ...ids.current.slice(ids.current.length - s)];
    setValue(next);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-wave">
        <label className="field-wave__label" htmlFor="field-wave-input">
          Caption
        </label>
        <div className="field-wave__box">
          <span className="field-wave__mirror" aria-hidden="true">
            {[...value].map((c, i) => (
              <span key={ids.current[i]} className="field-wave__ch" style={{ '--i': i } as React.CSSProperties}>
                {c}
              </span>
            ))}
          </span>
          <input
            id="field-wave-input"
            className="field-wave__input"
            value={value}
            maxLength={26}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => change(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
