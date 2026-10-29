"use client";

import * as React from "react";
const css = `
  /* Each slice sits at angle --a round the loop and is twisted by half that angle:
     a half twist over the whole loop is what makes it a Mobius band. Turning every
     twist on by 180deg (the band looks the same each half turn) rolls it round. */
  @keyframes loader-mobius-roll {
    from { transform: rotateZ(var(--a)) translateX(38px) rotateX(calc(var(--a) / 2)); }
    to { transform: rotateZ(var(--a)) translateX(38px) rotateX(calc(var(--a) / 2 + 180deg)); }
  }
  @keyframes loader-mobius-spin {
    from { transform: rotateX(62deg) rotateZ(0deg); }
    to { transform: rotateX(62deg) rotateZ(-360deg); }
  }
  .loader-mobius {
    display: grid;
    place-items: center;
    width: 120px;
    height: 110px;
    perspective: 420px;
  }
  .loader-mobius__loop {
    position: relative;
    width: 0;
    height: 0;
    transform-style: preserve-3d;
    animation: loader-mobius-spin 9s linear infinite;
  }
  .loader-mobius__slice {
    position: absolute;
    left: -1.5px;
    top: -12px;
    width: 3px;
    height: 24px;
    border-radius: 2px;
    background: linear-gradient(light-dark(#373a40, #f1f2f3), light-dark(#6d7179, #7d8087));
    animation: loader-mobius-roll 2.2s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-mobius__loop { animation-duration: 40s; }
    .loader-mobius__slice { animation: none; transform: rotateZ(var(--a)) translateX(38px) rotateX(calc(var(--a) / 2)); }
  }
`;

const SLICES = 44;

export function MobiusLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-mobius" role="status" aria-label="Loading">
        <div className="loader-mobius__loop" aria-hidden="true">
          {Array.from({ length: SLICES }, (_, i) => (
            <span
              key={i}
              className="loader-mobius__slice"
              style={{ '--a': `${((i * 360) / SLICES).toFixed(2)}deg` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </>
  );
}
