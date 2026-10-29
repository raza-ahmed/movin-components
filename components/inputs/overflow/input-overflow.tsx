"use client";

import * as React from "react";
import { useId, useState } from 'react';

const LIMIT = 24;

const css = `
  .field-overflow { width: 260px; }
  .field-overflow__top { display: flex; justify-content: space-between; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-overflow__count { color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; transition: color 0.2s; }
  .field-overflow[data-over] .field-overflow__count { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .field-overflow__box { position: relative; height: 44px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: box-shadow 0.2s; }
  .field-overflow__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 0 0 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent); }
  .field-overflow__input, .field-overflow__mirror { padding: 0 12px; font: 400 13px/44px ui-monospace, SFMono-Regular, Menlo, monospace; }
  .field-overflow__input { width: 100%; height: 100%; border: 0; outline: 0; background: none; color: transparent; caret-color: light-dark(#373a40, #f1f2f3); }
  .field-overflow__input::placeholder { color: light-dark(#6d7179, #7d8087); }
  .field-overflow__mirror { position: absolute; inset: 0; overflow: visible; color: light-dark(#373a40, #f1f2f3); white-space: pre; pointer-events: none; }
  /* Past the limit each letter sags a little more than the last, as if it is spilling off the end. */
  .field-overflow__spill { display: inline-block; color: light-dark(#5f626a, #a7abb2); text-decoration: line-through; text-decoration-color: color-mix(in oklab, light-dark(#5f626a, #a7abb2) 70%, transparent); transform: translateY(calc(var(--k) * var(--k) * 0.5px)) rotate(calc(var(--k) * 4deg)); transform-origin: 0 50%; transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .field-overflow__edge { font: 400 13px ui-monospace, SFMono-Regular, Menlo, monospace; position: absolute; top: 8px; bottom: 8px; width: 1px; background: light-dark(#cbced3, #393c41); opacity: 0; transition: opacity 0.2s; }
  .field-overflow[data-over] .field-overflow__edge { opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    .field-overflow__spill { transition: none; }
  }
`;

export function OverflowInput() {
  const id = useId();
  const [v, setV] = useState('');
  const left = LIMIT - v.length;
  const over = left < 0;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-overflow" data-over={over || undefined}>
        <div className="field-overflow__top">
          <label htmlFor={id}>Bio</label>
          <span id={`${id}-n`} className="field-overflow__count" aria-live="polite">
            {over ? `${-left} too many` : left}
          </span>
        </div>
        <div className="field-overflow__box">
          <input
            id={id}
            className="field-overflow__input"
            value={v}
            maxLength={30}
            placeholder="Designer, maker of tea"
            aria-describedby={`${id}-n`}
            aria-invalid={over}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setV(e.target.value)}
          />
          <span className="field-overflow__mirror" aria-hidden="true">
            {v.slice(0, LIMIT)}
            {[...v.slice(LIMIT)].map((c, k) => (
              <span key={k} className="field-overflow__spill" style={{ '--k': k + 1 } as React.CSSProperties}>
                {c}
              </span>
            ))}
          </span>
          {/* The limit, drawn where the 24th character ends: monospace, so it is a fixed distance. */}
          <span className="field-overflow__edge" aria-hidden="true" style={{ left: `calc(12px + ${LIMIT}ch)` }} />
        </div>
      </div>
    </>
  );
}
