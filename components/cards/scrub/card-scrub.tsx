"use client";

import * as React from "react";
import { useState } from 'react';

const FRAMES = 12;
const TW = 212;
const TH = 112;
const time = (f: number) => `0:${String(f * 2).padStart(2, '0')}`;

const css = `
  .card-scrub { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-scrub__thumb { position: relative; width: ${TW}px; height: ${TH}px; border-radius: 10px; overflow: hidden; cursor: ew-resize; touch-action: pan-y; }
  .card-scrub__thumb:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-scrub__thumb svg { display: block; width: 100%; height: 100%; }
  .card-scrub__sky { fill: light-dark(#ebedf0, #232529); }
  .card-scrub__far { fill: light-dark(#dbdde1, #2e3035); }
  .card-scrub__near { fill: light-dark(#cbced3, #393c41); }
  .card-scrub__plane { fill: light-dark(#373a40, #f1f2f3); }
  .card-scrub__trail { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.2; stroke-dasharray: 2 3; }
  .card-scrub__bar { position: absolute; left: 0; right: 0; bottom: 0; height: 3px; background: var(--card-scrub-shadow); opacity: 0; transition: opacity 0.2s; }
  .card-scrub { --card-scrub-shadow: light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.4)); }
  .card-scrub__bar span { display: block; height: 100%; background: light-dark(#373a40, #f1f2f3); }
  .card-scrub__chip { position: absolute; right: 6px; bottom: 8px; padding: 1px 6px; border-radius: 4px; background: light-dark(#fbfcfd, #121417); color: light-dark(#373a40, #f1f2f3); font-size: 10px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .card-scrub--live .card-scrub__bar { opacity: 1; }
  .card-scrub__title { margin: 10px 0 2px; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-scrub__meta { margin: 0; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .card-scrub__bar { transition: none; }
  }
`;

// One frame of the clip: a paper plane loops across, the hills sliding behind it at two speeds.
function Frame({ f }: { f: number }) {
  const t = f / (FRAMES - 1);
  const x = 22 + t * 168;
  const y = 58 - 30 * Math.sin(t * Math.PI) + 10 * Math.sin(t * Math.PI * 3);
  const dy = -30 * Math.PI * Math.cos(t * Math.PI) + 30 * Math.PI * Math.cos(t * Math.PI * 3);
  const tilt = (Math.atan2(dy / 168, 1) * 180) / Math.PI;
  return (
    <svg viewBox={`0 0 ${TW} ${TH}`} aria-hidden="true">
      <rect className="card-scrub__sky" width={TW} height={TH} />
      <path className="card-scrub__far" d={`M${-t * 30} 86 Q${40 - t * 30} 64 ${90 - t * 30} 80 T${200 - t * 30} 74 T${300 - t * 30} 78 V${TH} H${-t * 30} Z`} />
      <path className="card-scrub__near" d={`M${-t * 70} 98 Q${50 - t * 70} 84 ${110 - t * 70} 96 T${230 - t * 70} 92 T${340 - t * 70} 96 V${TH} H${-t * 70} Z`} />
      <path className="card-scrub__trail" d={`M 10 ${58} Q ${(10 + x) / 2} ${y - 18} ${x - 8} ${y}`} />
      <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
        <path className="card-scrub__plane" d="M10 0 L-8 -6 L-4 0 L-8 6 Z" />
      </g>
    </svg>
  );
}

export function ScrubCard() {
  const [f, setF] = useState(0);
  const [live, setLive] = useState(false);
  const pick = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setLive(true);
    setF(Math.max(0, Math.min(FRAMES - 1, Math.floor(((e.clientX - r.left) / r.width) * FRAMES))));
  };
  return (
    <>
      <style>
        {css}
      </style>
      <article className={`card-scrub${live ? ' card-scrub--live' : ''}`}>
        {/* The pointer's position across the thumbnail picks the frame; the keys step through them. */}
        <div
          className="card-scrub__thumb"
          role="slider"
          tabIndex={0}
          aria-label="Preview position"
          aria-valuemin={0}
          aria-valuemax={FRAMES - 1}
          aria-valuenow={f}
          aria-valuetext={time(f)}
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => {
            setLive(false);
            setF(0);
          }}
          onKeyDown={(e) => {
            const next = { ArrowRight: f + 1, ArrowLeft: f - 1, Home: 0, End: FRAMES - 1 }[e.key];
            if (next === undefined) return;
            e.preventDefault();
            setLive(true);
            setF(Math.max(0, Math.min(FRAMES - 1, next)));
          }}
          onBlur={() => setLive(false)}
        >
          <Frame f={f} />
          <span className="card-scrub__bar" aria-hidden="true">
            <span style={{ width: `${((f + 1) / FRAMES) * 100}%` }} />
          </span>
          <span className="card-scrub__chip" aria-hidden="true">
            {live ? time(f) : time(FRAMES - 1)}
          </span>
        </div>
        <p className="card-scrub__title">Paper plane, take 3</p>
        <p className="card-scrub__meta">Studio reel · 1.2k views</p>
      </article>
    </>
  );
}
