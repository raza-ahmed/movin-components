"use client";

import * as React from "react";
import { useState } from 'react';

const LEDS = Array.from({ length: 21 }, (_, k) => k);

const css = `
  .slider-dial { display: grid; justify-items: center; gap: 8px; }
  .slider-dial__ring { position: relative; width: 150px; height: 150px; }
  .slider-dial__led {
    --on: clamp(0, calc((var(--slider-dial-v) * 20 - var(--k) + 0.5) * 4), 1);
    position: absolute;
    left: 50%;
    top: 50%;
    width: 5px;
    height: 5px;
    margin: -2.5px;
    border-radius: 50%;
    background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--on) * 100%), light-dark(#ebedf0, #232529));
    box-shadow: 0 0 calc(var(--on) * 6px) color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--on) * 60%), transparent);
    transform: rotate(calc(-135deg + var(--k) * 13.5deg)) translateY(-68px);
    transition: background-color 0.15s, box-shadow 0.15s;
  }
  .slider-dial__knob {
    position: absolute;
    inset: 27px;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 30%, light-dark(#6d7179, #7d8087), light-dark(#dbdde1, #2e3035) 70%);
    box-shadow: inset 0 1px 0 light-dark(#5f626a, #a7abb2), 0 0 0 4px light-dark(#f3f4f7, #1a1c1f), 0 0 0 5px light-dark(#dbdde1, #2e3035), 0 10px 18px -6px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    transform: rotate(calc(-135deg + var(--slider-dial-v) * 270deg));
    transition: transform 0.25s cubic-bezier(0.3, 1.4, 0.5, 1);
  }
  .slider-dial__knob::before { content: ''; position: absolute; left: 50%; top: 8px; width: 4px; height: 18px; margin-left: -2px; border-radius: 2px; background: light-dark(#373a40, #f1f2f3); }
  .slider-dial__knob::after { content: ''; position: absolute; inset: 16px; border-radius: 50%; background: repeating-conic-gradient(from 0deg, light-dark(#cbced3, #393c41) 0 4deg, light-dark(#dbdde1, #2e3035) 4deg 8deg); opacity: 0.5; }
  .slider-dial__label { color: light-dark(#5f626a, #a7abb2); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; }
  .slider-dial__value { color: light-dark(#373a40, #f1f2f3); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; font-variant-numeric: tabular-nums; }
  .slider-dial:has(.slider-dial__input:focus-visible) .slider-dial__knob { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 8px; }
  .slider-dial__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: ew-resize; -webkit-appearance: none; appearance: none; background: none; }
  .slider-dial__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 150px; }
  .slider-dial__input::-moz-range-thumb { width: 20px; height: 150px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-dial__knob { transition: none; }
  }
`;

export function DialSlider() {
  const [v, setV] = useState(60);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-dial" style={{ '--slider-dial-v': v / 100 } as React.CSSProperties}>
        <span className="slider-dial__label" aria-hidden="true">
          GAIN
        </span>
        <span className="slider-dial__ring">
          {LEDS.map((k) => (
            <span key={k} className="slider-dial__led" style={{ '--k': k } as React.CSSProperties} aria-hidden="true" />
          ))}
          <span className="slider-dial__knob" aria-hidden="true" />
          <input className="slider-dial__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Gain" aria-valuetext={(v / 10).toFixed(1)} />
        </span>
        <span className="slider-dial__value" aria-hidden="true">
          {(v / 10).toFixed(1)}
        </span>
      </div>
    </>
  );
}
