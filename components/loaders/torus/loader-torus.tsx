"use client";

import { useEffect, useRef } from 'react';

const css = `
  .loader-torus { display: block; width: 120px; height: 120px; color: light-dark(#373a40, #f1f2f3); }
`;

const MAJOR = 30; // points round the ring
const MINOR = 10; // points round the tube
const R = 1; // ring radius
const r = 0.42; // tube radius

// The torus as points: angle u round the ring, v round the tube.
const POINTS = Array.from({ length: MAJOR * MINOR }, (_, i) => {
  const u = ((i % MAJOR) / MAJOR) * Math.PI * 2;
  const v = (Math.floor(i / MAJOR) / MINOR) * Math.PI * 2;
  return [(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)];
});

export function TorusLoader() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext('2d')!;
    const size = el.clientWidth;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = size * dpr;
    el.height = size * dpr;
    ctx.scale(dpr, dpr);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const draw = (now: number) => {
      const t = still ? 1.2 : now / 1000;
      const spin = t * 0.7; // round its own axis: the points flow round the ring
      const ax = 1.05 + Math.sin(t * 0.6) * 0.25; // tilted so the hole stays in view, rocking
      const ay = Math.sin(t * 0.4) * 0.5; // and swaying side to side
      const cs = Math.cos(spin);
      const ss = Math.sin(spin);
      const cx = Math.cos(ax);
      const sx = Math.sin(ax);
      const cy = Math.cos(ay);
      const sy = Math.sin(ay);
      // Canvas can't read CSS variables: the ink is the element's own colour (per frame, for theme switches).
      ctx.fillStyle = getComputedStyle(el).color;
      ctx.clearRect(0, 0, size, size);
      const projected = POINTS.map(([x0, y0, z]) => {
        const x = x0 * cs - y0 * ss; // spin about the torus axis (z)
        const y = x0 * ss + y0 * cs;
        const x1 = x * cy + z * sy; // sway about y
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx; // tilt about x
        const z2 = y * sx + z1 * cx;
        const k = 1 / (3.2 - z2); // perspective
        return { x: size / 2 + x1 * k * size * 0.8, y: size / 2 + y2 * k * size * 0.8, z: z2 };
      });
      // Far points first, so near ones paint over them.
      projected.sort((a, b) => a.z - b.z);
      for (const p of projected) {
        const depth = (p.z + R + r) / (2 * (R + r)); // 0 far … 1 near
        ctx.globalAlpha = 0.12 + depth * 0.88;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.6 + depth * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <canvas ref={canvas} className="loader-torus" role="status" aria-label="Loading" />
    </>
  );
}
