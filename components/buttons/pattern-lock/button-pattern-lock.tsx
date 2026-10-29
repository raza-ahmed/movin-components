"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes btn-pattern-lock-shake {
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
  }
  .btn-pattern-lock {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    padding: 10px 22px 10px 10px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 18px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#42454c, #e5e6e9);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .btn-pattern-lock:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-pattern-lock[data-status='bad'] { animation: btn-pattern-lock-shake 0.4s ease; }
  .btn-pattern-lock[data-status='ok'] {
    border-color: light-dark(#50535b, #c6c8cd);
    color: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 24px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 20%, transparent);
  }
  .btn-pattern-lock__pad {
    width: 96px;
    height: 96px;
    border-radius: 12px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .btn-pattern-lock__line {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 3px light-dark(#50535b, #c6c8cd));
  }
  .btn-pattern-lock__dot { fill: light-dark(#cbced3, #393c41); transition: fill 0.2s ease; }
  .btn-pattern-lock__dot[data-on] { fill: light-dark(#373a40, #f1f2f3); }
  .btn-pattern-lock__halo {
    fill: none;
    stroke: light-dark(#50535b, #c6c8cd);
    stroke-width: 1;
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(0.4);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
  }
  .btn-pattern-lock__halo[data-on] { transform: scale(1); opacity: 1; }
  .btn-pattern-lock__text { display: grid; min-width: 7.5em; text-align: left; }
  .btn-pattern-lock__hint { font-size: 11px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .btn-pattern-lock[data-status='bad'] { animation: none; }
    .btn-pattern-lock, .btn-pattern-lock__dot, .btn-pattern-lock__halo { transition: none; }
  }
`;

const AT = [18, 48, 78];
const DOTS = AT.flatMap((y) => AT.map((x) => ({ x, y })));
const DEMO = [0, 1, 2, 4, 6, 7, 8];

export function PatternLockButton() {
  const pad = useRef<SVGSVGElement>(null);
  const [path, setPath] = useState<number[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [status, setStatusState] = useState<'idle' | 'drawing' | 'ok' | 'bad'>('idle');
  // Mirrored in a ref: click fires right after pointerup, before React re-renders.
  const statusRef = useRef(status);
  const setStatus = (s: typeof status) => {
    statusRef.current = s;
    setStatusState(s);
  };
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const finish = (p: number[]) => {
    setCursor(null);
    if (p.length >= 4) {
      setStatus('ok');
      later(() => {
        setStatus('idle');
        setPath([]);
      }, 1800);
    } else {
      setStatus('bad');
      later(() => {
        setStatus('idle');
        setPath([]);
      }, 450);
    }
  };

  const play = () => {
    if (statusRef.current !== 'idle') return;
    setStatus('drawing');
    DEMO.forEach((d, i) =>
      later(() => {
        setPath(DEMO.slice(0, i + 1));
        if (i === DEMO.length - 1) finish(DEMO);
      }, 120 * (i + 1)),
    );
  };

  const local = (e: React.PointerEvent) => {
    const r = pad.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 96, y: ((e.clientY - r.top) / r.height) * 96 };
  };
  const hit = (p: { x: number; y: number }) => DOTS.findIndex((d) => Math.hypot(d.x - p.x, d.y - p.y) < 13);

  const pts = path.map((i) => `${DOTS[i].x},${DOTS[i].y}`);
  if (cursor && status === 'drawing' && path.length) pts.push(`${cursor.x},${cursor.y}`);

  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-pattern-lock"
        data-status={status}
        onPointerDown={(e) => {
          if (status !== 'idle') return;
          const i = hit(local(e));
          if (i < 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setStatus('drawing');
          setPath([i]);
        }}
        onPointerMove={(e) => {
          if (status !== 'drawing' || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
          const p = local(e);
          setCursor(p);
          const i = hit(p);
          if (i >= 0 && !path.includes(i)) setPath((old) => [...old, i]);
        }}
        onPointerUp={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          // A tap on one dot is a click, not a pattern: reset, and the click plays the demo.
          if (path.length <= 1) {
            setStatus('idle');
            setPath([]);
            setCursor(null);
          } else finish(path);
        }}
        onClick={play}
      >
        <svg ref={pad} className="btn-pattern-lock__pad" viewBox="0 0 96 96" aria-hidden="true">
          {pts.length > 1 && <polyline className="btn-pattern-lock__line" points={pts.join(' ')} />}
          {DOTS.map((d, i) => (
            <g key={i}>
              <circle className="btn-pattern-lock__halo" cx={d.x} cy={d.y} r={9} data-on={path.includes(i) || undefined} />
              <circle className="btn-pattern-lock__dot" cx={d.x} cy={d.y} r={3.5} data-on={path.includes(i) || undefined} />
            </g>
          ))}
        </svg>
        <span className="btn-pattern-lock__text" aria-live="polite">
          {status === 'ok' ? 'Unlocked' : 'Locked'}
          <span className="btn-pattern-lock__hint">
            {status === 'ok' ? 'Welcome back' : status === 'bad' ? 'Try 4+ dots' : 'Draw to unlock'}
          </span>
        </span>
      </button>
    </>
  );
}
