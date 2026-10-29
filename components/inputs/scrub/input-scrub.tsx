"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const MIN = 0;
const MAX = 480;

const css = `
  .field-scrub { width: 250px; }
  .field-scrub__box { position: relative; display: flex; align-items: center; height: 44px; border-radius: 10px; overflow: hidden; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: box-shadow 0.2s; }
  .field-scrub__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 0 0 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent); }
  .field-scrub__handle {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    height: 100%;
    padding: 0 12px;
    color: light-dark(#50535b, #c6c8cd);
    font-size: 13px;
    cursor: ew-resize;
    touch-action: none;
    user-select: none;
  }
  .field-scrub__handle svg { width: 14px; height: 14px; color: light-dark(#5f626a, #a7abb2); transition: transform 0.2s; }
  .field-scrub[data-drag] .field-scrub__handle { color: light-dark(#373a40, #f1f2f3); }
  .field-scrub[data-drag] .field-scrub__handle svg { transform: scaleX(1.25); color: light-dark(#373a40, #f1f2f3); }
  .field-scrub__input { position: relative; z-index: 1; flex: 1; min-width: 0; height: 100%; padding: 0 4px; border: 0; outline: 0; background: none; color: light-dark(#373a40, #f1f2f3); font: 500 15px/1 ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; text-align: right; }
  .field-scrub__unit { position: relative; z-index: 1; padding-right: 12px; color: light-dark(#5f626a, #a7abb2); font-size: 13px; }
  /* The ruler: ticks that slide with the value, shown only while you drag. */
  .field-scrub__ruler {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 12px;
    background: repeating-linear-gradient(90deg, light-dark(#6d7179, #7d8087) 0 1px, transparent 1px 8px) calc(var(--v) * -2px) 100% / 8px 6px repeat-x, repeating-linear-gradient(90deg, light-dark(#50535b, #c6c8cd) 0 1px, transparent 1px 40px) calc(var(--v) * -2px) 100% / 40px 11px repeat-x;
    -webkit-mask: linear-gradient(90deg, transparent, #000 25%, #000 75%, transparent);
    mask: linear-gradient(90deg, transparent, #000 25%, #000 75%, transparent);
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.25s, transform 0.25s;
  }
  .field-scrub__ruler::after { content: ''; position: absolute; left: 50%; bottom: 0; width: 1.5px; height: 12px; background: light-dark(#373a40, #f1f2f3); }
  .field-scrub[data-drag] .field-scrub__ruler { opacity: 1; transform: none; }
  .field-scrub__hint { display: block; margin-top: 6px; color: light-dark(#5f626a, #a7abb2); font-size: 11.5px; }
  @media (prefers-reduced-motion: reduce) {
    .field-scrub__ruler { transition: none; }
  }
`;

const clamp = (n: number) => Math.max(MIN, Math.min(MAX, Math.round(n)));

export function ScrubInput() {
  const id = useId();
  const [value, setValue] = useState(240);
  const [text, setText] = useState('240');
  const [drag, setDrag] = useState(false);
  const start = useRef({ x: 0, v: 0 });
  const set = (n: number) => {
    const c = clamp(n);
    setValue(c);
    setText(String(c));
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-scrub" data-drag={drag || undefined}>
        <div className="field-scrub__box" style={{ '--v': value } as React.CSSProperties}>
          <span className="field-scrub__ruler" aria-hidden="true" />
          {/* Drag the label to scrub: one pixel is one unit, Shift for ten. The field stays a plain number to type into. */}
          <label
            htmlFor={id}
            className="field-scrub__handle"
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              start.current = { x: e.clientX, v: value };
              setDrag(true);
            }}
            onPointerMove={(e) => drag && set(start.current.v + (e.clientX - start.current.x) * (e.shiftKey ? 10 : 1))}
            onPointerUp={() => setDrag(false)}
            onPointerCancel={() => setDrag(false)}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M5 4 1 8l4 4M11 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Width
          </label>
          <input
            id={id}
            className="field-scrub__input"
            inputMode="numeric"
            maxLength={3}
            value={text}
            aria-describedby={`${id}-hint`}
            onChange={(e) => {
              setText(e.target.value.replace(/[^\d]/g, ''));
              if (e.target.value !== '') setValue(clamp(+e.target.value.replace(/[^\d]/g, '')));
            }}
            onBlur={() => set(value)}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 10 : 1;
              if (e.key === 'ArrowUp') (e.preventDefault(), set(value + step));
              if (e.key === 'ArrowDown') (e.preventDefault(), set(value - step));
            }}
          />
          <span className="field-scrub__unit" aria-hidden="true">
            px
          </span>
        </div>
        <span id={`${id}-hint`} className="field-scrub__hint">
          Drag the label, or use the arrow keys
        </span>
      </div>
    </>
  );
}
