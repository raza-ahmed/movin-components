"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const T = 18;
const Y = 44;
const MAX = 1000;
const at = (n: number) => T / 2 + (n / MAX) * (W - T);

const css = `
  .slider-delta { position: relative; width: ${W}px; height: 76px; }
  .slider-delta__rail, .slider-delta__fill, .slider-delta__change { position: absolute; top: ${Y - 3}px; height: 6px; border-radius: 3px; }
  .slider-delta__rail { left: 0; width: ${W}px; background: light-dark(#ebedf0, #232529); }
  .slider-delta__fill { left: 0; background: light-dark(#42454c, #e5e6e9); }
  .slider-delta__change { box-sizing: border-box; }
  .slider-delta__change--up { background: repeating-linear-gradient(-45deg, light-dark(#50535b, #c6c8cd) 0 3px, light-dark(#6d7179, #7d8087) 3px 6px); }
  .slider-delta__change--down { border: 1px dashed light-dark(#5f626a, #a7abb2); }
  .slider-delta__ghost {
    position: absolute;
    top: ${Y - T / 2}px;
    width: ${T}px;
    height: ${T}px;
    margin-left: ${-T / 2}px;
    box-sizing: border-box;
    border: 1.5px dashed light-dark(#5f626a, #a7abb2);
    border-radius: 50%;
  }
  .slider-delta__bracket { position: absolute; top: 14px; height: 8px; box-sizing: border-box; border: 1.5px solid light-dark(#5f626a, #a7abb2); border-bottom: 0; }
  .slider-delta__label { position: absolute; top: -4px; transform: translateX(-50%); font-size: 12px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .slider-delta--settle .slider-delta__ghost,
  .slider-delta--settle .slider-delta__bracket,
  .slider-delta--settle .slider-delta__change,
  .slider-delta--settle .slider-delta__label {
    transition: left 0.45s cubic-bezier(0.3, 1.2, 0.5, 1), width 0.45s cubic-bezier(0.3, 1.2, 0.5, 1), opacity 0.45s;
    opacity: 0;
  }
  .slider-delta--settle .slider-delta__fill { transition: width 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .slider-delta__thumb { position: absolute; top: ${Y - T / 2}px; width: ${T}px; height: ${T}px; margin-left: ${-T / 2}px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 5px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5)); }
  .slider-delta:has(.slider-delta__input:focus-visible) .slider-delta__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-delta__value { position: absolute; left: 0; right: 0; top: ${Y + 16}px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-delta__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-delta__input { position: absolute; left: 0; top: ${Y - 18}px; width: 100%; height: 36px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-delta__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 36px; }
  .slider-delta__input::-moz-range-thumb { width: ${T}px; height: 36px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-delta--settle .slider-delta__ghost,
    .slider-delta--settle .slider-delta__bracket,
    .slider-delta--settle .slider-delta__change,
    .slider-delta--settle .slider-delta__label { transition: opacity 0.2s; }
    .slider-delta--settle .slider-delta__fill { transition: none; }
  }
`;

const money = (n: number) => `$${n}`;

export function DeltaSlider() {
  const [v, setV] = useState(480);
  const [start, setStart] = useState<number | null>(null);
  const [settle, setSettle] = useState(false);
  const timers = useRef({ key: 0, done: 0 });

  // A change starts when you grab the thumb (or press a key) and ends when you let go (or stop pressing).
  const begin = () => {
    clearTimeout(timers.current.done);
    setSettle(false);
    setStart((s) => (s === null || settle ? v : s));
  };
  const commit = () => {
    setSettle(true);
    timers.current.done = window.setTimeout(() => {
      setStart(null);
      setSettle(false);
    }, 460);
  };
  useEffect(() => {
    const t = timers.current;
    return () => {
      clearTimeout(t.key);
      clearTimeout(t.done);
    };
  }, []);

  const s = start ?? v;
  const x = at(v);
  // Settling, the ghost and the bracket collapse onto the thumb.
  const gx = settle ? x : at(s);
  const lo = Math.min(gx, x);
  const diff = v - s;
  const sign = diff > 0 ? '+' : diff < 0 ? '−' : '';

  return (
    <>
      <style>
        {css}
      </style>
      <div className={`slider-delta${settle ? ' slider-delta--settle' : ''}`}>
        <span className="slider-delta__rail" aria-hidden="true" />
        <span className="slider-delta__fill" style={{ width: settle ? x : Math.min(x, at(s)) }} aria-hidden="true" />
        {start !== null && (
          <>
            <span className={`slider-delta__change slider-delta__change--${diff >= 0 ? 'up' : 'down'}`} style={{ left: lo, width: Math.abs(x - gx) }} aria-hidden="true" />
            <span className="slider-delta__ghost" style={{ left: gx }} aria-hidden="true" />
            <span className="slider-delta__bracket" style={{ left: lo, width: Math.abs(x - gx) }} aria-hidden="true" />
            {diff !== 0 && (
              <span className="slider-delta__label" style={{ left: (gx + x) / 2 }} aria-hidden="true">
                {sign}
                {money(Math.abs(diff))}
              </span>
            )}
          </>
        )}
        <span className="slider-delta__thumb" style={{ left: x }} aria-hidden="true" />
        <p className="slider-delta__value" aria-hidden="true">
          <span>Budget</span>
          <b>{money(v)}</b>
        </p>
        <input
          className="slider-delta__input"
          type="range"
          min={0}
          max={MAX}
          step={10}
          value={v}
          onPointerDown={begin}
          onPointerUp={commit}
          onPointerCancel={commit}
          onKeyDown={(e) => {
            if (!/^(Arrow|Page|Home|End)/.test(e.key)) return;
            clearTimeout(timers.current.key);
            begin();
          }}
          onKeyUp={() => {
            clearTimeout(timers.current.key);
            timers.current.key = window.setTimeout(commit, 900);
          }}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Budget"
          aria-valuetext={money(v)}
        />
      </div>
    </>
  );
}
