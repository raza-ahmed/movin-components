"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const RANGES = [
  { label: 'Day', body: '1,204 visits today, a little up on yesterday.' },
  { label: 'Week', body: '8,630 visits, with Tuesday the busiest day.' },
  { label: 'Month', body: '34,900 visits, and a third of them on phones.' },
  { label: 'Year', body: '368,000 visits since January.' },
  { label: 'All', body: '1.2 million visits since the site launched.' },
];
const W = 240;
const COL = W / RANGES.length;
const center = (i: number) => i * COL + COL / 2;

const css = `
  .tabs-part { width: ${W}px; }
  .tabs-part__list { position: relative; display: grid; grid-template-columns: repeat(${RANGES.length}, 1fr); padding: 4px 0; border-radius: 12px; background: light-dark(#ebedf0, #232529); }
  .tabs-part__pill { position: absolute; top: 4px; left: ${-COL / 2 + 2}px; width: ${COL - 4}px; height: 28px; border-radius: 9px; background: light-dark(#373a40, #f1f2f3); }
  .tabs-part__tab { position: relative; height: 28px; padding: 0; border: 0; background: none; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
  .tabs-part__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: -2px; border-radius: 9px; }
  .tabs-part__label { display: inline-block; color: light-dark(#5f626a, #a7abb2); }
  .tabs-part__tab[aria-selected='true'] .tabs-part__label { color: light-dark(#fbfcfd, #121417); }
  .tabs-part__panel { padding: 12px 2px 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function PartTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const pill = useRef<HTMLSpanElement>(null);
  const st = useRef({ x: center(0), v: 0, raf: 0 });

  // The pill slides on a spring, and the labels it passes over step up out of its way, more the
  // faster it goes, then settle back. Only once it has stopped does the label under it turn dark.
  useEffect(() => {
    const s = st.current;
    const goal = center(sel);
    const draw = () => {
      pill.current!.style.transform = `translateX(${s.x}px)`;
      const fast = Math.min(1, Math.abs(s.v) / 260);
      labels.current.forEach((el, i) => {
        const near = Math.max(0, 1 - Math.abs(center(i) - s.x) / 30);
        el!.style.transform = `translateY(${-9 * near * fast}px) scale(${1 - 0.12 * near * fast})`;
        el!.style.color = i === sel && near > 0.6 && fast < 0.5 ? 'light-dark(#fbfcfd, #121417)' : i === sel ? 'light-dark(#373a40, #f1f2f3)' : 'light-dark(#5f626a, #a7abb2)';
      });
    };
    cancelAnimationFrame(s.raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(s, { x: goal, v: 0 });
      return draw();
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-120 * (s.x - goal) - 17 * s.v) * dt;
      s.x += s.v * dt;
      if (Math.abs(s.x - goal) < 0.05 && Math.abs(s.v) < 0.5) {
        Object.assign(s, { x: goal, v: 0 });
        return draw();
      }
      draw();
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.raf);
  }, [sel]);

  const n = RANGES.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-part">
        <div className="tabs-part__list" role="tablist" aria-label="Range" onKeyDown={onKeyDown}>
          <span className="tabs-part__pill" ref={pill} style={{ transform: `translateX(${center(0)}px)` }} aria-hidden="true" />
          {RANGES.map((r, i) => (
            <button
              key={r.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-part__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <span
                className="tabs-part__label"
                ref={(el) => {
                  labels.current[i] = el;
                }}
              >
                {r.label}
              </span>
            </button>
          ))}
        </div>
        {RANGES.map((r, i) => (
          <div key={r.label} className="tabs-part__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {r.body}
          </div>
        ))}
      </div>
    </>
  );
}
