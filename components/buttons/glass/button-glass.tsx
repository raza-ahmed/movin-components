"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-glass {
    position: relative;
    display: grid;
    place-items: center;
    width: 260px;
    height: 150px;
  }
  .btn-glass__light {
    position: absolute;
    width: 74px;
    height: 74px;
    margin: -37px 0 0 -37px;
    left: 0;
    top: 0;
    border-radius: 50%;
    filter: blur(6px);
    will-change: transform;
    pointer-events: none;
  }
  .btn-glass__light:nth-child(1) { background: light-dark(#373a40, #f1f2f3); opacity: 0.35; }
  .btn-glass__light:nth-child(2) { background: light-dark(#5f626a, #a7abb2); opacity: 0.55; width: 56px; height: 56px; margin: -28px 0 0 -28px; }
  .btn-glass__light:nth-child(3) { background: light-dark(#42454c, #e5e6e9); opacity: 0.3; width: 90px; height: 40px; margin: -20px 0 0 -45px; }
  .btn-glass__pane {
    --hx: 50%;
    --hy: 0%;
    position: relative;
    padding: 1rem 2.4rem;
    border: none;
    border-radius: 18px;
    background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 7%, transparent);
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    box-shadow:
      inset 0 1px 0 color-mix(in oklab, light-dark(#373a40, #f1f2f3) 35%, transparent),
      inset 0 0 0 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 14%, transparent),
      0 16px 32px -14px light-dark(rgba(0, 0, 0, 0.17), rgba(0, 0, 0, 0.55));
    color: light-dark(#373a40, #f1f2f3);
    text-shadow: 0 1px 8px light-dark(#fbfcfd, #121417);
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  /* A rim light that slides round the edge toward the cursor. */
  .btn-glass__pane::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: radial-gradient(circle 70px at var(--hx) var(--hy), color-mix(in oklab, light-dark(#373a40, #f1f2f3) 80%, transparent), transparent);
    mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
    pointer-events: none;
  }
  .btn-glass__pane:hover { transform: translateY(-1px); }
  .btn-glass__pane:active { transform: scale(0.98); }
  .btn-glass__pane:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
`;

// Resting orbits for the three lights (centre offsets in px, radius, speed).
const ORBITS = [
  { cx: -50, cy: -10, r: 26, s: 0.5 },
  { cx: 46, cy: 14, r: 22, s: -0.7 },
  { cx: 0, cy: 22, r: 30, s: 0.35 },
];

export function GlassButton() {
  const root = useRef<HTMLDivElement>(null);
  const pane = useRef<HTMLButtonElement>(null);
  const lights = useRef<HTMLSpanElement[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = root.current!;
    const pos = ORBITS.map(() => ({ x: el.clientWidth / 2, y: el.clientHeight / 2 }));
    let raf = 0;
    const tick = (now: number) => {
      const t = now / 1000;
      const w = el.clientWidth;
      const h = el.clientHeight;
      ORBITS.forEach((o, i) => {
        const home = { x: w / 2 + o.cx + Math.cos(t * o.s + i) * o.r, y: h / 2 + o.cy + Math.sin(t * o.s * 1.3 + i) * o.r * 0.6 };
        // Each light gathers toward the cursor, staggered so they arrive one after another.
        const p = pointer.current;
        const target = p ? { x: home.x * 0.35 + p.x * 0.65, y: home.y * 0.35 + p.y * 0.65 } : home;
        const k = 0.04 + i * 0.02;
        pos[i].x += (target.x - pos[i].x) * k;
        pos[i].y += (target.y - pos[i].y) * k;
        lights.current[i].style.transform = `translate(${pos[i].x.toFixed(1)}px, ${pos[i].y.toFixed(1)}px)`;
      });
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
      <div
        ref={root}
        className="btn-glass"
        onPointerMove={(e) => {
          const r = root.current!.getBoundingClientRect();
          pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
          const b = pane.current!.getBoundingClientRect();
          pane.current!.style.setProperty('--hx', `${e.clientX - b.left}px`);
          pane.current!.style.setProperty('--hy', `${e.clientY - b.top}px`);
        }}
        onPointerLeave={() => (pointer.current = null)}
      >
        {ORBITS.map((_, i) => (
          <span key={i} ref={(el) => void (el && (lights.current[i] = el))} className="btn-glass__light" aria-hidden="true" />
        ))}
        <button ref={pane} type="button" className="btn-glass__pane">
          Continue
        </button>
      </div>
    </>
  );
}
