"use client";

import { useId, useState } from 'react';

const BULB = 'M12 8H88C88 42 56 50 52 66C56 82 88 90 88 124H12C12 90 44 82 48 66C44 50 12 42 12 8Z';

const css = `
  @keyframes slider-hourglass-fall { to { stroke-dashoffset: -8; } }
  .slider-hourglass { display: flex; align-items: center; gap: 22px; }
  .slider-hourglass__body { position: relative; width: 96px; height: 150px; }
  .slider-hourglass__body svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .slider-hourglass__cap { fill: light-dark(#6d7179, #7d8087); }
  .slider-hourglass__post { fill: light-dark(#cbced3, #393c41); }
  .slider-hourglass__glass { fill: color-mix(in oklab, light-dark(#50535b, #c6c8cd) 8%, transparent); stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2; }
  .slider-hourglass__sand { fill: light-dark(#42454c, #e5e6e9); }
  .slider-hourglass__stream { stroke: light-dark(#42454c, #e5e6e9); stroke-width: 1.6; stroke-dasharray: 3 1; animation: slider-hourglass-fall 0.25s linear infinite; }
  .slider-hourglass:has(.slider-hourglass__input:focus-visible) .slider-hourglass__glass { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 3; }
  .slider-hourglass__input {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 150px;
    height: 96px;
    margin: 0;
    transform: translate(-50%, -50%) rotate(-90deg);
    opacity: 0;
    cursor: ns-resize;
    -webkit-appearance: none;
    appearance: none;
    background: none;
  }
  .slider-hourglass__input::-webkit-slider-thumb { -webkit-appearance: none; width: 10px; height: 96px; }
  .slider-hourglass__input::-moz-range-thumb { width: 10px; height: 96px; border: 0; }
  .slider-hourglass__read { display: grid; gap: 2px; }
  .slider-hourglass__min { color: light-dark(#373a40, #f1f2f3); font-size: 36px; font-weight: 300; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1; }
  .slider-hourglass__unit { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; }
  @media (prefers-reduced-motion: reduce) {
    .slider-hourglass__stream { animation: none; }
  }
`;

export function HourglassSlider() {
  const [min, setMin] = useState(25);
  const clip = `slider-hourglass-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const t = min / 60;
  // Sand left in the top bulb sits on its narrow neck; what has run out piles up at the bottom.
  const top = (64 - t * 48).toFixed(1);
  const pile = ((1 - t) * 44).toFixed(1);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-hourglass">
        <span className="slider-hourglass__body">
          <svg viewBox="0 0 100 132" aria-hidden="true">
            <defs>
              <clipPath id={clip}>
                <path d={BULB} />
              </clipPath>
            </defs>
            <rect className="slider-hourglass__post" x="8" y="6" width="4" height="120" rx="2" />
            <rect className="slider-hourglass__post" x="88" y="6" width="4" height="120" rx="2" />
            <g clipPath={`url(#${clip})`}>
              <rect className="slider-hourglass__sand" x="0" y={top} width="100" height={(66 - +top).toFixed(1)} />
              <path className="slider-hourglass__sand" d={`M10 125Q50 ${(125 - +pile * 2).toFixed(1)} 90 125Z`} />
              {min > 0 && <line className="slider-hourglass__stream" x1="50" y1="64" x2="50" y2="126" />}
            </g>
            <path className="slider-hourglass__glass" d={BULB} />
            <rect className="slider-hourglass__cap" x="2" y="0" width="96" height="8" rx="3" />
            <rect className="slider-hourglass__cap" x="2" y="124" width="96" height="8" rx="3" />
          </svg>
          <input
            className="slider-hourglass__input"
            type="range"
            min={0}
            max={60}
            value={min}
            onChange={(e) => setMin(+e.target.value)}
            aria-label="Timer"
            aria-valuetext={`${min} minutes`}
          />
        </span>
        <span className="slider-hourglass__read" aria-hidden="true">
          <span className="slider-hourglass__min">{min}</span>
          <span className="slider-hourglass__unit">MINUTES</span>
        </span>
      </div>
    </>
  );
}
