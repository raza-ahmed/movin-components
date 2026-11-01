"use client";

import { useState } from 'react';

const W = 240;
const T = 18;
const PW = 46;
const LW = 30;
const Y = 44;
const at = (v: number) => T / 2 + (v / 100) * (W - T);

const css = `
  .slider-nudge { position: relative; width: ${W}px; height: 64px; }
  .slider-nudge__end, .slider-nudge__pill { position: absolute; top: 4px; height: 22px; font-size: 12px; line-height: 22px; }
  .slider-nudge__end {
    width: ${LW}px;
    color: light-dark(#5f626a, #a7abb2);
    transition: transform 0.35s cubic-bezier(0.3, 1.7, 0.5, 1), opacity 0.2s;
  }
  .slider-nudge__end--min { left: 0; text-align: left; transform-origin: 0 100%; }
  .slider-nudge__end--max { right: 0; text-align: right; transform-origin: 100% 100%; }
  .slider-nudge__pill {
    width: ${PW}px;
    margin-left: ${-PW / 2}px;
    border-radius: 11px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-weight: 600;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
  .slider-nudge__pill::after { content: ''; position: absolute; left: 50%; bottom: -4px; margin-left: -4px; border: 4px solid transparent; border-bottom: 0; border-top-color: light-dark(#373a40, #f1f2f3); }
  .slider-nudge__rail, .slider-nudge__fill { position: absolute; left: 0; top: ${Y - 2}px; height: 4px; border-radius: 2px; }
  .slider-nudge__rail { width: ${W}px; background: light-dark(#ebedf0, #232529); }
  .slider-nudge__fill { background: light-dark(#50535b, #c6c8cd); }
  .slider-nudge__thumb { position: absolute; top: ${Y - T / 2}px; width: ${T}px; height: ${T}px; margin-left: ${-T / 2}px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 5px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5)); }
  .slider-nudge:has(.slider-nudge__input:focus-visible) .slider-nudge__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-nudge__input { position: absolute; left: 0; top: ${Y - 18}px; width: 100%; height: 36px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-nudge__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 36px; }
  .slider-nudge__input::-moz-range-thumb { width: ${T}px; height: 36px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-nudge__end { transition: opacity 0.2s; }
  }
`;

// How far the value pill overlaps an end label, and the knock that gives it: down, out and tipped over.
const shove = (overlap: number, side: 1 | -1) => {
  const o = Math.min(28, Math.max(0, overlap));
  return { transform: `translate(${side * o * 0.25}px, ${o * 0.75}px) rotate(${side * o * 1.6}deg) scale(${1 - o * 0.008})`, opacity: 1 - o * 0.018 };
};

export function NudgeSlider() {
  const [v, setV] = useState(24);
  const x = at(v);
  const left = x - PW / 2;
  const right = x + PW / 2;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-nudge">
        <span className="slider-nudge__end slider-nudge__end--min" style={shove(LW + 4 - left, -1)} aria-hidden="true">
          Off
        </span>
        <span className="slider-nudge__end slider-nudge__end--max" style={shove(right - (W - LW - 4), 1)} aria-hidden="true">
          Max
        </span>
        <span className="slider-nudge__pill" style={{ left: x }} aria-hidden="true">
          {v}%
        </span>
        <span className="slider-nudge__rail" aria-hidden="true" />
        <span className="slider-nudge__fill" style={{ width: x }} aria-hidden="true" />
        <span className="slider-nudge__thumb" style={{ left: x }} aria-hidden="true" />
        <input className="slider-nudge__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Volume" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
