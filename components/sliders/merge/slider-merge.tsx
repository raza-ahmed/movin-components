"use client";

import * as React from "react";
import { useState } from 'react';

const W = 240;
const MAX = 1000;
const MIN_GAP = 30;
const MID = 54;
const THUMB = 22;

const css = `
  .slider-merge { position: relative; width: ${W}px; height: 72px; }
  .slider-merge__rail { position: absolute; left: 0; right: 0; top: ${MID - 2}px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-merge__band { position: absolute; top: ${MID - 2}px; height: 4px; border-radius: 2px; background: light-dark(#42454c, #e5e6e9); }
  .slider-merge__thumb {
    position: absolute;
    top: ${MID - THUMB / 2}px;
    width: ${THUMB}px;
    height: ${THUMB}px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5));
    transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-merge__pill {
    position: absolute;
    top: 8px;
    height: 24px;
    padding: 0 9px;
    border-radius: 12px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#42454c, #e5e6e9);
    font-size: 12px;
    font-weight: 500;
    line-height: 24px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    transition: transform 0.4s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0.22s ease-out, background-color 0.2s, color 0.2s;
  }
  .slider-merge:has(.slider-merge__input--lo:active) .slider-merge__thumb--lo,
  .slider-merge:has(.slider-merge__input--hi:active) .slider-merge__thumb--hi { transform: scale(1.15); }
  .slider-merge:has(.slider-merge__input--lo:active) .slider-merge__pill--lo,
  .slider-merge:has(.slider-merge__input--hi:active) .slider-merge__pill--hi,
  .slider-merge:has(.slider-merge__input:active) .slider-merge__pill--both { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .slider-merge:has(.slider-merge__input--lo:focus-visible) .slider-merge__thumb--lo,
  .slider-merge:has(.slider-merge__input--hi:focus-visible) .slider-merge__thumb--hi { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-merge__input { position: absolute; left: 0; top: ${MID - 22}px; width: 100%; height: 44px; margin: 0; opacity: 0; pointer-events: none; -webkit-appearance: none; appearance: none; background: none; }
  .slider-merge__input::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: auto; width: ${THUMB}px; height: 44px; cursor: grab; }
  .slider-merge__input::-moz-range-thumb { pointer-events: auto; width: ${THUMB}px; height: 44px; border: 0; cursor: grab; }
  @media (prefers-reduced-motion: reduce) {
    .slider-merge__thumb, .slider-merge__pill { transition: opacity 0.22s; }
  }
`;

const money = (n: number) => `$${n.toLocaleString('en-US')}`;
// Close enough to the pill's rendered width to decide when two would touch.
const pillWidth = (text: string) => text.length * 7 + 18;

export function MergeSlider() {
  const [lo, setLo] = useState(240);
  const [hi, setHi] = useState(620);
  const at = (n: number) => THUMB / 2 + (n / MAX) * (W - THUMB);
  const [xl, xh] = [at(lo), at(hi)];
  const mid = (xl + xh) / 2;
  const merged = xh - xl < (pillWidth(money(lo)) + pillWidth(money(hi))) / 2 + 6;

  // Merging, each pill slides to the midpoint and fades as the joint one grows there.
  const pill = (x: number, shown: boolean): React.CSSProperties => ({
    left: x,
    opacity: shown ? 1 : 0,
    transform: `translateX(-50%) translateX(${shown ? 0 : mid - x}px) scale(${shown ? 1 : 0.7})`,
  });

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-merge">
        <span className="slider-merge__rail" aria-hidden="true" />
        <span className="slider-merge__band" style={{ left: xl, width: xh - xl }} aria-hidden="true" />
        <span className="slider-merge__pill slider-merge__pill--lo" style={pill(xl, !merged)} aria-hidden="true">
          {money(lo)}
        </span>
        <span className="slider-merge__pill slider-merge__pill--hi" style={pill(xh, !merged)} aria-hidden="true">
          {money(hi)}
        </span>
        {/* The pair merges into one label once the two would touch. */}
        <span
          className="slider-merge__pill slider-merge__pill--both"
          style={{ left: mid, opacity: merged ? 1 : 0, transform: `translateX(-50%) scale(${merged ? 1 : 0.7}, ${merged ? 1 : 0.9})` }}
          aria-hidden="true"
        >
          {money(lo)} – {money(hi)}
        </span>
        <span className="slider-merge__thumb slider-merge__thumb--lo" style={{ left: xl - THUMB / 2 }} aria-hidden="true" />
        <span className="slider-merge__thumb slider-merge__thumb--hi" style={{ left: xh - THUMB / 2 }} aria-hidden="true" />
        <input
          className="slider-merge__input slider-merge__input--lo"
          type="range"
          min={0}
          max={MAX}
          step={10}
          value={lo}
          // Near the top end the low thumb sits on top, so the pair can always be pulled apart.
          style={{ zIndex: lo > MAX / 2 ? 2 : 1 }}
          onChange={(e) => setLo(Math.min(+e.target.value, hi - MIN_GAP))}
          aria-label="Minimum price"
          aria-valuetext={money(lo)}
        />
        <input
          className="slider-merge__input slider-merge__input--hi"
          type="range"
          min={0}
          max={MAX}
          step={10}
          value={hi}
          style={{ zIndex: lo > MAX / 2 ? 1 : 2 }}
          onChange={(e) => setHi(Math.max(+e.target.value, lo + MIN_GAP))}
          aria-label="Maximum price"
          aria-valuetext={money(hi)}
        />
      </div>
    </>
  );
}
