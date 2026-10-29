"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-waveform {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: 220px;
    height: 56px;
    padding: 0;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.3s ease;
  }
  .btn-waveform:hover { border-color: light-dark(#6d7179, #7d8087); }
  .btn-waveform:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-waveform__bars {
    position: absolute;
    inset: 0 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .btn-waveform__bar {
    width: 3px;
    height: 40px;
    border-radius: 3px;
    background: light-dark(#cbced3, #393c41);
    transform: scaleY(0.15);
    will-change: transform;
  }
  .btn-waveform__label {
    position: relative;
    padding: 4px 12px;
    border-radius: 999px;
    background: color-mix(in oklab, light-dark(#f3f4f7, #1a1c1f) 82%, transparent);
    backdrop-filter: blur(2px);
  }
`;

const COUNT = 30;

export function WaveformButton() {
  const root = useRef<HTMLButtonElement>(null);
  const bars = useRef<HTMLSpanElement[]>([]);
  const cursor = useRef<{ x: number; on: number }>({ x: 0.5, on: 0 });

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bars.current.forEach((b, i) => (b.style.transform = `scaleY(${0.15 + 0.12 * Math.abs(Math.sin(i * 0.7))})`));
      return;
    }
    let raf = 0;
    let energy = 0;
    const tick = (now: number) => {
      const t = now / 1000;
      energy += (cursor.current.on - energy) * 0.08;
      bars.current.forEach((b, i) => {
        const u = i / (COUNT - 1);
        const idle = 0.14 + 0.1 * (0.5 + 0.5 * Math.sin(t * 2.2 + i * 0.55));
        const near = Math.exp(-(((u - cursor.current.x) / 0.16) ** 2));
        const beat = 0.55 + 0.45 * Math.sin(t * 11 + i * 1.7) * Math.sin(t * 5.3 + i);
        const s = Math.min(1, idle + energy * near * beat * 0.95);
        b.style.transform = `scaleY(${s.toFixed(3)})`;
        b.style.background = near * energy > 0.35 ? 'light-dark(#50535b, #c6c8cd)' : 'light-dark(#cbced3, #393c41)';
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <button
        ref={root}
        type="button"
        className="btn-waveform"
        onPointerMove={(e) => {
          const r = root.current!.getBoundingClientRect();
          cursor.current = { x: (e.clientX - r.left - 22) / (r.width - 44), on: 1 };
        }}
        onPointerLeave={() => (cursor.current.on = 0)}
        onFocus={() => (cursor.current = { x: 0.5, on: 1 })}
        onBlur={() => (cursor.current.on = 0)}
      >
        <span className="btn-waveform__bars" aria-hidden="true">
          {Array.from({ length: COUNT }, (_, i) => (
            <span key={i} ref={(el) => void (el && (bars.current[i] = el))} className="btn-waveform__bar" />
          ))}
        </span>
        <span className="btn-waveform__label">Speak</span>
      </button>
    </>
  );
}
