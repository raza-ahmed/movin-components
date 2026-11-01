"use client";

import * as React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

const TABS = [
  { label: 'Studio', body: 'North light, a long oak table and room for six.' },
  { label: 'Gallery', body: 'White walls, a polished concrete floor and track lighting.' },
  { label: 'Garden', body: 'A walled garden with a pergola, open until September.' },
];
const W = 264;
const PANEL = 200;
const DROP = 34;

const css = `
  .tabs-hang { position: relative; width: ${W}px; }
  .tabs-hang__list { display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); }
  .tabs-hang__tab { position: relative; border: 0; padding: 6px 0 10px; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-hang__tab:hover, .tabs-hang__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-hang__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-hang__stage { position: relative; padding-top: ${DROP}px; }
  .tabs-hang__rig { position: absolute; left: 0; top: 0; width: ${W}px; height: ${DROP}px; overflow: visible; pointer-events: none; }
  .tabs-hang__cord { stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; fill: none; }
  .tabs-hang__hook { fill: light-dark(#fbfcfd, #121417); stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.5; }
  .tabs-hang__panel {
    position: relative;
    width: ${PANEL}px;
    margin: 0 auto;
    padding: 12px 14px;
    min-height: 82px;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529), 0 8px 18px light-dark(rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.35));
    color: light-dark(#50535b, #c6c8cd);
    font-size: 13px;
    line-height: 1.55;
    transform-origin: 50% ${-DROP}px;
  }
`;

export function HangTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const sim = useRef({ hook: 0, hv: 0, angle: 0, av: 0, raf: 0 });

  const target = (i: number) => {
    const t = tabs.current[i]!;
    return t.offsetLeft + t.offsetWidth / 2;
  };
  // Draws the hook, the two cords to the panel's top corners, and turns the panel to the swing angle.
  const draw = () => {
    const s = sim.current;
    const p = panels.current[sel];
    // The panel drifts a third of the way towards the hook, so the cords never lie flat.
    const shift = (s.hook - W / 2) * 0.34;
    if (p) p.style.transform = `translateX(${shift}px) rotate(${s.angle}rad)`;
    // The panel turns about a point DROP above its top centre; its corners swing with it.
    const corner = (dx: number) => [W / 2 + shift + dx * Math.cos(s.angle) - DROP * Math.sin(s.angle), dx * Math.sin(s.angle) + DROP * Math.cos(s.angle)];
    const ends = [corner(-PANEL / 2 + 16), corner(PANEL / 2 - 16)];
    const g = svg.current!;
    g.querySelector('.tabs-hang__hook')!.setAttribute('cx', String(s.hook));
    g.querySelectorAll('.tabs-hang__cord').forEach((c, k) => c.setAttribute('d', `M${s.hook} 0L${ends[k][0]} ${ends[k][1]}`));
  };

  useLayoutEffect(() => {
    sim.current.hook = target(sel);
    draw();
    document.fonts?.ready.then(() => {
      if (!sim.current.raf) {
        sim.current.hook = target(sel);
        draw();
      }
    });
  }, []);

  // The hook slides on a spring; the panel is a pendulum, pushed by how hard the hook accelerates.
  useEffect(() => {
    const s = sim.current;
    const goal = target(sel);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(s, { hook: goal, hv: 0, angle: 0, av: 0 });
      draw();
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const acc = -150 * (s.hook - goal) - 20 * s.hv;
      s.hv += acc * dt;
      s.hook += s.hv * dt;
      s.av += (-30 * Math.sin(s.angle) - 3.4 * s.av - acc * 0.0024) * dt;
      s.angle += s.av * dt;
      draw();
      if (Math.abs(s.hook - goal) < 0.05 && Math.abs(s.hv) < 0.5 && Math.abs(s.angle) < 0.0008 && Math.abs(s.av) < 0.002) {
        Object.assign(s, { hook: goal, hv: 0, angle: 0, av: 0, raf: 0 });
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
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-hang">
        <div className="tabs-hang__list" role="tablist" aria-label="Spaces" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-hang__tab"
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
        <div className="tabs-hang__stage">
          <svg className="tabs-hang__rig" ref={svg} aria-hidden="true">
            <path className="tabs-hang__cord" />
            <path className="tabs-hang__cord" />
            <circle className="tabs-hang__hook" cx={W / 2} cy={0} r={3} />
          </svg>
          {TABS.map((t, i) => (
            <div
              key={t.label}
              ref={(el) => {
                panels.current[i] = el;
              }}
              className="tabs-hang__panel"
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              hidden={sel !== i}
            >
              {t.body}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
