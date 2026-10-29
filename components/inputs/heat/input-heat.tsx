"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes field-heat-cool {
    from {
      color: light-dark(#373a40, #f1f2f3);
      text-shadow: 0 0 calc(var(--h) * 9px) color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--h) * 90%), transparent);
      transform: translateY(calc(var(--h) * -2px));
    }
    to { color: light-dark(#42454c, #e5e6e9); text-shadow: none; transform: none; }
  }
  .field-heat { width: 250px; }
  .field-heat__head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .field-heat__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-heat__wpm { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-variant-numeric: tabular-nums; }
  .field-heat__box { position: relative; height: 42px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); transition: box-shadow 0.2s; }
  .field-heat__box:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-heat__input, .field-heat__mirror { padding: 0 12px; font-family: inherit; font-size: 15px; font-kerning: none; letter-spacing: 0; }
  .field-heat__input { position: relative; z-index: 1; width: 100%; height: 100%; border: 0; outline: 0; background: none; color: transparent; caret-color: light-dark(#373a40, #f1f2f3); }
  .field-heat__input::placeholder { color: light-dark(#5f626a, #a7abb2); }
  .field-heat__mirror { position: absolute; inset: 0; display: flex; align-items: center; overflow: hidden; color: light-dark(#42454c, #e5e6e9); white-space: pre; pointer-events: none; }
  .field-heat__ch { display: inline-block; animation: field-heat-cool 2.4s cubic-bezier(0.2, 0.7, 0.4, 1) both; }
  .field-heat__meter { height: 4px; margin-top: 8px; border-radius: 2px; background: light-dark(#ebedf0, #232529); overflow: hidden; }
  .field-heat__meter span { display: block; height: 100%; border-radius: 2px; background: linear-gradient(90deg, light-dark(#6d7179, #7d8087), light-dark(#373a40, #f1f2f3)); transform-origin: left; transition: transform 0.3s ease; }
  @media (prefers-reduced-motion: reduce) { .field-heat__ch { animation: none; } }
`;

export function HeatInput() {
  const [value, setValue] = useState('');
  const heat = useRef<{ h: number; id: number }[]>([]);
  const last = useRef(0);
  const gaps = useRef<number[]>([]);
  const seq = useRef(0);
  const [wpm, setWpm] = useState(0);

  // Speed decays when you stop typing.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (performance.now() - last.current > 1200) setWpm((w) => (w < 1 ? 0 : w * 0.7));
    }, 200);
    return () => clearInterval(id);
  }, []);

  const change = (next: string) => {
    const now = performance.now();
    const gap = last.current ? now - last.current : 1000;
    last.current = now;
    let p = 0;
    while (p < value.length && p < next.length && value[p] === next[p]) p++;
    let s = 0;
    while (s < value.length - p && s < next.length - p && value[value.length - 1 - s] === next[next.length - 1 - s]) s++;
    const added = next.length - p - s;
    // Fast keystrokes come out hot; slow ones barely warm.
    const h = Math.max(0, Math.min(1, (380 - gap) / 300));
    heat.current = [...heat.current.slice(0, p), ...Array.from({ length: added }, () => ({ h, id: seq.current++ })), ...heat.current.slice(heat.current.length - s)];
    if (added > 0 && gap < 1500) {
      gaps.current = [...gaps.current, gap].slice(-8);
      const avg = gaps.current.reduce((a, b) => a + b, 0) / gaps.current.length;
      setWpm(60000 / (avg * 5));
    }
    setValue(next);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-heat">
        <div className="field-heat__head">
          <label className="field-heat__label" htmlFor="field-heat-input">
            Message
          </label>
          <span className="field-heat__wpm" aria-hidden="true">
            {Math.round(wpm)} wpm
          </span>
        </div>
        <div className="field-heat__box">
          <span className="field-heat__mirror" aria-hidden="true">
            {[...value].map((c, i) => (
              <span key={heat.current[i]?.id ?? i} className="field-heat__ch" style={{ '--h': heat.current[i]?.h ?? 0 } as React.CSSProperties}>
                {c}
              </span>
            ))}
          </span>
          <input
            id="field-heat-input"
            className="field-heat__input"
            value={value}
            maxLength={30}
            placeholder="Type fast to heat it up"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => change(e.target.value)}
          />
        </div>
        <div className="field-heat__meter" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, wpm / 110)})` }} />
        </div>
      </div>
    </>
  );
}
