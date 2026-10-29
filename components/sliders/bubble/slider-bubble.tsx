"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const css = `
  .slider-bubble { position: relative; width: 220px; padding-top: 52px; }
  .slider-bubble__track { position: relative; height: 28px; }
  .slider-bubble__rail { position: absolute; left: 0; right: 0; top: 12px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-bubble__fill { position: absolute; left: 0; top: 12px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-bubble-v) * (100% - 20px)); background: light-dark(#42454c, #e5e6e9); }
  .slider-bubble__thumb { position: absolute; top: 4px; left: calc(var(--slider-bubble-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 5px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 15%, transparent), 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-bubble__tip {
    position: absolute;
    bottom: 34px;
    left: calc(10px + var(--slider-bubble-v) * (100% - 20px));
    width: 0;
    height: 0;
  }
  .slider-bubble__lean {
    position: absolute;
    left: -24px;
    bottom: 0;
    display: grid;
    place-items: center;
    width: 48px;
    height: 30px;
    border-radius: 9px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    box-shadow: 0 6px 14px -6px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
    transform-origin: 50% calc(100% + 10px);
    transform: rotate(var(--slider-bubble-tilt)) scale(var(--slider-bubble-s));
    transition: transform 0.45s cubic-bezier(0.3, 1.7, 0.4, 1);
  }
  .slider-bubble__lean::after { content: ''; position: absolute; left: 50%; bottom: -5px; width: 10px; height: 10px; margin-left: -5px; border-radius: 2px; background: inherit; transform: rotate(45deg); }
  .slider-bubble:has(.slider-bubble__input:focus-visible) .slider-bubble__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 6px; }
  .slider-bubble__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-bubble__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-bubble__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-bubble__lean { transition: none; transform: none; }
  }
`;

export function BubbleSlider() {
  const [v, setV] = useState(42);
  const [tilt, setTilt] = useState(0);
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="slider-bubble"
        style={{ '--slider-bubble-v': v / 100, '--slider-bubble-tilt': `${tilt}deg`, '--slider-bubble-s': tilt ? 1.08 : 1 } as React.CSSProperties}
      >
        <div className="slider-bubble__track">
          <span className="slider-bubble__rail" />
          <span className="slider-bubble__fill" />
          <span className="slider-bubble__thumb" />
          <span className="slider-bubble__tip" aria-hidden="true">
            <span className="slider-bubble__lean">{v}</span>
          </span>
          <input
            className="slider-bubble__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => {
              const next = +e.target.value;
              // Lean against the drag, harder the faster it moves, then right itself once the thumb rests.
              setTilt(Math.max(-24, Math.min(24, (v - next) * 4)));
              setV(next);
              clearTimeout(settle.current);
              settle.current = setTimeout(() => setTilt(0), 120);
            }}
            aria-label="Opacity"
          />
        </div>
      </div>
    </>
  );
}
