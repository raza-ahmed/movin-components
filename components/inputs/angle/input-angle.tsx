"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const css = `
  .field-angle { user-select: none; -webkit-user-select: none; display: flex; align-items: center; gap: 16px; }
  .field-angle__dial {
    position: relative;
    flex: none;
    width: 104px;
    height: 104px;
    border-radius: 50%;
    background: radial-gradient(circle, light-dark(#f3f4f7, #1a1c1f) 58%, light-dark(#ebedf0, #232529) 59%);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    cursor: grab;
    touch-action: none;
    outline: none;
  }
  .field-angle__dial:active { cursor: grabbing; }
  .field-angle__dial:focus-visible { box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 0 0 2px light-dark(#5f626a, #a7abb2); }
  .field-angle__tick { position: absolute; left: 50%; top: 50%; width: 2px; height: 6px; margin: -3px 0 0 -1px; border-radius: 1px; background: light-dark(#cbced3, #393c41); transform: rotate(var(--a)) translateY(-45px); transition: background-color 0.2s, height 0.2s; }
  .field-angle__tick[data-major] { height: 8px; background: light-dark(#6d7179, #7d8087); }
  .field-angle__tick[data-near] { background: light-dark(#373a40, #f1f2f3); }
  .field-angle__hand { position: absolute; left: 50%; top: 50%; width: 0; height: 0; }
  .field-angle__hand::before { content: ''; position: absolute; left: -1px; bottom: 0; width: 2px; height: 34px; border-radius: 1px; background: light-dark(#50535b, #c6c8cd); }
  .field-angle__knob { position: absolute; left: -8px; top: -50px; width: 16px; height: 16px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 0 3px light-dark(#f3f4f7, #1a1c1f); }
  .field-angle__hub { position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: 50%; background: light-dark(#50535b, #c6c8cd); }
  .field-angle__side { display: grid; gap: 8px; width: 110px; }
  .field-angle__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-angle__num { display: flex; align-items: center; height: 34px; padding: 0 8px; border-radius: 8px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .field-angle__num:focus-within { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-angle__num input { width: 100%; border: 0; outline: 0; background: none; color: light-dark(#373a40, #f1f2f3); font-family: inherit; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .field-angle__num span { color: light-dark(#5f626a, #a7abb2); font-size: 13px; }
  .field-angle__swatch { height: 42px; border-radius: 8px; box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  @media (prefers-reduced-motion: reduce) {
    .field-angle__tick { transition: none; }
  }
`;

const SNAP = 4; // degrees of pull toward every multiple of 45

export function AngleInput() {
  const dial = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(135);
  // Unwrapped rotation, so the hand never spins the long way round when crossing 0.
  const [turn, setTurn] = useState(135);
  const drag = useRef(false);

  const set = (a: number) => {
    const n = ((Math.round(a) % 360) + 360) % 360;
    const d = ((n - (turn % 360) + 540) % 360) - 180;
    setTurn(turn + d);
    setAngle(n);
  };
  const fromPointer = (e: React.PointerEvent) => {
    const r = dial.current!.getBoundingClientRect();
    const deg = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    let a = (deg + 360) % 360;
    if (e.shiftKey) a = Math.round(a / 15) * 15;
    else {
      const m = Math.round(a / 45) * 45;
      if (Math.abs(a - m) < SNAP) a = m;
    }
    set(a);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-angle">
        <div
          ref={dial}
          className="field-angle__dial"
          role="slider"
          tabIndex={0}
          aria-label="Gradient angle"
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={angle}
          aria-valuetext={`${angle} degrees`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = true;
            fromPointer(e);
          }}
          onPointerMove={(e) => drag.current && fromPointer(e)}
          onPointerUp={() => (drag.current = false)}
          onKeyDown={(e) => {
            const step = (e.shiftKey ? 15 : 1) * ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key] ?? 0);
            if (!step) return;
            e.preventDefault();
            set(angle + step);
          }}
        >
          {Array.from({ length: 24 }, (_, i) => {
            const a = i * 15;
            const near = Math.abs(((a - angle + 540) % 360) - 180) < 8;
            return <span key={i} className="field-angle__tick" data-major={a % 45 === 0 || undefined} data-near={near || undefined} style={{ '--a': `${a}deg` } as React.CSSProperties} />;
          })}
          <span className="field-angle__hand" style={{ transform: `rotate(${turn}deg)` }}>
            <span className="field-angle__knob" />
          </span>
          <span className="field-angle__hub" />
        </div>
        <div className="field-angle__side">
          <label className="field-angle__label" htmlFor="field-angle-num">
            Gradient angle
          </label>
          <div className="field-angle__num">
            <input
              id="field-angle-num"
              type="number"
              min={0}
              max={359}
              value={angle}
              onChange={(e) => e.target.value !== '' && set(Number(e.target.value))}
            />
            <span aria-hidden="true">°</span>
          </div>
          <div className="field-angle__swatch" style={{ background: `linear-gradient(${angle}deg, light-dark(#373a40, #f1f2f3), light-dark(#ebedf0, #232529))` }} aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
