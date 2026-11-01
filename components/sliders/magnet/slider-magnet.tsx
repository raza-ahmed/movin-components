"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const T = 18;
const Y = 30;
const R = 70;
const ZONE = 6;
const at = (v: number) => T / 2 + (v / 100) * (W - T);

const css = `
  .slider-magnet { position: relative; width: ${W}px; height: 82px; }
  .slider-magnet__rail, .slider-magnet__fill { position: absolute; left: 0; top: ${Y - 2}px; height: 4px; border-radius: 2px; }
  .slider-magnet__rail { width: ${W}px; background: light-dark(#ebedf0, #232529); }
  .slider-magnet__fill { background: light-dark(#50535b, #c6c8cd); }
  .slider-magnet__pin {
    position: absolute;
    left: ${at(R) - 1}px;
    top: ${Y - 22}px;
    width: 2px;
    height: 20px;
    border-radius: 1px;
    background: light-dark(#6d7179, #7d8087);
    transform-origin: 50% 100%;
    transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1), background-color 0.2s;
  }
  .slider-magnet__pin::before { content: ''; position: absolute; left: -3px; top: -4px; width: 8px; height: 8px; border-radius: 50%; background: inherit; }
  .slider-magnet__note { position: absolute; left: ${at(R)}px; top: ${Y + 16}px; transform: translateX(-50%); font-size: 11px; color: light-dark(#6d7179, #7d8087); white-space: nowrap; transition: color 0.2s; }
  .slider-magnet--held .slider-magnet__pin { background: light-dark(#373a40, #f1f2f3); }
  .slider-magnet--held .slider-magnet__note { color: light-dark(#373a40, #f1f2f3); }
  .slider-magnet__halo { position: absolute; left: ${at(R) - 16}px; top: ${Y - 16}px; width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid light-dark(#50535b, #c6c8cd); opacity: 0; }
  .slider-magnet--held .slider-magnet__halo { animation: slider-magnet-pulse 0.5s ease-out; }
  @keyframes slider-magnet-pulse {
    from { opacity: 0.8; transform: scale(0.5); }
    to { opacity: 0; transform: scale(1.4); }
  }
  .slider-magnet__thumb { position: absolute; left: 0; top: ${Y - T / 2}px; width: ${T}px; height: ${T}px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 5px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5)); }
  .slider-magnet:has(.slider-magnet__input:focus-visible) .slider-magnet__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-magnet__value { position: absolute; left: 0; right: 0; top: ${Y + 34}px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-magnet__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-magnet__input { position: absolute; left: 0; top: ${Y - 18}px; width: 100%; height: 36px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-magnet__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 36px; }
  .slider-magnet__input::-moz-range-thumb { width: ${T}px; height: 36px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-magnet__pin { transition: background-color 0.2s; }
    .slider-magnet--held .slider-magnet__halo { animation: none; }
  }
`;

export function MagnetSlider() {
  const [v, setV] = useState(48);
  const [tx, setTx] = useState(at(48));
  const drag = useRef(false);
  const st = useRef({ x: at(48), v: 0, raf: 0 });
  const held = v === R;

  // The thumb rides a stiff, slightly loose spring, so being pulled onto the mark reads as a snap.
  useEffect(() => {
    const q = st.current;
    const target = at(v);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      q.x = target;
      setTx(target);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-420 * (q.x - target) - 22 * q.v) * dt;
      q.x += q.v * dt;
      if (Math.abs(q.x - target) < 0.05 && Math.abs(q.v) < 0.5) {
        q.x = target;
        q.v = 0;
        setTx(target);
        return;
      }
      setTx(q.x);
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [v]);

  // The pin leans towards an approaching thumb, harder the closer it gets, and stands up once it holds it.
  const d = tx - at(R);
  const lean = held || Math.abs(d) > 60 ? 0 : Math.sign(d) * 32 * (1 - Math.abs(d) / 60);

  return (
    <>
      <style>
        {css}
      </style>
      <div className={`slider-magnet${held ? ' slider-magnet--held' : ''}`}>
        <span className="slider-magnet__rail" aria-hidden="true" />
        <span className="slider-magnet__fill" style={{ width: tx }} aria-hidden="true" />
        <span className="slider-magnet__halo" aria-hidden="true" />
        <span className="slider-magnet__pin" style={{ transform: `rotate(${lean}deg)` }} aria-hidden="true" />
        <span className="slider-magnet__note" aria-hidden="true">
          Recommended
        </span>
        <span className="slider-magnet__thumb" style={{ transform: `translateX(${tx - T / 2}px)` }} aria-hidden="true" />
        <p className="slider-magnet__value" aria-hidden="true">
          <span>Quality</span>
          <b>{v}%</b>
        </p>
        <input
          className="slider-magnet__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onPointerDown={() => (drag.current = true)}
          onPointerUp={() => (drag.current = false)}
          onPointerCancel={() => (drag.current = false)}
          // Only a drag is pulled in: the arrow keys still reach every value either side of the mark.
          onChange={(e) => {
            const raw = +e.target.value;
            setV(drag.current && Math.abs(raw - R) < ZONE ? R : raw);
          }}
          aria-label="Quality"
          aria-valuetext={held ? `${v}%, recommended` : `${v}%`}
        />
      </div>
    </>
  );
}
