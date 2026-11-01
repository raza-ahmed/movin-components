"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const W = 240;
const MID = 52;

const css = `
  .slider-lift { position: relative; width: ${W}px; height: 76px; }
  .slider-lift__rail { position: absolute; left: 0; right: 0; top: ${MID - 2}px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-lift__fill { position: absolute; left: 0; top: ${MID - 2}px; height: 4px; border-radius: 2px; width: var(--slider-lift-x); background: light-dark(#50535b, #c6c8cd); }
  /* Zero height, so the shadow is all blur: an oval on the track under the thumb. */
  .slider-lift__shadow {
    position: absolute;
    top: ${MID + 12}px;
    left: calc(var(--slider-lift-x) - 8px);
    width: 16px;
    height: 0;
    border-radius: 50%;
    box-shadow: 0 0 4px 3px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5));
    transition: box-shadow 0.4s cubic-bezier(0.3, 1.2, 0.5, 1), transform 0.4s cubic-bezier(0.3, 1.2, 0.5, 1);
  }
  .slider-lift__thumb {
    position: absolute;
    top: ${MID - 15}px;
    left: calc(var(--slider-lift-x) - 10px);
    width: 20px;
    height: 30px;
    transform-origin: 50% 30%;
    transform: translateY(var(--slider-lift-up, 0px)) rotate(var(--slider-lift-tilt)) scale(var(--slider-lift-s, 1));
    transition: transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
  .slider-lift__body {
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: inset 0 -2px 0 color-mix(in oklab, light-dark(#6d7179, #7d8087) 35%, transparent);
    transform-origin: 50% 100%;
  }
  .slider-lift__body::after { content: ''; position: absolute; left: 6px; right: 6px; top: 14px; height: 2px; border-radius: 1px; background: light-dark(#cbced3, #393c41); }
  .slider-lift__ripple {
    position: absolute;
    top: ${MID - 6}px;
    left: calc(var(--slider-lift-x) - 18px);
    width: 36px;
    height: 12px;
    border-radius: 50%;
    border: 1.5px solid light-dark(#5f626a, #a7abb2);
    opacity: 0;
    animation: slider-lift-ripple 0.6s ease-out 0.12s;
  }
  @keyframes slider-lift-ripple {
    from { opacity: 0.7; transform: scale(0.5); }
    to { opacity: 0; transform: scale(2.1); }
  }
  .slider-lift__value {
    position: absolute;
    top: 0;
    left: var(--slider-lift-x);
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: light-dark(#42454c, #e5e6e9);
    opacity: 0;
    transform: translateX(-50%) translateY(6px);
    transition: opacity 0.2s, transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
  .slider-lift--held {
    --slider-lift-up: -14px;
    --slider-lift-s: 1.08;
  }
  .slider-lift--held .slider-lift__shadow { box-shadow: 0 0 9px 5px light-dark(rgba(0, 0, 0, 0.07), rgba(0, 0, 0, 0.3)); transform: scaleX(1.5); }
  .slider-lift--held .slider-lift__value { opacity: 1; transform: translateX(-50%); }
  .slider-lift:has(.slider-lift__input:focus-visible) .slider-lift__body { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-lift__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: grab; -webkit-appearance: none; appearance: none; background: none; }
  .slider-lift__input:active { cursor: grabbing; }
  .slider-lift__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 40px; }
  .slider-lift__input::-moz-range-thumb { width: 20px; height: 40px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-lift__thumb, .slider-lift__shadow { transition: none; }
    .slider-lift__ripple { display: none; }
  }
`;

export function LiftSlider() {
  const [v, setV] = useState(60);
  const [held, setHeld] = useState(false);
  const [tilt, setTilt] = useState(0);
  const [drops, setDrops] = useState(0);
  const body = useRef<HTMLSpanElement>(null);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const x = 10 + (v / 100) * (W - 20);

  const pickUp = () => {
    setHeld(true);
    const drop = () => {
      setHeld(false);
      setTilt(0);
      removeEventListener('pointerup', drop);
      removeEventListener('pointercancel', drop);
      if (still()) return;
      setDrops((d) => d + 1);
      // Lands with a squash, timed to meet the track as the lift springs back.
      body.current?.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.16, 0.82)', offset: 0.35 },
          { transform: 'scale(0.96, 1.05)', offset: 0.7 },
          { transform: 'scale(1)' },
        ],
        { duration: 420, delay: 110, easing: 'ease-out' },
      );
    };
    addEventListener('pointerup', drop);
    addEventListener('pointercancel', drop);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div
        className={`slider-lift${held ? ' slider-lift--held' : ''}`}
        style={{ '--slider-lift-x': `${x}px`, '--slider-lift-tilt': `${tilt}deg` } as React.CSSProperties}
      >
        <span className="slider-lift__rail" aria-hidden="true" />
        <span className="slider-lift__fill" aria-hidden="true" />
        {drops > 0 && <span key={drops} className="slider-lift__ripple" aria-hidden="true" />}
        <span className="slider-lift__shadow" aria-hidden="true" />
        <span className="slider-lift__thumb" aria-hidden="true">
          <span ref={body} className="slider-lift__body" />
        </span>
        <span className="slider-lift__value" aria-hidden="true">
          {v}
        </span>
        <input
          className="slider-lift__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            const next = +e.target.value;
            // Held up, the thumb swings back against the drag, then hangs straight once you pause.
            if (held && !still()) setTilt(Math.max(-18, Math.min(18, (next - v) * 2.4)));
            setV(next);
            clearTimeout(settle.current);
            settle.current = setTimeout(() => setTilt(0), 100);
          }}
          onPointerDown={pickUp}
          aria-label="Opacity"
          aria-valuetext={`${v}%`}
        />
      </div>
    </>
  );
}
