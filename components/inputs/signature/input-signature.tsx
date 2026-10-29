"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes field-signature-ok { from { opacity: 0; transform: translateY(4px); } }
  .field-signature { width: 256px; }
  .field-signature__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .field-signature__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-signature__clear { padding: 3px 8px; border: 0; border-radius: 6px; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font-family: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
  .field-signature__clear:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .field-signature__pad { position: relative; height: 100px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); touch-action: none; cursor: crosshair; }
  .field-signature__pad canvas { position: absolute; inset: 0; width: 256px; height: 100px; }
  .field-signature__line { position: absolute; left: 30px; right: 16px; bottom: 26px; border-top: 1px solid light-dark(#cbced3, #393c41); }
  .field-signature__x { position: absolute; left: 14px; bottom: 26px; color: light-dark(#6d7179, #7d8087); font-family: inherit; font-size: 13px; font-weight: 600; }
  .field-signature__typed { position: absolute; left: 34px; right: 16px; bottom: 28px; overflow: hidden; color: light-dark(#373a40, #f1f2f3); font: italic 30px/1 Georgia, 'Times New Roman', serif; white-space: nowrap; pointer-events: none; }
  .field-signature__foot { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
  .field-signature__alt {
    flex: 1;
    min-width: 0;
    height: 30px;
    padding: 0 10px;
    border: 0;
    outline: 0;
    border-radius: 7px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 12px;
  }
  .field-signature__alt:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-signature__alt::placeholder { color: light-dark(#5f626a, #a7abb2); }
  .field-signature__ok { display: flex; align-items: center; gap: 4px; color: light-dark(#42454c, #e5e6e9); font-size: 11px; white-space: nowrap; animation: field-signature-ok 0.3s ease-out; }
  .field-signature__ok svg { width: 13px; height: 13px; }
  .field-signature__probe { position: absolute; width: 0; height: 0; overflow: hidden; color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .field-signature__ok { animation: none; }
  }
`;

const W = 256;
const H = 100;
type Pt = { x: number; y: number; w: number };

export function SignatureInput() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const probe = useRef<HTMLSpanElement>(null);
  const strokes = useRef<Pt[][]>([]);
  const drawing = useRef<{ t: number } | null>(null);
  const [signed, setSigned] = useState(false);
  const [typed, setTyped] = useState('');

  const paint = () => {
    const el = canvas.current!;
    const ctx = el.getContext('2d')!;
    ctx.setTransform(el.width / W, 0, 0, el.height / H, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = getComputedStyle(probe.current!).color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Midpoint quadratics smooth the jitter; each segment takes the width of its speed.
    for (const s of strokes.current) {
      for (let i = 1; i < s.length; i++) {
        const a = s[i - 1];
        const b = s[i];
        const prev = s[i - 2] ?? a;
        ctx.lineWidth = (a.w + b.w) / 2;
        ctx.beginPath();
        ctx.moveTo((prev.x + a.x) / 2, (prev.y + a.y) / 2);
        ctx.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    const el = canvas.current!;
    const dpr = Math.min(2, devicePixelRatio || 1);
    el.width = W * dpr;
    el.height = H * dpr;
    paint();
    // Repaint if the theme flips, so the ink follows it.
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = () => requestAnimationFrame(paint);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const point = (e: React.PointerEvent): Pt => {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: 2.4 };
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-signature">
        <span ref={probe} className="field-signature__probe" aria-hidden="true" />
        <div className="field-signature__head">
          <span className="field-signature__label" id="field-signature-label">
            Signature
          </span>
          <button
            type="button"
            className="field-signature__clear"
            onClick={() => {
              strokes.current = [];
              setSigned(false);
              setTyped('');
              paint();
            }}
          >
            Clear
          </button>
        </div>
        <div
          className="field-signature__pad"
          role="img"
          aria-labelledby="field-signature-label"
          aria-describedby="field-signature-status"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setTyped('');
            drawing.current = { t: performance.now() };
            strokes.current.push([point(e)]);
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            const s = strokes.current[strokes.current.length - 1];
            const p = point(e);
            const last = s[s.length - 1];
            const now = performance.now();
            const speed = Math.hypot(p.x - last.x, p.y - last.y) / Math.max(1, now - drawing.current.t);
            drawing.current.t = now;
            // Fast strokes run thin, slow ones pool ink; eased so the width never jumps.
            p.w = last.w + (Math.max(0.9, Math.min(3.6, 3.8 - speed * 1.6)) - last.w) * 0.35;
            s.push(p);
            paint();
          }}
          onPointerUp={() => {
            drawing.current = null;
            if (strokes.current.some((s) => s.length > 3)) setSigned(true);
          }}
        >
          <canvas ref={canvas} aria-hidden="true" />
          <span className="field-signature__x" aria-hidden="true">
            ×
          </span>
          <span className="field-signature__line" aria-hidden="true" />
          {typed && (
            <span className="field-signature__typed" aria-hidden="true">
              {typed}
            </span>
          )}
        </div>
        <div className="field-signature__foot">
          <input
            className="field-signature__alt"
            value={typed}
            placeholder="or type your name"
            aria-label="Type your name to sign"
            onChange={(e) => {
              strokes.current = [];
              paint();
              setTyped(e.target.value);
              setSigned(e.target.value.trim().length > 1);
            }}
          />
          <span id="field-signature-status" aria-live="polite">
            {signed && (
              <span className="field-signature__ok">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                Signed
              </span>
            )}
          </span>
        </div>
      </div>
    </>
  );
}
