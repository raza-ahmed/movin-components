"use client";

import { useState } from 'react';

const W = 240;
const T = 18;
const MAX = 1200;
const GAP = 100;
const H = 46;
const BINS = [3, 5, 9, 14, 22, 30, 38, 41, 37, 33, 28, 24, 20, 17, 15, 12, 10, 9, 7, 6, 5, 4, 3, 2];
const PEAK = Math.max(...BINS);
const BW = (W - T) / BINS.length;
const RAIL = H + 14;
const at = (n: number) => T / 2 + (n / MAX) * (W - T);

const css = `
  .slider-histogram { position: relative; width: ${W}px; height: 104px; -webkit-user-select: none; user-select: none; }
  .slider-histogram__bar {
    position: absolute;
    bottom: calc(100% - ${H}px);
    width: ${BW - 2}px;
    border-radius: 2px 2px 0 0;
    background: light-dark(#dbdde1, #2e3035);
    transform-origin: bottom;
    transform: scaleY(0.45);
    transition: transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1), background-color 0.25s;
  }
  .slider-histogram__bar--in { background: light-dark(#50535b, #c6c8cd); transform: scaleY(1); }
  .slider-histogram__rail { position: absolute; left: ${T / 2}px; right: ${T / 2}px; top: ${RAIL - 2}px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-histogram__band { position: absolute; top: ${RAIL - 2}px; height: 4px; border-radius: 2px; background: light-dark(#42454c, #e5e6e9); }
  .slider-histogram__thumb {
    position: absolute;
    top: ${RAIL - T / 2}px;
    width: ${T}px;
    height: ${T}px;
    margin-left: ${-T / 2}px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5));
  }
  .slider-histogram:has(.slider-histogram__input--lo:focus-visible) .slider-histogram__thumb--lo,
  .slider-histogram:has(.slider-histogram__input--hi:focus-visible) .slider-histogram__thumb--hi { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-histogram__value { position: absolute; left: 0; right: 0; top: ${RAIL + 22}px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; }
  .slider-histogram__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; }
  .slider-histogram__input { position: absolute; left: 0; top: ${RAIL - 14}px; width: 100%; height: 28px; margin: 0; opacity: 0; pointer-events: none; -webkit-appearance: none; appearance: none; background: none; }
  .slider-histogram__input::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: auto; width: ${T}px; height: 28px; cursor: grab; }
  .slider-histogram__input::-moz-range-thumb { pointer-events: auto; width: ${T}px; height: 28px; border: 0; cursor: grab; }
  @media (prefers-reduced-motion: reduce) {
    .slider-histogram__bar { transition: background-color 0.25s; }
  }
`;

export function HistogramSlider() {
  const [lo, setLo] = useState(300);
  const [hi, setHi] = useState(750);
  // A bin counts as in range when its middle price is.
  const inside = BINS.map((_, i) => {
    const mid = (i + 0.5) * (MAX / BINS.length);
    return mid >= lo && mid <= hi;
  });
  const count = BINS.reduce((n, c, i) => n + (inside[i] ? c : 0), 0);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-histogram">
        {BINS.map((c, i) => (
          <span
            key={i}
            className={`slider-histogram__bar${inside[i] ? ' slider-histogram__bar--in' : ''}`}
            style={{ left: T / 2 + i * BW + 1, height: (c / PEAK) * H }}
            aria-hidden="true"
          />
        ))}
        <span className="slider-histogram__rail" aria-hidden="true" />
        <span className="slider-histogram__band" style={{ left: at(lo), width: at(hi) - at(lo) }} aria-hidden="true" />
        <span className="slider-histogram__thumb slider-histogram__thumb--lo" style={{ left: at(lo) }} aria-hidden="true" />
        <span className="slider-histogram__thumb slider-histogram__thumb--hi" style={{ left: at(hi) }} aria-hidden="true" />
        <p className="slider-histogram__value" aria-hidden="true">
          <b>
            ${lo} – ${hi}
          </b>
          <span>{count} results</span>
        </p>
        <input
          className="slider-histogram__input slider-histogram__input--lo"
          type="range"
          min={0}
          max={MAX}
          step={50}
          value={lo}
          style={{ zIndex: lo > MAX / 2 ? 2 : 1 }}
          onChange={(e) => setLo(Math.min(+e.target.value, hi - GAP))}
          aria-label="Minimum price"
          aria-valuetext={`$${lo}`}
        />
        <input
          className="slider-histogram__input slider-histogram__input--hi"
          type="range"
          min={0}
          max={MAX}
          step={50}
          value={hi}
          style={{ zIndex: lo > MAX / 2 ? 1 : 2 }}
          onChange={(e) => setHi(Math.max(+e.target.value, lo + GAP))}
          aria-label="Maximum price"
          aria-valuetext={`$${hi}, ${count} results`}
        />
      </div>
    </>
  );
}
