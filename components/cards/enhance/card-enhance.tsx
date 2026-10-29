"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .card-enhance {
    width: 210px;
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    padding: 8px 8px 12px;
    cursor: zoom-in;
  }
  .card-enhance:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .card-enhance canvas { display: block; width: 194px; height: 120px; border-radius: 10px; image-rendering: pixelated; }
  .card-enhance__meta { display: flex; justify-content: space-between; align-items: center; padding: 10px 4px 0; }
  .card-enhance__meta b { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-enhance__res { color: light-dark(#5f626a, #a7abb2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; font-variant-numeric: tabular-nums; }
  .card-enhance__probe { position: absolute; width: 0; height: 0; overflow: hidden; }
  .card-enhance__probe i:nth-child(1) { color: light-dark(#fbfcfd, #121417); }
  .card-enhance__probe i:nth-child(2) { color: light-dark(#dbdde1, #2e3035); }
  .card-enhance__probe i:nth-child(3) { color: light-dark(#6d7179, #7d8087); }
  .card-enhance__probe i:nth-child(4) { color: light-dark(#50535b, #c6c8cd); }
  .card-enhance__probe i:nth-child(5) { color: light-dark(#373a40, #f1f2f3); }
`;

const W = 194;
const H = 120;
// Columns across the picture at each step: blocky to full.
const STEPS = [6, 12, 24, 48, W];

export function EnhanceCard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const target = useRef(0);

  useEffect(() => {
    const el = canvas.current!;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = W * dpr;
    el.height = H * dpr;
    // The scene, painted once at full size from the palette (resolved through probe elements,
    // since a canvas can't read CSS variables).
    const ink = [...probe.current!.children].map((c) => getComputedStyle(c).color);
    const full = document.createElement('canvas');
    full.width = W;
    full.height = H;
    const f = full.getContext('2d')!;
    const sky = f.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, ink[1]);
    sky.addColorStop(1, ink[0]);
    f.fillStyle = sky;
    f.fillRect(0, 0, W, H);
    f.fillStyle = ink[4];
    f.beginPath();
    f.arc(132, 42, 18, 0, Math.PI * 2);
    f.fill();
    f.fillStyle = ink[2];
    f.beginPath();
    f.moveTo(0, 96);
    [[30, 58], [58, 80], [92, 40], [126, 84], [160, 56], [194, 78], [194, 120], [0, 120]].forEach(([x, y]) => f.lineTo(x, y));
    f.fill();
    f.fillStyle = ink[3];
    f.beginPath();
    f.moveTo(0, 108);
    [[44, 84], [80, 102], [120, 90], [158, 108], [194, 96], [194, 120], [0, 120]].forEach(([x, y]) => f.lineTo(x, y));
    f.fill();
    f.fillStyle = ink[1];
    for (let i = 0; i < 6; i++) f.fillRect(0, 112 + i * 2, W, 1);

    const ctx = el.getContext('2d')!;
    const small = document.createElement('canvas');
    const paint = (cols: number) => {
      const rows = Math.max(1, Math.round((cols * H) / W));
      small.width = cols;
      small.height = rows;
      small.getContext('2d')!.drawImage(full, 0, 0, cols, rows);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, el.width, el.height);
    };
    paint(STEPS[0]);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let s = 0;
    const id = window.setInterval(() => {
      const t = target.current;
      if (s === t) return;
      s = still ? t : s + Math.sign(t - s);
      paint(STEPS[s]);
      setStep(s);
    }, 170);
    return () => clearInterval(id);
  }, []);

  const go = (t: number) => (target.current = t);

  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="card-enhance"
        tabIndex={0}
        role="group"
        aria-label="Low tide, enhance on hover"
        onPointerEnter={() => go(STEPS.length - 1)}
        onPointerLeave={() => go(0)}
        onFocus={() => go(STEPS.length - 1)}
        onBlur={() => go(0)}
      >
        <span ref={probe} className="card-enhance__probe" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        <canvas ref={canvas} aria-hidden="true" />
        <div className="card-enhance__meta">
          <b>Low tide</b>
          <span className="card-enhance__res" aria-hidden="true">
            {step === STEPS.length - 1 ? 'full res' : `${STEPS[step]} px`}
          </span>
        </div>
      </div>
    </>
  );
}
