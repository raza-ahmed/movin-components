"use client";

import * as React from "react";
import { useState } from 'react';

const css = `
  .card-dimmer {
    --v: 0.64;
    position: relative;
    width: 220px;
    padding: 14px;
    border-radius: 18px;
    background:
      radial-gradient(circle at 28% 34%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--v) * 22%), transparent), transparent 62%),
      light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 0 calc(var(--v) * 34px) color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--v) * 16%), transparent);
    overflow: hidden;
  }
  .card-dimmer__top { display: flex; align-items: center; gap: 12px; }
  .card-dimmer__bulb { position: relative; width: 44px; height: 54px; }
  .card-dimmer__bulb svg { width: 44px; height: 54px; overflow: visible; }
  .card-dimmer__glass { fill: color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--v) * 100%), light-dark(#ebedf0, #232529)); stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1.5; filter: drop-shadow(0 0 calc(var(--v) * 12px) color-mix(in oklab, light-dark(#373a40, #f1f2f3) calc(var(--v) * 80%), transparent)); }
  .card-dimmer__base { fill: light-dark(#6d7179, #7d8087); }
  .card-dimmer__room { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-dimmer__state { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-variant-numeric: tabular-nums; }
  .card-dimmer__range {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    height: 28px;
    margin: 14px 0 0;
    border-radius: 10px;
    background:
      linear-gradient(90deg, light-dark(#42454c, #e5e6e9) calc(var(--v) * 100%), light-dark(#ebedf0, #232529) 0);
    cursor: pointer;
  }
  .card-dimmer__range:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-dimmer__range::-webkit-slider-thumb { -webkit-appearance: none; width: 6px; height: 18px; border-radius: 3px; background: light-dark(#fbfcfd, #121417); box-shadow: 0 0 0 2px light-dark(#42454c, #e5e6e9); }
  .card-dimmer__range::-moz-range-thumb { width: 6px; height: 18px; border: none; border-radius: 3px; background: light-dark(#fbfcfd, #121417); box-shadow: 0 0 0 2px light-dark(#42454c, #e5e6e9); }
`;

export function DimmerCard() {
  const [v, setV] = useState(64);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-dimmer" style={{ '--v': v / 100 } as React.CSSProperties}>
        <div className="card-dimmer__top">
          <span className="card-dimmer__bulb" aria-hidden="true">
            <svg viewBox="0 0 44 54">
              <path className="card-dimmer__glass" d="M22 3a15 15 0 0 0-9 27c2 1.6 3 3.6 3 6v2h12v-2c0-2.4 1-4.4 3-6A15 15 0 0 0 22 3Z" />
              <rect className="card-dimmer__base" x={16} y={40} width={12} height={4} rx={1.5} />
              <rect className="card-dimmer__base" x={17} y={46} width={10} height={4} rx={1.5} />
            </svg>
          </span>
          <div>
            <div className="card-dimmer__room">Living room</div>
            <div className="card-dimmer__state">{v === 0 ? 'Off' : `${v}% · 2700K`}</div>
          </div>
        </div>
        <input
          className="card-dimmer__range"
          type="range"
          min={0}
          max={100}
          value={v}
          aria-label="Brightness"
          onChange={(e) => setV(Number(e.target.value))}
        />
      </div>
    </>
  );
}
