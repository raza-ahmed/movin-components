"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  .field-xy-pad { user-select: none; -webkit-user-select: none; width: 230px; }
  .field-xy-pad__label { display: flex; justify-content: space-between; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-xy-pad__label b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; font-variant-numeric: tabular-nums; }
  .field-xy-pad__pad {
    position: relative;
    height: 130px;
    border-radius: 12px;
    background:
      linear-gradient(light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 0 / 100% 26px,
      linear-gradient(90deg, light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 0 / 23px 100%,
      light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    cursor: crosshair;
    touch-action: none;
    outline: none;
  }
  .field-xy-pad__pad:focus-visible { box-shadow: inset 0 0 0 2px light-dark(#5f626a, #a7abb2); }
  .field-xy-pad__pad canvas { position: absolute; inset: 0; width: 230px; height: 130px; }
  .field-xy-pad__axis { display: flex; justify-content: space-between; margin-top: 5px; color: light-dark(#5f626a, #a7abb2); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; }
  .field-xy-pad__probe { position: absolute; width: 0; height: 0; overflow: hidden; }
  .field-xy-pad__probe i:nth-child(1) { color: light-dark(#6d7179, #7d8087); }
  .field-xy-pad__probe i:nth-child(2) { color: light-dark(#373a40, #f1f2f3); }
`;

const W = 230;
const H = 130;

export function XyPadInput() {
  const pad = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const target = useRef({ x: 0.62, y: 0.35 });
  const [val, setVal] = useState({ x: 0.62, y: 0.35 });
  const drag = useRef(false);

  useEffect(() => {
    const el = canvas.current!;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = W * dpr;
    el.height = H * dpr;
    const ctx = el.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const p = { x: target.current.x * W, y: (1 - target.current.y) * H };
    const trail: { x: number; y: number; t: number }[] = [];
    let raf = 0;
    const tick = (now: number) => {
      const tx = target.current.x * W;
      const ty = (1 - target.current.y) * H;
      // The puck follows with a little lag and leaves a fading trail.
      const k = still ? 1 : 0.3;
      p.x += (tx - p.x) * k;
      p.y += (ty - p.y) * k;
      trail.push({ x: p.x, y: p.y, t: now });
      while (trail.length && now - trail[0].t > 450) trail.shift();
      const [dim, ink] = [...probe.current!.children].map((c) => getComputedStyle(c).color);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = dim;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(p.x, 0);
      ctx.lineTo(p.x, H);
      ctx.moveTo(0, p.y);
      ctx.lineTo(W, p.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = ink;
      trail.forEach((q, i) => {
        ctx.globalAlpha = (i / trail.length) * 0.35;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 2 + (i / trail.length) * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const set = (x: number, y: number) => {
    const v = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
    target.current = v;
    setVal(v);
  };
  const fromPointer = (e: React.PointerEvent) => {
    const r = pad.current!.getBoundingClientRect();
    set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  };

  const cutoff = Math.round(200 * Math.pow(100, val.x));
  const res = val.y.toFixed(2);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-xy-pad">
        <span ref={probe} className="field-xy-pad__probe" aria-hidden="true">
          <i />
          <i />
        </span>
        <div className="field-xy-pad__label" id="field-xy-pad-label">
          Filter
          <b aria-hidden="true">
            {cutoff >= 1000 ? `${(cutoff / 1000).toFixed(1)} kHz` : `${cutoff} Hz`} · Q {res}
          </b>
        </div>
        <div
          ref={pad}
          className="field-xy-pad__pad"
          role="slider"
          tabIndex={0}
          aria-labelledby="field-xy-pad-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(val.x * 100)}
          aria-valuetext={`Cutoff ${cutoff} hertz, resonance ${res}. Arrow keys move; up and down set resonance.`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = true;
            fromPointer(e);
          }}
          onPointerMove={(e) => drag.current && fromPointer(e)}
          onPointerUp={() => (drag.current = false)}
          onKeyDown={(e) => {
            const d = e.shiftKey ? 0.1 : 0.02;
            const moves: Record<string, [number, number]> = { ArrowLeft: [-d, 0], ArrowRight: [d, 0], ArrowUp: [0, d], ArrowDown: [0, -d] };
            const m = moves[e.key];
            if (!m) return;
            e.preventDefault();
            set(val.x + m[0], val.y + m[1]);
          }}
        >
          <canvas ref={canvas} aria-hidden="true" />
        </div>
        <div className="field-xy-pad__axis" aria-hidden="true">
          <span>Cutoff →</span>
          <span>↑ Resonance</span>
        </div>
      </div>
    </>
  );
}
