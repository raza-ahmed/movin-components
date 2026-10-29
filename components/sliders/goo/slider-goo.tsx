"use client";

import * as React from "react";
import { useId, useState } from 'react';

const css = `
  .slider-goo { position: relative; width: 220px; height: 70px; }
  .slider-goo__rail { position: absolute; left: 0; right: 0; top: 43px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-goo__liquid { position: absolute; inset: 0; }
  .slider-goo__fill { position: absolute; left: 0; top: 40px; height: 10px; border-radius: 5px; width: calc(14px + var(--slider-goo-v) * (100% - 28px)); background: light-dark(#42454c, #e5e6e9); }
  .slider-goo__drop { position: absolute; top: 37px; left: calc(var(--slider-goo-v) * (100% - 28px) + 6px); width: 16px; height: 16px; border-radius: 50%; background: light-dark(#42454c, #e5e6e9); transition: left 0.35s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .slider-goo__thumb {
    position: absolute;
    top: 31px;
    left: calc(var(--slider-goo-v) * (100% - 28px));
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: light-dark(#42454c, #e5e6e9);
    transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-goo:has(.slider-goo__input:active) .slider-goo__thumb { transform: translateY(-20px) scale(0.86); }
  .slider-goo__shine { position: absolute; top: 31px; left: calc(var(--slider-goo-v) * (100% - 28px)); width: 28px; height: 28px; pointer-events: none; transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .slider-goo__shine::after { content: ''; position: absolute; left: 7px; top: 6px; width: 8px; height: 5px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); transform: rotate(-30deg); }
  .slider-goo:has(.slider-goo__input:active) .slider-goo__shine { transform: translateY(-20px) scale(0.86); }
  .slider-goo:has(.slider-goo__input:focus-visible) .slider-goo__shine { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 50%; }
  .slider-goo__input { position: absolute; left: 0; right: 0; top: 24px; width: 100%; height: 42px; margin: 0; opacity: 0; cursor: grab; -webkit-appearance: none; appearance: none; background: none; }
  .slider-goo__input:active { cursor: grabbing; }
  .slider-goo__input::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; }
  .slider-goo__input::-moz-range-thumb { width: 28px; height: 28px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-goo * { transition-duration: 0.01s !important; }
  }
`;

export function GooSlider() {
  const [v, setV] = useState(50);
  const filter = `slider-goo-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-goo" style={{ '--slider-goo-v': v / 100 } as React.CSSProperties}>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <filter id={filter} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </svg>
        <span className="slider-goo__rail" aria-hidden="true" />
        <span className="slider-goo__liquid" style={{ filter: `url(#${filter})` }} aria-hidden="true">
          <span className="slider-goo__fill" />
          <span className="slider-goo__drop" />
          <span className="slider-goo__thumb" />
        </span>
        <span className="slider-goo__shine" aria-hidden="true" />
        <input className="slider-goo__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Volume" />
      </div>
    </>
  );
}
