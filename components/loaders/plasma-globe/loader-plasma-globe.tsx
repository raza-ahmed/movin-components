"use client";

import { useEffect, useState } from 'react';

const css = `
  .loader-plasma-globe { display: block; width: 108px; height: 120px; overflow: visible; }
  .loader-plasma-globe__glass {
    fill: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 4%, transparent);
    stroke: light-dark(#6d7179, #7d8087);
    stroke-width: 1;
  }
  .loader-plasma-globe__shine { fill: none; stroke: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 35%, transparent); stroke-width: 1.5; stroke-linecap: round; }
  .loader-plasma-globe__base { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#cbced3, #393c41); stroke-width: 1; }
  .loader-plasma-globe__bolt {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 1;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 2px light-dark(#373a40, #f1f2f3)) drop-shadow(0 0 5px light-dark(#50535b, #c6c8cd));
  }
  .loader-plasma-globe__core { fill: light-dark(#373a40, #f1f2f3); filter: drop-shadow(0 0 6px light-dark(#373a40, #f1f2f3)); }
  .loader-plasma-globe__strike { fill: light-dark(#373a40, #f1f2f3); }
`;

const C = { x: 54, y: 54 };
const R = 44;

/** A wandering filament from the core to a point on the glass at angle `a`. */
function filament(a: number) {
  const end = { x: C.x + Math.cos(a) * (R - 1), y: C.y + Math.sin(a) * (R - 1) };
  let d = `M${C.x} ${C.y}`;
  const n = 10;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    // Perpendicular wander, strongest mid-way and growing toward the glass.
    const k = Math.sin(t * Math.PI) * 6 + t * 2;
    const nx = -Math.sin(a);
    const ny = Math.cos(a);
    const off = (Math.random() - 0.5) * 2 * k;
    d += ` L${(C.x + (end.x - C.x) * t + nx * off).toFixed(1)} ${(C.y + (end.y - C.y) * t + ny * off).toFixed(1)}`;
  }
  return { d: `${d} L${end.x.toFixed(1)} ${end.y.toFixed(1)}`, end };
}

export function PlasmaGlobeLoader() {
  const [bolts, setBolts] = useState<{ d: string; end: { x: number; y: number } }[]>([]);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Each filament's foot drifts round the glass at its own pace.
    const feet = [0.3, 1.5, 2.6, 3.9, 5.1].map((a, i) => ({ a, v: (i % 2 ? -1 : 1) * (0.25 + i * 0.07) }));
    let last = performance.now();
    const step = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      feet.forEach((f) => (f.a += f.v * dt + (Math.random() - 0.5) * 0.05));
      setBolts(feet.map((f) => filament(f.a)));
    };
    step();
    if (still) return;
    const id = window.setInterval(step, 70);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <svg className="loader-plasma-globe" viewBox="0 0 108 120" role="status" aria-label="Loading">
        <circle className="loader-plasma-globe__glass" cx={C.x} cy={C.y} r={R} />
        {bolts.map((b, i) => (
          <g key={i}>
            <path className="loader-plasma-globe__bolt" d={b.d} />
            <circle className="loader-plasma-globe__strike" cx={b.end.x} cy={b.end.y} r={1.6} />
          </g>
        ))}
        <circle className="loader-plasma-globe__core" cx={C.x} cy={C.y} r={5} />
        <path className="loader-plasma-globe__shine" d="M30 28a32 32 0 0 1 14-9" />
        <path className="loader-plasma-globe__base" d="M38 96h32l6 16H32z" />
      </svg>
    </>
  );
}
