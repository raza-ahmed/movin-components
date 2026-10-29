"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .card-gauge {
    width: 210px;
    padding: 14px 14px 12px;
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    text-align: center;
    cursor: pointer;
  }
  .card-gauge:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-gauge svg { display: block; width: 182px; height: 104px; overflow: visible; }
  .card-gauge__track { fill: none; stroke: light-dark(#ebedf0, #232529); stroke-width: 10; stroke-linecap: round; }
  .card-gauge__fill {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 10;
    stroke-linecap: round;
    stroke-dasharray: 1;
    transition: stroke-dashoffset 1.1s cubic-bezier(0.34, 1.25, 0.64, 1), opacity 0.2s ease;
  }
  .card-gauge__tick { stroke: light-dark(#cbced3, #393c41); stroke-width: 1.5; }
  .card-gauge__tick--major { stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2; }
  .card-gauge__needle {
    transform-origin: 91px 92px;
    transition: transform 1.1s cubic-bezier(0.34, 1.45, 0.64, 1);
  }
  .card-gauge__needle path { fill: light-dark(#373a40, #f1f2f3); }
  .card-gauge__hub { fill: light-dark(#f3f4f7, #1a1c1f); stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.5; }
  .card-gauge__v { margin-top: -4px; color: light-dark(#373a40, #f1f2f3); font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .card-gauge__v small { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-weight: 500; margin-left: 2px; }
  .card-gauge__k { color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  @media (prefers-reduced-motion: reduce) { .card-gauge__fill, .card-gauge__needle { transition-duration: 0.01s; } }
`;

const CX = 91;
const CY = 92;
const R = 76;
const VALUE = 72; // out of 100
const ARC = `M${CX - R} ${CY}A${R} ${R} 0 0 1 ${CX + R} ${CY}`;

export function GaugeCard() {
  const [on, setOn] = useState(false);
  const [shown, setShown] = useState(0);
  const raf = useRef(0);

  // The readout counts toward wherever the needle is heading.
  useEffect(() => {
    const target = on ? VALUE : 0;
    const from = shown;
    const start = performance.now();
    cancelAnimationFrame(raf.current);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1000);
      setShown(Math.round(from + (target - from) * (1 - (1 - p) ** 3)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [on]);

  const v = on ? VALUE : 0;
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="card-gauge"
        tabIndex={0}
        role="meter"
        aria-label="CPU load"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shown}
        onPointerEnter={() => setOn(true)}
        onPointerLeave={() => setOn(false)}
        onFocus={() => setOn(true)}
        onBlur={() => setOn(false)}
      >
        <svg viewBox="0 0 182 104" aria-hidden="true">
          <path className="card-gauge__track" d={ARC} />
          <path className="card-gauge__fill" d={ARC} pathLength={1} style={{ strokeDashoffset: 1 - v / 100, opacity: shown > 0 ? 1 : 0 }} />
          {Array.from({ length: 21 }, (_, i) => {
            const a = Math.PI * (1 - i / 20);
            const major = i % 5 === 0;
            const r1 = R - 14;
            const r2 = R - (major ? 22 : 18);
            return (
              <line
                key={i}
                className={`card-gauge__tick${major ? ' card-gauge__tick--major' : ''}`}
                // Rounded, so the server and browser print identical attributes.
                x1={(CX + Math.cos(a) * r1).toFixed(2)}
                y1={(CY - Math.sin(a) * r1).toFixed(2)}
                x2={(CX + Math.cos(a) * r2).toFixed(2)}
                y2={(CY - Math.sin(a) * r2).toFixed(2)}
              />
            );
          })}
          {/* The needle points left at 0 and turns 180deg across the dial. */}
          <g className="card-gauge__needle" style={{ transform: `rotate(${(v / 100) * 180}deg)` }}>
            <path d={`M${CX - 58} ${CY}L${CX} ${CY - 3}L${CX} ${CY + 3}Z`} />
          </g>
          <circle className="card-gauge__hub" cx={CX} cy={CY} r={6} />
        </svg>
        <div className="card-gauge__v">
          {shown}
          <small>%</small>
        </div>
        <div className="card-gauge__k">CPU load</div>
      </div>
    </>
  );
}
