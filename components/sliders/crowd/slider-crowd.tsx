"use client";

import * as React from "react";
import { useState } from 'react';

const SEATS = Array.from({ length: 60 }, (_, k) => ({ k, order: (k * 37) % 60 }));

const css = `
  .slider-crowd { display: grid; justify-items: center; gap: 12px; width: 220px; }
  .slider-crowd__room { display: grid; grid-template-columns: repeat(12, 12px); gap: 5px 4px; padding: 12px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  /* Seats fill in a scattered order, the way people arrive. */
  .slider-crowd__seat { position: relative; width: 12px; height: 14px; }
  .slider-crowd__seat::before { content: ''; position: absolute; left: 3px; bottom: 0; width: 6px; height: 2px; border-radius: 1px; background: light-dark(#dbdde1, #2e3035); }
  .slider-crowd__person { position: absolute; left: 2px; bottom: 1px; width: 8px; height: 12px; transform-origin: 50% 100%; transform: scale(clamp(0, calc((var(--slider-crowd-v) * 60 - var(--o)) * 2), 1)); transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .slider-crowd__person::before { content: ''; position: absolute; left: 1.5px; top: 0; width: 5px; height: 5px; border-radius: 50%; background: light-dark(#42454c, #e5e6e9); }
  .slider-crowd__person::after { content: ''; position: absolute; left: 0; bottom: 0; width: 8px; height: 6px; border-radius: 4px 4px 1px 1px; background: light-dark(#50535b, #c6c8cd); }
  @media (prefers-reduced-motion: reduce) {
    .slider-crowd__person { transition: none; }
  }
  .slider-crowd__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-crowd__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-crowd__track { position: relative; width: 100%; height: 24px; }
  .slider-crowd__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-crowd__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-crowd-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-crowd__thumb { position: absolute; top: 2px; left: calc(var(--slider-crowd-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-crowd:has(.slider-crowd__input:focus-visible) .slider-crowd__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-crowd__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-crowd__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-crowd__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function CrowdSlider() {
  const [v, setV] = useState(48);
  const t = (v - 0) / (120 - 0);
  const word = v === 0 ? 'Empty' : v < 30 ? 'Quiet' : v < 70 ? 'Comfortable' : v < 100 ? 'Busy' : 'Packed';
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-crowd" style={{ '--slider-crowd-v': t } as React.CSSProperties}>
        <div className="slider-crowd__room" aria-hidden="true">
          {SEATS.map((s) => (
            <span key={s.k} className="slider-crowd__seat">
              <span className="slider-crowd__person" style={{ '--o': s.order } as React.CSSProperties} />
            </span>
          ))}
        </div>
        <span className="slider-crowd__read" aria-hidden="true">
          <b>{v}</b> of 120 · {word}
        </span>
        <div className="slider-crowd__track">
          <span className="slider-crowd__rail" />
          <span className="slider-crowd__fill" />
          <span className="slider-crowd__thumb" />
          <input
            className="slider-crowd__input"
            type="range"
            min={0}
            max={120} step={2}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Expected guests"
            aria-valuetext={`${v} of 120 guests, ${word.toLowerCase()}`}
          />
        </div>
      </div>
    </>
  );
}
