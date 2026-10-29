"use client";

import { useState } from 'react';

const W = 220;
const MID = 34;
const OPEN = 20; // How far each edge has parted at the far end when fully unzipped.

const css = `
  .slider-zipper { position: relative; width: 220px; height: 68px; }
  .slider-zipper svg { display: block; width: 220px; height: 68px; overflow: visible; }
  .slider-zipper__inside { fill: light-dark(#fbfcfd, #121417); }
  .slider-zipper__fabric { fill: light-dark(#dbdde1, #2e3035); }
  .slider-zipper__tooth { fill: light-dark(#50535b, #c6c8cd); }
  .slider-zipper__slider { fill: light-dark(#42454c, #e5e6e9); stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; }
  .slider-zipper__pull { fill: light-dark(#373a40, #f1f2f3); stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; }
  .slider-zipper__hole { fill: light-dark(#dbdde1, #2e3035); }
  .slider-zipper:has(.slider-zipper__input:focus-visible) .slider-zipper__slider { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; }
  .slider-zipper__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; -webkit-appearance: none; appearance: none; background: none; }
  .slider-zipper__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 68px; }
  .slider-zipper__input::-moz-range-thumb { width: 20px; height: 68px; border: 0; }
`;

export function ZipperSlider() {
  const [v, setV] = useState(55);
  const px = 10 + (v / 100) * (W - 20);
  const spread = (OPEN * px) / W;
  // How far an edge has parted at x: nothing at the pull, most at the left end.
  const off = (x: number) => (x >= px ? 0 : (spread * (px - x)) / px);
  const teeth = [];
  for (let x = 2; x < W; x += 10) {
    teeth.push(<rect key={`t${x}`} className="slider-zipper__tooth" x={x} y={(MID - 7 - off(x + 3)).toFixed(1)} width="6" height="7" rx="1.5" />);
    teeth.push(<rect key={`b${x}`} className="slider-zipper__tooth" x={x + 5} y={(MID + off(x + 8)).toFixed(1)} width="6" height="7" rx="1.5" />);
  }
  const top = (MID - 5 - spread).toFixed(1);
  const bottom = (MID + 5 + spread).toFixed(1);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-zipper">
        <svg viewBox={`0 0 ${W} 68`} aria-hidden="true">
          <rect className="slider-zipper__inside" x="0" y="0" width={W} height="68" rx="8" />
          <path className="slider-zipper__fabric" d={`M0 8a8 8 0 0 1 8-8H${W - 8} a8 8 0 0 1 8 8V${MID - 5}H${px.toFixed(1)}L0 ${top}Z`} />
          <path className="slider-zipper__fabric" d={`M0 60a8 8 0 0 0 8 8H${W - 8} a8 8 0 0 0 8-8V${MID + 5}H${px.toFixed(1)}L0 ${bottom}Z`} />
          {teeth}
          <g transform={`translate(${px.toFixed(1)} ${MID})`}>
            <path className="slider-zipper__slider" d="M-10-10h20l-3 20h-14Z" />
            <rect className="slider-zipper__pull" x="-5" y="4" width="10" height="24" rx="5" />
            <rect className="slider-zipper__hole" x="-2" y="18" width="4" height="7" rx="2" />
          </g>
        </svg>
        <input
          className="slider-zipper__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Unzip"
          aria-valuetext={`${v} percent open`}
        />
      </div>
    </>
  );
}
