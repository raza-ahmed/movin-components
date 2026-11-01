"use client";

import { useRef, useState } from 'react';

const W = 240;
const L = 8;
const TW = W - 16;
const G = 6;
const Y = 22;
const NAMES = ['Design', 'Build', 'Test', 'Ship'];
const x = (n: number) => L + (n / 100) * TW;

const css = `
  .slider-push { position: relative; width: ${W}px; height: 74px; }
  .slider-push__seg { position: absolute; top: ${Y - 5}px; height: 10px; border-radius: 5px; }
  .slider-push__seg--0 { background: light-dark(#42454c, #e5e6e9); }
  .slider-push__seg--1 { background: light-dark(#5f626a, #a7abb2); }
  .slider-push__seg--2 { background: light-dark(#cbced3, #393c41); }
  .slider-push__seg--3 { background: light-dark(#dbdde1, #2e3035); }
  .slider-push__thumb {
    position: absolute;
    top: ${Y - 14}px;
    width: 6px;
    height: 28px;
    margin-left: -3px;
    border-radius: 3px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 1px 4px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.5));
    cursor: grab;
    touch-action: none;
    transition: transform 0.22s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-push__thumb::before { content: ''; position: absolute; inset: -8px -9px; }
  .slider-push__thumb:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-push__thumb--touch { transform: scale(0.55, 1.1); }
  .slider-push__label { position: absolute; top: ${Y + 14}px; transform: translateX(-50%); font-size: 11px; line-height: 1.3; text-align: center; color: light-dark(#5f626a, #a7abb2); white-space: nowrap; }
  .slider-push__label b { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
  @media (prefers-reduced-motion: reduce) {
    .slider-push__thumb { transition: none; }
  }
`;

// Move one divider and shove its neighbours along, never letting a segment drop below G.
function shove(p: number[], i: number, to: number) {
  const n = p.slice();
  n[i] = Math.round(Math.min(100 - (3 - i) * G, Math.max((i + 1) * G, to)));
  for (let j = i + 1; j < 3; j++) n[j] = Math.max(n[j], n[j - 1] + G);
  for (let j = i - 1; j >= 0; j--) n[j] = Math.min(n[j], n[j + 1] - G);
  return n;
}

export function PushSlider() {
  const [vals, setVals] = useState([25, 65, 85]);
  const box = useRef<HTMLDivElement>(null);
  const bounds = [0, ...vals, 100];
  const move = (i: number, to: number) => setVals((p) => shove(p, i, to));

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-push" ref={box}>
        {NAMES.map((name, j) => {
          const a = x(bounds[j]) + (j ? 4 : 0);
          const b = x(bounds[j + 1]) - (j < 3 ? 4 : 0);
          const wide = b - a;
          const pct = bounds[j + 1] - bounds[j];
          return (
            <span key={name}>
              <span className={`slider-push__seg slider-push__seg--${j}`} style={{ left: a, width: wide }} aria-hidden="true" />
              {wide >= 18 && (
                <span className="slider-push__label" style={{ left: (a + b) / 2 }} aria-hidden="true">
                  {wide >= 40 ? name : ' '}
                  <b>{pct}%</b>
                </span>
              )}
            </span>
          );
        })}
        {vals.map((n, i) => (
          <span
            key={i}
            className={`slider-push__thumb${vals[i + 1] - n <= G || n - (vals[i - 1] ?? -99) <= G ? ' slider-push__thumb--touch' : ''}`}
            style={{ left: x(n) }}
            role="slider"
            tabIndex={0}
            aria-label={`${NAMES[i]} and ${NAMES[i + 1]}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={n}
            aria-valuetext={`${NAMES[i]} ends at ${n}%`}
            onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const r = box.current!.getBoundingClientRect();
              move(i, ((e.clientX - r.left - L) / TW) * 100);
            }}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 10 : 1;
              const by: Record<string, number> = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 10, PageDown: -10 };
              if (e.key === 'Home') move(i, 0);
              else if (e.key === 'End') move(i, 100);
              else if (by[e.key]) move(i, n + by[e.key]);
              else return;
              e.preventDefault();
            }}
          />
        ))}
      </div>
    </>
  );
}
