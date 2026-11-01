"use client";

import { useEffect, useId, useRef, useState } from 'react';

const W = 240;
const Y = 22;
const at = (v: number) => 6 + (v / 100) * (W - 12);

type Ember = { x: number; y: number; vx: number; vy: number; life: number; max: number };

const css = `
  .slider-fuse { position: relative; width: ${W}px; height: 66px; }
  .slider-fuse__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 44px; overflow: visible; }
  .slider-fuse__cord { fill: light-dark(#50535b, #c6c8cd); }
  .slider-fuse__twist { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.3; }
  .slider-fuse__ash { fill: none; stroke-width: 2; stroke-linecap: round; stroke-dasharray: 5 2 1.5 2.5; }
  .slider-fuse__hot { stop-color: light-dark(#42454c, #e5e6e9); }
  .slider-fuse__cold { stop-color: light-dark(#cbced3, #393c41); }
  .slider-fuse__halo { stop-color: light-dark(#373a40, #f1f2f3); }
  .slider-fuse__core, .slider-fuse__ember { fill: light-dark(#373a40, #f1f2f3); }
  .slider-fuse__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-fuse:has(.slider-fuse__input:focus-visible) .slider-fuse__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-fuse__value { position: absolute; left: 0; right: 0; top: 46px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-fuse__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-fuse__input { position: absolute; left: 0; top: 0; width: 100%; height: 44px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-fuse__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 44px; }
  .slider-fuse__input::-moz-range-thumb { width: 12px; height: 44px; border: 0; }
`;

export function FuseSlider() {
  const [v, setV] = useState(64);
  const [embers, setEmbers] = useState<Ember[]>([]);
  const [flick, setFlick] = useState(1);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const box = useRef<HTMLDivElement>(null);
  const st = useRef({ x: at(64), raf: 0, acc: 0, list: [] as Ember[] });
  const sx = at(v);

  // The spark fizzes on its own and sprays harder the faster it is dragged. Paused off screen.
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let last = 0;
    let prev = q.x;
    const step = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      const moved = q.x - prev;
      prev = q.x;
      const speed = Math.min(500, Math.abs(moved) / dt);
      q.acc += dt * (8 + speed * 0.18);
      while (q.acc >= 1) {
        q.acc -= 1;
        if (q.list.length > 70) continue;
        const a = -Math.PI * (0.1 + Math.random() * 0.8);
        const s = 35 + Math.random() * 75;
        const max = 0.3 + Math.random() * 0.45;
        q.list.push({ x: q.x, y: Y, vx: Math.cos(a) * s - Math.sign(moved) * speed * 0.15, vy: Math.sin(a) * s, life: max, max });
      }
      q.list = q.list.filter((e) => (e.life -= dt) > 0);
      for (const e of q.list) {
        e.vy += 240 * dt;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
      }
      setEmbers(q.list.slice());
      setFlick(0.8 + Math.random() * 0.4);
      q.raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(q.raf);
      last = 0;
      if (e.isIntersecting) q.raf = requestAnimationFrame(step);
    });
    io.observe(box.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(q.raf);
    };
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-fuse" ref={box}>
        <svg className="slider-fuse__svg" aria-hidden="true">
          <defs>
            {/* A twisted cord: a stripe pattern skewed into diagonal turns. */}
            <pattern id={`${id}p`} patternUnits="userSpaceOnUse" width={4} height={6} patternTransform="skewX(-38)">
              <rect className="slider-fuse__cord" width={4} height={6} />
              <line className="slider-fuse__twist" x1={0.6} y1={0} x2={0.6} y2={6} />
            </pattern>
            <linearGradient id={`${id}a`} gradientUnits="userSpaceOnUse" x1={sx} x2={sx + 26} y1={0} y2={0}>
              <stop className="slider-fuse__hot" offset="0" />
              <stop className="slider-fuse__cold" offset="1" />
            </linearGradient>
            <radialGradient id={`${id}h`}>
              <stop className="slider-fuse__halo" offset="0" stopOpacity={0.55} />
              <stop className="slider-fuse__halo" offset="1" stopOpacity={0} />
            </radialGradient>
          </defs>
          <line className="slider-fuse__ash" x1={sx} y1={Y} x2={W - 3} y2={Y} stroke={`url(#${id}a)`} />
          <rect className="slider-fuse__rope" x={3} y={Y - 3} width={Math.max(0, sx - 3)} height={6} rx={3} fill={`url(#${id}p)`} />
          <circle className="slider-fuse__glow" cx={sx} cy={Y} r={11 * flick} fill={`url(#${id}h)`} />
          {embers.map((e, i) => (
            <circle key={i} className="slider-fuse__ember" cx={e.x} cy={e.y} r={1.2} opacity={e.life / e.max} />
          ))}
          <circle className="slider-fuse__core" cx={sx} cy={Y} r={2.8} />
          <circle className="slider-fuse__ring" cx={sx} cy={Y} r={9} />
        </svg>
        <p className="slider-fuse__value" aria-hidden="true">
          <span>Delay</span>
          <b>{(v / 10).toFixed(1)} s</b>
        </p>
        <input
          className="slider-fuse__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            setV(+e.target.value);
            st.current.x = at(+e.target.value);
          }}
          aria-label="Delay"
          aria-valuetext={`${(v / 10).toFixed(1)} seconds`}
        />
      </div>
    </>
  );
}
