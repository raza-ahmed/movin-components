"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes field-extrude-pop { from { transform: translateZ(-60px) scale(0.4); opacity: 0; } }
  .field-extrude { width: 250px; }
  .field-extrude__stage { display: grid; place-items: center; height: 92px; perspective: 500px; }
  .field-extrude__word {
    display: grid;
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 42px; font-weight: 600; line-height: 1;
    letter-spacing: -0.02em;
    white-space: pre;
    transform-style: preserve-3d;
  }
  /* Depth and face are separate layers, so no letter's depth can paint over its neighbour's face. */
  .field-extrude__word > span { grid-area: 1 / 1; }
  .field-extrude__depth { color: transparent; }
  .field-extrude__ch { display: inline-block; animation: field-extrude-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  .field-extrude__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-extrude__input {
    width: 100%;
    height: 38px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    border-radius: 9px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 14px; font-weight: 600;
    transition: box-shadow 0.2s;
  }
  .field-extrude__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-extrude__probe { position: absolute; width: 0; height: 0; overflow: hidden; }
  .field-extrude__probe i:nth-child(1) { color: light-dark(#6d7179, #7d8087); }
  .field-extrude__probe i:nth-child(2) { color: light-dark(#ebedf0, #232529); }
  @media (prefers-reduced-motion: reduce) { .field-extrude__ch { animation: none; } }
`;

const DEPTH = 12;
const rgb = (c: string) => (c.match(/[\d.]+/g) ?? ['0', '0', '0']).slice(0, 3).map(Number);

export function ExtrudeInput() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const depth = useRef<HTMLSpanElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const [value, setValue] = useState('Depth');

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = { x: 0, y: 0 };
    let raf = 0;
    const tick = (now: number) => {
      // Tilt toward the pointer; with no pointer, sway slowly on its own.
      const p = ptr.current;
      const tx = p ? (p.x - 0.5) * 2 : still ? 0.3 : Math.sin(now / 1400) * 0.6;
      const ty = p ? (p.y - 0.5) * 2 : still ? -0.3 : Math.cos(now / 1900) * 0.35;
      t.x += (tx - t.x) * 0.12;
      t.y += (ty - t.y) * 0.12;
      const [near, far] = [...probe.current!.children].map((c) => rgb(getComputedStyle(c).color));
      // The extrusion runs away from the viewer, so it always shows on the side you're looking from.
      const shadows = Array.from({ length: DEPTH }, (_, i) => {
        const k = (i + 1) / DEPTH;
        const c = near.map((v, j) => Math.round(v + (far[j] - v) * k));
        return `${(-t.x * (i + 1) * 0.9).toFixed(1)}px ${(-t.y * (i + 1) * 0.9 + (i + 1) * 0.4).toFixed(1)}px 0 rgb(${c.join(',')})`;
      }).join(',');
      const w = word.current!;
      depth.current!.style.textShadow = shadows;
      w.style.transform = `rotateY(${(t.x * 18).toFixed(2)}deg) rotateX(${(-t.y * 14).toFixed(2)}deg)`;
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
      <div
        ref={root}
        className="field-extrude"
        onPointerMove={(e) => {
          const r = root.current!.getBoundingClientRect();
          ptr.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
        }}
        onPointerLeave={() => (ptr.current = null)}
      >
        <span ref={probe} className="field-extrude__probe" aria-hidden="true">
          <i />
          <i />
        </span>
        <div className="field-extrude__stage" aria-hidden="true">
          <div ref={word} className="field-extrude__word">
            {[depth, null].map((ref, layer) => (
              <span key={layer} ref={ref} className={layer ? undefined : 'field-extrude__depth'}>
                {[...value].map((c, i) => (
                  <span key={`${i}${c}`} className="field-extrude__ch">
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
        <label className="field-extrude__label" htmlFor="field-extrude-input">
          Headline
        </label>
        <input
          id="field-extrude-input"
          className="field-extrude__input"
          value={value}
          maxLength={8}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </>
  );
}
