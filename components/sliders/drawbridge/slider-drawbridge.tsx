"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes slider-drawbridge-sail { from { transform: translateX(-60px); } to { transform: translateX(250px); } }
  @keyframes slider-drawbridge-drive { from { transform: translateX(-30px); } to { transform: translateX(240px); } }
  @keyframes slider-drawbridge-swell { to { transform: translateX(-16px); } }
  .slider-drawbridge { display: grid; gap: 12px; width: 230px; }
  .slider-drawbridge__scene { position: relative; height: 128px; overflow: hidden; border-radius: 14px; background: linear-gradient(light-dark(#f3f4f7, #1a1c1f), light-dark(#fbfcfd, #121417)); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .slider-drawbridge__water { position: absolute; left: 0; right: 0; bottom: 0; height: 40px; background: light-dark(#ebedf0, #232529); }
  .slider-drawbridge__waves { position: absolute; left: 0; top: 6px; width: calc(100% + 16px); height: 8px; background: radial-gradient(circle at 8px 0, transparent 5px, light-dark(#dbdde1, #2e3035) 5.5px 6.5px, transparent 7px) 0 0 / 16px 8px repeat-x; animation: slider-drawbridge-swell 1.4s linear infinite; }
  .slider-drawbridge__tower { position: absolute; bottom: 30px; width: 18px; height: 70px; border-radius: 3px 3px 0 0; background: light-dark(#cbced3, #393c41); box-shadow: inset 0 1px 0 light-dark(#6d7179, #7d8087); }
  .slider-drawbridge__tower::before { content: ''; position: absolute; left: -3px; right: -3px; top: -6px; height: 8px; border-radius: 2px; background: light-dark(#6d7179, #7d8087); }
  .slider-drawbridge__road { position: absolute; bottom: 52px; height: 6px; background: light-dark(#6d7179, #7d8087); }
  .slider-drawbridge__leaf { position: absolute; bottom: 52px; width: 47px; height: 6px; background: light-dark(#5f626a, #a7abb2); box-shadow: inset 0 -2px 0 light-dark(#6d7179, #7d8087); transition: transform 0.7s cubic-bezier(0.45, 0, 0.3, 1.15); }
  .slider-drawbridge__leaf--l { left: 68px; transform-origin: 0 100%; transform: rotate(calc(var(--slider-drawbridge-v) * -72deg)); }
  .slider-drawbridge__leaf--r { left: 115px; transform-origin: 100% 100%; transform: rotate(calc(var(--slider-drawbridge-v) * 72deg)); }
  .slider-drawbridge__boat { position: absolute; left: 0; bottom: 30px; width: 44px; height: 34px; opacity: 0; transition: opacity 0.4s; animation: slider-drawbridge-sail 5s linear infinite; }
  .slider-drawbridge[data-open] .slider-drawbridge__boat { opacity: 1; }
  .slider-drawbridge__boat svg, .slider-drawbridge__car svg { width: 100%; height: 100%; }
  .slider-drawbridge__hull { fill: light-dark(#50535b, #c6c8cd); }
  .slider-drawbridge__sail { fill: light-dark(#373a40, #f1f2f3); }
  .slider-drawbridge__car { position: absolute; left: 0; bottom: 58px; width: 22px; height: 12px; opacity: 0; transition: opacity 0.3s; animation: slider-drawbridge-drive 3.2s linear infinite; }
  .slider-drawbridge[data-shut] .slider-drawbridge__car { opacity: 1; }
  .slider-drawbridge__body { fill: light-dark(#42454c, #e5e6e9); }
  .slider-drawbridge__wheel { fill: light-dark(#fbfcfd, #121417); }
  .slider-drawbridge__track { position: relative; height: 24px; }
  .slider-drawbridge__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-drawbridge__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(9px + var(--slider-drawbridge-v) * (100% - 18px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-drawbridge__thumb { position: absolute; top: 3px; left: calc(var(--slider-drawbridge-v) * (100% - 18px)); width: 18px; height: 18px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-drawbridge:has(.slider-drawbridge__input:focus-visible) .slider-drawbridge__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-drawbridge__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-drawbridge__input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; }
  .slider-drawbridge__input::-moz-range-thumb { width: 18px; height: 18px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-drawbridge * { animation: none !important; }
    .slider-drawbridge__leaf { transition: none; }
  }
`;

export function DrawbridgeSlider() {
  const [v, setV] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="slider-drawbridge"
        data-open={v >= 75 ? '' : undefined}
        data-shut={v === 0 ? '' : undefined}
        style={{ '--slider-drawbridge-v': v / 100 } as React.CSSProperties}
      >
        <span className="slider-drawbridge__scene" aria-hidden="true">
          <span className="slider-drawbridge__water">
            <span className="slider-drawbridge__waves" />
          </span>
          <span className="slider-drawbridge__boat">
            <svg viewBox="0 0 44 34">
              <path className="slider-drawbridge__sail" d="M22 2V24H8Z" />
              <path className="slider-drawbridge__sail" d="M24 6V24H34Z" opacity="0.7" />
              <path className="slider-drawbridge__hull" d="M2 26H42L36 34H8Z" />
            </svg>
          </span>
          <span className="slider-drawbridge__road" style={{ left: 0, width: 68 }} />
          <span className="slider-drawbridge__road" style={{ left: 162, right: 0 }} />
          <span className="slider-drawbridge__car">
            <svg viewBox="0 0 22 12">
              <path className="slider-drawbridge__body" d="M2 5h4l3-4h7l3 4h1v4H2Z" />
              <circle className="slider-drawbridge__wheel" cx="6" cy="9.5" r="2.5" />
              <circle className="slider-drawbridge__wheel" cx="16" cy="9.5" r="2.5" />
            </svg>
          </span>
          <span className="slider-drawbridge__tower" style={{ left: 52 }} />
          <span className="slider-drawbridge__tower" style={{ left: 160 }} />
          <span className="slider-drawbridge__leaf slider-drawbridge__leaf--l" />
          <span className="slider-drawbridge__leaf slider-drawbridge__leaf--r" />
        </span>
        <div className="slider-drawbridge__track">
          <span className="slider-drawbridge__rail" />
          <span className="slider-drawbridge__fill" />
          <span className="slider-drawbridge__thumb" />
          <input
            className="slider-drawbridge__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Bridge"
            aria-valuetext={v === 0 ? 'Closed' : `${v} percent open`}
          />
        </div>
      </div>
    </>
  );
}
