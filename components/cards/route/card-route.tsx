"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .card-route {
    position: relative;
    width: 240px;
    height: 176px;
    border-radius: 18px;
    overflow: hidden;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-route__map { position: absolute; inset: 0; width: 100%; height: 100%; }
  .card-route__block { fill: light-dark(#f3f4f7, #1a1c1f); }
  .card-route__park { fill: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 6%, light-dark(#f3f4f7, #1a1c1f)); }
  .card-route__path-bg { fill: none; stroke: light-dark(#dbdde1, #2e3035); stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
  .card-route__path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; }
  .card-route__pin { fill: light-dark(#fbfcfd, #121417); stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.5; }
  .card-route__car { fill: light-dark(#373a40, #f1f2f3); filter: drop-shadow(0 0 4px light-dark(#373a40, #f1f2f3)); }
  .card-route__panel {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-radius: 12px;
    background: color-mix(in oklab, light-dark(#f3f4f7, #1a1c1f) 88%, transparent);
    backdrop-filter: blur(6px);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .card-route__panel b { display: block; color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .card-route__panel span { color: light-dark(#5f626a, #a7abb2); font-size: 10px; }
  .card-route__go { padding: 4px 10px; border-radius: 999px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font-size: 10px; font-weight: 600; }
`;

const ROUTE = 'M28 30 H92 V74 H150 V40 H206';
const LOOP = 5200; // ms: drive 3.8 s, arrive, hold, reset

export function RouteCard() {
  const path = useRef<SVGPathElement>(null);
  const line = useRef<SVGPathElement>(null);
  const car = useRef<SVGCircleElement>(null);
  const [eta, setEta] = useState(12);

  useEffect(() => {
    const p = path.current!;
    const len = p.getTotalLength();
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) % LOOP) / 3800;
      const u = Math.min(1, t);
      const e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2; // ease in-out
      const pt = p.getPointAtLength(e * len);
      car.current!.setAttribute('cx', pt.x.toFixed(1));
      car.current!.setAttribute('cy', pt.y.toFixed(1));
      // The route ahead stays bright; what is driven fades back.
      line.current!.style.strokeDashoffset = String(-e);
      setEta(Math.max(0, Math.ceil(12 * (1 - e))));
      if (!still) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-route" role="group" aria-label={`Route to Studio, ${eta} minutes`}>
        <svg className="card-route__map" viewBox="0 0 240 176" aria-hidden="true">
          {/* City blocks between the streets. */}
          {[
            [0, 0, 84, 22],
            [100, 0, 140, 32],
            [0, 38, 84, 28],
            [100, 48, 42, 18],
            [158, 48, 82, 40],
            [0, 82, 142, 40],
            [158, 96, 82, 30],
          ].map(([x, y, w, h], i) => (
            <rect key={i} className={i === 3 ? 'card-route__park' : 'card-route__block'} x={x} y={y} width={w} height={h} rx={4} />
          ))}
          <path className="card-route__path-bg" d={ROUTE} />
          <path ref={line} className="card-route__path" d={ROUTE} pathLength={1} />
          <path ref={path} d={ROUTE} fill="none" />
          <circle className="card-route__pin" cx={206} cy={40} r={5} />
          <circle ref={car} className="card-route__car" cx={28} cy={30} r={5} />
        </svg>
        <div className="card-route__panel">
          <div>
            <b>{eta === 0 ? 'Arrived' : `${eta} min`}</b>
            <span>Studio · 3.2 km</span>
          </div>
          <span className="card-route__go">{eta === 0 ? 'Done' : 'Live'}</span>
        </div>
      </div>
    </>
  );
}
