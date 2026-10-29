"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-signal { display: grid; justify-items: center; gap: 14px; width: 220px; }
  .slider-signal__bars { display: flex; align-items: flex-end; gap: 6px; height: 56px; }
  .slider-signal__bar {
    --on: clamp(0, calc((var(--slider-signal-v) * 5 - var(--k)) * 12), 1);
    width: 12px;
    height: calc(16px + var(--k) * 10px);
    border-radius: 3px;
    background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--on) * 100%), light-dark(#ebedf0, #232529));
    box-shadow: 0 0 calc(var(--on) * 10px) color-mix(in oklab, light-dark(#42454c, #e5e6e9) calc(var(--on) * 35%), transparent);
    transform-origin: 50% 100%;
    transform: scaleY(calc(0.82 + 0.18 * var(--on)));
    transition: background-color 0.2s, box-shadow 0.3s, transform 0.4s cubic-bezier(0.3, 1.8, 0.5, 1);
  }
  .slider-signal__word { color: light-dark(#42454c, #e5e6e9); font-size: 12px; font-weight: 600; }
  .slider-signal__track { position: relative; width: 100%; height: 24px; }
  .slider-signal__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-signal__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(9px + var(--slider-signal-v) * (100% - 18px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-signal__thumb { position: absolute; top: 3px; left: calc(var(--slider-signal-v) * (100% - 18px)); width: 18px; height: 18px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); transition: transform 0.2s; }
  .slider-signal__track:active .slider-signal__thumb { transform: scale(1.2); }
  .slider-signal:has(.slider-signal__input:focus-visible) .slider-signal__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-signal__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-signal__input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; }
  .slider-signal__input::-moz-range-thumb { width: 18px; height: 18px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-signal * { transition-duration: 0.01s !important; }
  }
`;

const WORDS = ['No signal', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

export function SignalSlider() {
  const [v, setV] = useState(64);
  const word = WORDS[Math.ceil(v / 20)];
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-signal" style={{ '--slider-signal-v': v / 100 } as React.CSSProperties}>
        <span className="slider-signal__bars" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((k) => (
            <span key={k} className="slider-signal__bar" style={{ '--k': k } as React.CSSProperties} />
          ))}
        </span>
        <span className="slider-signal__word" aria-hidden="true">
          {word}
        </span>
        <div className="slider-signal__track">
          <span className="slider-signal__rail" />
          <span className="slider-signal__fill" />
          <span className="slider-signal__thumb" />
          <input
            className="slider-signal__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Signal strength"
            aria-valuetext={word}
          />
        </div>
      </div>
    </>
  );
}
