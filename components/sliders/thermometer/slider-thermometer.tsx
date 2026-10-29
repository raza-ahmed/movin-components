"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  @keyframes slider-thermometer-boil {
    from { transform: translateY(0) scale(0.6); opacity: 0; }
    30% { opacity: 1; }
    to { transform: translateY(-16px) scale(1); opacity: 0; }
  }
  .slider-thermometer { display: flex; align-items: center; gap: 22px; }
  .slider-thermometer__body { position: relative; width: 36px; height: 170px; }
  .slider-thermometer__tube { position: absolute; left: 9px; top: 0; width: 18px; height: 140px; border-radius: 9px 9px 0 0; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41); }
  .slider-thermometer__bulb { position: absolute; left: 0; bottom: 0; width: 36px; height: 36px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 1.5px light-dark(#cbced3, #393c41), 0 0 0 5px light-dark(#f3f4f7, #1a1c1f), 0 0 0 6.5px light-dark(#cbced3, #393c41); }
  .slider-thermometer__column {
    position: absolute;
    left: 14px;
    bottom: 24px;
    width: 8px;
    height: calc(6px + var(--slider-thermometer-v) * 108px);
    border-radius: 4px 4px 0 0;
    background: light-dark(#373a40, #f1f2f3);
    transition: height 0.45s cubic-bezier(0.3, 1.3, 0.5, 1);
  }
  .slider-thermometer__bubble {
    position: absolute;
    bottom: 22px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: light-dark(#fbfcfd, #121417);
    opacity: 0;
  }
  .slider-thermometer[data-hot] .slider-thermometer__bubble { animation: slider-thermometer-boil 0.9s ease-out infinite; }
  .slider-thermometer__tick { position: absolute; left: 30px; height: 1px; width: 6px; background: light-dark(#6d7179, #7d8087); }
  .slider-thermometer__tick--major { width: 10px; background: light-dark(#5f626a, #a7abb2); }
  .slider-thermometer:has(.slider-thermometer__input:focus-visible) .slider-thermometer__tube { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-thermometer__input {
    position: absolute;
    left: 50%;
    top: 75px;
    width: 140px;
    height: 36px;
    margin: 0;
    transform: translate(-50%, -50%) rotate(-90deg);
    opacity: 0;
    cursor: ns-resize;
    -webkit-appearance: none;
    appearance: none;
    background: none;
  }
  .slider-thermometer__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 36px; }
  .slider-thermometer__input::-moz-range-thumb { width: 12px; height: 36px; border: 0; }
  .slider-thermometer__read { display: grid; gap: 2px; }
  .slider-thermometer__deg { color: light-dark(#373a40, #f1f2f3); font-size: 38px; font-weight: 300; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1; }
  .slider-thermometer__unit { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; }
  @media (prefers-reduced-motion: reduce) {
    .slider-thermometer__column { transition: none; }
    .slider-thermometer__bubble { display: none; }
  }
`;

const TICKS = Array.from({ length: 11 }, (_, i) => i);

export function ThermometerSlider() {
  const [v, setV] = useState(55);
  const deg = Math.round(-10 + (v / 100) * 50);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-thermometer" data-hot={v >= 85 ? '' : undefined} style={{ '--slider-thermometer-v': v / 100 } as React.CSSProperties}>
        <span className="slider-thermometer__body">
          <span className="slider-thermometer__tube" aria-hidden="true" />
          {TICKS.map((i) => (
            <span key={i} className={`slider-thermometer__tick${i % 2 ? '' : ' slider-thermometer__tick--major'}`} style={{ bottom: 30 + i * 10.8 }} aria-hidden="true" />
          ))}
          <span className="slider-thermometer__column" aria-hidden="true" />
          <span className="slider-thermometer__bulb" aria-hidden="true" />
          <span className="slider-thermometer__bubble" style={{ left: 12 }} aria-hidden="true" />
          <span className="slider-thermometer__bubble" style={{ left: 20, animationDelay: '-0.3s' }} aria-hidden="true" />
          <span className="slider-thermometer__bubble" style={{ left: 16, animationDelay: '-0.6s' }} aria-hidden="true" />
          <input
            className="slider-thermometer__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Temperature"
            aria-valuetext={`${deg} degrees Celsius`}
          />
        </span>
        <span className="slider-thermometer__read" aria-hidden="true">
          <span className="slider-thermometer__deg">{deg}°</span>
          <span className="slider-thermometer__unit">CELSIUS</span>
        </span>
      </div>
    </>
  );
}
