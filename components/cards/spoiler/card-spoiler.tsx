"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

type Speck = { x: number; y: number; vx: number; vy: number; r: number; a: number };

const css = `
  .card-spoiler { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-spoiler__who { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-spoiler__who span { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: light-dark(#cbced3, #393c41); font-size: 10px; }
  .card-spoiler__who small { font-size: 10.5px; font-weight: 400; color: light-dark(#5f626a, #a7abb2); }
  .card-spoiler__bubble { margin: 0; padding: 10px 12px; border-radius: 4px 14px 14px 14px; background: light-dark(#ebedf0, #232529); font-size: 12.5px; line-height: 1.6; color: light-dark(#373a40, #f1f2f3); }
  .card-spoiler__hidden { position: relative; display: inline-block; padding: 0 2px; border: 0; border-radius: 4px; background: none; color: inherit; font: inherit; line-height: inherit; white-space: nowrap; cursor: pointer; }
  .card-spoiler__hidden:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 1px; }
  .card-spoiler__text { opacity: 0; transition: opacity 0.4s 0.15s; }
  .card-spoiler__hidden--shown .card-spoiler__text { opacity: 1; }
  .card-spoiler__dust { position: absolute; inset: 0; width: 100%; height: 100%; color: light-dark(#50535b, #c6c8cd); pointer-events: none; }
  .card-spoiler__hint { margin: 8px 0 0; font-size: 10.5px; color: light-dark(#5f626a, #a7abb2); }
  @media (prefers-reduced-motion: reduce) {
    .card-spoiler__text { transition: none; }
  }
`;

export function SpoilerCard() {
  const [shown, setShown] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const st = useRef({ specks: [] as Speck[], burst: 0, w: 0, h: 0, raf: 0, on: false, run: () => {}, seed: () => {} });

  // Specks drift and twinkle over the hidden words on a canvas. Revealing throws each one away
  // from the click and fades them out. The loop stops when they are gone and pauses off screen.
  useEffect(() => {
    const q = st.current;
    const c = cvs.current!;
    const ctx = c.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = btn.current!.getBoundingClientRect();
    q.w = r.width;
    q.h = r.height;
    c.width = q.w * dpr;
    c.height = q.h * dpr;
    ctx.scale(dpr, dpr);
    const colour = getComputedStyle(c).color;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    q.seed = () => {
      q.burst = 0;
      q.specks = Array.from({ length: Math.round((q.w * q.h) / 7) }, () => ({ x: Math.random() * q.w, y: Math.random() * q.h, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8, r: 0.5 + Math.random() * 0.6, a: Math.random() }));
    };
    let last = 0;
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Under reduced motion the specks hold still and a reveal simply clears them.
      const fade = q.burst ? (still ? 0 : Math.max(0, 1 - (now - q.burst) / 650)) : 1;
      ctx.clearRect(0, 0, q.w, q.h);
      ctx.fillStyle = colour;
      for (const s of q.specks) {
        if (!still) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (!q.burst) {
            if (s.x < 0 || s.x > q.w) s.vx *= -1;
            if (s.y < 0 || s.y > q.h) s.vy *= -1;
          }
          s.a = Math.max(0.15, Math.min(1, s.a + (Math.random() - 0.5) * 0.2));
        }
        ctx.globalAlpha = s.a * fade;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (fade === 0 || still) {
        q.on = false;
        return;
      }
      q.raf = requestAnimationFrame(draw);
    };
    q.run = () => {
      if (q.on) return;
      q.on = true;
      last = performance.now();
      q.raf = requestAnimationFrame(draw);
    };
    q.seed();
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(q.raf);
      q.on = false;
      if (e.isIntersecting) q.run();
    });
    io.observe(c);
    return () => {
      io.disconnect();
      cancelAnimationFrame(q.raf);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    const q = st.current;
    if (shown) {
      q.seed();
      setShown(false);
      return q.run();
    }
    const r = btn.current!.getBoundingClientRect();
    // From the click, or the middle when it came from the keyboard.
    const x = e.detail ? e.clientX - r.left : q.w / 2;
    const y = e.detail ? e.clientY - r.top : q.h / 2;
    for (const s of q.specks) {
      const a = Math.atan2(s.y - y, s.x - x);
      const v = 40 + Math.random() * 90;
      s.vx = Math.cos(a) * v;
      s.vy = Math.sin(a) * v;
    }
    q.burst = performance.now();
    setShown(true);
    q.run();
  };

  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-spoiler">
        <div className="card-spoiler__who">
          <span aria-hidden="true">K</span>
          Kai <small>Book club</small>
        </div>
        <p className="card-spoiler__bubble">
          No spoilers, but it was{' '}
          <button
            ref={btn}
            type="button"
            className={`card-spoiler__hidden${shown ? ' card-spoiler__hidden--shown' : ''}`}
            aria-expanded={shown}
            aria-label={shown ? undefined : 'Hidden spoiler, show it'}
            onClick={toggle}
          >
            <span className="card-spoiler__text" aria-hidden={!shown}>
              the lighthouse keeper
            </span>
            <canvas ref={cvs} className="card-spoiler__dust" aria-hidden="true" />
          </button>{' '}
          all along.
        </p>
        <p className="card-spoiler__hint">{shown ? 'Click it again to hide it.' : 'Click the specks to reveal.'}</p>
      </article>
    </>
  );
}
