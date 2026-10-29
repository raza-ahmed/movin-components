"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  @keyframes loader-flask-level {
    0% { transform: translateY(58px); }
    45%, 60% { transform: translateY(8px); }
    100% { transform: translateY(58px); }
  }
  @keyframes loader-flask-wave { to { transform: translateX(-40px); } }
  @keyframes loader-flask-bubble {
    0% { transform: translateY(0) scale(0.6); opacity: 0; }
    20% { opacity: 1; }
    100% { transform: translateY(-34px) scale(1); opacity: 0; }
  }
  .loader-flask { display: block; width: 80px; height: 100px; overflow: visible; }
  .loader-flask__glass { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.6; stroke-linejoin: round; }
  .loader-flask__rim { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.6; stroke-linecap: round; }
  .loader-flask__level { animation: loader-flask-level 4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
  .loader-flask__wave { animation: loader-flask-wave 1.2s linear infinite; }
  .loader-flask__wave--back { animation-duration: 1.9s; animation-direction: reverse; }
  .loader-flask__liquid { fill: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 75%, transparent); }
  .loader-flask__liquid--back { fill: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent); }
  .loader-flask__bubble {
    fill: none;
    stroke: light-dark(#fbfcfd, #121417);
    stroke-width: 1;
    transform-box: fill-box;
    transform-origin: center;
    opacity: 0;
    animation: loader-flask-bubble 1.6s ease-in var(--d) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-flask__level { animation: none; transform: translateY(30px); }
    .loader-flask__wave, .loader-flask__bubble { animation: none; }
  }
`;

// Round-bottom flask: a neck from y 6 to 40, then a circle (centre 40,66) round the bottom.
const GLASS = 'M32 6V40A27.2 27.2 0 1 0 48 40V6';
const INSIDE = 'M33 6V40.6A26.2 26.2 0 1 0 47 40.6V6Z';
// Two wave periods of 40 wide, so sliding by one period loops seamlessly.
const wave = (amp: number) => `M-40 0Q-30 ${-amp} -20 0T0 0T20 0T40 0T60 0T80 0T100 0T120 0T140 0V100H-40Z`;

export function FlaskLoader() {
  const clip = `flask-${useId().replace(/:/g, '')}`;
  return (
    <>
      <style>
        {css}
      </style>
      <svg className="loader-flask" viewBox="0 0 80 100" role="status" aria-label="Loading">
        <clipPath id={clip}>
          <path d={INSIDE} />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <g className="loader-flask__level">
            <g transform="translate(0 38)">
              <g className="loader-flask__wave loader-flask__wave--back">
                <path className="loader-flask__liquid loader-flask__liquid--back" d={wave(3)} transform="translate(-10 -1)" />
              </g>
              <g className="loader-flask__wave">
                <path className="loader-flask__liquid" d={wave(2.5)} />
              </g>
              {[
                { x: 32, d: '0s' },
                { x: 44, d: '0.6s' },
                { x: 50, d: '1.1s' },
              ].map((b) => (
                <circle
                  key={b.x}
                  className="loader-flask__bubble"
                  cx={b.x}
                  cy={44}
                  r={2}
                  style={{ '--d': b.d } as React.CSSProperties}
                />
              ))}
            </g>
          </g>
        </g>
        <path className="loader-flask__glass" d={GLASS} />
        <path className="loader-flask__rim" d="M29 6H51" />
      </svg>
    </>
  );
}
