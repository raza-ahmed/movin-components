"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Light', body: 'A soft, warm palette with paper-white surfaces.' },
  { label: 'Auto', body: 'Follows your system setting and switches at sunset.' },
  { label: 'Dark', body: 'Deep greys that keep contrast high and glare low.' },
];
const W = 240;
const COL = W / TABS.length;
const BALL = 10;

const css = `
  .tabs-tilt { width: ${W}px; }
  .tabs-tilt__beam { position: relative; transform-origin: 50% 100%; }
  .tabs-tilt__list { display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); }
  .tabs-tilt__tab { border: 0; padding: 6px 0 8px; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-tilt__tab:hover, .tabs-tilt__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-tilt__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-tilt__rail {
    position: relative;
    height: 14px;
    border-radius: 7px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 1px 2px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45));
  }
  .tabs-tilt__ball {
    position: absolute;
    top: 2px;
    left: ${-BALL / 2}px;
    width: ${BALL}px;
    height: ${BALL}px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 1px 2px light-dark(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55));
  }
  /* A mark on the ball shows it rolling, not sliding. */
  .tabs-tilt__ball::after { content: ''; position: absolute; left: 4px; top: 1px; width: 2px; height: 3px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); }
  .tabs-tilt__pivot { width: 0; height: 0; margin: 0 auto; border: 6px solid transparent; border-bottom-color: light-dark(#cbced3, #393c41); border-top-width: 0; }
  .tabs-tilt__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function TiltTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const beam = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLSpanElement>(null);
  const st = useRef({ x: sel * COL + COL / 2, v: 0, tilt: 0, tv: 0, raf: 0 });

  const draw = () => {
    const s = st.current;
    beam.current!.style.transform = `rotate(${s.tilt}deg)`;
    ball.current!.style.transform = `translateX(${s.x}px) rotate(${(s.x / (BALL / 2)) * (180 / Math.PI)}deg)`;
  };

  // The beam tips towards the tab you picked; gravity along the slope rolls the ball there, and the
  // beam levels out as the ball arrives.
  useEffect(() => {
    const s = st.current;
    const goal = sel * COL + COL / 2;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(s, { x: goal, v: 0, tilt: 0, tv: 0 });
      draw();
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const want = Math.max(-7, Math.min(7, (goal - s.x) * 0.09));
      s.tv += (-120 * (s.tilt - want) - 20 * s.tv) * dt;
      s.tilt += s.tv * dt;
      s.v += (s.tilt * 95 - (s.x - goal) * 22 - 8 * s.v) * dt;
      s.x += s.v * dt;
      draw();
      if (Math.abs(s.x - goal) < 0.1 && Math.abs(s.v) < 1 && Math.abs(s.tilt) < 0.02 && Math.abs(s.tv) < 0.1) {
        Object.assign(s, { x: goal, v: 0, tilt: 0, tv: 0 });
        draw();
        return;
      }
      s.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.raf);
  }, [sel]);

  const n = TABS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  const first = useRef(sel).current;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-tilt">
        <div className="tabs-tilt__beam" ref={beam}>
          <div className="tabs-tilt__list" role="tablist" aria-label="Appearance" onKeyDown={onKeyDown}>
            {TABS.map((t, i) => (
              <button
                key={t.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tabs-tilt__tab"
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => setSel(i)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="tabs-tilt__rail" aria-hidden="true">
            <span className="tabs-tilt__ball" ref={ball} style={{ transform: `translateX(${first * COL + COL / 2}px)` }} />
          </div>
        </div>
        <div className="tabs-tilt__pivot" aria-hidden="true" />
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-tilt__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
