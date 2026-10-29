"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .slider-balance { display: grid; justify-items: center; gap: 12px; width: 220px; }
  .slider-balance__scale { position: relative; width: 200px; height: 108px; }
  .slider-balance__post { position: absolute; left: 50%; bottom: 0; width: 4px; height: 70px; margin-left: -2px; background: light-dark(#6d7179, #7d8087); }
  .slider-balance__post::after { content: ''; position: absolute; left: -16px; bottom: 0; width: 36px; height: 5px; border-radius: 3px; background: light-dark(#6d7179, #7d8087); }
  /* Tilt follows the split: the heavier side goes down, a little past where it settles. */
  .slider-balance__beam { position: absolute; left: 20px; right: 20px; top: 34px; height: 4px; border-radius: 2px; background: light-dark(#50535b, #c6c8cd); transform: rotate(calc((0.5 - var(--slider-balance-v)) * 22deg)); transition: transform 0.7s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .slider-balance__beam::before { content: ''; position: absolute; left: 50%; top: -4px; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: light-dark(#42454c, #e5e6e9); }
  .slider-balance__pan { position: absolute; top: 2px; width: 54px; height: 50px; margin-left: -27px; transform-origin: 50% 0; transform: rotate(calc((0.5 - var(--slider-balance-v)) * -22deg)); transition: transform 0.7s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .slider-balance__pan--l { left: 0; }
  .slider-balance__pan--r { left: 100%; }
  .slider-balance__pan::before { content: ''; position: absolute; left: 26px; top: 0; width: 1px; height: 30px; background: light-dark(#6d7179, #7d8087); }
  .slider-balance__dish { position: absolute; left: 0; right: 0; top: 30px; height: 6px; border-radius: 0 0 27px 27px; background: light-dark(#5f626a, #a7abb2); }
  .slider-balance__load { position: absolute; left: 50%; bottom: 20px; width: 22px; margin-left: -11px; border-radius: 3px; background: light-dark(#42454c, #e5e6e9); transition: height 0.4s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .slider-balance__pan--l .slider-balance__load { height: calc(4px + var(--slider-balance-v) * 22px); }
  .slider-balance__pan--r .slider-balance__load { height: calc(4px + (1 - var(--slider-balance-v)) * 22px); background: light-dark(#6d7179, #7d8087); }
  .slider-balance__tag { position: absolute; top: 40px; width: 60px; margin-left: -30px; color: light-dark(#5f626a, #a7abb2); font-size: 10.5px; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .slider-balance * { transition: none !important; }
  }
  .slider-balance__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; font-variant-numeric: tabular-nums; }
  .slider-balance__read b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-balance__track { position: relative; width: 100%; height: 24px; }
  .slider-balance__rail { position: absolute; left: 0; right: 0; top: 10px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-balance__fill { position: absolute; left: 0; top: 10px; height: 4px; border-radius: 2px; width: calc(10px + var(--slider-balance-v) * (100% - 20px)); background: light-dark(#50535b, #c6c8cd); }
  .slider-balance__thumb { position: absolute; top: 2px; left: calc(var(--slider-balance-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); }
  .slider-balance:has(.slider-balance__input:focus-visible) .slider-balance__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-balance__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-balance__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-balance__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
`;

export function BalanceSlider() {
  const [v, setV] = useState(30);
  const t = (v - 0) / (100 - 0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-balance" style={{ '--slider-balance-v': t } as React.CSSProperties}>
        <div className="slider-balance__scale" aria-hidden="true">
          <span className="slider-balance__post" />
          <span className="slider-balance__beam">
            <span className="slider-balance__pan slider-balance__pan--l">
              <span className="slider-balance__load" />
              <span className="slider-balance__dish" />
              <span className="slider-balance__tag" style={{ left: 27 }}>Save</span>
            </span>
            <span className="slider-balance__pan slider-balance__pan--r">
              <span className="slider-balance__load" />
              <span className="slider-balance__dish" />
              <span className="slider-balance__tag" style={{ left: 27 }}>Spend</span>
            </span>
          </span>
        </div>
        <span className="slider-balance__read" aria-hidden="true">
          Save <b>{v}%</b> · Spend <b>{100 - v}%</b>
        </span>
        <div className="slider-balance__track">
          <span className="slider-balance__rail" />
          <span className="slider-balance__fill" />
          <span className="slider-balance__thumb" />
          <input
            className="slider-balance__input"
            type="range"
            min={0}
            max={100} step={5}
            value={v}
            onChange={(e) => setV(+e.target.value)}
            aria-label="Save"
            aria-valuetext={`Save ${v} percent, spend ${100 - v} percent`}
          />
        </div>
      </div>
    </>
  );
}
