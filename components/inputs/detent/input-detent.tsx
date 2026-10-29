"use client";

import { useRef, useState } from 'react';

const css = `
  @keyframes field-detent-click { from { transform: scale(2.4); opacity: 0.9; } to { transform: scale(1); opacity: 0; } }
  @keyframes field-detent-name { from { opacity: 0; transform: translateY(6px); } }
  .field-detent { user-select: none; -webkit-user-select: none; width: 240px; }
  .field-detent__head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; }
  .field-detent__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-detent__name { color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; animation: field-detent-name 0.25s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .field-detent__rail { position: relative; height: 24px; margin: 0 10px; cursor: pointer; touch-action: none; }
  .field-detent__rail:focus-visible { outline: none; }
  .field-detent__rail:focus-visible .field-detent__thumb { box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f), 0 0 0 5px light-dark(#5f626a, #a7abb2); }
  .field-detent__line { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .field-detent__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#50535b, #c6c8cd); }
  .field-detent__stop { position: absolute; top: 8px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); transition: background-color 0.2s; }
  .field-detent__stop[data-on] { background: light-dark(#50535b, #c6c8cd); }
  .field-detent__ring { position: absolute; inset: 0; border-radius: 50%; border: 1.5px solid light-dark(#373a40, #f1f2f3); opacity: 0; animation: field-detent-click 0.4s ease-out; }
  .field-detent__thumb {
    position: absolute;
    top: 2px;
    width: 20px;
    height: 20px;
    margin-left: -10px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f), 0 2px 6px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
  }
  .field-detent__thumb, .field-detent__fill { transition: left 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .field-detent__rail[data-drag] .field-detent__thumb, .field-detent__rail[data-drag] .field-detent__fill { transition: none; }
  .field-detent__ticks { display: flex; justify-content: space-between; margin: 8px 2px 0; }
  .field-detent__ticks span { width: 20px; color: light-dark(#5f626a, #a7abb2); font-size: 11px; text-align: center; transition: color 0.2s; }
  .field-detent__ticks span[data-on] { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  @media (prefers-reduced-motion: reduce) {
    .field-detent__thumb, .field-detent__fill { transition-duration: 0.01s; }
    .field-detent__ring, .field-detent__name { animation: none; }
  }
`;

const STOPS = ['XS', 'S', 'M', 'L', 'XL'];
const NAMES = ['Extra small', 'Small', 'Medium', 'Large', 'Extra large'];
const LAST = STOPS.length - 1;

/** Sticky near each stop, quick between them: the thumb drags against a detent. */
const magnet = (raw: number) => {
  const s = raw * LAST;
  const n = Math.round(s);
  const d = s - n;
  return (n + Math.sign(d) * Math.pow(Math.abs(d) * 2, 2.4) / 2) / LAST;
};

export function DetentInput() {
  const rail = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(2);
  const [drag, setDrag] = useState<number | null>(null);
  const [clicks, setClicks] = useState(0);

  const set = (i: number) => {
    const n = Math.max(0, Math.min(LAST, i));
    if (n !== index) setClicks((c) => c + 1);
    setIndex(n);
  };
  const at = (clientX: number) => {
    const r = rail.current!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width));
  };
  const pos = drag === null ? index / LAST : magnet(drag);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-detent">
        <div className="field-detent__head">
          <span id="field-detent-label" className="field-detent__label">
            Size
          </span>
          <span key={index} className="field-detent__name">
            {NAMES[index]}
          </span>
        </div>
        <div
          ref={rail}
          className="field-detent__rail"
          role="slider"
          tabIndex={0}
          aria-labelledby="field-detent-label"
          aria-valuemin={0}
          aria-valuemax={LAST}
          aria-valuenow={index}
          aria-valuetext={NAMES[index]}
          data-drag={drag !== null || undefined}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const a = at(e.clientX);
            setDrag(a);
            set(Math.round(a * LAST));
          }}
          onPointerMove={(e) => {
            if (drag === null) return;
            const a = at(e.clientX);
            setDrag(a);
            set(Math.round(a * LAST));
          }}
          onPointerUp={() => setDrag(null)}
          onKeyDown={(e) => {
            const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
            if (step) {
              e.preventDefault();
              set(index + step);
            }
            if (e.key === 'Home') set(0);
            if (e.key === 'End') set(LAST);
          }}
        >
          <span className="field-detent__line" />
          <span className="field-detent__fill" style={{ width: `${pos * 100}%` }} />
          {STOPS.map((s, i) => (
            <span key={s} className="field-detent__stop" data-on={i <= index || undefined} style={{ left: `${(i / LAST) * 100}%` }}>
              {i === index && clicks > 0 && <span key={clicks} className="field-detent__ring" />}
            </span>
          ))}
          <span className="field-detent__thumb" style={{ left: `${pos * 100}%` }} />
        </div>
        <div className="field-detent__ticks" aria-hidden="true">
          {STOPS.map((s, i) => (
            <span key={s} data-on={i === index || undefined}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
