"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const MID = 22;
const GAP = 8;
const AMP = 3.5;
const LENGTH = 210;

const css = `
  .slider-squiggle { position: relative; width: ${W}px; }
  .slider-squiggle__svg { display: block; width: ${W}px; height: 44px; overflow: visible; }
  .slider-squiggle__wave { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
  .slider-squiggle__rest { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 4; stroke-linecap: round; }
  .slider-squiggle__handle {
    position: absolute;
    top: ${MID - 14}px;
    left: calc(var(--slider-squiggle-x) * 1px - 3px);
    width: 6px;
    height: 28px;
    border-radius: 3px;
    background: light-dark(#373a40, #f1f2f3);
    transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-squiggle:has(.slider-squiggle__input:active) .slider-squiggle__handle { transform: scaleY(1.28); }
  .slider-squiggle:has(.slider-squiggle__input:focus-visible) .slider-squiggle__handle { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-squiggle__times { display: flex; justify-content: space-between; margin-top: 2px; font-size: 12px; font-variant-numeric: tabular-nums; color: light-dark(#5f626a, #a7abb2); }
  .slider-squiggle__input { position: absolute; left: 0; top: 0; width: 100%; height: 44px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-squiggle__input::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 44px; }
  .slider-squiggle__input::-moz-range-thumb { width: 16px; height: 44px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-squiggle__handle { transition: none; }
  }
`;

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const spoken = (s: number) => `${Math.floor(s / 60)} min ${s % 60} s`;

/** The played part as a sine that eases to flat at both ends, so it meets the handle level. */
function wave(end: number, amp: number, phase: number) {
  if (end < 4) return '';
  let d = '';
  for (let x = 2; ; x += 1.5) {
    const at = Math.min(x, end);
    const ease = Math.min(1, (at - 2) / 8, (end - at) / 12);
    const y = MID + amp * Math.sin((Math.max(0, ease) * Math.PI) / 2) * Math.sin(at / 3.6 - phase);
    d += `${d ? 'L' : 'M'}${at.toFixed(1)} ${y.toFixed(2)}`;
    if (at === end) return d;
  }
}

export function SquiggleSlider() {
  const [s, setS] = useState(84);
  const path = useRef<SVGPathElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const live = useRef({ x: 0, held: false, paint: () => {} });
  const x = 4 + (s / LENGTH) * (W - 8);
  live.current.x = x;

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let amp = AMP;
    let phase = 0;
    let last = performance.now();
    let raf = 0;
    const paint = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = live.current.held ? 0 : AMP;
      // Flattens while held so you can aim, ripples back on release.
      amp = still ? target : amp + (target - amp) * (1 - Math.exp(-dt * 9));
      if (!still) phase += dt * 3.2;
      path.current?.setAttribute('d', wave(live.current.x - GAP, amp, phase));
    };
    live.current.paint = paint;
    paint();
    if (still) return;
    const loop = () => {
      paint();
      raf = requestAnimationFrame(loop);
    };
    // Only animate while on screen.
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(root.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => live.current.paint(), [x]);

  const hold = () => {
    live.current.held = true;
    live.current.paint();
    const up = () => {
      live.current.held = false;
      live.current.paint();
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
    };
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div ref={root} className="slider-squiggle" style={{ '--slider-squiggle-x': x } as React.CSSProperties}>
        <svg className="slider-squiggle__svg" aria-hidden="true">
          <path ref={path} className="slider-squiggle__wave" />
          {x + GAP < W - 2 && <line className="slider-squiggle__rest" x1={x + GAP} y1={MID} x2={W - 2} y2={MID} />}
        </svg>
        <span className="slider-squiggle__handle" aria-hidden="true" />
        <input
          className="slider-squiggle__input"
          type="range"
          min={0}
          max={LENGTH}
          value={s}
          onChange={(e) => setS(+e.target.value)}
          onPointerDown={hold}
          aria-label="Playback position"
          aria-valuetext={`${spoken(s)} of ${spoken(LENGTH)}`}
        />
        <div className="slider-squiggle__times" aria-hidden="true">
          <span>{clock(s)}</span>
          <span>{clock(LENGTH)}</span>
        </div>
      </div>
    </>
  );
}
