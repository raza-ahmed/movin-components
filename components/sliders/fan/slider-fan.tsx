"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes slider-fan-air { from { transform: translateX(-6px); opacity: 0; } 30% { opacity: 1; } to { transform: translateX(30px); opacity: 0; } }
  .slider-fan { display: grid; justify-items: center; gap: 14px; width: 220px; }
  .slider-fan__unit { position: relative; display: flex; align-items: center; gap: 4px; }
  .slider-fan__cage { position: relative; width: 112px; height: 112px; border-radius: 50%; background: repeating-radial-gradient(circle, transparent 0 9px, light-dark(#dbdde1, #2e3035) 9px 10.5px), light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 3px light-dark(#cbced3, #393c41), 0 10px 22px -12px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .slider-fan__blades { position: absolute; inset: 10px; }
  .slider-fan__blades svg { display: block; width: 100%; height: 100%; }
  .slider-fan__blade { fill: light-dark(#50535b, #c6c8cd); }
  .slider-fan__hub { fill: light-dark(#373a40, #f1f2f3); }
  .slider-fan__air { display: grid; gap: 10px; width: 40px; opacity: calc(var(--slider-fan-v) * 1.2); transition: opacity 0.4s; }
  .slider-fan__line { height: 2px; width: 24px; border-radius: 1px; background: light-dark(#5f626a, #a7abb2); animation: slider-fan-air 0.9s linear infinite; }
  .slider-fan__line:nth-child(2) { width: 30px; animation-delay: -0.3s; }
  .slider-fan__line:nth-child(3) { animation-delay: -0.6s; }
  .slider-fan__track { position: relative; width: 100%; height: 26px; }
  .slider-fan__rail { position: absolute; left: 10px; right: 10px; top: 11px; height: 4px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .slider-fan__stop { position: absolute; top: 9px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); }
  .slider-fan__thumb { position: absolute; top: 3px; left: calc(var(--slider-fan-v) * (100% - 20px)); width: 20px; height: 20px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)); transition: left 0.3s cubic-bezier(0.3, 1.5, 0.5, 1); }
  .slider-fan__level { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .slider-fan__level b { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  .slider-fan:has(.slider-fan__input:focus-visible) .slider-fan__thumb { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-fan__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-fan__input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; }
  .slider-fan__input::-moz-range-thumb { width: 20px; height: 20px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-fan__line { animation: none; }
  }
`;

const LEVELS = ['Off', '1', '2', '3', '4', '5'];

export function FanSlider() {
  const [level, setLevel] = useState(3);
  const blades = useRef<HTMLDivElement>(null);
  const target = useRef(level);
  target.current = level;

  // Spin by accumulating an angle, easing the speed towards the target, so it spools up and down instead of jumping.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let angle = 0;
    let speed = 0;
    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      speed += (target.current * 300 - speed) * Math.min(1, dt * 1.6);
      angle = (angle + speed * dt) % 360;
      if (blades.current) blades.current.style.transform = `rotate(${angle.toFixed(1)}deg)`;
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-fan" style={{ '--slider-fan-v': level / 5 } as React.CSSProperties}>
        <span className="slider-fan__unit" aria-hidden="true">
          <span className="slider-fan__cage">
            <div className="slider-fan__blades" ref={blades}>
              <svg viewBox="-46 -46 92 92">
                {[0, 120, 240].map((a) => (
                  <path key={a} className="slider-fan__blade" transform={`rotate(${a})`} d="M0-6C8-24 26-38 34-30S20 0 0 0Z" />
                ))}
                <circle className="slider-fan__hub" r="9" />
              </svg>
            </div>
          </span>
          <span className="slider-fan__air">
            <span className="slider-fan__line" />
            <span className="slider-fan__line" />
            <span className="slider-fan__line" />
          </span>
        </span>
        <span className="slider-fan__level" aria-hidden="true">
          Speed <b>{LEVELS[level]}</b>
        </span>
        <div className="slider-fan__track">
          <span className="slider-fan__rail" />
          {LEVELS.map((l, i) => (
            <span key={l} className="slider-fan__stop" style={{ left: `calc(10px + ${i / 5} * (100% - 20px))` }} />
          ))}
          <span className="slider-fan__thumb" />
          <input
            className="slider-fan__input"
            type="range"
            min={0}
            max={5}
            value={level}
            onChange={(e) => setLevel(+e.target.value)}
            aria-label="Fan speed"
            aria-valuetext={level ? `Speed ${level}` : 'Off'}
          />
        </div>
      </div>
    </>
  );
}
