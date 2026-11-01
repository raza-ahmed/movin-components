"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const H = 156;

const css = `
  .slider-rubber { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 64px; }
  .slider-rubber__body {
    position: relative;
    width: 64px;
    height: ${H}px;
    border-radius: 22px;
    overflow: hidden;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 6%, transparent);
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
  .slider-rubber--held .slider-rubber__body { cursor: grabbing; }
  .slider-rubber:has(.slider-rubber__input:focus-visible) .slider-rubber__body { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-rubber__fill { position: absolute; inset: 0; background: light-dark(#373a40, #f1f2f3); clip-path: inset(calc((1 - var(--slider-rubber-v)) * 100%) 0 0 0); transition: clip-path 0.15s ease-out; }
  .slider-rubber--held .slider-rubber__fill { transition: none; }
  .slider-rubber__icon { position: absolute; left: 50%; bottom: 16px; width: 24px; height: 24px; margin-left: -12px; color: light-dark(#50535b, #c6c8cd); overflow: visible; }
  .slider-rubber__fill .slider-rubber__icon { color: light-dark(#dbdde1, #2e3035); }
  .slider-rubber__value { font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; color: light-dark(#42454c, #e5e6e9); opacity: 0; transform: translateY(-4px); transition: opacity 0.2s, transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1); }
  .slider-rubber--held .slider-rubber__value, .slider-rubber:has(.slider-rubber__input:focus-visible) .slider-rubber__value { opacity: 1; transform: none; }
  /* Keyboard and screen readers drive the native input; the pointer drags the body. */
  .slider-rubber__input { position: absolute; left: 0; top: 0; width: 64px; height: ${H}px; margin: 0; opacity: 0; pointer-events: none; writing-mode: vertical-lr; direction: rtl; }
  @media (prefers-reduced-motion: reduce) {
    .slider-rubber__body, .slider-rubber__fill, .slider-rubber__value { transition: none !important; }
  }
`;

function Sun({ v }: { v: number }) {
  return (
    <svg className="slider-rubber__icon" viewBox="-12 -12 24 24" aria-hidden="true">
      <g transform={`rotate(${v * 0.9})`}>
        <circle r="4.2" fill="currentColor" />
        {/* Rays grow with the brightness. */}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="0" y1="-6.6" x2="0" y2={-7.4 - 3 * (v / 100)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" transform={`rotate(${i * 45})`} />
        ))}
      </g>
    </svg>
  );
}

/** Past the end the capsule follows the finger with growing resistance, up to 20px. */
const rubber = (over: number) => Math.sign(over) * 20 * (1 - 1 / (Math.abs(over) / 50 + 1));

export function RubberSlider() {
  const [v, setV] = useState(55);
  const [held, setHeld] = useState(false);
  const [pull, setPull] = useState(0);
  const [origin, setOrigin] = useState('bottom');
  const drag = useRef<{ y: number; v: number } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const s = Math.abs(pull);
  const transform = `scale(${((held ? 1.04 : 1) * (1 - (s / H) * 0.4)).toFixed(4)}, ${(1 + s / H).toFixed(4)})`;
  const end = () => {
    drag.current = null;
    setHeld(false);
    setPull(0);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className={`slider-rubber${held ? ' slider-rubber--held' : ''}`} style={{ '--slider-rubber-v': v / 100 } as React.CSSProperties}>
        <div
          className="slider-rubber__body"
          style={{
            transform,
            transformOrigin: `50% ${origin === 'bottom' ? '100%' : '0%'}`,
            transition: held ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.3, 1.6, 0.5, 1)',
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            // Drag is relative, like the control-centre sliders: grab anywhere and move from where it is.
            drag.current = { y: e.clientY, v };
            setHeld(true);
            input.current?.focus({ preventScroll: true });
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const raw = drag.current.v + ((drag.current.y - e.clientY) / H) * 100;
            setV(Math.max(0, Math.min(100, raw)));
            const over = raw > 100 ? ((raw - 100) / 100) * H : raw < 0 ? (raw / 100) * H : 0;
            if (over) setOrigin(over > 0 ? 'bottom' : 'top');
            setPull(matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : rubber(over));
          }}
          onPointerUp={end}
          onPointerCancel={end}
        >
          <Sun v={v} />
          <span className="slider-rubber__fill">
            <Sun v={v} />
          </span>
        </div>
        <input
          ref={input}
          className="slider-rubber__input"
          type="range"
          min={0}
          max={100}
          value={Math.round(v)}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Brightness"
          aria-valuetext={`${Math.round(v)}%`}
        />
        <span className="slider-rubber__value" aria-hidden="true">
          {Math.round(v)}%
        </span>
      </div>
    </>
  );
}
