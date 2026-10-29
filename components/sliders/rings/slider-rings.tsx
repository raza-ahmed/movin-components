"use client";

import * as React from "react";
import { useState } from 'react';

const RINGS = Array.from({ length: 16 }, (_, k) => k);

const css = `
  .slider-rings { display: grid; justify-items: center; gap: 12px; width: 220px; }
  .slider-rings__stump { position: relative; display: grid; place-items: center; width: 116px; height: 116px; }
  /* The trunk widens with age; rings appear from the pith outwards, a little uneven like real wood. */
  .slider-rings__wood { position: relative; width: calc(44px + var(--slider-rings-v) * 70px); aspect-ratio: 1; border-radius: 48% 52% 50% 50% / 52% 48% 52% 48%; background: radial-gradient(circle, light-dark(#6d7179, #7d8087), light-dark(#cbced3, #393c41)); box-shadow: 0 0 0 4px light-dark(#ebedf0, #232529), 0 0 0 5px light-dark(#dbdde1, #2e3035), 0 10px 18px -8px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); transition: width 0.4s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .slider-rings__ring { position: absolute; left: 50%; top: 50%; width: calc(var(--f) * 100%); aspect-ratio: 1; border-radius: var(--shape); border: 1px solid color-mix(in oklab, light-dark(#ebedf0, #232529) 70%, transparent); transform: translate(-50%, -50%) scale(var(--on)); opacity: var(--on); transition: transform 0.4s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0.3s, width 0.4s; }
  .slider-rings__crack { position: absolute; left: 50%; top: 18%; width: 1px; height: 32%; background: color-mix(in oklab, light-dark(#f3f4f7, #1a1c1f) 60%, transparent); transform: rotate(14deg); opacity: var(--slider-rings-v); }
  @media (prefers-reduced-motion: reduce) {
    .slider-rings__wood, .slider-rings__ring { transition: none; }
  }
  .slider-rings__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-rings__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-rings__track { position: relative; width: 100%; height: 24px; }
  .slider-rings__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-rings__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-rings-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-rings__thumb { position: absolute; top: 2px; left: calc(var(--slider-rings-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-rings:has(.slider-rings__input:focus-visible) .slider-rings__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-rings__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-rings__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-rings__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function RingsSlider() {
  const [v, setV] = useState(48);
  const t = (v - 1) / (120 - 1);
  const shown = Math.max(1, Math.round(t * RINGS.length));
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-rings" style={{ '--slider-rings-v': t } as React.CSSProperties}>
        <div className="slider-rings__stump" aria-hidden="true">
          <span className="slider-rings__wood">
            {RINGS.map((k) => (
              <span
                key={k}
                className="slider-rings__ring"
                style={{
                  '--f': ((k + 1) / (shown + 0.6)).toFixed(3),
                  '--on': k < shown ? 1 : 0,
                  '--shape': `${48 + (k % 3)}% ${52 - (k % 3)}% ${50 + (k % 2)}% ${50 - (k % 2)}% / ${52 - (k % 2)}% 48% 52% ${48 + (k % 3)}%`,
                } as React.CSSProperties}
              />
            ))}
            <span className="slider-rings__crack" />
          </span>
        </div>
        <span className="slider-rings__read" aria-hidden="true">
          <b>{v}</b> {v === 1 ? 'year' : 'years'} old
        </span>
        <div className="slider-rings__track">
          <span className="slider-rings__rail" />
          <span className="slider-rings__fill" />
          <span className="slider-rings__thumb" />
          <input
            className="slider-rings__input"
            type="range"
            min={1}
            max={120}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Tree age"
            aria-valuetext={`${v} ${v === 1 ? 'year' : 'years'}`}
          />
        </div>
      </div>
    </>
  );
}
