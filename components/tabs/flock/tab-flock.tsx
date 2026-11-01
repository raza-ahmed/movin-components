"use client";

import * as React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

const TABS = [
  { label: 'Today', body: 'Two deliveries arriving before noon and one to send.' },
  { label: 'Week', body: 'Fourteen orders this week, three of them still to pack.' },
  { label: 'Month', body: 'Sales are up 12% on last month, led by the spring range.' },
  { label: 'Year', body: 'The best year yet: 1,840 orders from 31 countries.' },
];
const DOTS = 6;
const SPACE = 6;
// Every bird takes its own height of arc.
const LIFT = [10, 17, 8, 14, 20, 11];
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const css = `
  .tabs-flock { width: 270px; }
  .tabs-flock__list { position: relative; display: flex; gap: 22px; padding-bottom: 12px; }
  .tabs-flock__tab { border: 0; padding: 6px 0; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-flock__tab:hover, .tabs-flock__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-flock__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; border-radius: 4px; }
  /* Hidden until placed: their positions come from the laid-out labels. */
  .tabs-flock__dot { position: absolute; left: -1.5px; bottom: 4px; width: 3px; height: 3px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); visibility: hidden; }
  .tabs-flock__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function FlockTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const at = useRef<{ x: number; y: number }[]>([]);
  const raf = useRef(0);

  const home = (i: number, j: number) => {
    const t = tabs.current[i]!;
    return t.offsetLeft + t.offsetWidth / 2 + (j - (DOTS - 1) / 2) * SPACE;
  };
  const draw = () =>
    at.current.forEach((p, j) => {
      const d = dots.current[j]!;
      d.style.transform = `translate(${p.x}px, ${p.y}px)`;
      d.style.visibility = 'visible';
    });

  // Place the flock under the first tab, and again once the font has loaded and the labels have their real widths.
  useLayoutEffect(() => {
    const place = () => {
      at.current = Array.from({ length: DOTS }, (_, j) => ({ x: home(sel, j), y: 0 }));
      draw();
    };
    place();
    document.fonts?.ready.then(() => !raf.current && place());
  }, []);

  const fly = (to: number) => {
    cancelAnimationFrame(raf.current);
    const from = at.current.map((p) => ({ ...p }));
    const dests = Array.from({ length: DOTS }, (_, j) => home(to, j));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      at.current = dests.map((x) => ({ x, y: 0 }));
      draw();
      return;
    }
    // The dot nearest the destination leaves first and the rest follow it, a beat apart.
    const right = dests[0] > from[0].x;
    const start = performance.now();
    const step = (now: number) => {
      let done = true;
      at.current = from.map((p, j) => {
        const order = right ? DOTS - 1 - j : j;
        const t = Math.min(1, Math.max(0, (now - start - order * 45) / 560));
        if (t < 1) done = false;
        const e = ease(t);
        return { x: p.x + (dests[j] - p.x) * e, y: p.y * (1 - e) - LIFT[j] * Math.sin(Math.PI * t) };
      });
      draw();
      raf.current = done ? 0 : requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const pick = (i: number) => {
    if (i === sel) return;
    setSel(i);
    fly(i);
  };
  const n = TABS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    pick(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-flock">
        <div className="tabs-flock__list" role="tablist" aria-label="Sales period" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-flock__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => pick(i)}
            >
              {t.label}
            </button>
          ))}
          {Array.from({ length: DOTS }, (_, j) => (
            <span
              key={j}
              ref={(el) => {
                dots.current[j] = el;
              }}
              className="tabs-flock__dot"
              aria-hidden="true"
            />
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-flock__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
