"use client";

import { useRef, useState } from 'react';

const css = `
  .field-drum { user-select: none; -webkit-user-select: none; width: 230px; }
  .field-drum__label { display: block; margin-bottom: 8px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-drum__body {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 4px;
    height: 132px;
    padding: 0 10px;
    border-radius: 14px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
  }
  /* The lens: the selected row reads through a raised band. */
  .field-drum__lens { position: absolute; left: 8px; right: 8px; top: 50%; height: 30px; margin-top: -15px; border-radius: 8px; background: light-dark(#ebedf0, #232529); }
  .field-drum__fade { position: absolute; inset: 0; background: linear-gradient(light-dark(#f3f4f7, #1a1c1f), transparent 32%, transparent 68%, light-dark(#f3f4f7, #1a1c1f)); pointer-events: none; }
  .field-drum__wheel { position: relative; width: 56px; height: 100%; perspective: 420px; cursor: ns-resize; touch-action: none; outline: none; }
  .field-drum__wheel:focus-visible::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 30px; margin-top: -15px; border-radius: 8px; box-shadow: inset 0 0 0 2px light-dark(#5f626a, #a7abb2); }
  .field-drum__wheel--ampm { width: 44px; }
  .field-drum__cyl { position: absolute; left: 0; right: 0; top: 50%; height: 0; transform-style: preserve-3d; }
  .field-drum__cyl[data-snap] { transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .field-drum__item {
    position: absolute;
    left: 0;
    right: 0;
    top: -15px;
    height: 30px;
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 19px; font-weight: 600; line-height: 30px;
    font-variant-numeric: tabular-nums;
    text-align: center;
    backface-visibility: hidden;
  }
  .field-drum__colon { position: relative; align-self: center; color: light-dark(#50535b, #c6c8cd); font-family: inherit; font-size: 19px; font-weight: 600; }
  @media (prefers-reduced-motion: reduce) {
    .field-drum__cyl[data-snap] { transition: none; }
  }
`;

const ITEM = 30;

type DrumProps = { label: string; items: string[]; loop: boolean; value: number; onChange: (i: number) => void; className?: string };

/** A 3D drum: items sit round a cylinder that turns under drag, wheel or arrow keys, then snaps to a row. */
function Drum({ label, items, loop, value, onChange, className = '' }: DrumProps) {
  const n = items.length;
  const step = loop ? 360 / n : 24;
  // Rounded: Math.tan can differ in the last bit between server and browser, and it lands in an attribute.
  const radius = Math.round((ITEM / 2 / Math.tan(((step / 2) * Math.PI) / 180)) * 100) / 100;
  const [pos, setPos] = useState(value);
  const [snap, setSnap] = useState(true);
  const drag = useRef<{ y: number; p: number } | null>(null);
  const wheelEnd = useRef(0);

  const clamp = (p: number) => (loop ? p : Math.max(0, Math.min(n - 1, p)));
  const settle = (p: number) => {
    const r = clamp(Math.round(p));
    setSnap(true);
    setPos(r);
    onChange(((r % n) + n) % n);
  };

  return (
    <div
      className={`field-drum__wheel ${className}`}
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuetext={items[value]}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { y: e.clientY, p: pos };
        setSnap(false);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const p = drag.current.p - (e.clientY - drag.current.y) / ITEM;
        // Past the ends of a finite drum it drags with resistance.
        setPos(loop ? p : p < 0 ? p * 0.3 : p > n - 1 ? n - 1 + (p - n + 1) * 0.3 : p);
      }}
      onPointerUp={() => {
        if (!drag.current) return;
        drag.current = null;
        settle(pos);
      }}
      onWheel={(e) => {
        setSnap(false);
        const p = clamp(pos + e.deltaY / 60);
        setPos(p);
        window.clearTimeout(wheelEnd.current);
        wheelEnd.current = window.setTimeout(() => settle(p), 120);
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          settle(Math.round(pos) + (e.key === 'ArrowDown' ? 1 : -1));
        }
      }}
    >
      <div className="field-drum__cyl" data-snap={snap || undefined} style={{ transform: `translateZ(${-radius}px) rotateX(${pos * step}deg)` }}>
        {items.map((t, i) => {
          // Nearest copy of this item to the current position, so a looping drum never shows a seam.
          const k = loop ? i + Math.round((pos - i) / n) * n : i;
          const off = Math.abs(k - pos) * step;
          return (
            <div
              key={i}
              className="field-drum__item"
              aria-hidden="true"
              style={{ transform: `rotateX(${-k * step}deg) translateZ(${radius}px)`, opacity: off > 80 ? 0 : Number((1 - off / 110).toFixed(3)) }}
            >
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
const AMPM = ['AM', 'PM'];

export function DrumInput() {
  const [h, setH] = useState(6);
  const [m, setM] = useState(6);
  const [p, setP] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-drum" role="group" aria-labelledby="field-drum-label">
        <span id="field-drum-label" className="field-drum__label">
          Alarm · {HOURS[h]}:{MINUTES[m]} {AMPM[p]}
        </span>
        <div className="field-drum__body">
          <span className="field-drum__lens" />
          <Drum label="Hour" items={HOURS} loop value={h} onChange={setH} />
          <span className="field-drum__colon" aria-hidden="true">
            :
          </span>
          <Drum label="Minute" items={MINUTES} loop value={m} onChange={setM} />
          <Drum label="AM or PM" items={AMPM} loop={false} value={p} onChange={setP} className="field-drum__wheel--ampm" />
          <span className="field-drum__fade" />
        </div>
      </div>
    </>
  );
}
