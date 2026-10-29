"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .cb-pluck { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-pluck__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-pluck__box {
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41);
    transition: box-shadow 0.25s;
  }
  .cb-pluck__input:focus-visible + .cb-pluck__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-pluck__input:checked + .cb-pluck__box { box-shadow: inset 0 0 0 1.5px light-dark(#5f626a, #a7abb2); }
  .cb-pluck__box svg { position: absolute; inset: 0; width: 28px; height: 28px; overflow: visible; }
  .cb-pluck__string { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: stroke 0.25s, stroke-width 0.25s; }
  .cb-pluck__input:checked + .cb-pluck__box .cb-pluck__string { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.6; }
  .cb-pluck__pin { fill: light-dark(#50535b, #c6c8cd); }
`;

// The string runs between two pins. Ticking pulls its middle down into the vertex of a tick;
// unticking lets go, and it rings across the straight line before it settles.
const A = [7, 14.5];
const B = [21.5, 7.5];
const MID_X = 12;
const MID_Y = A[1] + ((MID_X - A[0]) * (B[1] - A[1])) / (B[0] - A[0]);
const PULL = 20 - MID_Y;
const pathAt = (t: number) => `M${A[0]} ${A[1]}L${MID_X} ${(MID_Y + t * PULL).toFixed(2)}L${B[0]} ${B[1]}`;

export function PluckCheckbox() {
  const path = useRef<SVGPathElement>(null);
  const sim = useRef({ x: 0, v: 0, raf: 0 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const s = sim.current;
    const target = on ? 1 : 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.x = target;
      path.current?.setAttribute('d', pathAt(target));
      return;
    }
    // A taut pull when ticking; a loose, ringing release when unticking.
    const [k, c] = on ? [520, 24] : [1100, 5];
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += Math.min(0.05, (now - last) / 1000);
      last = now;
      while (acc >= 1 / 240) {
        s.v += (k * (target - s.x) - c * s.v) / 240;
        s.x += s.v / 240;
        acc -= 1 / 240;
      }
      path.current?.setAttribute('d', pathAt(s.x));
      if (Math.abs(target - s.x) > 0.002 || Math.abs(s.v) > 0.02) s.raf = requestAnimationFrame(tick);
      else path.current?.setAttribute('d', pathAt(target));
    };
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.raf);
  }, [on]);

  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-pluck">
        <input className="cb-pluck__input" type="checkbox" onChange={(e) => setOn(e.currentTarget.checked)} />
        <span className="cb-pluck__box" aria-hidden="true">
          <svg viewBox="0 0 28 28">
            <path ref={path} className="cb-pluck__string" d={pathAt(0)} />
            <circle className="cb-pluck__pin" cx={A[0]} cy={A[1]} r="1.6" />
            <circle className="cb-pluck__pin" cx={B[0]} cy={B[1]} r="1.6" />
          </svg>
        </span>
        Play sounds
      </label>
    </>
  );
}
