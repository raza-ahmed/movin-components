"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TOPICS = [
  { label: 'All', body: 'Everything from the last month, newest first.' },
  { label: 'Design', body: 'Grids, type pairings and a long read on colour.' },
  { label: 'Code', body: 'Small, sharp snippets: easing, layout and canvas tricks.' },
  { label: 'Motion', body: 'Springs, timing and when to leave something still.' },
  { label: 'Type', body: 'New releases, revivals and one very odd italic.' },
];
const W = 240;
const COL = W / TOPICS.length;

const css = `
  .tabs-focus { width: ${W}px; }
  .tabs-focus__list { position: relative; display: grid; grid-template-columns: repeat(${TOPICS.length}, 1fr); }
  .tabs-focus__tab { border: 0; padding: 6px 0 10px; background: none; font: inherit; font-size: 12.5px; font-weight: 600; color: light-dark(#50535b, #c6c8cd); cursor: pointer; }
  .tabs-focus__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-focus__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-focus__label { display: inline-block; }
  /* A focus mark rides with the plane of focus, like the point a lens is set to. */
  .tabs-focus__mark { position: absolute; left: 0; bottom: 2px; width: 18px; height: 6px; margin-left: -9px; border: 1.5px solid light-dark(#373a40, #f1f2f3); border-top: 0; border-radius: 0 0 3px 3px; }
  .tabs-focus__panel { padding: 10px 0 0; min-height: calc(3.1em + 10px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function FocusTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const mark = useRef<HTMLSpanElement>(null);
  const st = useRef({ f: 0, v: 0, raf: 0 });

  // Depth of field across the row: each label softens with its distance from the plane of focus,
  // and racking focus to a tab sweeps that plane across, sharpening each label as it passes.
  // Pointing at a tab racks to it for a look; letting go racks back.
  useEffect(() => {
    const s = st.current;
    const goal = hover ?? sel;
    const draw = () => {
      mark.current!.style.transform = `translateX(${s.f * COL + COL / 2}px)`;
      labels.current.forEach((el, i) => {
        const d = Math.abs(i - s.f);
        el!.style.filter = `blur(${Math.min(0.9, d * 0.6).toFixed(2)}px)`;
        el!.style.opacity = String(1 - Math.min(0.2, d * 0.1));
        el!.style.transform = `scale(${1 - Math.min(0.08, d * 0.04)})`;
      });
    };
    cancelAnimationFrame(s.raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(s, { f: goal, v: 0 });
      return draw();
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-110 * (s.f - goal) - 20 * s.v) * dt;
      s.f += s.v * dt;
      if (Math.abs(s.f - goal) < 0.002 && Math.abs(s.v) < 0.01) {
        Object.assign(s, { f: goal, v: 0 });
        return draw();
      }
      draw();
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.raf);
  }, [sel, hover]);

  const n = TOPICS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  const blur = (i: number) => ({
    filter: `blur(${Math.min(0.9, i * 0.6).toFixed(2)}px)`,
    opacity: 1 - Math.min(0.2, i * 0.1),
    transform: `scale(${1 - Math.min(0.08, i * 0.04)})`,
  });
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-focus">
        <div className="tabs-focus__list" role="tablist" aria-label="Topics" onKeyDown={onKeyDown} onPointerLeave={() => setHover(null)}>
          {TOPICS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-focus__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(i)}
              onClick={() => setSel(i)}
            >
              <span
                className="tabs-focus__label"
                style={blur(i)}
                ref={(el) => {
                  labels.current[i] = el;
                }}
              >
                {t.label}
              </span>
            </button>
          ))}
          <span className="tabs-focus__mark" ref={mark} style={{ transform: `translateX(${COL / 2}px)` }} aria-hidden="true" />
        </div>
        {TOPICS.map((t, i) => (
          <div key={t.label} className="tabs-focus__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
