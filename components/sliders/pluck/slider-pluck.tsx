"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const Y = 34;
const PEG = 5;

const css = `
  .slider-pluck { position: relative; width: ${W}px; height: 68px; }
  .slider-pluck__svg { display: block; width: ${W}px; height: 68px; overflow: visible; }
  .slider-pluck__on { stroke: light-dark(#42454c, #e5e6e9); stroke-width: 2.5; stroke-linecap: round; }
  .slider-pluck__off { stroke: light-dark(#cbced3, #393c41); stroke-width: 2; stroke-linecap: round; }
  .slider-pluck__peg { fill: light-dark(#6d7179, #7d8087); }
  .slider-pluck__bead { fill: light-dark(#373a40, #f1f2f3); filter: drop-shadow(0 2px 3px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5))); }
  .slider-pluck__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-pluck:has(.slider-pluck__input:focus-visible) .slider-pluck__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-pluck__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: grab; -webkit-appearance: none; appearance: none; background: none; }
  .slider-pluck__input:active { cursor: grabbing; }
  .slider-pluck__input::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; }
  .slider-pluck__input::-moz-range-thumb { width: 24px; height: 24px; border: 0; }
`;

export function PluckSlider() {
  const [v, setV] = useState(40);
  const [sag, setSag] = useState(0);
  // The bead's height on the string as a lightly damped spring: pressing bends it, letting go twangs it.
  const sim = useRef({ y: 0, vy: 0, target: 0, raf: 0, still: false });

  useEffect(() => {
    sim.current.still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    return () => cancelAnimationFrame(sim.current.raf);
  }, []);

  const run = () => {
    const s = sim.current;
    if (s.still) {
      s.y = s.target;
      setSag(s.y);
      return;
    }
    if (s.raf) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      for (let i = 0; i < 4; i++) {
        const a = -1200 * (s.y - s.target) - 7 * s.vy;
        s.vy += (a * dt) / 4;
        s.y += (s.vy * dt) / 4;
      }
      if (Math.abs(s.y - s.target) < 0.04 && Math.abs(s.vy) < 0.6) {
        s.y = s.target;
        s.vy = 0;
        s.raf = 0;
        setSag(s.y);
        return;
      }
      setSag(s.y);
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  };

  const press = (e: React.PointerEvent) => {
    const y0 = e.clientY;
    sim.current.target = 7;
    run();
    // Pull up or down while holding to bend the string further.
    const move = (m: PointerEvent) => {
      sim.current.target = Math.max(-16, Math.min(18, 7 + (m.clientY - y0) * 0.8));
      run();
    };
    const up = () => {
      sim.current.target = 0;
      run();
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  };

  const bx = 20 + (v / 100) * (W - 40);
  const by = Y + sag;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-pluck">
        <svg className="slider-pluck__svg" aria-hidden="true">
          <line className="slider-pluck__off" x1={bx} y1={by} x2={W - PEG} y2={Y} />
          <line className="slider-pluck__on" x1={PEG} y1={Y} x2={bx} y2={by} />
          <circle className="slider-pluck__peg" cx={PEG} cy={Y} r={3.5} />
          <circle className="slider-pluck__peg" cx={W - PEG} cy={Y} r={3.5} />
          <circle className="slider-pluck__bead" cx={bx} cy={by} r={9} />
          <circle className="slider-pluck__ring" cx={bx} cy={by} r={13} />
        </svg>
        <input
          className="slider-pluck__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          onPointerDown={press}
          onKeyDown={(e) => {
            // A light pluck on every key step.
            if (/^Arrow|^Page|^Home$|^End$/.test(e.key) && !sim.current.still) {
              sim.current.vy += 70;
              run();
            }
          }}
          aria-label="Tension"
        />
      </div>
    </>
  );
}
