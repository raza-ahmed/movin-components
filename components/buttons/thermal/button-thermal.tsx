"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-thermal {
    position: relative;
    display: grid;
    place-items: center;
    width: 222px;
    height: 60px;
    padding: 0;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 12px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.05em;
    cursor: crosshair;
    overflow: hidden;
  }
  .btn-thermal:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-thermal canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .btn-thermal__label {
    position: relative;
    padding: 3px 10px;
    border-radius: 6px;
    background: color-mix(in oklab, light-dark(#fbfcfd, #121417) 78%, transparent);
  }
  .btn-thermal__temp {
    position: absolute;
    right: 8px;
    bottom: 5px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 9px;
    color: light-dark(#5f626a, #a7abb2);
    font-variant-numeric: tabular-nums;
  }
`;

const CELL = 6;
const LEVELS = 6; // thermal-camera banding

export function ThermalButton() {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const temp = useRef<HTMLSpanElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext('2d')!;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = w * dpr;
    el.height = h * dpr;
    ctx.scale(dpr, dpr);
    const cols = Math.ceil(w / CELL);
    const rows = Math.ceil(h / CELL);
    let heat = new Float32Array(cols * rows);
    let next = new Float32Array(cols * rows);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const frame = () => {
      const p = pointer.current;
      if (p) {
        // Deposit heat in a soft disc around the cursor.
        const cx = p.x / CELL;
        const cy = p.y / CELL;
        for (let y = Math.max(0, Math.floor(cy - 4)); y < Math.min(rows, cy + 4); y++)
          for (let x = Math.max(0, Math.floor(cx - 4)); x < Math.min(cols, cx + 4); x++) {
            const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
            heat[y * cols + x] = Math.min(1, heat[y * cols + x] + Math.max(0, 1 - d / 3.6) * 0.22);
          }
      }
      // Diffuse into neighbours and cool.
      let peak = 0;
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const n =
            (x > 0 ? heat[i - 1] : 0) +
            (x < cols - 1 ? heat[i + 1] : 0) +
            (y > 0 ? heat[i - cols] : 0) +
            (y < rows - 1 ? heat[i + cols] : 0);
          next[i] = (heat[i] * 0.6 + n * 0.1) * 0.985;
          if (next[i] > peak) peak = next[i];
        }
      [heat, next] = [next, heat];
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(btn.current!).color;
      for (let i = 0; i < heat.length; i++) {
        const q = Math.floor(heat[i] * LEVELS) / LEVELS;
        if (q <= 0) continue;
        ctx.globalAlpha = q * 0.85;
        // Hotter cells fill more of their square, like a dithered camera readout.
        const s = CELL * (0.45 + q * 0.55);
        ctx.fillRect((i % cols) * CELL + (CELL - s) / 2, Math.floor(i / cols) * CELL + (CELL - s) / 2, s, s);
      }
      ctx.globalAlpha = 1;
      if (temp.current) temp.current.textContent = `${(21 + peak * 46).toFixed(1)}°C`;
      raf = requestAnimationFrame(frame);
    };
    if (!still) raf = requestAnimationFrame(frame);
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
        className="btn-thermal"
        onPointerMove={(e) => {
          const r = btn.current!.getBoundingClientRect();
          pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        }}
        onPointerLeave={() => (pointer.current = null)}
      >
        <canvas ref={canvas} aria-hidden="true" />
        <span className="btn-thermal__label">Thermal</span>
        <span ref={temp} className="btn-thermal__temp" aria-hidden="true">
          21.0°C
        </span>
      </button>
    </>
  );
}
