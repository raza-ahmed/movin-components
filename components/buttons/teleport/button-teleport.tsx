"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from 'react';

const css = `
  @keyframes btn-teleport-out {
    from { transform: none; opacity: 1; }
    to { transform: translateY(-30px) scaleY(2.2); opacity: 0; }
  }
  @keyframes btn-teleport-in {
    from { transform: translateY(-30px) scaleY(2.2); opacity: 0; }
    to { transform: none; opacity: 1; }
  }
  @keyframes btn-teleport-beam {
    0% { opacity: 0; transform: scaleX(0.2); }
    15%, 80% { opacity: 1; transform: scaleX(1); }
    100% { opacity: 0; transform: scaleX(0.4); }
  }
  .btn-teleport {
    position: relative;
    width: 168px;
    height: 48px;
    padding: 0;
    border: none;
    background: none;
    font-family: inherit;
    cursor: pointer;
  }
  .btn-teleport:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 4px; border-radius: 12px; }
  .btn-teleport__face {
    position: absolute;
    left: 0;
    top: 0;
    display: grid;
    place-items: center;
    width: 168px;
    height: 48px;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 12px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.06em;
    box-sizing: border-box;
  }
  .btn-teleport:hover .btn-teleport__face { border-color: light-dark(#5f626a, #a7abb2); }
  .btn-teleport__tile {
    position: absolute;
    overflow: hidden;
    transform-origin: bottom;
  }
  .btn-teleport[data-phase='out'] .btn-teleport__tile { animation: btn-teleport-out 0.45s cubic-bezier(0.55, 0, 1, 0.45) var(--d) both; }
  .btn-teleport[data-phase='in'] .btn-teleport__tile { animation: btn-teleport-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) var(--d) both; }
  .btn-teleport__beam {
    position: absolute;
    left: -14px;
    right: -14px;
    top: -120px;
    bottom: -40px;
    background: linear-gradient(90deg, transparent, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 16%, transparent) 30%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 24%, transparent) 50%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 16%, transparent) 70%, transparent);
    mask-image: linear-gradient(transparent, #000 30%, #000 85%, transparent);
    animation: btn-teleport-beam 2.1s ease both;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-teleport[data-phase] .btn-teleport__tile, .btn-teleport__beam { animation-duration: 0.01s !important; animation-delay: 0s !important; }
  }
`;

const W = 168;
const H = 48;
const COLS = 8;
const ROWS = 3;

export function TeleportButton() {
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Seeded jitter per tile; rows go bottom-up on the way out and top-down on the way back.
  const tiles = useMemo(() => {
    let seed = 3;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const out: { c: number; r: number; jitter: number }[] = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) out.push({ c, r, jitter: rand() });
    return out;
  }, []);

  const face = (
    <span className="btn-teleport__face" aria-hidden="true">
      Beam me up
    </span>
  );

  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-teleport"
        data-phase={phase === 'idle' ? undefined : phase}
        aria-label="Beam me up"
        onClick={() => {
          if (phase !== 'idle') return;
          setPhase('out');
          timers.current.push(window.setTimeout(() => setPhase('in'), 1100));
          timers.current.push(window.setTimeout(() => setPhase('idle'), 2100));
        }}
      >
        {phase !== 'idle' && <span className="btn-teleport__beam" aria-hidden="true" />}
        {phase === 'idle'
          ? face
          : tiles.map(({ c, r, jitter }) => {
              const w = W / COLS;
              const h = H / ROWS;
              const order = phase === 'out' ? ROWS - 1 - r : r;
              return (
                <span
                  key={`${c}-${r}`}
                  className="btn-teleport__tile"
                  aria-hidden="true"
                  style={
                    {
                      left: c * w,
                      top: r * h,
                      width: w,
                      height: h,
                      '--d': `${(order * 0.14 + jitter * 0.22).toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                >
                  <span style={{ position: 'absolute', left: -c * w, top: -r * h }}>{face}</span>
                </span>
              );
            })}
      </button>
    </>
  );
}
