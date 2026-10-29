"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes card-shatter-crack { 0% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes card-shatter-flash { 0% { opacity: 0.9; transform: scale(0.2); } 100% { opacity: 0; transform: scale(1.6); } }
  .card-shatter {
    position: relative;
    display: block;
    width: 224px;
    height: 148px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    text-align: left;
    perspective: 600px;
    cursor: pointer;
  }
  .card-shatter:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 4px; border-radius: 16px; }
  .card-shatter__prize {
    position: absolute;
    inset: 0;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 4px;
    border-radius: 16px;
    background: radial-gradient(circle at 50% 40%, light-dark(#dbdde1, #2e3035), light-dark(#fbfcfd, #121417) 75%);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transform: scale(0.88);
    opacity: 0.3;
    transition: transform 0.5s cubic-bezier(0.34, 1.5, 0.64, 1), opacity 0.3s ease;
  }
  .card-shatter[aria-pressed='true'] .card-shatter__prize { transform: none; opacity: 1; transition-delay: 0.18s; }
  .card-shatter__big { color: light-dark(#373a40, #f1f2f3); font-size: 34px; font-weight: 600; letter-spacing: -0.04em; line-height: 1; }
  .card-shatter__sub { color: light-dark(#50535b, #c6c8cd); font-size: 11px; }
  .card-shatter__code {
    margin-top: 6px;
    padding: 3px 10px;
    border-radius: 6px;
    border: 1px dashed light-dark(#5f626a, #a7abb2);
    color: light-dark(#373a40, #f1f2f3);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 11px;
    letter-spacing: 0.12em;
  }
  .card-shatter__hint { position: absolute; bottom: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
  .card-shatter__cover {
    position: absolute;
    inset: 0;
    display: grid;
    align-content: end;
    padding: 14px;
    border-radius: 16px;
    background:
      radial-gradient(circle at 168px 52px, light-dark(#dbdde1, #2e3035) 0 26px, transparent 27px),
      repeating-linear-gradient(-45deg, light-dark(#ebedf0, #232529) 0 6px, color-mix(in oklab, light-dark(#dbdde1, #2e3035) 55%, light-dark(#ebedf0, #232529)) 6px 12px);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41);
  }
  .card-shatter__seal {
    position: absolute;
    left: 142px;
    top: 26px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 1.5px dashed light-dark(#5f626a, #a7abb2);
  }
  .card-shatter__seal svg { position: absolute; inset: 0; width: 52px; height: 52px; color: light-dark(#42454c, #e5e6e9); }
  .card-shatter__cover b { color: light-dark(#373a40, #f1f2f3); font-size: 15px; font-weight: 600; }
  .card-shatter__cover span { color: light-dark(#50535b, #c6c8cd); font-size: 11px; }
  .card-shatter__whole { position: absolute; inset: 0; z-index: 2; transition: opacity 0s linear 0.8s; }
  .card-shatter[aria-pressed='true'] .card-shatter__whole { opacity: 0; transition-delay: 0s; }
  .card-shatter__shard {
    position: absolute;
    inset: 0;
    z-index: 1;
    transform: translate3d(var(--tx, 0px), var(--ty, 0px), var(--tz, 0px)) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) rotateZ(var(--rz, 0deg));
    transition: transform 0.6s cubic-bezier(0.5, 0, 0.2, 1) var(--d, 0s), opacity 0.2s ease var(--d, 0s);
  }
  .card-shatter[aria-pressed='true'] .card-shatter__shard {
    opacity: 0;
    transition: transform 0.85s cubic-bezier(0.15, 0.6, 0.35, 1) var(--d, 0s), opacity 0.4s ease calc(var(--d, 0s) + 0.4s);
  }
  .card-shatter__cracks { position: absolute; inset: 0; z-index: 3; width: 224px; height: 148px; opacity: 0; pointer-events: none; }
  .card-shatter__cracks path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.2; stroke-linejoin: round; }
  .card-shatter[aria-pressed='true'] .card-shatter__cracks { animation: card-shatter-crack 0.5s ease-out; }
  .card-shatter__flash {
    position: absolute;
    z-index: 3;
    width: 90px;
    height: 90px;
    margin: -45px 0 0 -45px;
    border-radius: 50%;
    background: radial-gradient(circle, light-dark(#373a40, #f1f2f3), transparent 65%);
    opacity: 0;
    pointer-events: none;
  }
  .card-shatter[aria-pressed='true'] .card-shatter__flash { animation: card-shatter-flash 0.45s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .card-shatter__shard, .card-shatter[aria-pressed='true'] .card-shatter__shard { transform: none; transition: opacity 0.3s ease; }
    .card-shatter[aria-pressed='true'] .card-shatter__cracks, .card-shatter[aria-pressed='true'] .card-shatter__flash { animation: none; }
  }
`;

const W = 224;
const H = 148;
const COLS = 4;
const ROWS = 3;
// A fixed pseudo-random sequence, so the crack pattern is the same on every load.
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// A jittered grid of points: interior points wander, edge points stay on their edge.
const PTS = Array.from({ length: ROWS + 1 }, (_, r) =>
  Array.from({ length: COLS + 1 }, (_, c) => [
    (c / COLS) * W + (c === 0 || c === COLS ? 0 : (rnd(r * 9 + c) - 0.5) * 34),
    (r / ROWS) * H + (r === 0 || r === ROWS ? 0 : (rnd(r * 9 + c + 50) - 0.5) * 28),
  ]),
);

// Each cell splits into two triangles, alternating the diagonal so the cracks don't line up.
const SHARDS = PTS.slice(0, ROWS).flatMap((row, r) =>
  row.slice(0, COLS).flatMap((_, c) => {
    const [a, b, d, e] = [PTS[r][c], PTS[r][c + 1], PTS[r + 1][c], PTS[r + 1][c + 1]];
    const tris = (r + c) % 2 ? [[a, b, e], [a, e, d]] : [[a, b, d], [b, e, d]];
    return tris.map((p) => ({ p, cx: (p[0][0] + p[1][0] + p[2][0]) / 3, cy: (p[0][1] + p[1][1] + p[2][1]) / 3 }));
  }),
);

const CRACKS = SHARDS.map(({ p }) => `M${p.map((q) => q.map((n) => n.toFixed(1)).join(' ')).join('L')}Z`).join('');

function Cover() {
  return (
    <span className="card-shatter__cover">
      <span className="card-shatter__seal">
        <svg viewBox="0 0 52 52" fill="none">
          <path d="M26 14l3.4 7.6 8.2.8-6.2 5.5 1.8 8.1L26 31.8 18.8 36l1.8-8.1-6.2-5.5 8.2-.8z" fill="currentColor" />
        </svg>
      </span>
      <b>Mystery drop</b>
      <span>Click to break the seal</span>
    </span>
  );
}

export function ShatterCard() {
  const [broken, setBroken] = useState(false);
  const [hit, setHit] = useState({ x: W / 2, y: H / 2 });

  const toggle = (x: number, y: number) => {
    if (!broken) setHit({ x, y });
    setBroken(!broken);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="card-shatter"
        aria-pressed={broken}
        aria-label={broken ? 'Reward revealed: 30% off with code MOVIN30. Press to reseal' : 'Mystery drop. Press to break the seal'}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          // Keyboard presses report 0,0: break from the middle instead.
          const fromKey = e.detail === 0;
          toggle(fromKey ? W / 2 : e.clientX - r.left, fromKey ? H / 2 : e.clientY - r.top);
        }}
      >
        <span className="card-shatter__prize" aria-hidden="true">
          <span className="card-shatter__big">30% off</span>
          <span className="card-shatter__sub">your next order</span>
          <span className="card-shatter__code">MOVIN30</span>
          <span className="card-shatter__hint">Click to reseal</span>
        </span>
        {SHARDS.map(({ p, cx, cy }, i) => {
          const dx = cx - hit.x;
          const dy = cy - hit.y;
          const dist = Math.hypot(dx, dy) || 1;
          const push = 50 + rnd(i + 7) * 80;
          const vars = broken
            ? {
                '--tx': `${((dx / dist) * push).toFixed(1)}px`,
                '--ty': `${((dy / dist) * push + 60 + rnd(i + 3) * 40).toFixed(1)}px`,
                '--tz': `${(40 + rnd(i + 11) * 80).toFixed(0)}px`,
                '--rx': `${((rnd(i + 13) - 0.5) * 140).toFixed(0)}deg`,
                '--ry': `${((rnd(i + 17) - 0.5) * 140).toFixed(0)}deg`,
                '--rz': `${((rnd(i + 19) - 0.5) * 180).toFixed(0)}deg`,
                '--d': `${(0.08 + dist * 0.0016).toFixed(3)}s`,
              }
            : { '--d': `${(rnd(i + 23) * 0.12).toFixed(3)}s` };
          return (
            <span
              key={i}
              className="card-shatter__shard"
              aria-hidden="true"
              style={{
                clipPath: `polygon(${p.map((q) => `${q[0].toFixed(1)}px ${q[1].toFixed(1)}px`).join(',')})`,
                transformOrigin: `${cx.toFixed(1)}px ${cy.toFixed(1)}px`,
                ...(vars as React.CSSProperties),
              }}
            >
              <Cover />
            </span>
          );
        })}
        <span className="card-shatter__whole" aria-hidden="true">
          <Cover />
        </span>
        <svg className="card-shatter__cracks" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          <path d={CRACKS} />
        </svg>
        <span className="card-shatter__flash" aria-hidden="true" style={{ left: hit.x, top: hit.y }} />
      </button>
    </>
  );
}
