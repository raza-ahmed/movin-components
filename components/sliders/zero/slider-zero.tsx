"use client";

import { useRef, useState } from 'react';

const W = 240;
const T = 18;
const Y = 26;
const R = 30;
const at = (v: number) => T / 2 + ((v + R) / (2 * R)) * (W - T);
const MID = at(0);

const css = `
  .slider-zero { position: relative; width: ${W}px; height: 78px; }
  .slider-zero__rail, .slider-zero__fill { position: absolute; top: ${Y - 2}px; height: 4px; border-radius: 2px; }
  .slider-zero__rail { left: 0; width: ${W}px; background: light-dark(#ebedf0, #232529); }
  .slider-zero__fill { background: light-dark(#42454c, #e5e6e9); }
  .slider-zero__tick { position: absolute; top: ${Y + 8}px; width: 1.5px; height: 5px; margin-left: -0.75px; background: light-dark(#cbced3, #393c41); }
  .slider-zero__mark { position: absolute; left: ${MID - 1}px; top: ${Y - 10}px; width: 2px; height: 20px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); transition: transform 0.3s cubic-bezier(0.3, 1.8, 0.5, 1), background-color 0.2s; }
  .slider-zero--at .slider-zero__mark { background: light-dark(#373a40, #f1f2f3); transform: scaleY(1.4); }
  .slider-zero__thumb {
    position: absolute;
    top: ${Y - T / 2}px;
    box-sizing: border-box;
    width: ${T}px;
    height: ${T}px;
    margin-left: ${-T / 2}px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 2px 5px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5));
    transition: border-width 0.2s, background-color 0.2s;
  }
  .slider-zero--at .slider-zero__thumb { border: 5px solid light-dark(#373a40, #f1f2f3); background: light-dark(#fbfcfd, #121417); }
  .slider-zero:has(.slider-zero__input:focus-visible) .slider-zero__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-zero__value { position: absolute; left: 0; right: 0; top: ${Y + 24}px; display: flex; justify-content: space-between; align-items: baseline; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-zero__value b { display: inline-flex; color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; perspective: 80px; }
  .slider-zero__sign { display: inline-block; width: 0.7em; text-align: center; animation: slider-zero-flip 0.32s cubic-bezier(0.3, 1.4, 0.5, 1); }
  @keyframes slider-zero-flip {
    from { transform: rotateX(90deg); opacity: 0; }
    to { transform: none; opacity: 1; }
  }
  .slider-zero__input { position: absolute; left: 0; top: ${Y - 18}px; width: 100%; height: 36px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-zero__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 36px; }
  .slider-zero__input::-moz-range-thumb { width: ${T}px; height: 36px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-zero__mark { transition: background-color 0.2s; }
    .slider-zero__sign { animation: none; }
  }
`;

export function ZeroSlider() {
  const [v, setV] = useState(12);
  const drag = useRef(false);
  const x = at(v);
  const sign = v > 0 ? '+' : v < 0 ? '−' : '';

  return (
    <>
      <style>
        {css}
      </style>
      <div className={`slider-zero${v === 0 ? ' slider-zero--at' : ''}`}>
        <span className="slider-zero__rail" aria-hidden="true" />
        {[-3, -2, -1, 1, 2, 3].map((ev) => (
          <span key={ev} className="slider-zero__tick" style={{ left: at(ev * 10) }} aria-hidden="true" />
        ))}
        {/* The fill grows from the centre towards the thumb, either way. */}
        <span className="slider-zero__fill" style={{ left: Math.min(x, MID), width: Math.abs(x - MID) }} aria-hidden="true" />
        <span className="slider-zero__mark" aria-hidden="true" />
        <span className="slider-zero__thumb" style={{ left: x }} aria-hidden="true" />
        <p className="slider-zero__value" aria-hidden="true">
          <span>Exposure</span>
          <b>
            <span key={sign} className="slider-zero__sign">
              {sign}
            </span>
            {(Math.abs(v) / 10).toFixed(1)} EV
          </b>
        </p>
        <input
          className="slider-zero__input"
          type="range"
          min={-R}
          max={R}
          value={v}
          onPointerDown={() => (drag.current = true)}
          onPointerUp={() => (drag.current = false)}
          onPointerCancel={() => (drag.current = false)}
          // A drag sticks at zero for a moment as it crosses; the keys still step straight through.
          onChange={(e) => {
            const raw = +e.target.value;
            setV(drag.current && Math.abs(raw) < 3 ? 0 : raw);
          }}
          aria-label="Exposure"
          aria-valuetext={`${sign === '−' ? 'minus ' : sign ? 'plus ' : ''}${(Math.abs(v) / 10).toFixed(1)} EV`}
        />
      </div>
    </>
  );
}
