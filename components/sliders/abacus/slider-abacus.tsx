"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const N = 10;
const BW = 20;
const GAP = W - N * BW;
const MID = 18;
const BEAD = 'M9 0C12 0 18 10 18 14S12 28 9 28 0 18 0 14 6 0 9 0Z';

const css = `
  .slider-abacus { position: relative; width: ${W}px; height: 60px; }
  .slider-abacus__rod { position: absolute; left: -6px; right: -6px; top: ${MID - 0.75}px; height: 1.5px; background: light-dark(#cbced3, #393c41); }
  .slider-abacus__post { position: absolute; top: ${MID - 18}px; width: 4px; height: 36px; border-radius: 2px; background: light-dark(#cbced3, #393c41); }
  .slider-abacus__bead {
    position: absolute;
    left: 1px;
    top: ${MID - 14}px;
    width: 18px;
    height: 28px;
    /* Ends in a small rebound, the knock of one bead against the next. */
    transition: transform 0.42s linear(0, 0.34 18%, 0.78 40%, 1 60%, 0.975 72%, 1 86%, 1);
  }
  .slider-abacus__bead svg { display: block; overflow: visible; }
  .slider-abacus__body { fill: light-dark(#dbdde1, #2e3035); stroke: light-dark(#cbced3, #393c41); stroke-width: 1; transition: fill 0.3s, stroke 0.3s; }
  .slider-abacus__bead--on .slider-abacus__body { fill: light-dark(#42454c, #e5e6e9); stroke: light-dark(#42454c, #e5e6e9); }
  .slider-abacus__shine { fill: light-dark(#fbfcfd, #a7abb2); opacity: 0.5; }
  .slider-abacus__grip {
    position: absolute;
    top: ${MID - 9}px;
    left: calc(var(--slider-abacus-v) * ${BW}px + ${GAP / 2 - 1.5}px);
    width: 3px;
    height: 18px;
    border-radius: 2px;
    background: light-dark(#6d7179, #7d8087);
    transition: left 0.42s cubic-bezier(0.25, 1, 0.35, 1), background-color 0.2s;
  }
  .slider-abacus:has(.slider-abacus__input:active) .slider-abacus__grip { background: light-dark(#373a40, #f1f2f3); }
  .slider-abacus:has(.slider-abacus__input:focus-visible) .slider-abacus__grip { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; }
  .slider-abacus__count { position: absolute; left: 0; right: 0; top: 42px; display: flex; justify-content: space-between; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-abacus__count b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-abacus__input { position: absolute; left: 0; top: 0; width: 100%; height: 36px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-abacus__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${GAP}px; height: 36px; }
  .slider-abacus__input::-moz-range-thumb { width: ${GAP}px; height: 36px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-abacus__bead, .slider-abacus__grip { transition: none; }
  }
`;

export function AbacusSlider() {
  const [v, setV] = useState(6);
  const prev = useRef(v);
  const from = prev.current;
  useEffect(() => {
    prev.current = v;
  }, [v]);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-abacus" style={{ '--slider-abacus-v': v } as React.CSSProperties}>
        <span className="slider-abacus__rod" aria-hidden="true" />
        <span className="slider-abacus__post" style={{ left: -10 }} aria-hidden="true" />
        <span className="slider-abacus__post" style={{ right: -10 }} aria-hidden="true" />
        {Array.from({ length: N }, (_, i) => {
          const x = i < v ? i * BW : W - (N - i) * BW;
          // The beads that cross set off one after another, the nearest first.
          const delay = v > from && i >= from && i < v ? (i - from) * 32 : v < from && i >= v && i < from ? (from - 1 - i) * 32 : 0;
          return (
            <span
              key={i}
              className={`slider-abacus__bead${i < v ? ' slider-abacus__bead--on' : ''}`}
              style={{ transform: `translateX(${x}px)`, transitionDelay: `${delay}ms` }}
              aria-hidden="true"
            >
              <svg width={18} height={28} viewBox="0 0 18 28">
                <path className="slider-abacus__body" d={BEAD} />
                <ellipse className="slider-abacus__shine" cx={6} cy={10} rx={1.6} ry={4} />
              </svg>
            </span>
          );
        })}
        <span className="slider-abacus__grip" aria-hidden="true" />
        <p className="slider-abacus__count" aria-hidden="true">
          <span>Glasses of water</span>
          <span>
            <b>{v}</b> of {N}
          </span>
        </p>
        <input
          className="slider-abacus__input"
          type="range"
          min={0}
          max={N}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Glasses of water"
          aria-valuetext={`${v} of ${N}`}
        />
      </div>
    </>
  );
}
