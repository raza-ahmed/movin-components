"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const MEALS = [
  { label: 'Brunch', body: 'Eggs three ways, sourdough and a pot of strong coffee.' },
  { label: 'Lunch', body: 'Soup of the day and a sandwich, done by half past one.' },
  { label: 'Dinner', body: 'Slow-cooked beans, cornbread and peach cobbler.' },
];
const W = 240;
const COL = W / MEALS.length;
const Y = 22;
const RY = 14;
const HAND = { x: 252, y: -34 };
const rxOf = (i: number) => MEALS[i].label.length * 3.6 + 14;
const rest = (i: number) => ({ cx: i * COL + COL / 2, cy: Y, rx: rxOf(i), ry: RY });
type Loop = ReturnType<typeof rest>;

// The loop at time k (0 to 1) of a throw from tab a to tab b: it loosens and lifts, flies over
// spinning (its height pulses as it turns), drops round the new label wide open, then cinches.
function throwAt(a: number, b: number, k: number): Loop {
  const A = rest(a);
  const B = rest(b);
  const io = (u: number) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
  if (k < 0.15) {
    const u = k / 0.15;
    return { cx: A.cx, cy: Y - 6 * u, rx: A.rx * (1 + 0.35 * u), ry: RY * (1 + 0.6 * u) };
  }
  if (k < 0.65) {
    const u = (k - 0.15) / 0.5;
    const e = io(u);
    return {
      cx: A.cx + (B.cx - A.cx) * e,
      cy: Y - 6 - 24 * Math.sin(Math.PI * u),
      rx: (A.rx + (B.rx - A.rx) * e) * 1.35,
      ry: RY * 1.6 * (0.3 + 0.7 * Math.abs(Math.cos(Math.PI * 3 * u))),
    };
  }
  if (k < 0.8) {
    const u = (k - 0.65) / 0.15;
    return { cx: B.cx, cy: Y - 6 + 6 * u, rx: B.rx * 1.35, ry: RY * 1.6 };
  }
  const u = (k - 0.8) / 0.2;
  const back = 1 + 2.7 * (u - 1) ** 3 + 1.7 * (u - 1) ** 2;
  return { cx: B.cx, cy: Y, rx: B.rx * (1.35 - 0.35 * back), ry: RY * (1.6 - 0.6 * back) };
}

const css = `
  .tabs-lasso { position: relative; width: ${W}px; }
  .tabs-lasso__list { display: grid; grid-template-columns: repeat(${MEALS.length}, 1fr); height: 44px; }
  .tabs-lasso__tab { border: 0; padding: 0; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-lasso__tab:hover, .tabs-lasso__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-lasso__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -4px; border-radius: 8px; }
  .tabs-lasso__rope { position: absolute; left: 0; top: 0; width: ${W}px; height: 44px; overflow: visible; pointer-events: none; }
  .tabs-lasso__rope path, .tabs-lasso__rope ellipse { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 2; stroke-linecap: round; }
  .tabs-lasso__knot { fill: light-dark(#50535b, #c6c8cd); }
  .tabs-lasso__panel { padding: 10px 0 0; min-height: calc(3.1em + 10px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function LassoTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [loop, setLoop] = useState(rest(0));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const at = useRef(0);

  useEffect(() => {
    const from = at.current;
    at.current = sel;
    if (from === sel) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setLoop(rest(sel));
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 900);
      setLoop(throwAt(from, sel, k));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [sel]);

  // The rope leaves the loop at its upper right, through the knot, and sags up to the hand off the corner.
  const kx = loop.cx + loop.rx * Math.cos(-0.45);
  const ky = loop.cy + loop.ry * Math.sin(-0.45);
  const sag = 4 + Math.hypot(HAND.x - kx, HAND.y - ky) * 0.03;
  const n = MEALS.length;
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
      <div className="tabs-lasso">
        <div className="tabs-lasso__list" role="tablist" aria-label="Meals" onKeyDown={onKeyDown}>
          {MEALS.map((m, i) => (
            <button
              key={m.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-lasso__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <svg className="tabs-lasso__rope" aria-hidden="true">
          <ellipse cx={loop.cx.toFixed(1)} cy={loop.cy.toFixed(1)} rx={loop.rx.toFixed(1)} ry={loop.ry.toFixed(1)} />
          <path d={`M${kx.toFixed(1)} ${ky.toFixed(1)}Q${((kx + HAND.x) / 2).toFixed(1)} ${((ky + HAND.y) / 2 + sag).toFixed(1)} ${HAND.x} ${HAND.y}`} />
          <circle className="tabs-lasso__knot" cx={kx.toFixed(1)} cy={ky.toFixed(1)} r={3} />
        </svg>
        {MEALS.map((m, i) => (
          <div key={m.label} className="tabs-lasso__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {m.body}
          </div>
        ))}
      </div>
    </>
  );
}
