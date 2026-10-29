"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

// One breath: in, hold, out. Two rounds, then it rests again.
const STEPS = [
  { word: 'Breathe in', ms: 4000, phase: 'in' },
  { word: 'Hold', ms: 2000, phase: 'hold' },
  { word: 'Breathe out', ms: 4000, phase: 'out' },
];
const ROUNDS = 2;

const css = `
  @keyframes btn-breathe-idle { 50% { transform: scale(1.08); opacity: 0.55; } }
  .btn-breathe { position: relative; display: inline-grid; place-items: center; width: 150px; height: 150px; }
  .btn-breathe__halo {
    position: absolute;
    inset: 18px;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in oklab, light-dark(#50535b, #c6c8cd) 30%, transparent), transparent 70%);
    box-shadow: 0 0 0 1px color-mix(in oklab, light-dark(#5f626a, #a7abb2) 30%, transparent);
    opacity: 0.35;
    animation: btn-breathe-idle 6s ease-in-out infinite;
  }
  .btn-breathe__halo--2 { inset: 34px; animation-delay: -1.5s; }
  .btn-breathe[data-phase] .btn-breathe__halo { animation: none; transition: transform var(--ms) cubic-bezier(0.45, 0, 0.55, 1), opacity var(--ms); }
  .btn-breathe[data-phase='in'] .btn-breathe__halo, .btn-breathe[data-phase='hold'] .btn-breathe__halo { transform: scale(1.22); opacity: 0.8; }
  .btn-breathe[data-phase='out'] .btn-breathe__halo { transform: scale(0.8); opacity: 0.3; }
  .btn-breathe__btn {
    position: relative;
    display: grid;
    place-items: center;
    width: 92px;
    height: 92px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 10px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.25;
    cursor: pointer;
  }
  .btn-breathe__btn:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; }
  .btn-breathe__word { transition: opacity 0.4s; }
  .btn-breathe__sub { display: block; margin-top: 2px; color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-weight: 400; }
  @media (prefers-reduced-motion: reduce) {
    .btn-breathe__halo { animation: none; transition: none !important; }
  }
`;

export function BreatheButton() {
  const [step, setStep] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => {
    if (step < 0) return;
    if (step >= STEPS.length * ROUNDS) {
      setStep(-1);
      return;
    }
    timer.current = setTimeout(() => setStep((s) => s + 1), STEPS[step % STEPS.length]!.ms);
    return () => clearTimeout(timer.current);
  }, [step]);
  const cur = step >= 0 ? STEPS[step % STEPS.length]! : null;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="btn-breathe" data-phase={cur?.phase} style={{ '--ms': `${cur?.ms ?? 0}ms` } as React.CSSProperties}>
        <span className="btn-breathe__halo" aria-hidden="true" />
        <span className="btn-breathe__halo btn-breathe__halo--2" aria-hidden="true" />
        <button type="button" className="btn-breathe__btn" aria-pressed={!!cur} onClick={() => setStep((s) => (s < 0 ? 0 : -1))}>
          <span className="btn-breathe__word" aria-live="polite">
            {cur ? cur.word : 'Begin'}
            <span className="btn-breathe__sub">{cur ? `Round ${Math.floor(step / STEPS.length) + 1} of ${ROUNDS}` : 'One minute'}</span>
          </span>
        </button>
      </div>
    </>
  );
}
