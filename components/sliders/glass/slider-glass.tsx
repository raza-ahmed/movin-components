"use client";

import * as React from "react";
import { useState } from 'react';

const W = 240;
const TW = 40;
const TH = 24;
const MID = 28;

const css = `
  .slider-glass {
    position: relative;
    width: ${W}px;
    height: 56px;
    --slider-glass-hl: light-dark(#fbfcfd, #f1f2f3);
  }
  .slider-glass__track { position: absolute; left: 0; width: ${W}px; top: ${MID - 3}px; height: 6px; border-radius: 3px; background: light-dark(#ebedf0, #232529); }
  .slider-glass__fill { position: absolute; left: 0; top: ${MID - 3}px; height: 6px; border-radius: 3px; width: var(--slider-glass-x); background: light-dark(#42454c, #e5e6e9); }
  .slider-glass__thumb {
    position: absolute;
    top: ${MID - TH / 2}px;
    left: calc(var(--slider-glass-x) - ${TW / 2}px);
    width: ${TW}px;
    height: ${TH}px;
    transition: transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
  .slider-glass__solid, .slider-glass__lens, .slider-glass__shine { position: absolute; inset: 0; border-radius: ${TH / 2}px; transition: opacity 0.2s ease-out; }
  .slider-glass__solid { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5)); }
  .slider-glass__lens { overflow: hidden; opacity: 0; }
  /* A copy of the track, aligned under the lens; scaling the thumb magnifies it about the thumb's centre. */
  .slider-glass__view { position: absolute; left: calc(${TW / 2}px - var(--slider-glass-x)); top: ${-(MID - TH / 2)}px; width: ${W}px; height: 56px; }
  .slider-glass__shine {
    opacity: 0;
    background: radial-gradient(ellipse 55% 45% at 32% 22%, color-mix(in oklab, var(--slider-glass-hl) 40%, transparent), transparent 70%);
    box-shadow:
      inset 0 1px 0.5px color-mix(in oklab, var(--slider-glass-hl) 85%, transparent),
      inset 0 0 0 0.75px color-mix(in oklab, var(--slider-glass-hl) 30%, transparent),
      inset 0 -2px 4px -1px color-mix(in oklab, var(--slider-glass-hl) 22%, transparent),
      0 6px 14px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4));
  }
  .slider-glass:has(.slider-glass__input:active) .slider-glass__thumb { transform: scale(1.6); }
  .slider-glass:has(.slider-glass__input:active) .slider-glass__solid { opacity: 0; }
  .slider-glass:has(.slider-glass__input:active) :is(.slider-glass__lens, .slider-glass__shine) { opacity: 1; }
  .slider-glass:has(.slider-glass__input:focus-visible) .slider-glass__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: ${TH / 2 + 3}px; }
  .slider-glass__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-glass__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${TW}px; height: 40px; }
  .slider-glass__input::-moz-range-thumb { width: ${TW}px; height: 40px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-glass__thumb { transition: none; }
  }
`;

export function GlassSlider() {
  const [v, setV] = useState(48);
  const x = TW / 2 + (v / 100) * (W - TW);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-glass" style={{ '--slider-glass-x': `${x}px` } as React.CSSProperties}>
        <span className="slider-glass__track" aria-hidden="true" />
        <span className="slider-glass__fill" aria-hidden="true" />
        <span className="slider-glass__thumb" aria-hidden="true">
          <span className="slider-glass__solid" />
          <span className="slider-glass__lens">
            <span className="slider-glass__view">
              <span className="slider-glass__track" />
              <span className="slider-glass__fill" />
            </span>
          </span>
          <span className="slider-glass__shine" />
        </span>
        <input
          className="slider-glass__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Volume"
        />
      </div>
    </>
  );
}
