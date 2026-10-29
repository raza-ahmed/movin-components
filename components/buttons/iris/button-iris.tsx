"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-iris {
    position: relative;
    display: grid;
    place-items: center;
    width: 128px;
    height: 128px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    cursor: pointer;
    box-shadow: 0 0 0 1px light-dark(#cbced3, #393c41), 0 0 0 6px light-dark(#f3f4f7, #1a1c1f), 0 0 0 7px light-dark(#dbdde1, #2e3035);
  }
  .btn-iris:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 10px; }
  .btn-iris__inside {
    position: absolute;
    display: grid;
    place-items: center;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    text-shadow: 0 0 12px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent);
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .btn-iris:hover .btn-iris__inside,
  .btn-iris:focus-visible .btn-iris__inside { opacity: 1; transform: none; transition-delay: 0.1s; }
  .btn-iris svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
  .btn-iris__blade { stroke: light-dark(#fbfcfd, #121417); stroke-width: 1; stroke-linejoin: round; }
  .btn-iris__blade:nth-child(odd) { fill: light-dark(#ebedf0, #232529); }
  .btn-iris__blade:nth-child(even) { fill: light-dark(#dbdde1, #2e3035); }
`;

const R = 64; // aperture radius (viewBox units)
const N = 6;
const CLOSED = 1;
const OPEN = 50;

type P = { x: number; y: number };

/** Where the ray from `p` along unit `d` leaves the aperture circle. */
function exit(p: P, d: P): P {
  const b = p.x * d.x + p.y * d.y;
  const t = -b + Math.sqrt(b * b - (p.x * p.x + p.y * p.y - R * R));
  return { x: p.x + d.x * t, y: p.y + d.y * t };
}

/**
 * The six blades for an opening of radius r. The opening is a hexagon that twists
 * as it grows; each blade is bounded by one hexagon edge carried on to the rim and
 * the previous edge's extension, so the blades always tile the disc exactly.
 */
function blades(r: number): string[] {
  const twist = (1 - r / OPEN) * 0.9;
  const v = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 + twist;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  });
  const ends = v.map((p, i) => {
    const q = v[(i + 1) % N];
    const len = Math.hypot(q.x - p.x, q.y - p.y);
    return exit(q, { x: (q.x - p.x) / len, y: (q.y - p.y) / len });
  });
  return v.map((p, i) => {
    const q = v[(i + 1) % N];
    const e = ends[i];
    const prev = ends[(i + N - 1) % N];
    let a0 = Math.atan2(e.y, e.x);
    let a1 = Math.atan2(prev.y, prev.x);
    while (a1 > a0) a1 -= Math.PI * 2; // walk the rim backwards from e to prev
    let d = `M${p.x.toFixed(2)} ${p.y.toFixed(2)}L${q.x.toFixed(2)} ${q.y.toFixed(2)}L${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
    const steps = 10;
    for (let s = 1; s <= steps; s++) {
      const a = a0 + ((a1 - a0) * s) / steps;
      d += `L${(Math.cos(a) * R).toFixed(2)} ${(Math.sin(a) * R).toFixed(2)}`;
    }
    return `${d}Z`;
  });
}

export function IrisButton() {
  const group = useRef<SVGGElement>(null);
  const target = useRef(CLOSED);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let r = CLOSED;
    let raf = 0;
    const draw = () => {
      const paths = group.current!.children;
      blades(r).forEach((d, i) => paths[i].setAttribute('d', d));
    };
    const tick = () => {
      r = still ? target.current : r + (target.current - r) * 0.14;
      draw();
      raf = requestAnimationFrame(tick);
    };
    draw();
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const open = () => (target.current = OPEN);
  const close = () => (target.current = CLOSED);

  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-iris"
        onPointerEnter={open}
        onPointerLeave={close}
        onFocus={open}
        onBlur={close}
      >
        <span className="btn-iris__inside">Open</span>
        <svg viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} aria-hidden="true">
          <clipPath id="btn-iris-aperture">
            <circle r={R} />
          </clipPath>
          <g ref={group} clipPath="url(#btn-iris-aperture)">
            {Array.from({ length: N }, (_, i) => (
              <path key={i} className="btn-iris__blade" d={blades(CLOSED)[i]} />
            ))}
          </g>
        </svg>
      </button>
    </>
  );
}
