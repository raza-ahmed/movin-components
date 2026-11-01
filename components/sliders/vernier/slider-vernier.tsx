"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const W = 240;
const R = 7;
const UNIT = (W - 2 * R) / 100;
const TRACK = 52;
// How far the pointer has to stray from the track (px) to drop to each speed.
const SPEEDS = [
  { from: 0, k: 1, label: 'Hi-speed scrubbing' },
  { from: 30, k: 0.5, label: 'Half-speed scrubbing' },
  { from: 54, k: 0.25, label: 'Quarter-speed scrubbing' },
  { from: 78, k: 0.125, label: 'Fine scrubbing' },
];
const TICKS = Array.from({ length: 201 }, (_, i) => i / 2);
const level = (t: number) => (t % 10 === 0 ? 0 : t % 5 === 0 ? 1 : t % 1 === 0 ? 2 : 3);
const pos = (v: number) => R + v * UNIT;
const clamp = (v: number) => Math.min(100, Math.max(0, v));

const css = `
  .slider-vernier { position: relative; width: ${W}px; height: 96px; touch-action: none; cursor: pointer; outline: none; user-select: none; -webkit-user-select: none; }
  .slider-vernier__head { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-vernier__value { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-vernier__scale {
    position: absolute;
    left: 0;
    top: 24px;
    width: ${W}px;
    height: 18px;
    overflow: visible;
    mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
  }
  .slider-vernier__zoom { transition: transform 0.45s cubic-bezier(0.25, 1, 0.35, 1); }
  .slider-vernier__tick { stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; transition: opacity 0.3s; }
  .slider-vernier__tick--l0 { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-vernier__tick--l2, .slider-vernier__tick--l3 { opacity: 0; }
  .slider-vernier--z1 .slider-vernier__tick--l2 { opacity: 0.4; }
  .slider-vernier--z2 .slider-vernier__tick--l2,
  .slider-vernier--z3 :is(.slider-vernier__tick--l2, .slider-vernier__tick--l3) { opacity: 1; }
  .slider-vernier__track, .slider-vernier__fill { position: absolute; left: 0; top: ${TRACK - 1}px; height: 2px; border-radius: 1px; }
  .slider-vernier__track { width: ${W}px; background: light-dark(#dbdde1, #2e3035); }
  .slider-vernier__fill { width: var(--slider-vernier-x); background: light-dark(#42454c, #e5e6e9); }
  .slider-vernier__needle { position: absolute; top: 24px; height: ${TRACK - 24}px; width: 1px; left: calc(var(--slider-vernier-x) - 0.5px); background: light-dark(#373a40, #f1f2f3); }
  .slider-vernier__thumb {
    position: absolute;
    top: ${TRACK - R}px;
    left: calc(var(--slider-vernier-x) - ${R}px);
    width: ${2 * R}px;
    height: ${2 * R}px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 1px 3px light-dark(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5));
    transition: transform 0.2s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-vernier--held .slider-vernier__thumb { transform: scale(1.2); }
  .slider-vernier:focus-visible .slider-vernier__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-vernier__speed { position: absolute; top: 72px; left: 0; right: 0; height: 16px; font-size: 12px; text-align: center; }
  .slider-vernier__label { position: absolute; inset: 0; color: light-dark(#5f626a, #a7abb2); opacity: 0; transform: translateY(4px); transition: opacity 0.2s, transform 0.25s; }
  .slider-vernier__label--on { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .slider-vernier__zoom, .slider-vernier__thumb, .slider-vernier__label { transition: none; }
  }
`;

export function VernierSlider() {
  const [v, setV] = useState(42);
  const [band, setBand] = useState(0);
  const [held, setHeld] = useState(false);
  const drag = useRef<{ x: number; track: number } | null>(null);
  const x = pos(v);
  const zoom = held ? band : 0;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, track: r.top + TRACK };
    // A press on the thumb grabs it where it is; anywhere else jumps there first.
    if (Math.abs(px - x) > 12) setV(clamp((px - R) / UNIT));
    setBand(0);
    setHeld(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const away = Math.abs(e.clientY - d.track);
    const b = SPEEDS.filter((s) => away >= s.from).length - 1;
    const dx = e.clientX - d.x;
    d.x = e.clientX;
    setBand(b);
    setV((v) => clamp(v + (dx / UNIT) * SPEEDS[b].k));
  };
  const onPointerUp = () => {
    drag.current = null;
    setHeld(false);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const next = { ArrowRight: v + step, ArrowUp: v + step, ArrowLeft: v - step, ArrowDown: v - step, PageUp: v + 10, PageDown: v - 10, Home: 0, End: 100 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setV(clamp(Math.round(next * 10) / 10));
  };

  const shown = Math.round(v * 10) / 10;
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className={`slider-vernier slider-vernier--z${zoom}${held ? ' slider-vernier--held' : ''}`}
        style={{ '--slider-vernier-x': `${x}px` } as React.CSSProperties}
        role="slider"
        tabIndex={0}
        aria-label="Position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className="slider-vernier__head" aria-hidden="true">
          <span>Position</span>
          <span className="slider-vernier__value">{shown.toFixed(1)}</span>
        </div>
        <svg className="slider-vernier__scale" viewBox={`0 0 ${W} 18`} aria-hidden="true">
          {/* Zoom about the thumb: move it to the origin, scale, move it back. */}
          <g style={{ transform: `translateX(${x}px)` }}>
            <g className="slider-vernier__zoom" style={{ transform: `scaleX(${1 / SPEEDS[zoom].k})` }}>
              <g style={{ transform: `translateX(${-x}px)` }}>
                {TICKS.map((t) => {
                  const l = level(t);
                  return (
                    <line
                      key={t}
                      className={`slider-vernier__tick slider-vernier__tick--l${l}`}
                      x1={pos(t)}
                      x2={pos(t)}
                      y1={18 - [10, 7, 5, 3][l]}
                      y2={18}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </g>
            </g>
          </g>
        </svg>
        <span className="slider-vernier__track" aria-hidden="true" />
        <span className="slider-vernier__fill" aria-hidden="true" />
        <span className="slider-vernier__needle" aria-hidden="true" />
        <span className="slider-vernier__thumb" aria-hidden="true" />
        <div className="slider-vernier__speed" aria-hidden="true">
          <span className={`slider-vernier__label${held ? '' : ' slider-vernier__label--on'}`}>Drag down to fine-tune</span>
          {SPEEDS.map((s, i) => (
            <span key={s.label} className={`slider-vernier__label${held && band === i ? ' slider-vernier__label--on' : ''}`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
