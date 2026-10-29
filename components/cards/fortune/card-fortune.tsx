"use client";

import * as React from "react";
import { useState } from 'react';

const FORTUNES = [
  { text: 'Small steps, taken often, go far.', nums: '4 · 17 · 23' },
  { text: 'The idea you dropped is worth a second look.', nums: '8 · 12 · 31' },
  { text: 'Ship it on Tuesday. Polish it on Wednesday.', nums: '2 · 19 · 40' },
];
const CRUMBS = [
  { x: -14, d: 0 },
  { x: -4, d: 0.05 },
  { x: 8, d: 0.02 },
  { x: 16, d: 0.08 },
];

const css = `
  @keyframes card-fortune-crumb { from { transform: translate(0, 0); opacity: 1; } to { transform: translate(var(--x), 46px); opacity: 0; } }
  .card-fortune {
    position: relative;
    display: grid;
    justify-items: center;
    width: 240px;
    height: 180px;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    cursor: pointer;
  }
  .card-fortune:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 14px; }
  .card-fortune__cookie { position: relative; width: 150px; height: 92px; margin-top: 18px; }
  .card-fortune__half { position: absolute; top: 0; width: 76px; height: 92px; overflow: visible; transition: transform 0.55s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .card-fortune__half path { fill: light-dark(#cbced3, #393c41); stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.2; }
  .card-fortune__half .card-fortune__fold { stroke-width: 1.4; stroke-linecap: round; }
  .card-fortune__half .card-fortune__fold { fill: none; stroke: light-dark(#6d7179, #7d8087); }
  .card-fortune__half--l { left: 0; transform-origin: 100% 80%; }
  .card-fortune__half--r { right: 0; transform-origin: 0 80%; }
  .card-fortune[aria-pressed='true'] .card-fortune__half--l { transform: translate(-30px, -6px) rotate(-28deg); }
  .card-fortune[aria-pressed='true'] .card-fortune__half--r { transform: translate(30px, -6px) rotate(28deg); }
  /* The slip pulls out sideways from the crack, a little after it opens. */
  .card-fortune__slip {
    position: absolute;
    left: 50%;
    top: 48px;
    width: 216px;
    padding: 7px 10px;
    border-radius: 2px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 8px 16px -10px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    color: light-dark(#373a40, #f1f2f3);
    font-size: 11.5px;
    line-height: 1.35;
    text-align: center;
    transform: translateX(-50%) scaleX(0.05);
    opacity: 0;
    transition: transform 0.5s cubic-bezier(0.3, 1.2, 0.5, 1), opacity 0.2s;
  }
  .card-fortune__slip small { display: block; margin-top: 3px; color: light-dark(#5f626a, #a7abb2); font-size: 9.5px; letter-spacing: 0.08em; }
  .card-fortune[aria-pressed='true'] .card-fortune__slip { transform: translateX(-50%) translateY(74px); opacity: 1; transition-delay: 0.22s; }
  .card-fortune__crumb { position: absolute; left: 50%; top: 70px; width: 3px; height: 3px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); opacity: 0; }
  .card-fortune[aria-pressed='true'] .card-fortune__crumb { animation: card-fortune-crumb 0.7s ease-in var(--d) both; }
  .card-fortune__hint { position: absolute; bottom: 4px; color: light-dark(#5f626a, #a7abb2); font-size: 11.5px; transition: opacity 0.2s; }
  .card-fortune[aria-pressed='true'] .card-fortune__hint { opacity: 0; }
  @media (prefers-reduced-motion: reduce) {
    .card-fortune * { transition-duration: 0.01s !important; animation: none !important; }
  }
`;

export function FortuneCard() {
  const [n, setN] = useState(0);
  const [open, setOpen] = useState(false);
  const f = FORTUNES[n % FORTUNES.length]!;
  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="card-fortune"
        aria-pressed={open}
        aria-label={open ? `${f.text} Lucky ${f.nums}. Press for another fortune.` : 'Tap to crack the fortune cookie'}
        onClick={() => {
          if (open) setN((k) => k + 1);
          setOpen((o) => !o);
        }}
      >
        <span className="card-fortune__cookie" aria-hidden="true">
          <svg className="card-fortune__half card-fortune__half--l" viewBox="0 0 76 92">
            <path d="M75 34C62 12 30 8 14 20C0 32 2 58 16 70C32 84 58 86 75 80Z" />
            <path className="card-fortune__fold" d="M70 44C54 40 34 46 28 62" />
          </svg>
          <svg className="card-fortune__half card-fortune__half--r" viewBox="0 0 76 92">
            <path d="M1 34C14 12 46 8 62 20C76 32 74 58 60 70C44 84 18 86 1 80Z" />
            <path className="card-fortune__fold" d="M6 44C22 40 42 46 48 62" />
          </svg>
          {CRUMBS.map((c, i) => (
            <span key={i} className="card-fortune__crumb" style={{ '--x': `${c.x}px`, '--d': `${0.12 + c.d}s` } as React.CSSProperties} />
          ))}
        </span>
        <span className="card-fortune__slip" aria-hidden="true">
          {f.text}
          <small>LUCKY {f.nums}</small>
        </span>
        <span className="card-fortune__hint" aria-hidden="true">
          Tap to crack
        </span>
      </button>
    </>
  );
}
