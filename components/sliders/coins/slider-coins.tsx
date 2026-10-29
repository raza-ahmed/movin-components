"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-coins { display: grid; justify-items: center; gap: 14px; width: 220px; }
  .slider-coins__table { position: relative; width: 120px; height: 110px; }
  .slider-coins__shadow { position: absolute; left: 50%; bottom: 0; width: 44px; height: 4px; margin-left: -22px; border-radius: 50%; box-shadow: 0 0 10px 6px light-dark(rgba(0, 0, 0, 0.11), rgba(0, 0, 0, 0.35)); opacity: min(1, calc(var(--slider-coins-v) * 10)); transition: opacity 0.3s; }
  .slider-coins__coin {
    --on: clamp(0, calc(var(--slider-coins-v) * 10 - var(--k)), 1);
    position: absolute;
    left: 50%;
    bottom: calc(4px + var(--k) * 8px);
    width: 52px;
    height: 16px;
    margin-left: -26px;
    border-radius: 50%;
    background: radial-gradient(ellipse at 50% 40%, light-dark(#42454c, #e5e6e9), light-dark(#50535b, #c6c8cd) 55%, light-dark(#5f626a, #a7abb2));
    box-shadow: inset 0 0 0 1.5px light-dark(#5f626a, #a7abb2), 0 3px 0 light-dark(#6d7179, #7d8087), 0 4px 0 light-dark(#cbced3, #393c41);
    opacity: var(--on);
    transform: translateY(calc((1 - var(--on)) * -48px));
    transition: opacity 0.2s, transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1);
    transition-delay: calc(var(--k) * 20ms);
  }
  .slider-coins__coin::after { content: ''; position: absolute; inset: 4px 12px; border-radius: 50%; box-shadow: inset 0 0 0 1px color-mix(in oklab, light-dark(#6d7179, #7d8087) 70%, transparent); }
  .slider-coins__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .slider-coins__label b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; font-variant-numeric: tabular-nums; }
  .slider-coins__track { position: relative; width: 100%; height: 24px; }
  .slider-coins__rail { position: absolute; left: 9px; right: 9px; top: 10px; height: 4px; border-radius: 2px; background: radial-gradient(circle, light-dark(#6d7179, #7d8087) 1.5px, transparent 2px) -1px 0 / 10% 100% repeat-x, light-dark(#ebedf0, #232529); }
  .slider-coins__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(9px + var(--slider-coins-v) * (100% - 18px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-coins__thumb { position: absolute; top: 3px; left: calc(var(--slider-coins-v) * (100% - 18px)); width: 18px; height: 18px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); transition: left 0.2s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .slider-coins__fill { transition: width 0.2s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .slider-coins:has(.slider-coins__input:focus-visible) .slider-coins__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-coins__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-coins__input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; }
  .slider-coins__input::-moz-range-thumb { width: 18px; height: 18px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-coins * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const COINS = Array.from({ length: 10 }, (_, k) => k);

export function CoinsSlider() {
  const [n, setN] = useState(4);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-coins" style={{ '--slider-coins-v': n / 10 } as React.CSSProperties}>
        <span className="slider-coins__table" aria-hidden="true">
          <span className="slider-coins__shadow" />
          {COINS.map((k) => (
            <span key={k} className="slider-coins__coin" style={{ '--k': k } as React.CSSProperties} />
          ))}
        </span>
        <span className="slider-coins__label" aria-hidden="true">
          Tip <b>${n}</b>
        </span>
        <div className="slider-coins__track">
          <span className="slider-coins__rail" />
          <span className="slider-coins__fill" />
          <span className="slider-coins__thumb" />
          <input
            className="slider-coins__input"
            type="range"
            min={0}
            max={10}
            value={n}
            onChange={(e) => setN(+e.target.value)}
            aria-label="Tip"
            aria-valuetext={`${n} dollars`}
          />
        </div>
      </div>
    </>
  );
}
