"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-invert {
    position: relative;
    width: 240px;
    height: 48px;
    border-radius: 14px;
    overflow: hidden;
    background: light-dark(#ebedf0, #232529);
    transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
  .slider-invert:has(.slider-invert__input:active) { transform: scale(0.97); }
  .slider-invert:has(.slider-invert__input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-invert__row {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 500;
    color: light-dark(#42454c, #e5e6e9);
  }
  .slider-invert__row b { font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-invert__label { display: flex; align-items: center; gap: 8px; }
  .slider-invert__fill {
    position: absolute;
    inset: 0;
    background: light-dark(#42454c, #e5e6e9);
    clip-path: inset(0 calc(100% - var(--slider-invert-w)) 0 0 round 0 6px 6px 0);
    transition: clip-path 0.12s ease-out;
  }
  .slider-invert__fill .slider-invert__row { color: light-dark(#f3f4f7, #1a1c1f); }
  .slider-invert__icon { width: 18px; height: 18px; overflow: visible; }
  .slider-invert__icon path { transition: opacity 0.2s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); transform-box: fill-box; transform-origin: 0 50%; }
  .slider-invert__icon .slider-invert__off { opacity: 0; transform: scale(0.4); }
  .slider-invert__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-invert__input::-webkit-slider-thumb { -webkit-appearance: none; width: 2px; height: 48px; }
  .slider-invert__input::-moz-range-thumb { width: 2px; height: 48px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-invert, .slider-invert__fill, .slider-invert__icon path { transition: none; }
  }
`;

function Speaker({ v }: { v: number }) {
  const off = (hidden: boolean) => (hidden ? 'slider-invert__off' : undefined);
  return (
    <svg className="slider-invert__icon" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2.5 6.5h2.8L9.5 3v12l-4.2-3.5H2.5z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      {/* Waves come in as the level rises; at zero they give way to a cross. */}
      <path className={off(v === 0)} d="M12.2 6.6a3.2 3.2 0 0 1 0 4.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path className={off(v < 50)} d="M14.2 4.4a6.2 6.2 0 0 1 0 9.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path className={off(v > 0)} d="M12.5 7l3.8 4M16.3 7l-3.8 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function InvertSlider() {
  const [v, setV] = useState(64);
  const row = (
    <div className="slider-invert__row" aria-hidden="true">
      <span className="slider-invert__label">
        <Speaker v={v} />
        Volume
      </span>
      <b>{v}%</b>
    </div>
  );
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-invert" style={{ '--slider-invert-w': `calc(1px + ${v / 100} * (100% - 2px))` } as React.CSSProperties}>
        {row}
        {/* The same row again on the fill, in the inverse colour; the clip shows it only where the fill covers. */}
        <div className="slider-invert__fill">
          {row}
        </div>
        <input
          className="slider-invert__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Volume"
          aria-valuetext={`${v}%`}
        />
      </div>
    </>
  );
}
