"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Strings', body: 'Violins, violas, cellos and basses: twelve players tonight.' },
  { label: 'Brass', body: 'Two horns, two trumpets and a trombone at the back.' },
  { label: 'Woodwind', body: 'Flute, oboe, clarinet and bassoon, one of each.' },
];

const W = 260;
const Y = 6;
const SAG = 6;
const centre = (i: number) => ((i + 0.5) * W) / TABS.length;

const css = `
  .tabs-string { width: ${W}px; }
  .tabs-string__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); }
  .tabs-string__tab { padding: 10px 0 8px; border: 0; border-radius: 6px; background: none; color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: color 0.2s; }
  .tabs-string__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-string__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-string__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-string__svg { display: block; width: ${W}px; height: 22px; overflow: visible; }
  .tabs-string__line { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
  .tabs-string__peg { fill: light-dark(#6d7179, #7d8087); }
  .tabs-string__bead { fill: light-dark(#373a40, #f1f2f3); filter: drop-shadow(0 1px 2px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.5))); }
  .tabs-string__panel { padding: 8px 4px 0; min-height: calc(3.1em + 8px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function StringTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [bead, setBead] = useState({ x: centre(0), s: SAG });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const sim = useRef({ x: centre(0), vx: 0, s: SAG, vs: 0, raf: 0 });

  useEffect(() => {
    const m = sim.current;
    const target = centre(sel);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(m, { x: target, vx: 0, s: SAG, vs: 0 });
      setBead({ x: target, s: SAG });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      for (let k = 0; k < 4; k++) {
        const h = dt / 4;
        m.vx += (-170 * (m.x - target) - 22 * m.vx) * h;
        m.x += m.vx * h;
        // The bead rides up the string as it speeds along; when it slows, the sag snaps back and rings.
        const lift = Math.min(SAG + 2, Math.abs(m.vx) / 90);
        m.vs += (-900 * (m.s - (SAG - lift)) - 7 * m.vs) * h;
        m.s += m.vs * h;
      }
      setBead({ x: m.x, s: m.s });
      if (Math.abs(m.x - target) < 0.05 && Math.abs(m.vx) < 0.5 && Math.abs(m.s - SAG) < 0.03 && Math.abs(m.vs) < 0.5) {
        m.raf = 0;
        return;
      }
      m.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(m.raf);
    m.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(m.raf);
  }, [sel]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
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
      <div className="tabs-string">
        <div className="tabs-string__list" role="tablist" aria-label="Sections" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-string__tab"
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
        <svg className="tabs-string__svg" aria-hidden="true">
          <polyline className="tabs-string__line" points={`3,${Y} ${bead.x},${Y + bead.s} ${W - 3},${Y}`} />
          <circle className="tabs-string__peg" cx={3} cy={Y} r={2.5} />
          <circle className="tabs-string__peg" cx={W - 3} cy={Y} r={2.5} />
          <circle className="tabs-string__bead" cx={bead.x} cy={Y + bead.s} r={4.5} />
        </svg>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-string__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
