"use client";

import * as React from "react";
import { useState } from 'react';

const W = 230;
const H = 90;
const N = 46;
const LENGTH_KM = 12;
// A fixed elevation profile in metres, sampled along the trail.
const ELEV = Array.from({ length: N }, (_, i) => {
  const x = i / (N - 1);
  return 620 + 300 * Math.sin(x * 2.4 - 0.9) + 140 * Math.sin(x * 6.1 + 1.2) + 50 * Math.sin(x * 13 + 2);
});
const yOf = (m: number) => H - 8 - ((m - 120) / 1000) * (H - 20);
const POINTS = ELEV.map((m, i) => `${((i / (N - 1)) * W).toFixed(1)} ${yOf(m).toFixed(1)}`);
const LINE = `M${POINTS.join('L')}`;
const AREA = `${LINE}L${W} ${H}L0 ${H}Z`;

const css = `
  .slider-trail { display: grid; gap: 8px; width: 230px; }
  .slider-trail__read { display: flex; justify-content: space-between; color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .slider-trail__read b { color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .slider-trail__map { position: relative; height: 90px; }
  .slider-trail__map svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .slider-trail__area { fill: light-dark(#f3f4f7, #1a1c1f); }
  .slider-trail__walked { fill: color-mix(in oklab, light-dark(#50535b, #c6c8cd) 30%, transparent); clip-path: inset(0 calc((1 - var(--slider-trail-v)) * 100%) 0 0); }
  .slider-trail__line { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 1.5; stroke-dasharray: 3 3; }
  .slider-trail__line--done { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; stroke-dasharray: none; clip-path: inset(0 calc((1 - var(--slider-trail-v)) * 100%) 0 0); }
  .slider-trail__drop { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1; stroke-dasharray: 2 3; }
  .slider-trail__hiker { fill: light-dark(#373a40, #f1f2f3); stroke: light-dark(#fbfcfd, #121417); stroke-width: 3; paint-order: stroke; }
  .slider-trail__flag { fill: light-dark(#50535b, #c6c8cd); }
  .slider-trail:has(.slider-trail__input:focus-visible) .slider-trail__hiker { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-trail__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; -webkit-appearance: none; appearance: none; background: none; }
  .slider-trail__input::-webkit-slider-thumb { -webkit-appearance: none; width: 2px; height: 90px; }
  .slider-trail__input::-moz-range-thumb { width: 2px; height: 90px; border: 0; }
`;

export function TrailSlider() {
  const [v, setV] = useState(40);
  const t = v / 100;
  const f = t * (N - 1);
  const i = Math.min(N - 2, Math.floor(f));
  const m = ELEV[i] + (ELEV[i + 1] - ELEV[i]) * (f - i);
  const x = (t * W).toFixed(1);
  const y = yOf(m).toFixed(1);
  const km = (t * LENGTH_KM).toFixed(1);
  const metres = Math.round(m).toLocaleString('en-US');
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-trail" style={{ '--slider-trail-v': t } as React.CSSProperties}>
        <span className="slider-trail__read" aria-hidden="true">
          <span>
            <b>{km}</b> km
          </span>
          <span>
            <b>{metres}</b> m
          </span>
        </span>
        <span className="slider-trail__map">
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <path className="slider-trail__area" d={AREA} />
            <path className="slider-trail__walked" d={AREA} />
            <path className="slider-trail__line" d={LINE} />
            <path className="slider-trail__line slider-trail__line--done" d={LINE} />
            <line className="slider-trail__drop" x1={x} y1={y} x2={x} y2={H} />
            <circle className="slider-trail__hiker" cx={x} cy={y} r="5" />
            <path className="slider-trail__flag" d={`M${W - 4} ${yOf(ELEV[N - 1]).toFixed(1)}v-14l-8 4 8 4`} />
          </svg>
          <input
            className="slider-trail__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Distance along the trail"
            aria-valuetext={`${km} kilometres, ${metres} metres high`}
          />
        </span>
      </div>
    </>
  );
}
