"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const W = 240;
const JW = 14;
const MAX = 80;
const TOP = 6;
const BOT = 50;

// A jaw with a serrated inner face; `side` 1 is the left jaw, -1 the right.
const jaw = (edge: number, side: 1 | -1) => {
  const face = edge + side * JW;
  let p = `${edge},${TOP} ${face},${TOP}`;
  for (let y = TOP; y < BOT; y += 4) p += ` ${face + side * 2.5},${y + 2} ${face},${y + 4}`;
  return `${p} ${edge},${BOT}`;
};

const css = `
  .slider-clamp { position: relative; width: ${W}px; height: 92px; border-radius: 6px; touch-action: none; }
  .slider-clamp:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; }
  .slider-clamp__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 66px; overflow: visible; }
  .slider-clamp__jaw { fill: light-dark(#50535b, #c6c8cd); }
  .slider-clamp__rod { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 4; stroke-linecap: round; }
  .slider-clamp__thread { stroke: light-dark(#6d7179, #7d8087); stroke-width: 4; stroke-dasharray: 1.2 2.4; }
  .slider-clamp__word {
    position: absolute;
    left: 50%;
    top: ${(TOP + BOT) / 2 - 11}px;
    height: 22px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: light-dark(#373a40, #f1f2f3);
    white-space: nowrap;
    pointer-events: none;
  }
  .slider-clamp__grip { position: absolute; top: 0; width: ${JW + 16}px; height: 66px; cursor: ew-resize; }
  .slider-clamp__value { position: absolute; left: 0; right: 0; top: 70px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-clamp__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
`;

export function ClampSlider() {
  const [inset, setInset] = useState(30);
  const [d, setD] = useState(30);
  const [nat, setNat] = useState(66);
  const word = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const side = useRef<1 | -1>(1);
  const st = useRef({ x: 30, v: 0, raf: 0 });

  useEffect(() => setNat(word.current!.offsetWidth), []);

  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = inset;
      setD(inset);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-320 * (q.x - inset) - 30 * q.v) * dt;
      q.x += q.v * dt;
      if (Math.abs(q.x - inset) < 0.05 && Math.abs(q.v) < 0.5) {
        q.x = inset;
        q.v = 0;
        setD(inset);
        return;
      }
      setD(q.x);
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [inset]);

  const set = (n: number) => setInset(Math.round(Math.min(MAX, Math.max(0, n))));
  // Once the jaws reach the word they squash it, and it bulges a little to keep its bulk.
  const room = W - 2 * (JW + d) - 8;
  const sx = Math.min(1, room / nat);
  const drag = (e: React.PointerEvent) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const px = e.clientX - box.current!.getBoundingClientRect().left;
    set(side.current === 1 ? px - JW / 2 : W - px - JW / 2);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div
        ref={box}
        className="slider-clamp"
        role="slider"
        tabIndex={0}
        aria-label="Inset"
        aria-valuemin={0}
        aria-valuemax={MAX}
        aria-valuenow={inset}
        aria-valuetext={`${inset} pixels`}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 1;
          const by: Record<string, number> = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 10, PageDown: -10 };
          if (e.key === 'Home') set(0);
          else if (e.key === 'End') set(MAX);
          else if (by[e.key]) set(inset + by[e.key]);
          else return;
          e.preventDefault();
        }}
      >
        <svg className="slider-clamp__svg" aria-hidden="true">
          <line className="slider-clamp__rod" x1={4} y1={59} x2={W - 4} y2={59} />
          <line className="slider-clamp__thread" x1={8} y1={59} x2={W - 8} y2={59} strokeDashoffset={-d * 0.9} />
          <polygon className="slider-clamp__jaw slider-clamp__jaw--l" points={jaw(d, 1)} />
          <polygon className="slider-clamp__jaw slider-clamp__jaw--r" points={jaw(W - d, -1)} />
          <rect className="slider-clamp__jaw slider-clamp__jaw--l" x={d + 3} y={BOT} width={8} height={9} />
          <rect className="slider-clamp__jaw slider-clamp__jaw--r" x={W - d - 11} y={BOT} width={8} height={9} />
        </svg>
        <span ref={word} className="slider-clamp__word" style={{ transform: `translateX(-50%) scale(${sx}, ${1 + (1 - sx) * 0.3})` }} aria-hidden="true">
          Content
        </span>
        {([1, -1] as const).map((s) => (
          <span
            key={s}
            className={`slider-clamp__grip slider-clamp__grip--${s === 1 ? 'l' : 'r'}`}
            style={{ left: s === 1 ? d - 8 : W - d - JW - 8 }}
            onPointerDown={(e) => {
              side.current = s;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={drag}
            aria-hidden="true"
          />
        ))}
        <p className="slider-clamp__value" aria-hidden="true">
          <span>Inset</span>
          <b>{inset} px</b>
        </p>
      </div>
    </>
  );
}
