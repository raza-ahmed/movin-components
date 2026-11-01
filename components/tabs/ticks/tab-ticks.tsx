"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Inbox', body: 'Nine new messages, two of them flagged for today.' },
  { label: 'Drafts', body: 'Three drafts, the oldest from last Tuesday.' },
  { label: 'Sent', body: 'Forty-two sent this week; four are waiting on a reply.' },
  { label: 'Archive', body: 'Everything you have filed away, searchable by sender.' },
];
const W = 264;
const COL = W / TABS.length;
const PITCH = 4;
const COUNT = Math.floor(W / PITCH);
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const css = `
  .tabs-ticks { width: ${W}px; }
  .tabs-ticks__list { display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); }
  .tabs-ticks__tab { border: 0; padding: 6px 0 8px; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-ticks__tab:hover, .tabs-ticks__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-ticks__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-ticks__comb { display: flex; justify-content: space-between; align-items: flex-end; height: 14px; padding: 0 1px; }
  .tabs-ticks__tick { width: 1px; height: 4px; border-radius: 0.5px; background: light-dark(#dbdde1, #2e3035); }
  .tabs-ticks__panel { padding: 14px 0 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function TicksTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);
  const st = useRef({ c: sel * COL + COL / 2, v: 0, raf: 0 });
  // The first render draws the resting crest; after that the animation owns the ticks' styles.
  const first = useRef(sel).current;

  // A crest the width of a tab: ticks inside it stand tall and bright, with soft shoulders at its edges.
  const draw = (c: number, speed: number) => {
    const half = COL / 2 - 8 + Math.min(18, Math.abs(speed) * 0.025);
    ticks.current.forEach((t, k) => {
      const f = 1 - smooth(half - 6, half + 6, Math.abs(k * PITCH + 1.5 - c));
      t!.style.height = `${4 + 9 * f}px`;
      t!.style.background = `color-mix(in oklab, light-dark(#373a40, #f1f2f3) ${Math.round(f * 100)}%, light-dark(#dbdde1, #2e3035))`;
    });
  };

  useEffect(() => {
    const s = st.current;
    const goal = sel * COL + COL / 2;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.c = goal;
      draw(goal, 0);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-170 * (s.c - goal) - 23 * s.v) * dt;
      s.c += s.v * dt;
      draw(s.c, s.v);
      if (Math.abs(s.c - goal) < 0.05 && Math.abs(s.v) < 0.5) {
        Object.assign(s, { c: goal, v: 0 });
        draw(goal, 0);
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
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-ticks">
        <div className="tabs-ticks__list" role="tablist" aria-label="Mail" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-ticks__tab"
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
        <div className="tabs-ticks__comb" aria-hidden="true">
          {Array.from({ length: COUNT }, (_, k) => {
            const f = 1 - smooth(COL / 2 - 14, COL / 2 - 2, Math.abs(k * PITCH + 1.5 - (first * COL + COL / 2)));
            return (
              <span
                key={k}
                ref={(el) => {
                  ticks.current[k] = el;
                }}
                className="tabs-ticks__tick"
                style={{ height: 4 + 9 * f, background: `color-mix(in oklab, light-dark(#373a40, #f1f2f3) ${Math.round(f * 100)}%, light-dark(#dbdde1, #2e3035))` }}
              />
            );
          })}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-ticks__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
