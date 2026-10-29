"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes slider-bass-pump { 0%, 100% { transform: scale(1); } 28% { transform: scale(calc(1 + var(--slider-bass-v) * 0.09)); } }
  @keyframes slider-bass-shock {
    from { transform: scale(1); opacity: calc(var(--slider-bass-v) * 0.7); }
    to { transform: scale(calc(1 + var(--slider-bass-v) * 0.5)); opacity: 0; }
  }
  .slider-bass { display: grid; justify-items: center; gap: 18px; width: 220px; }
  .slider-bass__box { position: relative; display: grid; place-items: center; width: 116px; height: 116px; border-radius: 18px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529), 0 10px 24px -12px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .slider-bass__shock { position: absolute; inset: 14px; border-radius: 50%; box-shadow: 0 0 0 2px light-dark(#5f626a, #a7abb2); opacity: 0; animation: slider-bass-shock 0.84s ease-out infinite; }
  .slider-bass__shock + .slider-bass__shock { animation-delay: 0.42s; }
  .slider-bass__surround { position: relative; display: grid; place-items: center; width: 88px; height: 88px; border-radius: 50%; background: radial-gradient(circle, light-dark(#dbdde1, #2e3035) 62%, light-dark(#cbced3, #393c41) 63%, light-dark(#dbdde1, #2e3035) 74%, light-dark(#ebedf0, #232529) 100%); box-shadow: 0 0 0 3px light-dark(#ebedf0, #232529); }
  .slider-bass__cone { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; background: radial-gradient(circle, light-dark(#cbced3, #393c41), light-dark(#ebedf0, #232529) 70%); box-shadow: inset 0 0 8px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); animation: slider-bass-pump 0.42s ease-in-out infinite; }
  .slider-bass__cap { width: 24px; height: 24px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, light-dark(#50535b, #c6c8cd), light-dark(#6d7179, #7d8087) 60%, light-dark(#cbced3, #393c41)); box-shadow: 0 2px 4px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-bass__track { position: relative; width: 100%; height: 24px; }
  .slider-bass__rail { position: absolute; left: 0; right: 0; top: 9px; height: 6px; border-radius: 3px; background: light-dark(#ebedf0, #232529); }
  .slider-bass__fill { position: absolute; left: 0; top: 9px; height: 6px; border-radius: 3px; width: calc(10px + var(--slider-bass-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-bass__thumb { position: absolute; top: 2px; left: calc(var(--slider-bass-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd)); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45)); }
  .slider-bass:has(.slider-bass__input:focus-visible) .slider-bass__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-bass__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-bass__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-bass__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-bass__cone, .slider-bass__shock { animation: none; }
  }
`;

export function BassSlider() {
  const [v, setV] = useState(50);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-bass" style={{ '--slider-bass-v': v / 100 } as React.CSSProperties}>
        <span className="slider-bass__box" aria-hidden="true">
          <span className="slider-bass__shock" />
          <span className="slider-bass__shock" />
          <span className="slider-bass__surround">
            <span className="slider-bass__cone">
              <span className="slider-bass__cap" />
            </span>
          </span>
        </span>
        <div className="slider-bass__track">
          <span className="slider-bass__rail" />
          <span className="slider-bass__fill" />
          <span className="slider-bass__thumb" />
          <input className="slider-bass__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Bass" />
        </div>
      </div>
    </>
  );
}
