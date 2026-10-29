"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-constellation {
    position: relative;
    display: grid;
    place-items: center;
    width: 230px;
    height: 64px;
    padding: 0;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 14px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.05em;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.3s ease;
  }
  .btn-constellation:hover { border-color: light-dark(#6d7179, #7d8087); }
  .btn-constellation:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-constellation canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .btn-constellation__label {
    position: relative;
    padding: 3px 10px;
    border-radius: 999px;
    background: color-mix(in oklab, light-dark(#fbfcfd, #121417) 75%, transparent);
  }
`;

const COUNT = 34;
const LINK = 50;

export function ConstellationButton() {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext('2d')!;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = el.clientWidth;
    const h = el.clientHeight;
    el.width = w * dpr;
    el.height = h * dpr;
    ctx.scale(dpr, dpr);
    const nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
    }));
    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      // Canvas can't read CSS variables: take the ink from the button's own colour,
      // every frame, so a theme switch recolours it.
      const ink = getComputedStyle(btn.current!).color;
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      const p = pointer.current;
      for (const n of nodes) {
        if (p) {
          // Gentle pull toward the cursor, capped so the swarm never collapses onto it.
          const dx = p.x - n.x;
          const dy = p.y - n.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 90) {
            n.vx += (dx / d) * 30 * dt;
            n.vy += (dy / d) * 30 * dt;
          }
        }
        n.vx *= 0.99;
        n.vy *= 0.99;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      }
      for (let i = 0; i < COUNT; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < COUNT; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.45;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (p) {
          const d = Math.hypot(a.x - p.x, a.y - p.y);
          if (d < 80) {
            ctx.globalAlpha = (1 - d / 80) * 0.9;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!still) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <button
        ref={btn}
        type="button"
        className="btn-constellation"
        onPointerMove={(e) => {
          const r = btn.current!.getBoundingClientRect();
          pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        }}
        onPointerLeave={() => (pointer.current = null)}
      >
        <canvas ref={canvas} aria-hidden="true" />
        <span className="btn-constellation__label">Connect</span>
      </button>
    </>
  );
}
