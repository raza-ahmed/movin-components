"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes btn-echo-stack-slam {
    0% { transform: translate(var(--ex), var(--ey)); }
    55% { transform: translate(0, 0) scale(0.96); }
    100% { transform: none; }
  }
  @keyframes btn-echo-stack-punch {
    0% { transform: scale(1); }
    40% { transform: scale(0.94); }
    100% { transform: scale(1); }
  }
  .btn-echo-stack {
    position: relative;
    width: 170px;
    height: 50px;
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    cursor: pointer;
  }
  .btn-echo-stack:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 6px; border-radius: 12px; }
  .btn-echo-stack__layer {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border-radius: 12px;
    border: 1px solid light-dark(#6d7179, #7d8087);
    color: light-dark(#6d7179, #7d8087);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: var(--o);
    transform: none;
    transition: transform 0.55s cubic-bezier(0.34, 1.45, 0.64, 1) var(--lag), opacity 0.3s ease;
  }
  .btn-echo-stack__layer--top {
    border-color: light-dark(#5f626a, #a7abb2);
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
  }
  .btn-echo-stack:hover .btn-echo-stack__layer,
  .btn-echo-stack:focus-visible .btn-echo-stack__layer { transform: translate(var(--ex), var(--ey)); }
  .btn-echo-stack[data-slam] .btn-echo-stack__layer { animation: btn-echo-stack-slam 0.32s cubic-bezier(0.7, 0, 0.84, 0) both; }
  .btn-echo-stack[data-slam] .btn-echo-stack__layer--top { animation: btn-echo-stack-punch 0.32s ease both; }
  @media (prefers-reduced-motion: reduce) {
    .btn-echo-stack__layer { transition: opacity 0.2s ease; }
    .btn-echo-stack:hover .btn-echo-stack__layer { transform: none; }
    .btn-echo-stack[data-slam] .btn-echo-stack__layer { animation: none; }
  }
`;

// Back to front: each echo steps further up-left and fades, like depth slices of one object.
const ECHOES = [
  { ex: '-30px', ey: '-24px', o: 0.18, lag: '0.12s' },
  { ex: '-22px', ey: '-18px', o: 0.3, lag: '0.09s' },
  { ex: '-14px', ey: '-12px', o: 0.45, lag: '0.06s' },
  { ex: '-7px', ey: '-6px', o: 0.65, lag: '0.03s' },
];

export function EchoStackButton() {
  const [slam, setSlam] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-echo-stack"
        data-slam={slam || undefined}
        onClick={() => {
          setSlam(false);
          requestAnimationFrame(() => setSlam(true));
        }}
        onAnimationEnd={(e) => e.target === e.currentTarget.lastElementChild && setSlam(false)}
      >
        {ECHOES.map((e, i) => (
          <span
            key={i}
            className="btn-echo-stack__layer"
            aria-hidden="true"
            style={{ '--ex': e.ex, '--ey': e.ey, '--o': e.o, '--lag': e.lag } as React.CSSProperties}
          >
            Stack
          </span>
        ))}
        <span
          className="btn-echo-stack__layer btn-echo-stack__layer--top"
          style={{ '--ex': '0px', '--ey': '0px', '--o': 1, '--lag': '0s' } as React.CSSProperties}
        >
          Stack
        </span>
      </button>
    </>
  );
}
