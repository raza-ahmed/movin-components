"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Venus', body: 'The hottest planet, under clouds of sulphuric acid. A day outlasts its year.' },
  { label: 'Earth', body: 'One moon, liquid water and the only known life. A year is 365.25 days.' },
  { label: 'Mars', body: 'A thin, dusty sky and two small moons, Phobos and Deimos.' },
];
const TILT = (-12 * Math.PI) / 180;
const RY = 9;

const css = `
  .tabs-orbit { width: 270px; }
  .tabs-orbit__list { position: relative; display: flex; justify-content: center; gap: 30px; padding: 12px 0; }
  .tabs-orbit__tab { position: relative; z-index: 1; border: 0; padding: 4px 2px; background: none; font: inherit; font-size: 14px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-orbit__tab:hover, .tabs-orbit__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-orbit__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; border-radius: 4px; }
  .tabs-orbit__path { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .tabs-orbit__path ellipse { fill: none; stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1; }
  .tabs-orbit__moon { position: absolute; left: -3px; top: -3px; width: 6px; height: 6px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); pointer-events: none; visibility: hidden; }
  .tabs-orbit__panel { padding: 10px 4px 0; min-height: calc(3.1em + 10px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
`;

export function OrbitTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const moon = useRef<HTMLSpanElement>(null);
  const ring = useRef<SVGEllipseElement>(null);
  const goal = useRef(sel);
  goal.current = sel;
  // Under reduced motion the loop draws one frame and stops; a switch asks for one more.
  const redraw = useRef<(() => void) | null>(null);

  // One loop for the whole life of the component: the moon keeps circling, and the orbit's centre and
  // width chase the active label on springs, so a switch carries the moon across mid-orbit.
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const at = (i: number) => {
      const t = tabs.current[i]!;
      return { x: t.offsetLeft + t.offsetWidth / 2, y: t.offsetTop + t.offsetHeight / 2, rx: t.offsetWidth / 2 + 13 };
    };
    const o = { ...at(goal.current), vx: 0, vr: 0, phi: 1.2 };
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const g = at(goal.current);
      if (still) {
        Object.assign(o, { x: g.x, rx: g.rx, phi: Math.PI / 2 });
      } else {
        o.vx += (-90 * (o.x - g.x) - 15 * o.vx) * dt;
        o.x += o.vx * dt;
        o.vr += (-90 * (o.rx - g.rx) - 15 * o.vr) * dt;
        o.rx += o.vr * dt;
        o.phi += dt * 2.1;
      }
      const [c, s] = [Math.cos(o.phi), Math.sin(o.phi)];
      const mx = o.x + o.rx * c * Math.cos(TILT) - RY * s * Math.sin(TILT);
      const my = g.y + o.rx * c * Math.sin(TILT) + RY * s * Math.cos(TILT);
      // The lower half of the orbit passes in front of the word, the upper half behind it.
      const front = s > 0;
      const m = moon.current!;
      m.style.transform = `translate(${mx}px, ${my}px) scale(${front ? 1 : 0.7})`;
      m.style.zIndex = front ? '2' : '0';
      m.style.opacity = front ? '1' : '0.45';
      m.style.visibility = 'visible';
      const r = ring.current!;
      r.setAttribute('cx', String(o.x));
      r.setAttribute('cy', String(g.y));
      r.setAttribute('rx', String(o.rx));
      r.setAttribute('transform', `rotate(${(TILT * 180) / Math.PI} ${o.x} ${g.y})`);
      if (!still) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    if (still) {
      redraw.current = () => requestAnimationFrame(step);
      document.fonts?.ready.then(redraw.current);
    }
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    redraw.current?.();
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
      <div className="tabs-orbit">
        <div className="tabs-orbit__list" role="tablist" aria-label="Planets" onKeyDown={onKeyDown}>
          <svg className="tabs-orbit__path" aria-hidden="true">
            <ellipse ref={ring} ry={RY} />
          </svg>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-orbit__tab"
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
          <span className="tabs-orbit__moon" ref={moon} aria-hidden="true" />
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-orbit__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
