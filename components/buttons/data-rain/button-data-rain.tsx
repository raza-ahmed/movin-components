"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-data-rain {
    position: relative;
    display: grid;
    place-items: center;
    width: 210px;
    height: 60px;
    padding: 0;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 12px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.3s ease;
  }
  .btn-data-rain:hover { border-color: light-dark(#6d7179, #7d8087); }
  .btn-data-rain:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-data-rain canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  .btn-data-rain__label {
    position: relative;
    padding: 3px 10px;
    border-radius: 6px;
    background: color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent);
    box-shadow: 0 0 14px 6px color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent);
  }
`;

const GLYPHS = '01アイウエオカキクケコサシスセソ<>/{}=+*#ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘ';
const COL = 11;
const FONT = 11;

export function DataRainButton() {
  const btn = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const raining = useRef(false);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext('2d')!;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = w * dpr;
    el.height = h * dpr;
    ctx.scale(dpr, dpr);
    const cols = Math.ceil(w / COL);
    // Each column: head position (in rows), fall speed, and whether it is still pouring.
    const drops = Array.from({ length: cols }, () => ({ y: -Math.random() * 10, v: 9 + Math.random() * 10, on: false }));
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Canvas can't read CSS variables: the ink is the button's own colour (per frame, so
      // a theme switch recolours it).
      ctx.fillStyle = getComputedStyle(btn.current!).color;
      // Fade what is already drawn toward transparent, leaving a trail behind each head.
      // destination-out only uses the source's alpha, so any colour does here.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = 0.14;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = `${FONT}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      drops.forEach((d, i) => {
        if (raining.current) d.on = true;
        if (!d.on) return;
        const before = Math.floor(d.y);
        d.y += d.v * dt;
        if (Math.floor(d.y) !== before && d.y > 0) {
          ctx.globalAlpha = 0.95;
          ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * COL + 1, d.y * FONT);
        }
        if (d.y * FONT > h + FONT) {
          // Off the bottom: start again from the top, or stop if the hover has ended.
          d.y = -Math.random() * 6;
          d.v = 9 + Math.random() * 10;
          d.on = raining.current;
        }
      });
      ctx.globalAlpha = 1;
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
        className="btn-data-rain"
        onPointerEnter={() => (raining.current = true)}
        onPointerLeave={() => (raining.current = false)}
        onFocus={() => (raining.current = true)}
        onBlur={() => (raining.current = false)}
      >
        <canvas ref={canvas} aria-hidden="true" />
        <span className="btn-data-rain__label">Decrypt</span>
      </button>
    </>
  );
}
