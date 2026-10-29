"use client";

import * as React from "react";
const WORD = 'Explore';

const css = `
  /* Each letter tips onto the next, holds a moment, then stands back up. */
  @keyframes btn-topple-tip {
    0% { transform: none; }
    22% { transform: rotate(24deg); }
    30% { transform: rotate(19deg); }
    62% { transform: rotate(19deg); }
    80% { transform: rotate(-5deg); }
    100% { transform: none; }
  }
  .btn-topple {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 22px 0 24px;
    border: none;
    border-radius: 999px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 10px 22px -12px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
  }
  .btn-topple:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .btn-topple:active { transform: scale(0.97); }
  .btn-topple__word { display: inline-flex; }
  .btn-topple__ch { display: inline-block; transform-origin: 100% 100%; }
  .btn-topple:is(:hover, :focus-visible) .btn-topple__ch { animation: btn-topple-tip 1.1s cubic-bezier(0.5, 0, 0.3, 1) calc(var(--i) * 55ms) both; }
  .btn-topple__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; transition: transform 0.3s; }
  .btn-topple:is(:hover, :focus-visible) .btn-topple__dot { transform: translateX(3px); }
  @media (prefers-reduced-motion: reduce) {
    .btn-topple__ch { animation: none !important; }
  }
`;

export function ToppleButton() {
  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-topple" aria-label={WORD}>
        <span className="btn-topple__word" aria-hidden="true">
          {[...WORD].map((c, i) => (
            <span key={i} className="btn-topple__ch" style={{ '--i': i } as React.CSSProperties}>
              {c}
            </span>
          ))}
        </span>
        <span className="btn-topple__dot" aria-hidden="true" />
      </button>
    </>
  );
}
