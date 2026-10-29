"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes card-scrubber-in { from { opacity: 0; transform: translateY(var(--from)) rotateX(var(--tilt)); } }
  .card-scrubber {
    width: 252px;
    border-radius: 18px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
  }
  .card-scrubber__panel { height: 112px; padding: 12px 14px 0; perspective: 500px; overflow: hidden; }
  .card-scrubber__month { color: light-dark(#5f626a, #a7abb2); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
  .card-scrubber__day { animation: card-scrubber-in 0.32s cubic-bezier(0.2, 0.8, 0.3, 1); transform-origin: 50% 0; }
  .card-scrubber__date { margin-top: 2px; color: light-dark(#373a40, #f1f2f3); font-size: 22px; font-weight: 600; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .card-scrubber__events { display: grid; gap: 5px; margin: 8px 0 0; padding: 0; list-style: none; }
  .card-scrubber__events li { display: flex; gap: 8px; align-items: baseline; color: light-dark(#42454c, #e5e6e9); font-size: 11px; }
  .card-scrubber__events time { width: 34px; color: light-dark(#5f626a, #a7abb2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10px; }
  .card-scrubber__none { color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .card-scrubber__ruler {
    position: relative;
    height: 58px;
    border-top: 1px solid light-dark(#ebedf0, #232529);
    cursor: grab;
    touch-action: none;
  }
  .card-scrubber__ruler:active { cursor: grabbing; }
  .card-scrubber__ruler:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: -2px; border-radius: 0 0 18px 18px; }
  .card-scrubber__ruler canvas { display: block; width: 252px; height: 58px; mask-image: linear-gradient(90deg, transparent, #000 24%, #000 76%, transparent); }
  .card-scrubber__needle { position: absolute; left: 50%; top: 30px; bottom: 0; width: 2px; margin-left: -1px; border-radius: 1px; background: light-dark(#373a40, #f1f2f3); pointer-events: none; }
  .card-scrubber__needle::before {
    content: '';
    position: absolute;
    left: -4px;
    top: -4px;
    border: 5px solid transparent;
    border-top-color: light-dark(#373a40, #f1f2f3);
  }
  .card-scrubber__probe { position: absolute; width: 0; height: 0; overflow: hidden; }
  .card-scrubber__probe i:nth-child(1) { color: light-dark(#6d7179, #7d8087); }
  .card-scrubber__probe i:nth-child(2) { color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .card-scrubber__day { animation: none; }
  }
`;

const W = 252;
const H = 58;
const GAP = 26; // px per day
const DAYS = 30;
const MAX = (DAYS - 1) * GAP;
const EVENTS: Record<number, [string, string][]> = {
  2: [['09:30', 'Sprint planning']],
  4: [['14:00', 'Design review']],
  6: [['15:30', 'Demo day'], ['19:00', 'Team dinner']],
  9: [['11:00', 'User interviews']],
  12: [['10:00', 'Launch'], ['11:30', 'Press call']],
  13: [['16:00', 'Retro']],
  17: [['08:45', 'Flight to Lisbon']],
  18: [['All day', 'Motion meetup']],
  20: [['13:00', 'Portfolio review']],
  24: [['10:00', 'Quarterly planning'], ['15:00', '1:1 with Maya']],
  26: [['18:30', 'Climbing']],
  30: [['17:00', 'Month wrap-up']],
};
const label = (d: number) => new Date(2026, 10, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });

export function ScrubberCard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const [day, setDay] = useState(12);
  const [dir, setDir] = useState(1);
  const m = useRef({ pos: 11 * GAP, vel: 0, mode: 'snap' as 'drag' | 'free' | 'snap', target: 11 * GAP, day: 12, hold: 0, drag: { x: 0, pos: 0, hist: [] as [number, number][] } });

  useEffect(() => {
    const el = canvas.current!;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = W * dpr;
    el.height = H * dpr;
    const ctx = el.getContext('2d')!;
    ctx.scale(dpr, dpr);
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = m.current;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      if (s.mode === 'free') {
        // A flick glides on, slowing like a wheel on a bearing; past either end it is pulled back.
        s.vel *= Math.exp(-dt * 2.6);
        if (s.pos < 0 || s.pos > MAX) s.vel += ((s.pos < 0 ? 0 : MAX) - s.pos) * 60 * dt - s.vel * 8 * dt;
        s.pos += s.vel * dt;
        // Wheel input holds the ruler where it is until the scrolling stops, then it snaps.
        if (Math.abs(s.vel) < 90 && now > s.hold) {
          s.mode = 'snap';
          s.target = Math.max(0, Math.min(MAX, Math.round(s.pos / GAP) * GAP));
        }
      } else if (s.mode === 'snap') {
        if (still) {
          s.pos = s.target;
          s.vel = 0;
        } else {
          s.vel += ((s.target - s.pos) * 170 - s.vel * 20) * dt;
          s.pos += s.vel * dt;
        }
      }
      const d = Math.max(1, Math.min(DAYS, Math.round(s.pos / GAP) + 1));
      if (d !== s.day) {
        setDir(d > s.day ? 1 : -1);
        s.day = d;
        setDay(d);
      }
      const [dim, ink] = [...probe.current!.children].map((c) => getComputedStyle(c).color);
      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = 'center';
      for (let i = 0; i < DAYS; i++) {
        for (let sub = 0; sub < 4; sub++) {
          const x = W / 2 + i * GAP + (sub * GAP) / 4 - s.pos;
          if (x < -10 || x > W + 10 || (i === DAYS - 1 && sub)) continue;
          // Fisheye: everything near the needle swells.
          const mag = Math.exp(-(((x - W / 2) / 42) ** 2));
          const major = sub === 0;
          const len = major ? 9 + 15 * mag : 4 + 5 * mag;
          ctx.globalAlpha = major ? 0.45 + 0.55 * mag : 0.35;
          ctx.fillStyle = major && mag > 0.85 ? ink : dim;
          ctx.fillRect(x - (major ? 0.75 : 0.5), H - len, major ? 1.5 : 1, len);
          if (!major) continue;
          ctx.font = `${mag > 0.85 ? 700 : 500} ${(9 + 5 * mag).toFixed(1)}px system-ui, sans-serif`;
          ctx.fillText(String(i + 1), x, 14 + (1 - mag) * 2);
          if (EVENTS[i + 1]) {
            ctx.beginPath();
            ctx.arc(x, 21 + mag * 2, 1.6 + mag, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Wheel and trackpad scroll the ruler; a native listener so the page doesn't scroll with it.
    const r = ruler.current!;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      s.mode = 'free';
      s.pos = Math.max(-GAP, Math.min(MAX + GAP, s.pos + (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY)));
      s.vel = 0;
      s.hold = performance.now() + 140;
    };
    r.addEventListener('wheel', wheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      r.removeEventListener('wheel', wheel);
    };
  }, []);

  const go = (d: number) => {
    const s = m.current;
    s.mode = 'snap';
    s.target = (Math.max(1, Math.min(DAYS, d)) - 1) * GAP;
  };

  const events = EVENTS[day];
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-scrubber" role="group" aria-label="November schedule">
        <span ref={probe} className="card-scrubber__probe" aria-hidden="true">
          <i />
          <i />
        </span>
        <div className="card-scrubber__panel" aria-live="polite">
          <div className="card-scrubber__month">November 2026</div>
          <div
            key={day}
            className="card-scrubber__day"
            style={{ '--from': `${dir * 10}px`, '--tilt': `${dir * -50}deg` } as React.CSSProperties}
          >
            <div className="card-scrubber__date">{label(day)}</div>
            {events ? (
              <ul className="card-scrubber__events">
                {events.map(([t, what]) => (
                  <li key={what}>
                    <time>{t}</time>
                    {what}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="card-scrubber__events card-scrubber__none">Nothing planned</div>
            )}
          </div>
        </div>
        <div
          ref={ruler}
          className="card-scrubber__ruler"
          role="slider"
          tabIndex={0}
          aria-label="Day"
          aria-valuemin={1}
          aria-valuemax={DAYS}
          aria-valuenow={day}
          aria-valuetext={new Date(2026, 10, day).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const s = m.current;
            s.mode = 'drag';
            s.vel = 0;
            s.drag = { x: e.clientX, pos: s.pos, hist: [[performance.now(), e.clientX]] };
          }}
          onPointerMove={(e) => {
            const s = m.current;
            if (s.mode !== 'drag') return;
            const over = (p: number) => (p < 0 ? p * 0.35 : p > MAX ? MAX + (p - MAX) * 0.35 : p);
            s.pos = over(s.drag.pos - (e.clientX - s.drag.x));
            s.drag.hist = [...s.drag.hist, [performance.now(), e.clientX] as [number, number]].slice(-5);
          }}
          onPointerUp={() => {
            const s = m.current;
            if (s.mode !== 'drag') return;
            // Release velocity from the last few moves, so a flick carries on.
            const h = s.drag.hist;
            const [t0, x0] = h[0];
            const [t1, x1] = h[h.length - 1];
            const v = t1 > t0 ? -((x1 - x0) / (t1 - t0)) * 1000 : 0;
            s.vel = performance.now() - t1 > 80 ? 0 : v;
            s.mode = 'free';
          }}
          onKeyDown={(e) => {
            const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
            if (step) {
              e.preventDefault();
              go(m.current.day + step);
            }
            if (e.key === 'Home') go(1);
            if (e.key === 'End') go(DAYS);
          }}
        >
          <canvas ref={canvas} aria-hidden="true" />
          <span className="card-scrubber__needle" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
