"use client";

import { useEffect, useRef } from 'react';

const css = `
  .loader-rally {
    position: relative;
    width: 128px;
    height: 80px;
    border-radius: 8px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
  }
  .loader-rally__net {
    position: absolute;
    left: 50%;
    top: 6px;
    bottom: 6px;
    width: 2px;
    margin-left: -1px;
    background: repeating-linear-gradient(light-dark(#cbced3, #393c41) 0 4px, transparent 4px 8px);
  }
  .loader-rally__paddle,
  .loader-rally__ball {
    position: absolute;
    left: 0;
    top: 0;
    background: light-dark(#373a40, #f1f2f3);
    will-change: transform;
  }
  .loader-rally__paddle { width: 4px; height: 18px; border-radius: 2px; }
  .loader-rally__ball { width: 6px; height: 6px; border-radius: 1px; box-shadow: 0 0 8px light-dark(#373a40, #f1f2f3); }
`;

const W = 128;
const H = 80;

export function RallyLoader() {
  const ball = useRef<HTMLSpanElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minX = 12;
    const maxX = W - 18;
    let x = minX;
    let y = 30;
    let vx = 95;
    let vy = 61;
    let pl = 30;
    let pr = 30;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      x += vx * dt;
      y += vy * dt;
      if (y < 4 || y > H - 10) {
        vy = -vy;
        y = Math.max(4, Math.min(H - 10, y));
      }
      if (x > maxX || x < minX) {
        vx = -vx;
        x = Math.max(minX, Math.min(maxX, x));
        vy += (Math.random() - 0.5) * 30; // a little english off the paddle
      }
      // Each paddle chases the ball only while it is coming their way, and a touch late.
      const target = y - 6;
      if (vx < 0) pl += (target - pl) * 0.12;
      else pr += (target - pr) * 0.12;
      ball.current!.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      left.current!.style.transform = `translate(6px, ${pl.toFixed(1)}px)`;
      right.current!.style.transform = `translate(${W - 10}px, ${pr.toFixed(1)}px)`;
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
      <div className="loader-rally" role="status" aria-label="Loading">
        <span className="loader-rally__net" aria-hidden="true" />
        <span ref={left} className="loader-rally__paddle" aria-hidden="true" />
        <span ref={right} className="loader-rally__paddle" aria-hidden="true" />
        <span ref={ball} className="loader-rally__ball" aria-hidden="true" />
      </div>
    </>
  );
}
