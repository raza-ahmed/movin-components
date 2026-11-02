"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const LINES = [
  { label: 'Sales', body: 'Three calls waiting. Average wait is under a minute.' },
  { label: 'Support', body: 'Busy this morning: the new release went out at nine.' },
  { label: 'Billing', body: 'Quiet. Invoices for October go out on Friday.' },
  { label: 'Press', body: 'One request, from a design magazine, about the rebrand.' },
];
const W = 240;
const COL = W / LINES.length;
const JACK_Y = 36;
const SOCKET = { x: 120, y: 112 };
const N = 15;
const SEG = 9.2;
const G = 0.3;

type Pt = { x: number; y: number; px: number; py: number };
const jack = (i: number) => ({ x: i * COL + COL / 2, y: JACK_Y });

// A cord of N links (verlet): each point keeps its own momentum, gravity pulls it down, and a few
// passes of length constraints keep the links a fixed length. Both ends are held: the switchboard
// socket and the plug.
function simulate(p: Pt[], end: { x: number; y: number }) {
  for (let i = 1; i < N; i++) {
    const q = p[i];
    const vx = (q.x - q.px) * 0.97;
    const vy = (q.y - q.py) * 0.97;
    q.px = q.x;
    q.py = q.y;
    q.x += vx;
    q.y += vy + G;
  }
  for (let k = 0; k < 10; k++) {
    Object.assign(p[0], SOCKET);
    p[N].x = end.x;
    p[N].y = end.y;
    for (let i = 0; i < N; i++) {
      const a = p[i];
      const b = p[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const f = (d - SEG) / d / 2;
      if (i > 0) {
        a.x += dx * f;
        a.y += dy * f;
      }
      if (i < N - 1) {
        b.x -= dx * f;
        b.y -= dy * f;
      }
    }
  }
}
function cord(end: { x: number; y: number }) {
  const p: Pt[] = Array.from({ length: N + 1 }, (_, i) => {
    const x = SOCKET.x + ((end.x - SOCKET.x) * i) / N;
    const y = SOCKET.y + ((end.y - SOCKET.y) * i) / N;
    return { x, y, px: x, py: y };
  });
  for (let k = 0; k < 400; k++) simulate(p, end);
  return p;
}
function path(p: Pt[]) {
  let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 1; i < N; i++) d += `Q${p[i].x.toFixed(1)} ${p[i].y.toFixed(1)} ${((p[i].x + p[i + 1].x) / 2).toFixed(1)} ${((p[i].y + p[i + 1].y) / 2).toFixed(1)}`;
  return `${d}L${p[N].x.toFixed(1)} ${p[N].y.toFixed(1)}`;
}
// The cord at rest in the first jack, worked out the same way on the server and in the browser.
const REST = cord(jack(0));

const css = `
  .tabs-patch { width: ${W}px; }
  .tabs-patch__board { position: relative; height: 132px; border-radius: 12px; background: light-dark(#ebedf0, #232529); }
  .tabs-patch__wire { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .tabs-patch__cord { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 2.5; stroke-linecap: round; }
  .tabs-patch__plug { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 6; stroke-linecap: round; }
  .tabs-patch__socket { fill: light-dark(#cbced3, #393c41); }
  .tabs-patch__list { display: grid; grid-template-columns: repeat(${LINES.length}, 1fr); padding-top: 8px; }
  .tabs-patch__tab { display: grid; justify-items: center; gap: 5px; padding: 0; border: 0; background: none; font: inherit; font-size: 11.5px; line-height: 15px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.25s; }
  .tabs-patch__tab:hover, .tabs-patch__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-patch__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-patch__jack { width: 16px; height: 16px; box-sizing: border-box; border: 3px solid light-dark(#6d7179, #7d8087); border-radius: 50%; background: light-dark(#fbfcfd, #121417); }
  .tabs-patch__tab[aria-selected='true'] .tabs-patch__jack { border-color: light-dark(#42454c, #e5e6e9); }
  .tabs-patch__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
`;

export function PatchTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const wire = useRef<SVGPathElement>(null);
  const plug = useRef<SVGLineElement>(null);
  const st = useRef({ p: REST.map((q) => ({ ...q })), at: 0, raf: 0 });

  const draw = (p: Pt[]) => {
    wire.current!.setAttribute('d', path(p));
    const a = p[N];
    const b = p[N - 2];
    const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    plug.current!.setAttribute('x1', String(a.x));
    plug.current!.setAttribute('y1', String(a.y));
    plug.current!.setAttribute('x2', String(a.x + ((b.x - a.x) / d) * 9));
    plug.current!.setAttribute('y2', String(a.y + ((b.y - a.y) / d) * 9));
  };

  // Moving the call: the plug lifts out, arcs over to the new jack and pushes in, and the cord
  // swings after it until it hangs still again.
  useEffect(() => {
    const s = st.current;
    if (s.at === sel) return;
    const from = jack(s.at);
    const to = jack(sel);
    s.at = sel;
    cancelAnimationFrame(s.raf);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      s.p = cord(to);
      return draw(s.p);
    }
    const t0 = performance.now();
    let still = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 600);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const end = { x: from.x + (to.x - from.x) * e, y: JACK_Y - Math.sin(k * Math.PI) * 18 };
      const before = s.p.reduce((sum, q) => sum + q.x + q.y, 0);
      simulate(s.p, end);
      draw(s.p);
      const moved = Math.abs(s.p.reduce((sum, q) => sum + q.x + q.y, 0) - before);
      still = k === 1 && moved < 0.05 ? still + 1 : 0;
      if (still < 10 && now - t0 < 4000) s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.raf);
  }, [sel]);

  const n = LINES.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  const end = REST[N];
  const back = REST[N - 2];
  const len = Math.hypot(end.x - back.x, end.y - back.y) || 1;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-patch">
        <div className="tabs-patch__board">
          <div className="tabs-patch__list" role="tablist" aria-label="Lines" onKeyDown={onKeyDown}>
            {LINES.map((l, i) => (
              <button
                key={l.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tabs-patch__tab"
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => setSel(i)}
              >
                {l.label}
                <span className="tabs-patch__jack" aria-hidden="true" />
              </button>
            ))}
          </div>
          <svg className="tabs-patch__wire" viewBox={`0 0 ${W} 132`} aria-hidden="true">
            <rect className="tabs-patch__socket" x={SOCKET.x - 10} y={SOCKET.y - 2} width={20} height={14} rx={3} />
            <path className="tabs-patch__cord" ref={wire} d={path(REST)} />
            <line
              className="tabs-patch__plug"
              ref={plug}
              x1={end.x.toFixed(1)}
              y1={end.y.toFixed(1)}
              x2={(end.x + ((back.x - end.x) / len) * 9).toFixed(1)}
              y2={(end.y + ((back.y - end.y) / len) * 9).toFixed(1)}
            />
          </svg>
        </div>
        {LINES.map((l, i) => (
          <div key={l.label} className="tabs-patch__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {l.body}
          </div>
        ))}
      </div>
    </>
  );
}
