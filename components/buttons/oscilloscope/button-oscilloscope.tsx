"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-oscilloscope {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 8px 20px 8px 8px;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 12px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  .btn-oscilloscope:hover { border-color: light-dark(#6d7179, #7d8087); }
  .btn-oscilloscope:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-oscilloscope__screen {
    position: relative;
    width: 124px;
    height: 38px;
    border-radius: 7px;
    background:
      linear-gradient(light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 0 / 100% 9.5px,
      linear-gradient(90deg, light-dark(#ebedf0, #232529) 1px, transparent 1px) 0 0 / 15.5px 100%,
      light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), inset 0 0 14px light-dark(rgba(0, 0, 0, 0.11), rgba(0, 0, 0, 0.35));
    overflow: hidden;
  }
  .btn-oscilloscope__trace {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 1.6;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 3px light-dark(#50535b, #c6c8cd));
  }
`;

const W = 124;
const H = 38;
const N = 90;

export function OscilloscopeButton() {
  const path = useRef<SVGPathElement>(null);
  const hover = useRef(0);
  const pulse = useRef<number | null>(null);

  useEffect(() => {
    const el = path.current!;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let blend = 0;
    let phase = 0;
    let last = performance.now();
    let raf = 0;
    const draw = () => {
      let d = '';
      const amp = 8 + 4 * blend;
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const s = Math.sin(u * Math.PI * 2 * (2 + blend) + phase);
        const square = Math.tanh(7 * s);
        let y = (s * (1 - blend) + square * blend) * amp;
        if (pulse.current !== null) y -= 13 * Math.exp(-(((u - pulse.current) / 0.035) ** 2));
        d += `${i ? 'L' : 'M'}${(u * W).toFixed(1)} ${(H / 2 + y).toFixed(1)}`;
      }
      el.setAttribute('d', d);
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      blend += (hover.current - blend) * Math.min(1, dt * 6);
      phase -= dt * (3 + 5 * blend);
      if (pulse.current !== null) {
        pulse.current += dt * 1.4;
        if (pulse.current > 1.1) pulse.current = null;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    if (still) draw();
    else raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <button
        type="button"
        className="btn-oscilloscope"
        onPointerEnter={() => (hover.current = 1)}
        onPointerLeave={() => (hover.current = 0)}
        onFocus={() => (hover.current = 1)}
        onBlur={() => (hover.current = 0)}
        onClick={() => (pulse.current = -0.1)}
      >
        <span className="btn-oscilloscope__screen" aria-hidden="true">
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <path ref={path} className="btn-oscilloscope__trace" />
          </svg>
        </span>
        Signal
      </button>
    </>
  );
}
