"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes btn-tesla-flash {
    from { box-shadow: 0 0 0 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 70%, transparent), 0 0 40px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent); background-color: light-dark(#dbdde1, #2e3035); }
    to { box-shadow: 0 0 0 14px transparent, 0 0 0 transparent; background-color: light-dark(#f3f4f7, #1a1c1f); }
  }
  .btn-tesla { position: relative; width: 260px; height: 120px; }
  .btn-tesla__arcs { position: absolute; inset: 0; overflow: visible; pointer-events: none; }
  .btn-tesla__arc {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 1.6;
    stroke-linejoin: bevel;
    filter: drop-shadow(0 0 3px light-dark(#373a40, #f1f2f3)) drop-shadow(0 0 8px light-dark(#50535b, #c6c8cd));
  }
  .btn-tesla__arc--faint { stroke-width: 0.8; opacity: 0.55; }
  .btn-tesla__node {
    fill: light-dark(#ebedf0, #232529);
    stroke: light-dark(#5f626a, #a7abb2);
    stroke-width: 1.5;
  }
  .btn-tesla__node[data-live] { fill: light-dark(#373a40, #f1f2f3); filter: drop-shadow(0 0 6px light-dark(#373a40, #f1f2f3)); }
  .btn-tesla__btn {
    position: absolute;
    left: 50px;
    top: 50px;
    width: 160px;
    height: 46px;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.06em;
    cursor: pointer;
  }
  .btn-tesla__btn:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-tesla__btn[data-flash] { animation: btn-tesla-flash 0.45s ease-out; }
`;

const L = { x: 38, y: 73 };
const R = { x: 222, y: 73 };

/** A jagged bolt from a to b, bowed over the top of the button by `lift` px. */
function bolt(a: { x: number; y: number }, b: { x: number; y: number }, lift: number, jitter: number) {
  const n = 16;
  const cx = (a.x + b.x) / 2;
  const cy = Math.min(a.y, b.y) - lift;
  let d = `M${a.x} ${a.y}`;
  for (let i = 1; i < n; i++) {
    const t = i / n;
    // Point on the quadratic curve a → (cx, cy) → b, pushed off it at random.
    const x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * cx + t ** 2 * b.x;
    const y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * cy + t ** 2 * b.y;
    const k = Math.sin(t * Math.PI) * jitter;
    d += ` L${(x + (Math.random() - 0.5) * k).toFixed(1)} ${(y + (Math.random() - 0.5) * k * 1.4).toFixed(1)}`;
  }
  return `${d} L${b.x} ${b.y}`;
}

export function TeslaButton() {
  const [arcs, setArcs] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);
  const live = useRef(false);
  const burst = useRef(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let idle = 0;
    const id = window.setInterval(() => {
      const now = performance.now();
      if (now < burst.current) {
        setArcs([bolt(L, R, 104, 30), bolt(L, R, 90, 34), bolt(L, R, 122, 24), bolt(L, R, 78, 22)]);
      } else if (live.current) {
        setArcs([bolt(L, R, 100, 20), bolt(L, R, 92, 28)]);
      } else {
        // At rest: an occasional short crackle off the left electrode.
        idle += 1;
        const spark = idle % 36 < 2;
        setArcs(spark ? [bolt(L, { x: L.x + 22 + Math.random() * 14, y: L.y - 26 }, 6, 10)] : []);
      }
    }, 55);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="btn-tesla"
        onPointerEnter={() => (live.current = true)}
        onPointerLeave={() => (live.current = false)}
      >
        <svg className="btn-tesla__arcs" viewBox="0 0 260 120" aria-hidden="true">
          {arcs.map((d, i) => (
            <path key={i} d={d} className={`btn-tesla__arc${i % 2 ? ' btn-tesla__arc--faint' : ''}`} />
          ))}
          <circle cx={L.x} cy={L.y} r={5} className="btn-tesla__node" data-live={arcs.length > 0 || undefined} />
          <circle cx={R.x} cy={R.y} r={5} className="btn-tesla__node" data-live={arcs.length > 1 || undefined} />
        </svg>
        <button
          type="button"
          className="btn-tesla__btn"
          data-flash={flash || undefined}
          onAnimationEnd={() => setFlash(false)}
          onFocus={() => (live.current = true)}
          onBlur={() => (live.current = false)}
          onClick={() => {
            burst.current = performance.now() + 380;
            // Off then on next frame, so back-to-back clicks restart the flash.
            setFlash(false);
            requestAnimationFrame(() => setFlash(true));
          }}
        >
          Discharge
        </button>
      </div>
    </>
  );
}
