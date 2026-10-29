"use client";

import * as React from "react";
import { useMemo } from 'react';

const css = `
  @keyframes loader-sound-ring-pump {
    0%, 100% { transform: scaleY(0.25); }
    50% { transform: scaleY(1); }
  }
  @keyframes loader-sound-ring-turn { to { transform: rotate(360deg); } }
  .loader-sound-ring {
    position: relative;
    width: 112px;
    height: 112px;
    animation: loader-sound-ring-turn 12s linear infinite;
  }
  .loader-sound-ring__bar {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 3px;
    height: 0;
  }
  .loader-sound-ring__bar::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 26px;
    width: 3px;
    height: 24px;
    border-radius: 2px;
    background: linear-gradient(light-dark(#373a40, #f1f2f3), light-dark(#6d7179, #7d8087));
    transform-origin: 50% 100%;
    animation: loader-sound-ring-pump var(--t) cubic-bezier(0.45, 0, 0.55, 1) var(--d) infinite;
  }
  .loader-sound-ring__hub {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 36px;
    height: 36px;
    margin: -18px;
    border-radius: 50%;
    border: 1px solid light-dark(#cbced3, #393c41);
    background: radial-gradient(circle, light-dark(#ebedf0, #232529), light-dark(#fbfcfd, #121417));
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-sound-ring { animation: none; }
    .loader-sound-ring__bar::before { animation: none; transform: scaleY(0.5); }
  }
`;

const BARS = 40;

export function SoundRingLoader() {
  // Neighbouring bars share a "band" (a beat length) so the ring pumps in clusters, like a spectrum.
  const bars = useMemo(() => {
    let seed = 13;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: BARS }, (_, i) => {
      const band = Math.floor(i / 5);
      return {
        transform: `rotate(${(i * 360) / BARS}deg)`,
        '--t': `${(0.5 + ((band * 7) % 5) * 0.12).toFixed(2)}s`,
        '--d': `${(-rand() * 0.6 - (i % 5) * 0.05).toFixed(2)}s`,
      } as React.CSSProperties;
    });
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-sound-ring" role="status" aria-label="Loading">
        {bars.map((s, i) => (
          <span key={i} className="loader-sound-ring__bar" style={s} aria-hidden="true" />
        ))}
        <span className="loader-sound-ring__hub" aria-hidden="true" />
      </div>
    </>
  );
}
