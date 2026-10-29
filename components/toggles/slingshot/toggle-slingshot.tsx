"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .toggle-slingshot { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-slingshot__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-slingshot__track {
    position: relative;
    width: 88px;
    height: 34px;
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    touch-action: none;
    transition: background-color 0.3s;
  }
  .toggle-slingshot__input:focus-visible + .toggle-slingshot__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-slingshot__input:checked + .toggle-slingshot__track { background: light-dark(#dbdde1, #2e3035); }
  .toggle-slingshot__band { position: absolute; inset: 0; width: 88px; height: 34px; overflow: visible; }
  .toggle-slingshot__band path { fill: none; stroke: light-dark(#5f626a, #a7abb2); stroke-linecap: round; stroke-linejoin: round; }
  .toggle-slingshot__post { fill: light-dark(#6d7179, #7d8087); }
  .toggle-slingshot__thumb {
    position: absolute;
    left: 0;
    top: 6px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2) 80%);
    box-shadow: 0 2px 6px -2px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    cursor: grab;
  }
  .toggle-slingshot__thumb:active { cursor: grabbing; }
`;

const W = 88;
const MID = W / 2;
const OFF = 16;
const ON = W - 16;

export function SlingshotToggle() {
  const [on, setOn] = useState(false);
  const thumb = useRef<HTMLSpanElement>(null);
  const band = useRef<SVGPathElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const sim = useRef({ x: OFF, v: 0, target: OFF, drag: null as null | { start: number; x0: number }, moved: false });

  useEffect(() => {
    sim.current.target = on ? ON : OFF;
  }, [on]);

  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = sim.current;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (!s.drag) {
        if (still) {
          s.x = s.target;
          s.v = 0;
        } else {
          // A loose spring: it overshoots and settles like a ball on elastic.
          s.v += ((s.target - s.x) * 320 - s.v * 13) * dt;
          s.x += s.v * dt;
        }
      }
      thumb.current!.style.transform = `translateX(${(s.x - 11).toFixed(2)}px)`;
      // The band runs post, thumb, post; the further it stretches, the thinner it gets.
      const stretch = Math.abs(s.x - MID);
      band.current!.setAttribute('d', `M${MID} 2 Q ${s.x.toFixed(1)} 17 ${MID} 32`);
      band.current!.style.strokeWidth = String(Math.max(1, 2.6 - stretch / 30));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const local = (clientX: number) => clientX - track.current!.getBoundingClientRect().left;

  return (
    <>
      <style>
        {css}
      </style>
      <label
        className="toggle-slingshot"
        onClick={(e) => {
          // A drag already decided the state; don't let the click flip it back.
          if (sim.current.moved) {
            e.preventDefault();
            sim.current.moved = false;
          }
        }}
      >
        <input className="toggle-slingshot__input" type="checkbox" role="switch" checked={on} onChange={(e) => setOn(e.target.checked)} />
        <span ref={track} className="toggle-slingshot__track" aria-hidden="true">
          <svg className="toggle-slingshot__band" viewBox={`0 0 ${W} 34`}>
            <path ref={band} />
            <circle className="toggle-slingshot__post" cx={MID} cy="2" r="2.5" />
            <circle className="toggle-slingshot__post" cx={MID} cy="32" r="2.5" />
          </svg>
          <span
            ref={thumb}
            className="toggle-slingshot__thumb"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              const s = sim.current;
              s.drag = { start: local(e.clientX), x0: s.x };
              s.moved = false;
            }}
            onPointerMove={(e) => {
              const s = sim.current;
              if (!s.drag) return;
              const dx = local(e.clientX) - s.drag.start;
              if (Math.abs(dx) > 3) s.moved = true;
              s.x = Math.max(2, Math.min(W - 2, s.drag.x0 + dx));
              s.v = 0;
            }}
            onPointerUp={() => {
              const s = sim.current;
              if (!s.drag) return;
              s.drag = null;
              if (!s.moved) return;
              // Pulled back past its rest and let go: fire across. Dragged over the middle: it lands there.
              const pulled = on ? s.x - ON : OFF - s.x;
              const crossed = on ? s.x < MID : s.x > MID;
              if (pulled > 4 || crossed) {
                s.v = (on ? -1 : 1) * Math.max(0, pulled) * 22;
                setOn(!on);
              }
            }}
          />
        </span>
        Fling mode
      </label>
    </>
  );
}
