"use client";

import { useRef, useState } from 'react';

const W = 240;
const TICKS = 41;
const PITCH = W / (TICKS - 1);
const BASE = 60;

const css = `
  .slider-comb { position: relative; width: ${W}px; height: 68px; }
  .slider-comb__tick {
    position: absolute;
    bottom: ${68 - BASE}px;
    width: 2px;
    border-radius: 1px;
    transform-origin: 50% 100%;
    transition: height 0.32s cubic-bezier(0.3, 1.35, 0.5, 1), transform 0.5s cubic-bezier(0.3, 1.6, 0.5, 1), background-color 0.2s;
  }
  .slider-comb__value {
    position: absolute;
    left: 0;
    padding: 1px 5px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: light-dark(#42454c, #e5e6e9);
    transition: bottom 0.32s cubic-bezier(0.3, 1.35, 0.5, 1);
  }
  .slider-comb:has(.slider-comb__input:focus-visible) .slider-comb__value { outline: 2px solid light-dark(#50535b, #c6c8cd); }
  .slider-comb__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-comb__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 68px; }
  .slider-comb__input::-moz-range-thumb { width: 12px; height: 68px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-comb__tick, .slider-comb__value { transition: none; }
  }
`;

export function CombSlider() {
  const [v, setV] = useState(50);
  const [held, setHeld] = useState(false);
  const [lean, setLean] = useState(0);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  const t = 6 + (v / 100) * (W - 12);
  const peak = held ? 30 : 22;
  const spread = held ? 18 : 13;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-comb">
        {Array.from({ length: TICKS }, (_, i) => {
          const x = i * PITCH;
          // A bell of ticks around the thumb, like a magnified dock.
          const g = Math.exp(-(((x - t) / spread) ** 2));
          return (
            <span
              key={i}
              className="slider-comb__tick"
              aria-hidden="true"
              style={{
                left: x - 1,
                height: 8 + peak * g,
                background: x <= t ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(#cbced3, #393c41)',
                transform: `rotate(${(lean * g).toFixed(2)}deg)`,
              }}
            />
          );
        })}
        <span
          className="slider-comb__value"
          aria-hidden="true"
          style={{ bottom: 68 - BASE + 8 + peak + 6, transform: `translateX(calc(${t}px - 50%))` }}
        >
          {v}
        </span>
        <input
          className="slider-comb__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            const next = +e.target.value;
            // Ticks near the thumb lean the way you drag, harder the faster you go, then stand back up.
            if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setLean(Math.max(-22, Math.min(22, (next - v) * 3)));
            setV(next);
            clearTimeout(settle.current);
            settle.current = setTimeout(() => setLean(0), 110);
          }}
          onPointerDown={() => {
            setHeld(true);
            const up = () => {
              setHeld(false);
              removeEventListener('pointerup', up);
              removeEventListener('pointercancel', up);
            };
            addEventListener('pointerup', up);
            addEventListener('pointercancel', up);
          }}
          aria-label="Level"
        />
      </div>
    </>
  );
}
