"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const LESSONS = [
  { label: 'Maths', body: 'Fractions today: halves, quarters and why a third is awkward.' },
  { label: 'Science', body: 'Why ice floats, with a jug of water and a lot of patience.' },
  { label: 'History', body: 'The canal age, and the people who dug them by hand.' },
];
const W = 240;
const COL = W / LESSONS.length;
const STROKE = 'M3 6Q14 3 26 5.5T50 5T61 4';

const css = `
  .tabs-chalk { width: ${W}px; }
  .tabs-chalk__board { position: relative; padding: 12px 0 6px; border-radius: 12px; background: radial-gradient(ellipse at 30% 20%, light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529) 70%); }
  .tabs-chalk__list { display: grid; grid-template-columns: repeat(${LESSONS.length}, 1fr); }
  .tabs-chalk__tab { display: grid; justify-items: center; gap: 2px; padding: 0; border: 0; background: none; font: 15px 'Chalkboard SE', 'Bradley Hand', 'Segoe Print', 'Comic Sans MS', cursive; color: light-dark(#50535b, #c6c8cd); cursor: pointer; transition: color 0.3s; }
  .tabs-chalk__tab:hover, .tabs-chalk__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-chalk__tab:focus-visible { outline: 2px dashed light-dark(#50535b, #c6c8cd); outline-offset: 2px; border-radius: 6px; }
  .tabs-chalk__mark { width: 64px; height: 10px; overflow: visible; }
  .tabs-chalk__mark path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.6; stroke-linecap: round; }
  /* The chalk line draws in once the eraser is clear; leaving, it is rubbed out to a smudge. */
  .tabs-chalk__ink { stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0; transition: opacity 0.35s 0.12s, stroke-dashoffset 0s 0.6s; }
  .tabs-chalk__tab[aria-selected='true'] .tabs-chalk__ink { stroke-dashoffset: 0; opacity: 0.92; transition: stroke-dashoffset 0.45s ease-out 0.38s, opacity 0s 0.38s; }
  .tabs-chalk__smudge { opacity: 0; filter: blur(1.4px); stroke-width: 6 !important; transition: opacity 0.4s 0.15s; }
  .tabs-chalk__tab--used:not([aria-selected='true']) .tabs-chalk__smudge { opacity: 0.13; }
  .tabs-chalk__eraser { position: absolute; left: 0; top: 0; width: 26px; height: 12px; border-radius: 3px; background: linear-gradient(light-dark(#6d7179, #7d8087) 0 45%, light-dark(#50535b, #c6c8cd) 45%); opacity: 0; pointer-events: none; }
  .tabs-chalk__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-chalk__ink, .tabs-chalk__tab[aria-selected='true'] .tabs-chalk__ink, .tabs-chalk__smudge { transition: none; }
  }
`;

export function ChalkTabs() {
  const id = useId();
  const grain = `tabs-chalk-${id.replace(/[^a-zA-Z0-9]/g, '')}`;
  const [sel, setSel] = useState(0);
  const [used, setUsed] = useState([true, false, false]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const eraser = useRef<HTMLSpanElement>(null);
  const prev = useRef(0);

  // The eraser rubs the old line out, three quick strokes, and lifts away.
  useEffect(() => {
    const from = prev.current;
    prev.current = sel;
    if (from === sel || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const x = from * COL + COL / 2 - 13;
    const y = 41;
    const at = (dx: number, dy = 0, o = 1) => ({ transform: `translate(${x + dx}px, ${y + dy}px) rotate(${dx / 6}deg)`, opacity: o });
    eraser.current!.animate([at(-30, -8, 0), at(-28), at(28), at(-24), at(24), at(0, -14, 0)], { duration: 620, easing: 'ease-in-out' });
  }, [sel]);

  const pick = (i: number) => {
    setSel(i);
    setUsed((u) => u.map((v, k) => v || k === i));
  };
  const n = LESSONS.length;
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
      <div className="tabs-chalk">
        <div className="tabs-chalk__board">
          <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true">
            <filter id={grain}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} />
              <feDisplacementMap in="SourceGraphic" scale={2.6} />
            </filter>
          </svg>
          <div className="tabs-chalk__list" role="tablist" aria-label="Lessons" onKeyDown={onKeyDown}>
            {LESSONS.map((l, i) => (
              <button
                key={l.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className={`tabs-chalk__tab${used[i] ? ' tabs-chalk__tab--used' : ''}`}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => pick(i)}
              >
                {l.label}
                <svg className="tabs-chalk__mark" viewBox="0 0 64 10" style={{ filter: `url(#${grain})` }} aria-hidden="true">
                  <path className="tabs-chalk__smudge" d={STROKE} />
                  <path className="tabs-chalk__ink" d={STROKE} pathLength={1} />
                </svg>
              </button>
            ))}
          </div>
          <span className="tabs-chalk__eraser" ref={eraser} aria-hidden="true" />
        </div>
        {LESSONS.map((l, i) => (
          <div key={l.label} className="tabs-chalk__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {l.body}
          </div>
        ))}
      </div>
    </>
  );
}
