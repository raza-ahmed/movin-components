"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-daylight {
    --slider-daylight-noon: calc(1 - max(var(--slider-daylight-v) * 2 - 1, 1 - var(--slider-daylight-v) * 2));
    display: grid;
    gap: 12px;
    width: 230px;
  }
  .slider-daylight__sky {
    position: relative;
    height: 118px;
    overflow: hidden;
    border-radius: 12px;
    background: linear-gradient(color-mix(in oklab, light-dark(#cbced3, #393c41) calc(var(--slider-daylight-noon) * 100%), light-dark(#fbfcfd, #121417)), color-mix(in oklab, light-dark(#5f626a, #a7abb2) calc(var(--slider-daylight-noon) * 100%), light-dark(#ebedf0, #232529)));
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: background 0.3s;
  }
  .slider-daylight__star { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: light-dark(#42454c, #e5e6e9); opacity: calc(1 - var(--slider-daylight-noon) * 2.5); transition: opacity 0.3s; }
  .slider-daylight__arm { position: absolute; left: 50%; top: 112px; width: 0; height: 0; transform: rotate(calc(-82deg + var(--slider-daylight-v) * 164deg)); transition: transform 0.35s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .slider-daylight__sun {
    position: absolute;
    left: -12px;
    top: -102px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 0 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 18%, transparent), 0 0 24px 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent);
  }
  .slider-daylight__hills { position: absolute; left: 0; bottom: 0; width: 100%; height: 44px; }
  .slider-daylight__far { fill: light-dark(#ebedf0, #232529); }
  .slider-daylight__near { fill: light-dark(#f3f4f7, #1a1c1f); }
  .slider-daylight__time { position: absolute; right: 10px; top: 8px; color: light-dark(#373a40, #f1f2f3); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; font-variant-numeric: tabular-nums; }
  .slider-daylight__track { position: relative; height: 24px; }
  .slider-daylight__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: linear-gradient(90deg, light-dark(#ebedf0, #232529), light-dark(#50535b, #c6c8cd) 50%, light-dark(#ebedf0, #232529)); }
  .slider-daylight__thumb { position: absolute; top: 3px; left: calc(var(--slider-daylight-v) * (100% - 18px)); width: 18px; height: 18px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f), 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-daylight:has(.slider-daylight__input:focus-visible) .slider-daylight__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; }
  .slider-daylight__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-daylight__input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; }
  .slider-daylight__input::-moz-range-thumb { width: 18px; height: 18px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-daylight * { transition-duration: 0.01s !important; }
  }
`;

const STARS = [
  [18, 14], [46, 30], [70, 10], [150, 18], [184, 34], [206, 12], [120, 8], [98, 36],
];

export function DaylightSlider() {
  const [v, setV] = useState(30);
  const minutes = Math.round((6 + (v / 100) * 12) * 60);
  const time = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-daylight" style={{ '--slider-daylight-v': v / 100 } as React.CSSProperties}>
        <div className="slider-daylight__sky" aria-hidden="true">
          {STARS.map(([x, y]) => (
            <span key={`${x}-${y}`} className="slider-daylight__star" style={{ left: x, top: y }} />
          ))}
          <span className="slider-daylight__arm">
            <span className="slider-daylight__sun" />
          </span>
          <svg className="slider-daylight__hills" viewBox="0 0 230 44" preserveAspectRatio="none">
            <path className="slider-daylight__far" d="M0 26C30 10 60 12 90 22S150 8 180 16 220 20 230 18V44H0Z" />
            <path className="slider-daylight__near" d="M0 36C40 24 80 30 120 34S190 26 230 30V44H0Z" />
          </svg>
          <span className="slider-daylight__time">{time}</span>
        </div>
        <div className="slider-daylight__track">
          <span className="slider-daylight__rail" />
          <span className="slider-daylight__thumb" />
          <input
            className="slider-daylight__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Time of day"
            aria-valuetext={time}
          />
        </div>
      </div>
    </>
  );
}
