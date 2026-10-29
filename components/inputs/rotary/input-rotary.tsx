"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const css = `
  .field-rotary { user-select: none; -webkit-user-select: none; display: flex; align-items: center; gap: 14px; }
  .field-rotary__phone { position: relative; flex: none; width: 140px; height: 140px; }
  .field-rotary__plate { position: absolute; inset: 0; border-radius: 50%; background: light-dark(#fbfcfd, #121417); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .field-rotary__num { position: absolute; width: 22px; height: 22px; margin: -11px 0 0 -11px; color: light-dark(#373a40, #f1f2f3); font-family: inherit; font-size: 12px; font-weight: 600; line-height: 22px; text-align: center; }
  .field-rotary__disc { position: absolute; inset: 0; width: 140px; height: 140px; cursor: grab; touch-action: none; }
  .field-rotary__disc:active { cursor: grabbing; }
  .field-rotary__disc path { fill: light-dark(#dbdde1, #2e3035); stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; }
  .field-rotary__hub { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#cbced3, #393c41); }
  .field-rotary__stop { position: absolute; width: 12px; height: 4px; border-radius: 2px; background: light-dark(#42454c, #e5e6e9); transform-origin: 0 50%; }
  .field-rotary__side { display: grid; gap: 8px; width: 106px; }
  .field-rotary__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-rotary__input {
    width: 100%;
    height: 34px;
    padding: 0 8px;
    border: 0;
    outline: 0;
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: 0.5px;
  }
  .field-rotary__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-rotary__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-rotary__top > :first-child { margin: 0; }
  .field-rotary__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-rotary__info svg { width: 14px; height: 14px; }
  .field-rotary__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-rotary__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-rotary__info::after {
    content: attr(data-tip);
    position: absolute;
    right: -6px;
    bottom: calc(100% + 6px);
    z-index: 5;
    padding: 4px 8px;
    border-radius: 6px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-family: inherit; font-size: 11px; font-weight: 500; line-height: 1.3;
    width: max-content;
    max-width: 150px;
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
  }
  .field-rotary__info:hover::after, .field-rotary__info:focus-visible::after { opacity: 1; transform: none; }
`;

const C = 70;
const R = 48;
const STOP = 60; // the finger stop, in degrees clockwise from 3 o'clock
const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
// Hole n sits (n + 1) × 30° anticlockwise of the stop, so that is how far it travels to dial.
const holeAngle = (n: number) => STOP - (n + 1) * 30;
const rad = (d: number) => (d * Math.PI) / 180;
// Hole centres, rounded so the server and browser print the same numbers.
const at = (deg: number, r: number) => ({ x: Math.round((C + Math.cos(rad(deg)) * r) * 100) / 100, y: Math.round((C + Math.sin(rad(deg)) * r) * 100) / 100 });
const DISC = (() => {
  const circle = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
  return [circle(C, C, 66), ...DIGITS.map((_, i) => circle(at(holeAngle(i + 1), R).x, at(holeAngle(i + 1), R).y, 11)), circle(C, C, 24)].join('');
})();

export function RotaryInput() {
  const disc = useRef<SVGSVGElement>(null);
  const [number, setNumber] = useState('415');
  const [rot, setRot] = useState(0);
  const [back, setBack] = useState(0); // return duration in seconds; 0 while dragging
  const drag = useRef<{ n: number; prev: number; rot: number } | null>(null);
  const queue = useRef(Promise.resolve());

  const angleAt = (e: React.PointerEvent) => {
    const r = disc.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - r.top - C, e.clientX - r.left - C) * 180) / Math.PI;
  };
  const release = (r: number) => {
    // The spring drags it home at a steady governor speed, like the real thing.
    setBack(Math.max(0.2, (r / 360) * 1.1));
    setRot(0);
  };
  // Typing a digit dials it too.
  const autoDial = (d: string) => {
    const n = DIGITS.indexOf(d) + 1;
    if (!n || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    queue.current = queue.current.then(
      () =>
        new Promise<void>((done) => {
          setBack(0.35);
          setRot((n + 1) * 30);
          window.setTimeout(() => {
            release((n + 1) * 30);
            window.setTimeout(done, ((n + 1) * 30 * 1.1 * 1000) / 360 + 40);
          }, 380);
        }),
    );
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-rotary">
        <div className="field-rotary__phone" aria-hidden="true">
          <div className="field-rotary__plate">
            {DIGITS.map((d, i) => (
              <span key={d} className="field-rotary__num" style={{ left: at(holeAngle(i + 1), R).x, top: at(holeAngle(i + 1), R).y }}>
                {d}
              </span>
            ))}
          </div>
          <svg
            ref={disc}
            className="field-rotary__disc"
            viewBox="0 0 140 140"
            style={{ transform: `rotate(${rot}deg)`, transition: back ? `transform ${back}s cubic-bezier(0.3, 0, 0.6, 1)` : 'none' }}
            onPointerDown={(e) => {
              const a = angleAt(e);
              const r = disc.current!.getBoundingClientRect();
              const dist = Math.hypot(e.clientX - r.left - C, e.clientY - r.top - C);
              if (dist < R - 13 || dist > R + 13) return;
              // Which hole is under the finger?
              const n = DIGITS.findIndex((_, i) => Math.abs(((a - holeAngle(i + 1) + 540) % 360) - 180) < 15) + 1;
              if (!n) return;
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { n, prev: a, rot: 0 };
              setBack(0);
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              const a = angleAt(e);
              d.rot = Math.max(0, Math.min((d.n + 1) * 30, d.rot + (((a - d.prev + 540) % 360) - 180)));
              d.prev = a;
              setRot(d.rot);
            }}
            onPointerUp={() => {
              const d = drag.current;
              if (!d) return;
              drag.current = null;
              if (d.rot >= (d.n + 1) * 30 - 6) setNumber((s) => (s + DIGITS[d.n - 1]).slice(0, 14));
              release(d.rot);
            }}
          >
            <path d={DISC} fillRule="evenodd" />
            <circle className="field-rotary__hub" cx={C} cy={C} r="20" />
          </svg>
          <span className="field-rotary__stop" style={{ left: at(STOP, 56).x, top: at(STOP, 56).y - 2, transform: `rotate(${STOP}deg)` }} />
        </div>
        <div className="field-rotary__side">
          <div className="field-rotary__top">
            <label className="field-rotary__label" htmlFor="field-rotary-input">
              Number
            </label>
            <button type="button" className="field-rotary__info" aria-label="Drag a hole round to the stop" data-tip="Drag a hole round to the stop">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
          </div>
          <input
            id="field-rotary-input"
            className="field-rotary__input"
            type="tel"
            value={number}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, '').slice(0, 14);
              if (v.length > number.length) autoDial(v[v.length - 1]);
              setNumber(v);
            }}
          />
        </div>
      </div>
    </>
  );
}
