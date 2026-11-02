"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const SOURCES = [
  { label: 'Grid', body: 'Drawing 1.2 kW from the grid, on the off-peak rate until seven.' },
  { label: 'Solar', body: 'Panels making 3.4 kW. The battery is full by eleven on days like this.' },
  { label: 'Wind', body: 'The turbine is idling: the wind dropped below 3 m/s at noon.' },
  { label: 'Hydro', body: 'The stream wheel runs day and night, a steady 0.6 kW.' },
];
const W = 240;
const COL = W / SOURCES.length;
const NODE_Y = 12;
const nodeX = (i: number) => i * COL + COL / 2;

const css = `
  .tabs-arc { width: ${W}px; }
  .tabs-arc__top { position: relative; }
  .tabs-arc__list { display: grid; grid-template-columns: repeat(${SOURCES.length}, 1fr); padding-top: 8px; }
  .tabs-arc__tab { display: grid; justify-items: center; gap: 8px; padding: 0 0 6px; border: 0; background: none; font: inherit; font-size: 12.5px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.25s; }
  .tabs-arc__tab:hover, .tabs-arc__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-arc__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-arc__node { width: 8px; height: 8px; box-sizing: border-box; border: 1.5px solid light-dark(#cbced3, #393c41); border-radius: 50%; transition: background-color 0.2s, border-color 0.2s; }
  .tabs-arc__tab[aria-selected='true'] .tabs-arc__node { border-color: light-dark(#373a40, #f1f2f3); background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 6px light-dark(#50535b, #c6c8cd); animation: tabs-arc-flash 0.5s ease-out; }
  @keyframes tabs-arc-flash {
    from { transform: scale(2.2); box-shadow: 0 0 14px light-dark(#373a40, #f1f2f3); }
  }
  .tabs-arc__bolt { position: absolute; left: 0; top: 0; width: ${W}px; height: 40px; overflow: visible; pointer-events: none; }
  .tabs-arc__bolt path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.4; stroke-linejoin: bevel; filter: drop-shadow(0 0 3px light-dark(#50535b, #c6c8cd)); }
  .tabs-arc__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-arc__tab[aria-selected='true'] .tabs-arc__node { animation: none; }
  }
`;

// A jagged bolt along an arc from x0 to x1: points on a curve, each kicked sideways at random,
// most in the middle and least at the ends, with a short fork off one of them.
function bolt(x0: number, x1: number) {
  const dx = x1 - x0;
  const h = 16 + Math.abs(dx) * 0.12;
  const n = 10 + Math.round(Math.abs(dx) / 12);
  let main = '';
  let fork = '';
  const at = 2 + Math.floor(Math.random() * (n - 4));
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    const kick = (Math.random() - 0.5) * 9 * Math.sin(Math.PI * t);
    const x = x0 + dx * t + kick * 0.4;
    const y = NODE_Y - 4 * h * t * (1 - t) + kick;
    main += `${k ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    if (k === at)
      fork = `M${x.toFixed(1)} ${y.toFixed(1)}l${((Math.random() - 0.5) * 12).toFixed(1)} ${(-6 - Math.random() * 6).toFixed(1)}l${((Math.random() - 0.5) * 8).toFixed(1)} -4`;
  }
  return main + fork;
}

export function ArcTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const path = useRef<SVGPathElement>(null);
  const prev = useRef(0);

  // The current jumps from the old source to the new one: the bolt is redrawn every few frames
  // for a third of a second, flickering, then the new node lights.
  useEffect(() => {
    const from = prev.current;
    prev.current = sel;
    if (from === sel || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = path.current!;
    const t0 = performance.now();
    let raf = 0;
    let last = 0;
    const step = (now: number) => {
      if (now - t0 > 360) {
        el.setAttribute('d', '');
        return;
      }
      if (now - last > 40) {
        last = now;
        el.setAttribute('d', bolt(nodeX(from), nodeX(sel)));
        el.style.opacity = String(0.55 + Math.random() * 0.45);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      el.setAttribute('d', '');
    };
  }, [sel]);

  const n = SOURCES.length;
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
      <div className="tabs-arc">
        <div className="tabs-arc__top">
          <div className="tabs-arc__list" role="tablist" aria-label="Power" onKeyDown={onKeyDown}>
            {SOURCES.map((s, i) => (
              <button
                key={s.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tabs-arc__tab"
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => setSel(i)}
              >
                <span className="tabs-arc__node" aria-hidden="true" />
                {s.label}
              </button>
            ))}
          </div>
          <svg className="tabs-arc__bolt" aria-hidden="true">
            <path ref={path} />
          </svg>
        </div>
        {SOURCES.map((s, i) => (
          <div key={s.label} className="tabs-arc__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {s.body}
          </div>
        ))}
      </div>
    </>
  );
}
