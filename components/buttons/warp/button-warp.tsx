"use client";

import * as React from "react";
import { useMemo } from 'react';

const css = `
  @keyframes btn-warp-drift {
    from { transform: rotate(var(--a)) translateX(6px) scaleX(0.08); opacity: 0; }
    30% { opacity: 0.8; }
    to { transform: rotate(var(--a)) translateX(var(--reach)) scaleX(0.12); opacity: 0; }
  }
  @keyframes btn-warp-jump {
    from { transform: rotate(var(--a)) translateX(4px) scaleX(0.1); opacity: 0; }
    20% { opacity: 1; }
    to { transform: rotate(var(--a)) translateX(var(--reach)) scaleX(1); opacity: 0; }
  }
  .btn-warp {
    position: relative;
    display: grid;
    place-items: center;
    width: 210px;
    height: 58px;
    padding: 0;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 14px;
    background: radial-gradient(ellipse at center, light-dark(#f3f4f7, #1a1c1f), light-dark(#fbfcfd, #121417) 75%);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.3s ease, box-shadow 0.3s ease, letter-spacing 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .btn-warp:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-warp__star {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 46px;
    height: 1.5px;
    margin-top: -0.75px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, light-dark(#373a40, #f1f2f3));
    transform-origin: 0 50%;
    opacity: 0;
    animation: btn-warp-drift var(--slow) linear var(--delay) infinite;
  }
  .btn-warp__label { position: relative; text-shadow: 0 0 12px light-dark(#fbfcfd, #121417); }
  .btn-warp:hover, .btn-warp:focus-visible {
    border-color: light-dark(#5f626a, #a7abb2);
    letter-spacing: 0.32em;
    box-shadow: 0 0 30px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 16%, transparent);
  }
  .btn-warp:hover .btn-warp__star,
  .btn-warp:focus-visible .btn-warp__star { animation: btn-warp-jump var(--fast) cubic-bezier(0.55, 0, 1, 0.45) var(--delay) infinite; }
  @media (prefers-reduced-motion: reduce) {
    .btn-warp__star, .btn-warp:hover .btn-warp__star { animation: none; }
  }
`;

const COUNT = 46;

export function WarpButton() {
  // A fixed pseudo-random field (seeded), so server and client render the same stars.
  const stars = useMemo(() => {
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: COUNT }, () => {
      const slow = 3 + rand() * 3;
      const fast = 0.45 + rand() * 0.4;
      return {
        '--a': `${(rand() * 360).toFixed(1)}deg`,
        '--reach': `${(90 + rand() * 40).toFixed(0)}px`,
        '--slow': `${slow.toFixed(2)}s`,
        '--fast': `${fast.toFixed(2)}s`,
        '--delay': `${(-rand() * slow).toFixed(2)}s`,
      } as React.CSSProperties;
    });
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-warp">
        {stars.map((s, i) => (
          <span key={i} className="btn-warp__star" style={s} aria-hidden="true" />
        ))}
        <span className="btn-warp__label">Engage</span>
      </button>
    </>
  );
}
