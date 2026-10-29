"use client";

import { useRef, useState } from 'react';

const css = `
  @keyframes btn-reactor-cw { to { transform: rotate(360deg); } }
  @keyframes btn-reactor-ccw { to { transform: rotate(-360deg); } }
  @keyframes btn-reactor-breathe {
    0%, 100% { box-shadow: 0 0 14px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent), inset 0 0 10px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent); }
    50% { box-shadow: 0 0 26px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent), inset 0 0 14px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent); }
  }
  @keyframes btn-reactor-ignite {
    from { transform: scale(0.6); opacity: 0.9; }
    to { transform: scale(1.9); opacity: 0; }
  }
  .btn-reactor {
    position: relative;
    display: grid;
    place-items: center;
    width: 136px;
    height: 136px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    cursor: pointer;
  }
  .btn-reactor:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 4px; }
  .btn-reactor__ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .btn-reactor__ring circle { fill: none; }
  .btn-reactor__outer { animation: btn-reactor-cw 14s linear infinite; }
  .btn-reactor__mid { animation: btn-reactor-ccw 9s linear infinite; }
  .btn-reactor__inner { animation: btn-reactor-cw 5s linear infinite; }
  .btn-reactor__core {
    position: relative;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 1px solid light-dark(#50535b, #c6c8cd);
    background: radial-gradient(circle, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent), light-dark(#f3f4f7, #1a1c1f) 70%);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.16em;
    animation: btn-reactor-breathe 2.4s ease-in-out infinite;
  }
  .btn-reactor[aria-pressed='true'] .btn-reactor__core {
    background: radial-gradient(circle, light-dark(#373a40, #f1f2f3) 0 30%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent) 60%, light-dark(#f3f4f7, #1a1c1f));
    color: light-dark(#fbfcfd, #121417);
  }
  .btn-reactor__flash {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid light-dark(#373a40, #f1f2f3);
    animation: btn-reactor-ignite 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-reactor__outer, .btn-reactor__mid, .btn-reactor__inner, .btn-reactor__core { animation: none; }
    .btn-reactor__flash { display: none; }
  }
`;

const C = 68; // centre of the 136px viewBox

export function ReactorButton() {
  const root = useRef<HTMLButtonElement>(null);
  const [on, setOn] = useState(false);
  const [flash, setFlash] = useState(0);

  // Spin up / down without a jump: the ring animations keep running and only their rate changes.
  const rate = (r: number) =>
    root.current?.querySelectorAll('svg').forEach((s) => s.getAnimations().forEach((a) => a.updatePlaybackRate(r)));

  return (
    <>
      <style>
        {css}
      </style>
      <button
        ref={root}
        type="button"
        className="btn-reactor"
        aria-pressed={on}
        aria-label={on ? 'Core online' : 'Ignite core'}
        onPointerEnter={() => rate(on ? 6 : 3)}
        onPointerLeave={() => rate(on ? 2 : 1)}
        onClick={() => {
          setOn((v) => !v);
          setFlash((n) => n + 1);
          rate(on ? 3 : 6);
        }}
      >
        <svg className="btn-reactor__ring btn-reactor__outer" viewBox="0 0 136 136" aria-hidden="true">
          <circle cx={C} cy={C} r={64} stroke="light-dark(#cbced3, #393c41)" strokeWidth={1} />
          <circle cx={C} cy={C} r={58} stroke="light-dark(#5f626a, #a7abb2)" strokeWidth={5} strokeDasharray="2 7.1" />
        </svg>
        <svg className="btn-reactor__ring btn-reactor__mid" viewBox="0 0 136 136" aria-hidden="true">
          <circle cx={C} cy={C} r={46} stroke="light-dark(#50535b, #c6c8cd)" strokeWidth={3} strokeDasharray="34 14.2" />
        </svg>
        <svg className="btn-reactor__ring btn-reactor__inner" viewBox="0 0 136 136" aria-hidden="true">
          <circle cx={C} cy={C} r={36} stroke="light-dark(#6d7179, #7d8087)" strokeWidth={1.5} strokeDasharray="1 5" />
          <circle cx={C} cy={C} r={36} stroke="light-dark(#373a40, #f1f2f3)" strokeWidth={2} strokeDasharray="20 206.2" strokeLinecap="round" />
        </svg>
        <span className="btn-reactor__core">{on ? 'ON' : 'OFF'}</span>
        {flash > 0 && <span key={flash} className="btn-reactor__flash" aria-hidden="true" />}
      </button>
    </>
  );
}
