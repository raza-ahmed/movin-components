"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const LABEL = 'Hold to delete';
const HOLD = 1300;
// Fixed scatter per letter: how far it drifts and how much it turns, so nothing is random.
const DRIFT = [...LABEL].map((_, i) => ({ x: ((i * 37) % 21) - 6, y: 18 + ((i * 53) % 17), r: ((i * 29) % 70) - 35 }));

const css = `
  .btn-dissolve {
    position: relative;
    display: inline-grid;
    place-items: center;
    min-width: 190px;
    height: 48px;
    padding: 0 22px;
    border: none;
    border-radius: 12px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 8px 20px -12px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    touch-action: none;
  }
  .btn-dissolve:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .btn-dissolve__fill {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent);
    transform: scaleX(0);
    transform-origin: 100% 50%;
    transition: transform 0.3s ease-out;
  }
  .btn-dissolve[data-holding] .btn-dissolve__fill { transform: scaleX(1); transition: transform ${HOLD}ms linear; }
  .btn-dissolve__label, .btn-dissolve__done { grid-area: 1 / 1; position: relative; white-space: pre; }
  .btn-dissolve__ch {
    display: inline-block;
    transition: transform 0.35s cubic-bezier(0.3, 1.3, 0.5, 1), opacity 0.3s, filter 0.3s;
  }
  /* Letters crumble from the right end first; on release they all come back together. */
  .btn-dissolve[data-holding] .btn-dissolve__ch,
  .btn-dissolve[data-done] .btn-dissolve__ch {
    transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(0.4);
    opacity: 0;
    filter: blur(2px);
    transition: transform 0.6s cubic-bezier(0.5, 0, 0.9, 0.6) var(--d), opacity 0.6s ease-in var(--d), filter 0.6s var(--d);
  }
  .btn-dissolve__done { color: light-dark(#50535b, #c6c8cd); opacity: 0; transform: translateY(6px); transition: opacity 0.3s, transform 0.3s; }
  .btn-dissolve[data-done] .btn-dissolve__done { opacity: 1; transform: none; transition-delay: 0.15s; }
  .btn-dissolve__done b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; text-decoration: underline; text-underline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .btn-dissolve__ch { transition: opacity 0.2s !important; transform: none !important; filter: none !important; }
  }
`;

export function DissolveButton() {
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const start = () => {
    if (done) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setHolding(false);
      setDone(true);
    }, HOLD);
  };
  const stop = () => {
    clearTimeout(timer.current);
    setHolding(false);
  };
  const n = LABEL.length;
  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-dissolve"
        data-holding={holding || undefined}
        data-done={done || undefined}
        aria-label={done ? 'Deleted. Press to undo' : 'Hold to delete'}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => (e.key === ' ' || e.key === 'Enter') && stop()}
        onClick={() => done && setDone(false)}
      >
        <span className="btn-dissolve__fill" aria-hidden="true" />
        <span className="btn-dissolve__label" aria-hidden="true">
          {[...LABEL].map((c, i) => (
            <span
              key={i}
              className="btn-dissolve__ch"
              style={{ '--x': `${DRIFT[i]!.x}px`, '--y': `${DRIFT[i]!.y}px`, '--r': `${DRIFT[i]!.r}deg`, '--d': `${((n - 1 - i) / n) * (HOLD - 500)}ms` } as React.CSSProperties}
            >
              {c}
            </span>
          ))}
        </span>
        <span className="btn-dissolve__done" aria-hidden="true">
          Deleted · <b>Undo</b>
        </span>
      </button>
    </>
  );
}
