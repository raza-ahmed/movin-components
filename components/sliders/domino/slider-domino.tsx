"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const N = 16;
const S = 14;
const DW = 5.5;
const DH = 22;
const BASE = 34;
const T = 14;
const dx = (i: number) => 12 + i * S;
const at = (k: number) => T / 2 + (k / N) * (W - T);

const css = `
  .slider-domino { position: relative; width: ${W}px; height: 76px; }
  .slider-domino__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 54px; overflow: visible; }
  .slider-domino__tile {
    fill: light-dark(#cbced3, #393c41);
    transform-box: fill-box;
    transform-origin: 100% 100%;
    transition: transform 0.3s cubic-bezier(0.55, 0, 0.9, 0.55), fill 0.3s;
  }
  .slider-domino__tile--down { fill: light-dark(#42454c, #e5e6e9); }
  .slider-domino__floor { stroke: light-dark(#ebedf0, #232529); stroke-width: 1.5; }
  .slider-domino__rail { stroke: light-dark(#ebedf0, #232529); stroke-width: 3; stroke-linecap: round; }
  .slider-domino__fill { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 3; stroke-linecap: round; }
  .slider-domino__thumb { fill: light-dark(#373a40, #f1f2f3); }
  .slider-domino__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-domino:has(.slider-domino__input:focus-visible) .slider-domino__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-domino__value { position: absolute; left: 0; right: 0; top: 58px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-domino__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-domino__input { position: absolute; left: 0; top: 0; width: 100%; height: 54px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-domino__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 54px; }
  .slider-domino__input::-moz-range-thumb { width: ${T}px; height: 54px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-domino__tile { transition: none; }
  }
`;

export function DominoSlider() {
  const [k, setK] = useState(9);
  const prev = useRef(9);
  useEffect(() => {
    prev.current = k;
  }, [k]);
  const was = prev.current;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-domino">
        <svg className="slider-domino__svg" aria-hidden="true">
          <line className="slider-domino__floor" x1={4} y1={BASE + 0.75} x2={W - 4} y2={BASE + 0.75} />
          {Array.from({ length: N }, (_, i) => {
            const down = i < k;
            // The last one down leans on the first one standing; the rest lie on each other.
            const tilt = !down ? 0 : i === k - 1 && k < N ? 23 : 64;
            // A jump of several topples them one after another, and stands them up the same way back.
            const delay = down && i >= was ? (i - was) * 45 : !down && i < was ? (was - 1 - i) * 45 : 0;
            return (
              <rect
                key={i}
                className={`slider-domino__tile${down ? ' slider-domino__tile--down' : ''}`}
                x={dx(i)}
                y={BASE - DH}
                width={DW}
                height={DH}
                rx={1.5}
                style={{ transform: `rotate(${tilt}deg)`, transitionDelay: `${delay}ms` }}
              />
            );
          })}
          <line className="slider-domino__rail" x1={T / 2} y1={BASE + 10} x2={W - T / 2} y2={BASE + 10} />
          <line className="slider-domino__fill" x1={T / 2} y1={BASE + 10} x2={at(k)} y2={BASE + 10} />
          <circle className="slider-domino__thumb" cx={at(k)} cy={BASE + 10} r={T / 2} />
          <circle className="slider-domino__ring" cx={at(k)} cy={BASE + 10} r={T / 2 + 4} />
        </svg>
        <p className="slider-domino__value" aria-hidden="true">
          <span>Tasks done</span>
          <b>
            {k} / {N}
          </b>
        </p>
        <input
          className="slider-domino__input"
          type="range"
          min={0}
          max={N}
          value={k}
          onChange={(e) => setK(+e.target.value)}
          aria-label="Tasks done"
          aria-valuetext={`${k} of ${N}`}
        />
      </div>
    </>
  );
}
