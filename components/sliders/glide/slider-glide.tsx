"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const R = 12;
const MID = 36;
const LO = R;
const HI = W - R;

const css = `
  .slider-glide { position: relative; width: ${W}px; height: 64px; cursor: grab; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
  .slider-glide--held { cursor: grabbing; }
  .slider-glide__rail { position: absolute; left: 0; right: 0; top: ${MID - 2}px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-glide__fill { position: absolute; left: 0; top: ${MID - 2}px; height: 4px; border-radius: 2px; width: var(--slider-glide-x); background: light-dark(#50535b, #c6c8cd); }
  .slider-glide__ticks { position: absolute; left: ${R}px; right: ${R}px; top: ${MID + 10}px; height: 8px; display: flex; justify-content: space-between; }
  .slider-glide__ticks i { width: 1px; height: 5px; background: light-dark(#cbced3, #393c41); }
  .slider-glide__ticks i:nth-child(5n + 1) { height: 8px; }
  .slider-glide__thumb {
    position: absolute;
    top: ${MID - R}px;
    left: calc(var(--slider-glide-x) - ${R}px);
    width: ${R * 2}px;
    height: ${R * 2}px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5));
  }
  .slider-glide:has(.slider-glide__input:focus-visible) .slider-glide__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-glide__value { position: absolute; top: 0; left: var(--slider-glide-x); transform: translateX(-50%); font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; color: light-dark(#42454c, #e5e6e9); }
  /* Keyboard and screen readers drive the native input; the pointer drives the physics. */
  .slider-glide__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; pointer-events: none; }
`;

export function GlideSlider() {
  const [x, setX] = useState(LO + 0.3 * (HI - LO));
  const [held, setHeld] = useState(false);
  const [squash, setSquash] = useState({ s: 0, side: 0 });
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const m = useRef({ x: 0, grab: 0, samples: [] as { t: number; x: number }[], raf: 0, timer: undefined as ReturnType<typeof setTimeout> | undefined });
  m.current.x = x;
  useEffect(() => () => cancelAnimationFrame(m.current.raf), []);

  const value = Math.round(((x - LO) / (HI - LO)) * 100);
  const clamp = (n: number) => Math.max(LO, Math.min(HI, n));
  const local = (e: React.PointerEvent) => e.clientX - root.current!.getBoundingClientRect().left;

  const bump = (speed: number, side: number) => {
    setSquash({ s: Math.min(0.32, speed / 2600), side });
    clearTimeout(m.current.timer);
    m.current.timer = setTimeout(() => setSquash({ s: 0, side }), 70);
  };

  const glide = (v0: number) => {
    let v = v0;
    let pos = m.current.x;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      pos += v * dt;
      // Friction slows it; an end returns it at under half the speed, squashed against the wall.
      v *= Math.exp(-dt * 2.6);
      if (pos < LO || pos > HI) {
        bump(Math.abs(v), pos < LO ? -1 : 1);
        pos = clamp(pos);
        v = -v * 0.42;
      }
      setX(pos);
      if (Math.abs(v) < 10) {
        m.current.raf = 0;
        return;
      }
      m.current.raf = requestAnimationFrame(step);
    };
    m.current.raf = requestAnimationFrame(step);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div
        ref={root}
        className={`slider-glide${held ? ' slider-glide--held' : ''}`}
        style={{ '--slider-glide-x': `${x}px` } as React.CSSProperties}
        onPointerDown={(e) => {
          cancelAnimationFrame(m.current.raf);
          e.currentTarget.setPointerCapture(e.pointerId);
          const px = local(e);
          // Grab the thumb where you touched it; press the track and it jumps under the pointer.
          const onThumb = Math.abs(px - m.current.x) <= R + 4;
          m.current.grab = onThumb ? px - m.current.x : 0;
          if (!onThumb) setX(clamp(px));
          m.current.samples = [{ t: e.timeStamp, x: px }];
          setHeld(true);
          input.current?.focus({ preventScroll: true });
        }}
        onPointerMove={(e) => {
          if (!held) return;
          const px = local(e);
          setX(clamp(px - m.current.grab));
          const s = m.current.samples;
          s.push({ t: e.timeStamp, x: px });
          while (s.length > 2 && e.timeStamp - s[0].t > 100) s.shift();
        }}
        onPointerUp={(e) => {
          setHeld(false);
          const s = m.current.samples;
          const [a, b] = [s[0], s[s.length - 1]];
          // A drag that stopped before release doesn't glide.
          if (!a || b.t - a.t < 10 || e.timeStamp - b.t > 60) return;
          if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          const v = Math.max(-3000, Math.min(3000, ((b.x - a.x) / (b.t - a.t)) * 1000));
          if (Math.abs(v) > 60) glide(v);
        }}
        onPointerCancel={() => setHeld(false)}
      >
        <span className="slider-glide__rail" aria-hidden="true" />
        <span className="slider-glide__fill" aria-hidden="true" />
        <span className="slider-glide__ticks" aria-hidden="true">
          {Array.from({ length: 11 }, (_, i) => (
            <i key={i} />
          ))}
        </span>
        <span
          className="slider-glide__thumb"
          aria-hidden="true"
          style={{
            transform: `scale(${(held ? 1.1 : 1) * (1 - squash.s)}, ${(held ? 1.1 : 1) * (1 + squash.s * 0.7)})`,
            transformOrigin: squash.side < 0 ? '0% 50%' : squash.side > 0 ? '100% 50%' : '50% 50%',
            transition: squash.s ? 'transform 0.06s ease-out' : 'transform 0.45s cubic-bezier(0.3, 1.8, 0.5, 1)',
          }}
        />
        <span className="slider-glide__value" aria-hidden="true">
          {value}
        </span>
        <input
          ref={input}
          className="slider-glide__input"
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            cancelAnimationFrame(m.current.raf);
            setX(LO + (+e.target.value / 100) * (HI - LO));
          }}
          aria-label="Position"
        />
      </div>
    </>
  );
}
