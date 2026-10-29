"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .field-elastic { user-select: none; -webkit-user-select: none; width: 240px; }
  .field-elastic__label { display: block; margin-bottom: 30px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-elastic__rail { position: relative; height: 28px; margin: 0 12px; cursor: pointer; touch-action: none; outline: none; }
  .field-elastic__rail:focus-visible .field-elastic__thumb { box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f), 0 0 0 5px light-dark(#5f626a, #a7abb2); }
  .field-elastic__track { position: absolute; top: 12px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .field-elastic__fill { position: absolute; left: 0; top: 12px; height: 4px; border-radius: 2px; background: light-dark(#42454c, #e5e6e9); }
  .field-elastic__thumb {
    position: absolute;
    top: 3px;
    width: 22px;
    height: 22px;
    margin-left: -11px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f), 0 2px 6px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
  }
  .field-elastic__bubble {
    position: absolute;
    bottom: 32px;
    min-width: 34px;
    margin-left: -17px;
    padding: 3px 6px;
    border-radius: 6px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-family: inherit; font-size: 11px; font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-align: center;
    transform-origin: 50% 130%;
  }
  .field-elastic__bubble::after { content: ''; position: absolute; left: 50%; bottom: -4px; margin-left: -4px; border: 4px solid transparent; border-bottom: 0; border-top-color: light-dark(#373a40, #f1f2f3); }
  .field-elastic__ends { display: flex; justify-content: space-between; margin: 6px 4px 0; color: light-dark(#5f626a, #a7abb2); }
  .field-elastic__ends svg { width: 16px; height: 16px; }
`;

const W = 216;

export function ElasticInput() {
  const rail = useRef<HTMLDivElement>(null);
  const els = useRef<{ track: HTMLSpanElement | null; fill: HTMLSpanElement | null; thumb: HTMLSpanElement | null; bubble: HTMLSpanElement | null }>({ track: null, fill: null, thumb: null, bubble: null });
  const sim = useRef({ value: 0.6, rubber: 0, rubberV: 0, x: 0.6 * W, vx: 0, drag: false, lastX: 0, lastT: 0 });
  const [value, setValue] = useState(0.6);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = sim.current;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!s.drag) {
        // Let go past an end: the band snaps back with a wobble.
        if (still) s.rubber = 0;
        else {
          s.rubberV += (-s.rubber * 420 - s.rubberV * 14) * dt;
          s.rubber += s.rubberV * dt;
        }
        s.vx *= 0.85;
      }
      const { track, fill, thumb, bubble } = els.current;
      const r = s.rubber;
      const x = s.value * W + r;
      // The track stretches at whichever end is pulled, and thins as it does.
      track!.style.left = `${Math.min(0, r)}px`;
      track!.style.width = `${W + Math.abs(r)}px`;
      track!.style.transform = `scaleY(${Math.max(0.4, 1 - Math.abs(r) / 50)})`;
      fill!.style.width = `${Math.max(0, x)}px`;
      fill!.style.left = r < 0 ? `${r}px` : '0px';
      if (r < 0) fill!.style.width = `${Math.max(0, x - r)}px`;
      const squash = Math.min(0.45, Math.abs(s.vx) / 2400);
      thumb!.style.left = `${x}px`;
      thumb!.style.transform = still ? '' : `scale(${1 + squash}, ${1 - squash * 0.7})`;
      bubble!.style.left = `${x}px`;
      bubble!.style.transform = still ? '' : `rotate(${Math.max(-24, Math.min(24, -s.vx / 60))}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const move = (clientX: number) => {
    const s = sim.current;
    const r = rail.current!.getBoundingClientRect();
    const px = clientX - r.left;
    const now = performance.now();
    if (s.lastT) s.vx = ((clientX - s.lastX) / Math.max(1, now - s.lastT)) * 1000;
    s.lastX = clientX;
    s.lastT = now;
    const over = px < 0 ? px : px > W ? px - W : 0;
    // Rubber-band resistance: the further you pull, the less it gives.
    s.rubber = Math.sign(over) * 34 * (1 - Math.exp(-Math.abs(over) / 40));
    s.value = Math.max(0, Math.min(1, px / W));
    setValue(s.value);
  };

  const pct = Math.round(value * 100);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-elastic">
        <span id="field-elastic-label" className="field-elastic__label">
          Volume
        </span>
        <div
          ref={rail}
          className="field-elastic__rail"
          role="slider"
          tabIndex={0}
          aria-labelledby="field-elastic-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-valuetext={`${pct}%`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            sim.current.drag = true;
            sim.current.lastT = 0;
            move(e.clientX);
          }}
          onPointerMove={(e) => sim.current.drag && move(e.clientX)}
          onPointerUp={() => {
            sim.current.drag = false;
            sim.current.rubberV = 0;
          }}
          onKeyDown={(e) => {
            const step = { ArrowRight: 0.05, ArrowUp: 0.05, ArrowLeft: -0.05, ArrowDown: -0.05 }[e.key];
            if (!step) return;
            e.preventDefault();
            const s = sim.current;
            const next = s.value + step;
            // Pressing past an end gives the band a little kick instead.
            if (next < 0 || next > 1) s.rubberV += Math.sign(step) * 260;
            s.value = Math.max(0, Math.min(1, next));
            setValue(s.value);
          }}
        >
          <span ref={(el) => void (els.current.track = el)} className="field-elastic__track" />
          <span ref={(el) => void (els.current.fill = el)} className="field-elastic__fill" />
          <span ref={(el) => void (els.current.bubble = el)} className="field-elastic__bubble" aria-hidden="true">
            {pct}%
          </span>
          <span ref={(el) => void (els.current.thumb = el)} className="field-elastic__thumb" />
        </div>
        <div className="field-elastic__ends" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 9h4l5-4v14l-5-4H4z" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
          </svg>
        </div>
      </div>
    </>
  );
}
