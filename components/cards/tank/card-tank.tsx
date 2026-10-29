"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  .card-tank {
    position: relative;
    width: 230px;
    height: 150px;
    border-radius: 18px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    touch-action: none;
  }
  .card-tank canvas { position: absolute; left: 0; top: 0; width: 230px; height: 150px; }
  .card-tank__text { position: relative; padding: 14px 16px; pointer-events: none; }
  .card-tank__label { color: light-dark(#50535b, #c6c8cd); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .card-tank__pct { margin-top: 4px; color: light-dark(#373a40, #f1f2f3); font-size: 34px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; }
  .card-tank__used { margin-top: 4px; color: light-dark(#42454c, #e5e6e9); font-size: 11px; font-variant-numeric: tabular-nums; }
  .card-tank__btn {
    position: absolute;
    right: 12px;
    top: 12px;
    padding: 5px 10px;
    border: 0;
    border-radius: 999px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s ease;
  }
  .card-tank__btn:active { transform: scale(0.94); }
  .card-tank__btn:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 2px; }
  .card-tank__probe { position: absolute; width: 0; height: 0; overflow: hidden; }
  .card-tank__probe i:nth-child(1) { color: light-dark(#dbdde1, #2e3035); }
  .card-tank__probe i:nth-child(2) { color: light-dark(#cbced3, #393c41); }
  .card-tank__probe i:nth-child(3) { color: light-dark(#50535b, #c6c8cd); }
`;

const W = 230;
const H = 150;
const N = 47; // surface columns
const GB = 64;
const FULL = 0.64;
const CLEAN = 0.38;
const STEP = 1 / 120;

export function TankCard() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLDivElement>(null);
  const used = useRef<HTMLDivElement>(null);
  const [clean, setClean] = useState(false);
  const sim = useRef({ levelT: FULL, kick: 0, px: -1, py: -1, vx: 0, vy: 0, hover: false });

  useEffect(() => {
    const el = canvas.current!;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = W * dpr;
    el.height = H * dpr;
    const ctx = el.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const h = new Float32Array(N);
    const v = new Float32Array(N);
    const s = sim.current;
    let level = s.levelT;
    let levelV = 0;
    let tilt = 0;
    let tiltV = 0;
    let acc = 0;
    let last = performance.now();
    let raf = 0;
    const bubbles = Array.from({ length: 8 }, (_, i) => ({ x: 20 + ((i * 53) % 190), y: H + i * 18, r: 1.5 + (i % 3), sp: 14 + (i % 4) * 6 }));
    const colX = (i: number) => (i / (N - 1)) * W;
    const surf = (i: number, t: number, back = 0) =>
      H * (1 - level) + tilt * (colX(i) - W / 2) + h[i] * (back ? 0.6 : 1) + (still ? 0 : Math.sin(t * 1.8 + i * 0.35 + back * 2) * (1.2 + back));

    const step = (dt: number) => {
      // The liquid leans toward the cursor, overshooting like a real slosh.
      const tiltT = s.hover ? (s.px / W - 0.5) * 0.28 : 0;
      tiltV += ((tiltT - tilt) * 40 - tiltV * 3.2) * dt;
      tilt += tiltV * dt;
      levelV += ((s.levelT - level) * 14 - levelV * 4.5) * dt;
      level += levelV * dt;
      for (let i = 0; i < N; i++) {
        const l = i > 0 ? h[i - 1] : h[i];
        const r = i < N - 1 ? h[i + 1] : h[i];
        // Changes in tilt rock the whole body: the near side drops as the far side climbs.
        v[i] += ((l + r - 2 * h[i]) * 700 - h[i] * 8 - v[i] * 1.8 - tiltV * (colX(i) - W / 2) * 0.9) * dt;
      }
      for (let i = 0; i < N; i++) h[i] = Math.max(-40, Math.min(40, h[i] + v[i] * dt));
      if (s.kick) {
        for (let i = 0; i < N; i++) v[i] += Math.sin(i * 0.9) * s.kick;
        s.kick = 0;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      if (still) {
        level = s.levelT;
        h.fill(0);
      } else {
        // The cursor stirs the surface where it crosses it.
        if (s.hover && s.px >= 0) {
          const i = Math.round((s.px / W) * (N - 1));
          const near = Math.abs(s.py - surf(i, t)) < 34;
          if (near) {
            const f = Math.max(-260, Math.min(260, s.vy * 0.5 + Math.abs(s.vx) * 0.12));
            for (let k = -2; k <= 2; k++) if (v[i + k] !== undefined) v[i + k] += f * dt * 6 * (1 - Math.abs(k) * 0.3);
          }
        }
        s.vx *= 0.8;
        s.vy *= 0.8;
        acc += dt;
        while (acc >= STEP) {
          step(STEP);
          acc -= STEP;
        }
      }
      const [back, front, line] = [...probe.current!.children].map((c) => getComputedStyle(c).color);
      ctx.clearRect(0, 0, W, H);
      const fill = (color: string, b: number) => {
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let i = 0; i < N; i++) ctx.lineTo(colX(i), surf(i, t, b) - b * 5);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      fill(back, 1);
      fill(front, 0);
      ctx.beginPath();
      for (let i = 0; i < N; i++) ctx[i ? 'lineTo' : 'moveTo'](colX(i), surf(i, t));
      ctx.strokeStyle = line;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Bubbles rise and pop at the surface.
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      for (const b of bubbles) {
        if (!still) {
          b.y -= b.sp * dt;
          b.x += Math.sin(t * 3 + b.r * 7) * 0.15;
        }
        const top = surf(Math.round((b.x / W) * (N - 1)), t);
        if (b.y < top + b.r + 2) {
          b.y = H + 6 + (b.r * 13) % 30;
          b.x = 12 + ((b.x * 7.3 + 41) % 206);
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const p = Math.max(0, Math.min(1, level));
      pct.current!.textContent = `${Math.round(p * 100)}%`;
      used.current!.textContent = `${Math.round(p * GB)} of ${GB} GB used`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const move = (e: React.PointerEvent) => {
    const r = root.current!.getBoundingClientRect();
    const s = sim.current;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (s.px >= 0) {
      s.vx = (x - s.px) * 60;
      s.vy = (y - s.py) * 60;
    }
    s.px = x;
    s.py = y;
    s.hover = true;
  };

  const toggle = () => {
    const next = !clean;
    setClean(next);
    sim.current.levelT = next ? CLEAN : FULL;
    sim.current.kick = 70;
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div
        ref={root}
        className="card-tank"
        role="group"
        aria-label={`Storage: ${Math.round((clean ? CLEAN : FULL) * GB)} of ${GB} GB used`}
        onPointerMove={move}
        onPointerLeave={() => Object.assign(sim.current, { hover: false, px: -1, py: -1 })}
      >
        <span ref={probe} className="card-tank__probe" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <canvas ref={canvas} aria-hidden="true" />
        <div className="card-tank__text" aria-hidden="true">
          <div className="card-tank__label">Storage</div>
          <div ref={pct} className="card-tank__pct">
            {Math.round(FULL * 100)}%
          </div>
          <div ref={used} className="card-tank__used" />
        </div>
        <button type="button" className="card-tank__btn" onClick={toggle}>
          {clean ? 'Undo' : 'Clean up'}
        </button>
      </div>
    </>
  );
}
