"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const REACH = 56;
const LENGTH = 120;
const FASTEST = 16;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const time = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;

const css = `
  .slider-shuttle { position: relative; width: ${W}px; height: 84px; touch-action: none; cursor: grab; outline: none; user-select: none; -webkit-user-select: none; }
  .slider-shuttle--held { cursor: grabbing; }
  .slider-shuttle__head { display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-shuttle__value { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-shuttle__groove {
    position: absolute;
    left: 0;
    top: 26px;
    width: ${W}px;
    height: 34px;
    border-radius: 17px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 1px 3px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.5)), inset 0 0 0 1px light-dark(#ebedf0, #232529);
  }
  .slider-shuttle__centre { position: absolute; left: ${W / 2 - 0.5}px; top: 4px; width: 1px; height: 26px; background: light-dark(#dbdde1, #2e3035); }
  .slider-shuttle__chev { position: absolute; top: 11px; width: 8px; height: 12px; color: light-dark(#dbdde1, #2e3035); transition: color 0.12s; }
  .slider-shuttle__chev--lit { color: light-dark(#50535b, #c6c8cd); }
  .slider-shuttle__handle {
    position: absolute;
    left: ${W / 2 - 22}px;
    top: 4px;
    width: 44px;
    height: 26px;
    border-radius: 13px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 1px 2px light-dark(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), 0 4px 10px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4));
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    /* Let go and it springs back past centre and settles. */
    transition: transform 0.55s cubic-bezier(0.3, 1.7, 0.45, 1);
  }
  .slider-shuttle--held .slider-shuttle__handle { transition: none; }
  .slider-shuttle__grip { width: 1.5px; height: 10px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); }
  .slider-shuttle:focus-visible .slider-shuttle__handle { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-shuttle__range { position: absolute; left: 0; top: 74px; width: ${W}px; height: 1px; background: light-dark(#dbdde1, #2e3035); }
  .slider-shuttle__played { position: absolute; left: 0; top: 0; height: 1px; width: var(--slider-shuttle-at); background: light-dark(#50535b, #c6c8cd); }
  @media (prefers-reduced-motion: reduce) {
    .slider-shuttle__handle { transition: transform 0.15s ease-out; }
  }
`;

export function ShuttleSlider() {
  const [t, setT] = useState(42.6);
  const [push, setPush] = useState(0);
  const [held, setHeld] = useState(false);
  const drag = useRef<number | null>(null);
  const live = useRef(push);
  live.current = push;

  // While held, time runs at a speed that climbs steeply with how far the handle is pushed.
  useEffect(() => {
    if (!held) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const f = live.current / REACH;
      setT((t) => clamp(t + Math.sign(f) * f * f * FASTEST * dt, 0, LENGTH));
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [held]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = e.clientX;
    setHeld(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (drag.current === null) return;
    setPush(clamp(e.clientX - drag.current, -REACH, REACH));
  };
  const onPointerUp = () => {
    drag.current = null;
    setHeld(false);
    setPush(0);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    const next = { ArrowRight: t + step, ArrowUp: t + step, ArrowLeft: t - step, ArrowDown: t - step, Home: 0, End: LENGTH }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setT(clamp(Math.round(next * 10) / 10, 0, LENGTH));
  };

  const f = push / REACH;
  const shown = Math.round(t * 10) / 10;
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className={`slider-shuttle${held ? ' slider-shuttle--held' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="Playhead"
        aria-valuemin={0}
        aria-valuemax={LENGTH}
        aria-valuenow={shown}
        aria-valuetext={time(shown)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        style={{ '--slider-shuttle-at': `${(t / LENGTH) * 100}%` } as React.CSSProperties}
      >
        <div className="slider-shuttle__head" aria-hidden="true">
          <span>{held && push !== 0 ? `${push < 0 ? 'Rewind' : 'Forward'} ${Math.max(1, Math.round(f * f * FASTEST))}×` : 'Push to shuttle'}</span>
          <span className="slider-shuttle__value">{time(shown)}</span>
        </div>
        <div className="slider-shuttle__groove" aria-hidden="true">
          <span className="slider-shuttle__centre" />
          {[-1, 1].flatMap((side) =>
            [0, 1, 2].map((j) => (
              <svg
                key={`${side}${j}`}
                className={`slider-shuttle__chev${Math.sign(push) === side && Math.abs(f) > (j + 1) / 4 ? ' slider-shuttle__chev--lit' : ''}`}
                style={{ left: W / 2 + side * (84 + j * 12) - 4 }}
                viewBox="0 0 8 12"
              >
                <path
                  d={side > 0 ? 'M2 1.5 6.5 6 2 10.5' : 'M6 1.5 1.5 6 6 10.5'}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )),
          )}
          <span className="slider-shuttle__handle" style={{ transform: `translateX(${push}px)` }}>
            <span className="slider-shuttle__grip" />
            <span className="slider-shuttle__grip" />
            <span className="slider-shuttle__grip" />
          </span>
        </div>
        <span className="slider-shuttle__range" aria-hidden="true">
          <span className="slider-shuttle__played" />
        </span>
      </div>
    </>
  );
}
