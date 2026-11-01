"use client";

import { useEffect, useRef, useState } from 'react';

const CELLS = 20;
const SPIN = ['|', '/', '-', '\\'];
const cellOf = (v: number) => Math.round((v / 100) * (CELLS - 1));

const css = `
  .slider-ascii { position: relative; width: 22ch; font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: light-dark(#6d7179, #7d8087); }
  .slider-ascii__top { display: flex; justify-content: space-between; margin: 0 0 4px; font-size: 12px; letter-spacing: 0.08em; }
  .slider-ascii__top b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; white-space: pre; }
  .slider-ascii__bar { position: relative; margin: 0; white-space: pre; color: light-dark(#cbced3, #393c41); border-radius: 2px; }
  .slider-ascii__edge { color: light-dark(#5f626a, #a7abb2); }
  .slider-ascii__on { color: light-dark(#373a40, #f1f2f3); }
  .slider-ascii__tip { color: light-dark(#373a40, #f1f2f3); font-weight: 700; }
  .slider-ascii:has(.slider-ascii__input:focus-visible) .slider-ascii__bar { outline: 1px dashed light-dark(#5f626a, #a7abb2); outline-offset: 4px; }
  .slider-ascii__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-ascii__input::-webkit-slider-thumb { -webkit-appearance: none; width: 1ch; height: 21px; }
  .slider-ascii__input::-moz-range-thumb { width: 1ch; height: 21px; border: 0; }
`;

export function AsciiSlider() {
  const [v, setV] = useState(55);
  const [drawn, setDrawn] = useState(cellOf(55));
  const [moving, setMoving] = useState(false);
  const [spin, setSpin] = useState(0);
  const cur = useRef(cellOf(55));
  const t = useRef({ step: 0, idle: 0 });

  // The bar redraws towards the value one character at a time, like a terminal repainting.
  useEffect(() => {
    const target = cellOf(v);
    const q = t.current;
    clearTimeout(q.step);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cur.current = target;
      setDrawn(target);
      return;
    }
    const tick = () => {
      if (cur.current === target) return;
      cur.current += Math.sign(target - cur.current);
      setDrawn(cur.current);
      q.step = window.setTimeout(tick, 22);
    };
    tick();
    return () => clearTimeout(q.step);
  }, [v]);

  // While the value is changing the head spins.
  useEffect(() => {
    if (!moving) return;
    const id = window.setInterval(() => setSpin((s) => s + 1), 70);
    return () => clearInterval(id);
  }, [moving]);
  useEffect(() => () => clearTimeout(t.current.idle), []);

  const tip = moving ? SPIN[spin % SPIN.length] : '>';

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-ascii">
        <p className="slider-ascii__top" aria-hidden="true">
          <span>VOLUME</span>
          <b>{String(v).padStart(3, ' ')}%</b>
        </p>
        <div className="slider-ascii__bar">
          <span aria-hidden="true">
            <span className="slider-ascii__edge">[</span>
            <span className="slider-ascii__on">{'='.repeat(drawn)}</span>
            <span className="slider-ascii__tip">{tip}</span>
            <span className="slider-ascii__off">{'·'.repeat(CELLS - drawn - 1)}</span>
            <span className="slider-ascii__edge">]</span>
          </span>
          <input
            className="slider-ascii__input"
            type="range"
            min={0}
            max={100}
            value={v}
            onChange={(e) => {
              setV(+e.target.value);
              if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
              setMoving(true);
              clearTimeout(t.current.idle);
              t.current.idle = window.setTimeout(() => setMoving(false), 260);
            }}
            aria-label="Volume"
            aria-valuetext={`${v}%`}
          />
        </div>
      </div>
    </>
  );
}
