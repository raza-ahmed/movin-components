"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const W = 240;
const WHEEL = 224;
const RIDGES = 40;
const STEP = 360 / RIDGES;
const PX = 14;
const MIN = -9;
const MAX = 9;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
// Thirds of a stop, the way a camera counts them.
const ev = (n: number) => (n === 0 ? '0' : `${n < 0 ? '−' : '+'}${(Math.abs(n) / 3).toFixed(1)}`);

const css = `
  .slider-thumbwheel { position: relative; width: ${W}px; height: 84px; touch-action: none; cursor: ew-resize; outline: none; user-select: none; -webkit-user-select: none; }
  .slider-thumbwheel__head { display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-thumbwheel__value { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-thumbwheel__slot {
    position: absolute;
    left: 0;
    top: 26px;
    width: ${W}px;
    height: 36px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 1px 3px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.5)), inset 0 0 0 1px light-dark(#ebedf0, #232529);
  }
  .slider-thumbwheel__wheel {
    position: absolute;
    left: ${(W - WHEEL) / 2}px;
    top: 5px;
    width: ${WHEEL}px;
    height: 26px;
    border-radius: 6px;
    overflow: hidden;
    background: light-dark(#ebedf0, #232529);
    /* The cylinder darkens as it turns away at both ends. */
    box-shadow: inset 34px 0 18px -14px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.55)), inset -34px 0 18px -14px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.55));
  }
  .slider-thumbwheel__wheel::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 15%, light-dark(color-mix(in oklab, light-dark(#fbfcfd, #121417) 55%, transparent), color-mix(in oklab, light-dark(#373a40, #f1f2f3) 9%, transparent)) 35%, transparent 60%);
    pointer-events: none;
  }
  .slider-thumbwheel__svg { display: block; }
  .slider-thumbwheel__notch { position: absolute; left: ${W / 2 - 4}px; top: 22px; border: 4px solid transparent; border-top-color: light-dark(#373a40, #f1f2f3); border-bottom-width: 0; }
  .slider-thumbwheel:focus-visible .slider-thumbwheel__slot { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .slider-thumbwheel__range { position: absolute; left: ${(W - WHEEL) / 2}px; top: 74px; width: ${WHEEL}px; height: 1px; background: light-dark(#dbdde1, #2e3035); }
  .slider-thumbwheel__zero { position: absolute; left: 50%; top: -2px; width: 1px; height: 5px; background: light-dark(#6d7179, #7d8087); }
  .slider-thumbwheel__at {
    position: absolute;
    top: -2px;
    left: var(--slider-thumbwheel-at);
    width: 5px;
    height: 5px;
    margin-left: -2.5px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
  }
`;

export function ThumbwheelSlider() {
  const [pos, setPos] = useState(2);
  const drag = useRef<{ x: number; from: number } | null>(null);
  const raf = useRef(0);
  // The stop it is resting on or settling into; while dragging, the stop under the notch.
  const goal = useRef(2);
  const value = drag.current ? clamp(Math.round(pos), MIN, MAX) : goal.current;

  // Lets go into the nearest click stop, the way a detented wheel does.
  const settle = (to: number) => {
    cancelAnimationFrame(raf.current);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setPos(to);
    let x = pos;
    let v = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      v += (-500 * (x - to) - 32 * v) * dt;
      x += v * dt;
      if (Math.abs(x - to) < 0.002 && Math.abs(v) < 0.01) return setPos(to);
      setPos(x);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    cancelAnimationFrame(raf.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, from: pos };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    // The surface moves with your finger: drag right and the wheel turns up through the stops.
    setPos(clamp(d.from + (e.clientX - d.x) / PX, MIN - 0.4, MAX + 0.4));
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    goal.current = value;
    settle(value);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: value + 1, ArrowUp: value + 1, ArrowLeft: value - 1, ArrowDown: value - 1, PageUp: value + 3, PageDown: value - 3, Home: MIN, End: MAX }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    goal.current = clamp(next, MIN, MAX);
    settle(goal.current);
  };

  const phi = pos * STEP;
  const ridges = Array.from({ length: RIDGES }, (_, i) => {
    const a = ((((i * STEP + phi) % 360) + 540) % 360) - 180;
    if (Math.abs(a) > 86) return null;
    const c = Math.cos((a * Math.PI) / 180);
    const w = 0.4 + 2.6 * c;
    const x = WHEEL / 2 + (WHEEL / 2) * Math.sin((a * Math.PI) / 180);
    return <rect key={i} x={x - w / 2} y={2} width={w} height={22} rx={w / 2} style={{ fill: `color-mix(in oklab, light-dark(#50535b, #c6c8cd) ${Math.round(c * 85)}%, light-dark(#dbdde1, #2e3035))` }} />;
  });
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="slider-thumbwheel"
        role="slider"
        tabIndex={0}
        aria-label="Exposure"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={value}
        aria-valuetext={`${ev(value)} EV`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        style={{ '--slider-thumbwheel-at': `${((value - MIN) / (MAX - MIN)) * 100}%` } as React.CSSProperties}
      >
        <div className="slider-thumbwheel__head" aria-hidden="true">
          <span>Exposure</span>
          <span className="slider-thumbwheel__value">{ev(value)} EV</span>
        </div>
        <div className="slider-thumbwheel__slot" aria-hidden="true">
          <div className="slider-thumbwheel__wheel">
            <svg className="slider-thumbwheel__svg" width={WHEEL} height={26}>
              {ridges}
            </svg>
          </div>
        </div>
        <span className="slider-thumbwheel__notch" aria-hidden="true" />
        <span className="slider-thumbwheel__range" aria-hidden="true">
          <span className="slider-thumbwheel__zero" />
          <span className="slider-thumbwheel__at" />
        </span>
      </div>
    </>
  );
}
