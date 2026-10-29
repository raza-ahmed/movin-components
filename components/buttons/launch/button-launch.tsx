"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes btn-launch-rumble {
    0% { translate: 0 0; } 25% { translate: -1px 1px; } 50% { translate: 1px 0; } 75% { translate: 0 -1px; } 100% { translate: 1px 1px; }
  }
  @keyframes btn-launch-flicker { 0%, 100% { scale: 1 1; } 50% { scale: 0.85 1.15; } }
  @keyframes btn-launch-pop { from { transform: scale(1.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes btn-launch-puff {
    from { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
    to { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1.6); opacity: 0; }
  }
  .btn-launch {
    position: relative;
    display: grid;
    place-items: center;
    width: 220px;
    height: 150px;
  }
  .btn-launch__btn {
    position: relative;
    z-index: 1;
    width: 132px;
    height: 46px;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.9s cubic-bezier(0.6, 0, 0.9, 0.45);
  }
  .btn-launch__btn:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-launch__count { display: inline-block; animation: btn-launch-pop 0.35s cubic-bezier(0.22, 1, 0.36, 1); font-variant-numeric: tabular-nums; }
  .btn-launch__flame {
    position: absolute;
    left: 50%;
    top: 100%;
    width: 16px;
    height: 44px;
    margin-left: -8px;
    border-radius: 50% 50% 50% 50% / 25% 25% 75% 75%;
    background: linear-gradient(light-dark(#373a40, #f1f2f3), color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent) 45%, transparent);
    filter: blur(1px);
    transform-origin: top;
    transform: scaleY(0);
    transition: transform 0.25s ease;
    pointer-events: none;
  }
  .btn-launch[data-phase='count'] .btn-launch__btn { animation: btn-launch-rumble 0.09s linear infinite; }
  .btn-launch[data-phase='count'] .btn-launch__flame { transform: scaleY(0.3); animation: btn-launch-flicker 0.12s linear infinite; }
  .btn-launch[data-phase='lift'] .btn-launch__btn { transform: translateY(-280px); }
  .btn-launch[data-phase='lift'] .btn-launch__flame { transform: scaleY(1.5); animation: btn-launch-flicker 0.1s linear infinite; }
  .btn-launch[data-phase='gone'] .btn-launch__btn { transform: translateY(-280px); transition: none; }
  .btn-launch[data-phase='land'] .btn-launch__btn { transform: none; transition: transform 0.75s cubic-bezier(0.22, 1.25, 0.36, 1); }
  .btn-launch__puff {
    position: absolute;
    left: 50%;
    top: calc(50% + 30px);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in oklab, light-dark(#50535b, #c6c8cd) 70%, transparent), transparent 70%);
    animation: btn-launch-puff 1.1s cubic-bezier(0.22, 1, 0.36, 1) var(--delay) forwards;
    opacity: 0;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-launch__btn, .btn-launch__flame, .btn-launch__puff, .btn-launch__count { animation: none !important; transition: none !important; }
    .btn-launch__puff { display: none; }
  }
`;

type Phase = 'idle' | 'count' | 'lift' | 'gone' | 'land' | 'done';

const PUFFS = Array.from({ length: 9 }, (_, i) => {
  const a = Math.PI * (0.05 + (0.9 * i) / 8); // fanned along the ground, both sides
  return { '--x': `${(Math.cos(a) * 70).toFixed(0)}px`, '--y': `${(-Math.sin(a) * 18 + 6).toFixed(0)}px`, '--delay': `${(i % 3) * 0.05}s` };
});

export function LaunchButton() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [n, setN] = useState(3);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const go = () => {
    if (phase !== 'idle' && phase !== 'done') return;
    setPhase('count');
    setN(3);
    at(600, () => setN(2));
    at(1200, () => setN(1));
    at(1800, () => setPhase('lift'));
    at(2700, () => setPhase('gone'));
    at(3300, () => setPhase('land'));
    at(4100, () => setPhase('done'));
    at(5600, () => setPhase('idle'));
  };

  const label = phase === 'count' ? null : phase === 'done' || phase === 'land' ? 'Launched' : 'Launch';

  return (
    <>
      <style>
        {css}
      </style>
      <div className="btn-launch" data-phase={phase}>
        {phase === 'lift' &&
          PUFFS.map((p, i) => <span key={i} className="btn-launch__puff" style={p as React.CSSProperties} aria-hidden="true" />)}
        <button type="button" className="btn-launch__btn" onClick={go} aria-live="polite">
          {label ?? (
            <span key={n} className="btn-launch__count">
              T-{n}
            </span>
          )}
          <span className="btn-launch__flame" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
