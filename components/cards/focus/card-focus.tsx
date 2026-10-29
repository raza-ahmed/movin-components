"use client";

import { useRef } from 'react';

const css = `
  .card-focus {
    --f: 0.5;
    --b-far: 3.5px;
    --b-mid: 0px;
    --b-near: 3.5px;
    position: relative;
    width: 230px;
    height: 180px;
    border-radius: 18px;
    background: linear-gradient(light-dark(#ebedf0, #232529), light-dark(#fbfcfd, #121417));
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    cursor: ns-resize;
  }
  .card-focus__layer { position: absolute; inset: 0; transition: filter 0.25s ease; }
  /* Each layer's blur is its distance from the focus plane (set from script). */
  .card-focus__far { filter: blur(var(--b-far)); }
  .card-focus__mid { filter: blur(var(--b-mid)); }
  .card-focus__near { filter: blur(var(--b-near)); }
  .card-focus__far::before {
    content: '';
    position: absolute;
    left: -10%;
    right: -10%;
    bottom: 54px;
    height: 70px;
    background: light-dark(#cbced3, #393c41);
    clip-path: polygon(0 100%, 12% 40%, 26% 70%, 42% 10%, 58% 60%, 72% 25%, 88% 65%, 100% 35%, 100% 100%);
  }
  .card-focus__far::after {
    content: '';
    position: absolute;
    left: 66%;
    top: 22px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: light-dark(#50535b, #c6c8cd);
  }
  .card-focus__mid::before {
    content: '';
    position: absolute;
    left: 34%;
    bottom: 40px;
    width: 64px;
    height: 74px;
    background: light-dark(#5f626a, #a7abb2);
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
  .card-focus__mid::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 44px;
    background: light-dark(#dbdde1, #2e3035);
  }
  .card-focus__near::before {
    content: '';
    position: absolute;
    left: -6px;
    bottom: -8px;
    width: 70px;
    height: 110px;
    background: light-dark(#42454c, #e5e6e9);
    clip-path: polygon(30% 100%, 0 20%, 22% 30%, 34% 0, 46% 36%, 70% 8%, 62% 50%, 100% 40%, 66% 100%);
  }
  .card-focus__near::after {
    content: '';
    position: absolute;
    right: -10px;
    bottom: -6px;
    width: 54px;
    height: 74px;
    background: light-dark(#50535b, #c6c8cd);
    clip-path: polygon(40% 100%, 10% 30%, 34% 40%, 50% 0, 60% 44%, 92% 22%, 72% 100%);
  }
  .card-focus__hud {
    position: absolute;
    left: 12px;
    top: 10px;
    display: flex;
    gap: 6px;
    align-items: center;
    color: light-dark(#373a40, #f1f2f3);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10px;
  }
  .card-focus__hud i { width: 6px; height: 6px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); }
  .card-focus__scale { position: absolute; right: 10px; top: 14px; bottom: 14px; width: 2px; background: light-dark(#dbdde1, #2e3035); border-radius: 1px; }
  .card-focus__scale span {
    position: absolute;
    left: -3px;
    width: 8px;
    height: 2px;
    background: light-dark(#373a40, #f1f2f3);
    top: calc((1 - var(--f)) * 100%);
    transition: top 0.25s ease;
  }
  @media (prefers-reduced-motion: reduce) {
    .card-focus__layer, .card-focus__scale span { transition: none; }
  }
`;

export function FocusCard() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const set = (f: number) => {
    const s = root.current!.style;
    s.setProperty('--f', f.toFixed(3));
    // Layers sit at depth 0 (far), 0.5 and 1 (near); blur by distance from the focus plane f.
    s.setProperty('--b-far', `${(f * 7).toFixed(2)}px`);
    s.setProperty('--b-mid', `${(Math.abs(f - 0.5) * 7).toFixed(2)}px`);
    s.setProperty('--b-near', `${((1 - f) * 7).toFixed(2)}px`);
    root.current!.setAttribute('aria-valuenow', String(Math.round(f * 100)));
    // Focus distance readout: near the bottom is close, the top is far away.
    const m = 0.4 + (1 - f) ** 2 * 60;
    label.current!.textContent = f < 0.1 ? 'f/1.8 · ∞' : `f/1.8 · ${m < 10 ? m.toFixed(1) : Math.round(m)} m`;
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div
        ref={root}
        className="card-focus"
        role="slider"
        tabIndex={0}
        aria-label="Focus distance"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        onPointerMove={(e) => {
          const r = root.current!.getBoundingClientRect();
          set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
        }}
        onKeyDown={(e) => {
          const f = Number(root.current!.style.getPropertyValue('--f') || 0.5);
          if (e.key === 'ArrowDown') set(Math.min(1, f + 0.1));
          if (e.key === 'ArrowUp') set(Math.max(0, f - 0.1));
        }}
      >
        <div className="card-focus__layer card-focus__far" aria-hidden="true" />
        <div className="card-focus__layer card-focus__mid" aria-hidden="true" />
        <div className="card-focus__layer card-focus__near" aria-hidden="true" />
        <span className="card-focus__hud" aria-hidden="true">
          <i />
          <span ref={label}>f/1.8 · 15 m</span>
        </span>
        <span className="card-focus__scale" aria-hidden="true">
          <span />
        </span>
      </div>
    </>
  );
}
