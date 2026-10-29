"use client";

import * as React from "react";
import { useState } from 'react';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const css = `
  .slider-odometer { display: grid; justify-items: center; gap: 16px; width: 220px; }
  .slider-odometer__read { display: flex; align-items: center; padding: 6px 10px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529), inset 0 6px 10px -6px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); color: light-dark(#373a40, #f1f2f3); font-size: 30px; font-weight: 600; font-variant-numeric: tabular-nums; line-height: 1; }
  .slider-odometer__sym { color: light-dark(#5f626a, #a7abb2); font-size: 22px; margin-right: 3px; }
  .slider-odometer__drum { position: relative; height: 1em; width: 0.62em; overflow: hidden; transition: width 0.35s cubic-bezier(0.3, 1.2, 0.5, 1), opacity 0.25s; -webkit-mask: linear-gradient(transparent, #000 25%, #000 75%, transparent); mask: linear-gradient(transparent, #000 25%, #000 75%, transparent); }
  .slider-odometer__reel { position: absolute; left: 0; top: 0; display: grid; transform: translateY(calc(var(--d) * -1em)); transition: transform 0.6s cubic-bezier(0.3, 1.3, 0.5, 1); transition-delay: var(--delay); }
  .slider-odometer__reel span { height: 1em; text-align: center; }
  .slider-odometer__comma { display: inline-block; width: 0.3em; overflow: hidden; color: light-dark(#5f626a, #a7abb2); transition: width 0.35s, opacity 0.25s; }
  .slider-odometer__drum[data-lead], .slider-odometer__comma[data-lead] { width: 0; opacity: 0; }
  .slider-odometer__track { position: relative; width: 100%; height: 24px; }
  .slider-odometer__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-odometer__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(9px + var(--slider-odometer-v) * (100% - 18px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-odometer__thumb { position: absolute; top: 3px; left: calc(var(--slider-odometer-v) * (100% - 18px)); width: 18px; height: 18px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-odometer:has(.slider-odometer__input:focus-visible) .slider-odometer__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-odometer__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-odometer__input::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; }
  .slider-odometer__input::-moz-range-thumb { width: 18px; height: 18px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-odometer__reel, .slider-odometer__drum, .slider-odometer__comma { transition: none; }
  }
`;

export function OdometerSlider() {
  const [amount, setAmount] = useState(2450);
  const digits = String(amount).padStart(4, '0').split('').map(Number);
  // Leading zeros fold away, so $450 never reads $0,450; the ones digit always stays.
  const lead = 4 - String(amount).length;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-odometer" style={{ '--slider-odometer-v': amount / 5000 } as React.CSSProperties}>
        <span className="slider-odometer__read" aria-hidden="true">
          <span className="slider-odometer__sym">$</span>
          {digits.map((d, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i === 1 && (
                <span className="slider-odometer__comma" data-lead={lead >= 1 ? '' : undefined}>
                  ,
                </span>
              )}
              <span className="slider-odometer__drum" data-lead={i < lead ? '' : undefined}>
                <span className="slider-odometer__reel" style={{ '--d': d, '--delay': `${(3 - i) * 40}ms` } as React.CSSProperties}>
                  {DIGITS.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </span>
            </span>
          ))}
        </span>
        <div className="slider-odometer__track">
          <span className="slider-odometer__rail" />
          <span className="slider-odometer__fill" />
          <span className="slider-odometer__thumb" />
          <input
            className="slider-odometer__input"
            type="range"
            min={0}
            max={5000}
            step={50}
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            aria-label="Budget"
            aria-valuetext={`${amount} dollars`}
          />
        </div>
      </div>
    </>
  );
}
