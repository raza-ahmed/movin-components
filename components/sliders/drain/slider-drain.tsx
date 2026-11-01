"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const W = 240;
const SEGMENTS = 10;
const GAP = 2;
const PERIOD = (W + GAP) / SEGMENTS;

const css = `
  .slider-drain { position: relative; width: ${W}px; }
  .slider-drain__head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-drain__head b { font-weight: 500; font-variant-numeric: tabular-nums; color: light-dark(#42454c, #e5e6e9); }
  .slider-drain__bar {
    position: relative;
    height: 12px;
    border-radius: 3px;
    -webkit-mask-image: repeating-linear-gradient(90deg, #000 0 ${PERIOD - GAP}px, transparent ${PERIOD - GAP}px ${PERIOD}px);
    mask-image: repeating-linear-gradient(90deg, #000 0 ${PERIOD - GAP}px, transparent ${PERIOD - GAP}px ${PERIOD}px);
  }
  .slider-drain__track, .slider-drain__ghost, .slider-drain__main, .slider-drain__flash { position: absolute; top: 0; bottom: 0; left: 0; }
  .slider-drain__track { right: 0; background: light-dark(#ebedf0, #232529); }
  .slider-drain__ghost { background: light-dark(#6d7179, #7d8087); }
  .slider-drain__main { background: light-dark(#373a40, #f1f2f3); }
  .slider-drain__flash { background: light-dark(#373a40, #f1f2f3); animation: slider-drain-flash 0.45s ease-out forwards; }
  @keyframes slider-drain-flash {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  .slider-drain__handle {
    position: absolute;
    bottom: -6px;
    left: calc(var(--slider-drain-v) * 1% - 2px);
    width: 4px;
    height: 24px;
    border-radius: 2px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 0 2px light-dark(#fbfcfd, #121417);
    transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-drain:has(.slider-drain__input:active) .slider-drain__handle { transform: scaleY(1.2); }
  .slider-drain:has(.slider-drain__input:focus-visible) .slider-drain__handle { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .slider-drain__input { position: absolute; left: 0; bottom: -12px; width: 100%; height: 36px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-drain__input::-webkit-slider-thumb { -webkit-appearance: none; width: 2px; height: 36px; }
  .slider-drain__input::-moz-range-thumb { width: 2px; height: 36px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-drain__ghost, .slider-drain__main, .slider-drain__handle { transition: none !important; }
    .slider-drain__flash { display: none; }
  }
`;

export function DrainSlider() {
  const [hp, setHp] = useState({ v: 72, dir: 0 });
  const [hit, setHit] = useState({ n: 0, from: 0, to: 0 });
  const bar = useRef<HTMLDivElement>(null);
  const { v, dir } = hp;
  // Losing: the bar drops at once and the lost chunk drains after a beat. Gaining: the ghost leads and the bar fills up to it.
  const main = dir < 0 ? 'width 0.06s linear' : 'width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.25s';
  const ghost = dir < 0 ? 'width 0.55s cubic-bezier(0.4, 0, 0.2, 1) 0.45s' : 'width 0.06s linear';
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-drain" style={{ '--slider-drain-v': v } as React.CSSProperties}>
        <div className="slider-drain__head" aria-hidden="true">
          <span>Health</span>
          <span>
            <b>{v}</b> / 100
          </span>
        </div>
        <div ref={bar} className="slider-drain__bar" aria-hidden="true">
          <span className="slider-drain__track" />
          <span className="slider-drain__ghost" style={{ width: `${v}%`, transition: ghost }} />
          <span className="slider-drain__main" style={{ width: `${v}%`, transition: main }} />
          {hit.n > 0 && <span key={hit.n} className="slider-drain__flash" style={{ left: `${hit.to}%`, width: `${hit.from - hit.to}%` }} />}
        </div>
        <span className="slider-drain__handle" aria-hidden="true" />
        <input
          className="slider-drain__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            const next = +e.target.value;
            if (next < v) {
              setHit((h) => ({ n: h.n + 1, from: v, to: next }));
              // A big hit jolts the bar.
              if (v - next >= 15 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
                bar.current?.animate(
                  [{ transform: 'none' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(-1px)' }, { transform: 'none' }],
                  { duration: 260, easing: 'ease-out' },
                );
              }
            }
            setHp({ v: next, dir: Math.sign(next - v) });
          }}
          aria-label="Health"
          aria-valuetext={`${v} of 100`}
        />
      </div>
    </>
  );
}
