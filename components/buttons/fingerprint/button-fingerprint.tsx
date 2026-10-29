"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .btn-fingerprint {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 8px 22px 8px 8px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#42454c, #e5e6e9);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .btn-fingerprint:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-fingerprint[data-state='done'] {
    border-color: light-dark(#50535b, #c6c8cd);
    color: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 24px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 20%, transparent);
  }
  .btn-fingerprint__pad {
    position: relative;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
  }
  .btn-fingerprint__print { width: 34px; height: 34px; overflow: visible; }
  .btn-fingerprint__print path {
    fill: none;
    stroke-width: 1.3;
    stroke-linecap: round;
  }
  .btn-fingerprint__base path { stroke: light-dark(#cbced3, #393c41); }
  .btn-fingerprint__lit path {
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-dasharray: 1;
    filter: drop-shadow(0 0 2px light-dark(#50535b, #c6c8cd));
  }
  .btn-fingerprint__beam {
    position: absolute;
    left: 4px;
    right: 4px;
    height: 2px;
    border-radius: 2px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 10px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .btn-fingerprint[data-state='scanning'] .btn-fingerprint__beam { opacity: 1; }
  .btn-fingerprint__text { display: grid; min-width: 9.5em; text-align: left; }
  .btn-fingerprint__hint { font-size: 11px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .btn-fingerprint, .btn-fingerprint__beam { transition: none; }
    .btn-fingerprint__beam { display: none; }
  }
`;

const RIDGES = [
  'M5.5 18.5C5 16.5 4.8 14.5 4.8 12a7.2 7.2 0 0 1 14.4 0v1.2',
  'M8.6 20.6C8 18.3 7.9 15.4 7.9 12a4.1 4.1 0 0 1 8.2 0c0 2.4-.1 4.4-.6 6.4',
  'M12 12c0 3.2.3 6.2 1.4 8.9',
  'M18.9 16.4c.2-.9.3-1.9.3-3',
  'M3.2 9.2a9.4 9.4 0 0 1 17.6 0',
  'M5.6 5.4a9.6 9.6 0 0 1 12.8 0',
  'M10 17.6c-.2-1.8-.3-3.6-.3-5.6a2.3 2.3 0 0 1 4.6 0',
];
const HOLD_MS = 1400;

export function FingerprintButton() {
  const lit = useRef<SVGGElement>(null);
  const beam = useRef<HTMLSpanElement>(null);
  const holding = useRef(false);
  const [state, setState] = useState<'idle' | 'scanning' | 'done'>('idle');

  useEffect(() => {
    let p = 0;
    let last = performance.now();
    let raf = 0;
    let doneAt = 0;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (doneAt) {
        if (now - doneAt > 1800) {
          doneAt = 0;
          setState('idle');
        }
      } else if (holding.current) {
        p = Math.min(1, p + dt / HOLD_MS);
        if (p >= 1) {
          doneAt = now;
          holding.current = false;
          setState('done');
        }
      } else {
        p = Math.max(0, p - dt / 400);
      }
      const shown = doneAt ? 1 : p;
      lit.current?.querySelectorAll('path').forEach((path, i) => {
        // Ridges fill in one after another, overlapping, across the hold.
        const local = Math.min(1, Math.max(0, shown * 1.6 - i * 0.09));
        path.style.strokeDashoffset = String(1 - local);
      });
      if (beam.current) beam.current.style.top = `${8 + 36 * (0.5 - 0.5 * Math.cos(now / 260))}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const start = () => {
    if (state === 'done') return;
    holding.current = true;
    setState('scanning');
  };
  const stop = () => {
    if (!holding.current) return;
    holding.current = false;
    setState((s) => (s === 'done' ? s : 'idle'));
  };

  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-fingerprint"
        data-state={state}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !e.repeat && start()}
        onKeyUp={stop}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="btn-fingerprint__pad" aria-hidden="true">
          <svg className="btn-fingerprint__print" viewBox="0 0 24 24">
            <g className="btn-fingerprint__base">
              {RIDGES.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            <g ref={lit} className="btn-fingerprint__lit">
              {RIDGES.map((d) => (
                <path key={d} d={d} pathLength={1} strokeDashoffset={1} />
              ))}
            </g>
          </svg>
          <span ref={beam} className="btn-fingerprint__beam" />
        </span>
        <span className="btn-fingerprint__text" aria-live="polite">
          {state === 'done' ? 'Verified' : state === 'scanning' ? 'Scanning…' : 'Touch ID'}
          <span className="btn-fingerprint__hint">{state === 'done' ? 'Access granted' : 'Press and hold'}</span>
        </span>
      </button>
    </>
  );
}
