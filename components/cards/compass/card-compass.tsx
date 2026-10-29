"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .card-compass {
    display: grid;
    justify-items: center;
    gap: 8px;
    width: 196px;
    padding: 14px 14px 12px;
    border-radius: 18px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-compass__dial { position: relative; width: 132px; height: 132px; }
  .card-compass__dial svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .card-compass__ring { fill: light-dark(#fbfcfd, #121417); stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1; }
  .card-compass__tick { stroke: light-dark(#cbced3, #393c41); stroke-width: 1; }
  .card-compass__tick--major { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.5; }
  .card-compass__letter { fill: light-dark(#5f626a, #a7abb2); font-size: 10px; font-weight: 600; text-anchor: middle; dominant-baseline: central; }
  .card-compass__letter--n { fill: light-dark(#373a40, #f1f2f3); }
  .card-compass__north { fill: light-dark(#373a40, #f1f2f3); }
  .card-compass__south { fill: light-dark(#cbced3, #393c41); }
  .card-compass__hub { fill: light-dark(#fbfcfd, #121417); stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.5; }
  .card-compass__read { color: light-dark(#373a40, #f1f2f3); font-size: 15px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .card-compass__read small { color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-weight: 500; margin-left: 6px; }
`;

const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export function CompassCard() {
  const dial = useRef<HTMLDivElement>(null);
  const needle = useRef<SVGGElement>(null);
  const target = useRef(0);
  const [heading, setHeading] = useState(0);

  // A damped spring toward the target bearing: it overshoots and settles, like a real needle.
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let a = 0;
    let v = 0;
    let raf = 0;
    let idle = 0;
    const tick = (now: number) => {
      // With no pointer around, the target drifts slowly so the needle still hunts.
      if (performance.now() - idle > 2500) target.current = Math.sin(now / 2200) * 40 + 20;
      let d = target.current - a;
      d = ((d + 540) % 360) - 180; // the short way round
      if (still) a = target.current;
      else {
        v = (v + d * 0.012) * 0.9;
        a += v;
      }
      needle.current!.style.transform = `rotate(${a.toFixed(2)}deg)`;
      setHeading(Math.round(((a % 360) + 360) % 360));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const move = (e: PointerEvent) => {
      const r = dial.current!.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      // Bearing measured clockwise from up.
      target.current = (Math.atan2(dx, -dy) * 180) / Math.PI;
      idle = performance.now();
    };
    window.addEventListener('pointermove', move);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-compass" role="group" aria-label={`Compass heading ${heading} degrees`}>
        <div ref={dial} className="card-compass__dial" aria-hidden="true">
          <svg viewBox="-66 -66 132 132">
            <circle className="card-compass__ring" r={64} />
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i * 10 * Math.PI) / 180;
              const major = i % 9 === 0;
              return (
                <line
                  key={i}
                  className={`card-compass__tick${major ? ' card-compass__tick--major' : ''}`}
                  x1={(Math.sin(a) * 60).toFixed(2)}
                  y1={(-Math.cos(a) * 60).toFixed(2)}
                  x2={(Math.sin(a) * (major ? 52 : 56)).toFixed(2)}
                  y2={(-Math.cos(a) * (major ? 52 : 56)).toFixed(2)}
                />
              );
            })}
            {['N', 'E', 'S', 'W'].map((l, i) => {
              const a = (i * 90 * Math.PI) / 180;
              return (
                <text key={l} className={`card-compass__letter${l === 'N' ? ' card-compass__letter--n' : ''}`} x={(Math.sin(a) * 42).toFixed(2)} y={(-Math.cos(a) * 42).toFixed(2)}>
                  {l}
                </text>
              );
            })}
            <g ref={needle}>
              <path className="card-compass__north" d="M0 -36 L5 0 L-5 0Z" />
              <path className="card-compass__south" d="M0 36 L5 0 L-5 0Z" />
            </g>
            <circle className="card-compass__hub" r={4} />
          </svg>
        </div>
        <div className="card-compass__read">
          {heading}°<small>{DIRS[Math.round(heading / 45) % 8]}</small>
        </div>
      </div>
    </>
  );
}
