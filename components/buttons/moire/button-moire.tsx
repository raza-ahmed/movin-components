"use client";

import { useEffect, useRef } from 'react';

const css = `
  .btn-moire {
    --x: 30%;
    --y: 50%;
    position: relative;
    display: grid;
    place-items: center;
    width: 220px;
    height: 64px;
    padding: 0;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 16px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.05em;
    cursor: pointer;
    overflow: hidden;
  }
  .btn-moire:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  /* Two identical ring gratings; where their centres differ, the overlap beats into fringes. */
  .btn-moire::before, .btn-moire::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .btn-moire::before {
    background: repeating-radial-gradient(circle at 50% 50%, light-dark(#5f626a, #a7abb2) 0 1px, transparent 1px 6px);
    opacity: 0.55;
  }
  .btn-moire::after {
    background: repeating-radial-gradient(circle at var(--x) var(--y), light-dark(#5f626a, #a7abb2) 0 1px, transparent 1px 6px);
    opacity: 0.55;
  }
  .btn-moire__label {
    position: relative;
    z-index: 1;
    padding: 5px 14px;
    border-radius: 999px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
`;

export function MoireButton() {
  const btn = useRef<HTMLButtonElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  // At rest the second centre circles slowly; under the cursor it follows it (eased).
  useEffect(() => {
    const el = btn.current!;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = 0.3;
    let y = 0.5;
    let raf = 0;
    const tick = (now: number) => {
      const t = now / 1000;
      const target = pointer.current ?? { x: 0.5 + Math.cos(t * 0.6) * 0.22, y: 0.5 + Math.sin(t * 0.9) * 0.3 };
      x += (target.x - x) * 0.12;
      y += (target.y - y) * 0.12;
      el.style.setProperty('--x', `${(x * 100).toFixed(2)}%`);
      el.style.setProperty('--y', `${(y * 100).toFixed(2)}%`);
      raf = requestAnimationFrame(tick);
    };
    if (!still) raf = requestAnimationFrame(tick);
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
        className="btn-moire"
        onPointerMove={(e) => {
          const r = btn.current!.getBoundingClientRect();
          pointer.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
        }}
        onPointerLeave={() => (pointer.current = null)}
      >
        <span className="btn-moire__label">Interfere</span>
      </button>
    </>
  );
}
