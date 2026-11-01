"use client";

import * as React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

const TABS = [
  { label: 'Design', body: 'Fills, strokes and effects for the selected layers.' },
  { label: 'Prototype', body: 'Connections, transitions and the starting frame.' },
  { label: 'Inspect', body: 'Measurements and ready-to-copy code for developers.' },
];

const css = `
  .tabs-measure { width: 270px; }
  .tabs-measure__list { position: relative; display: flex; justify-content: center; gap: 4px; padding-bottom: 36px; }
  .tabs-measure__tab { border: 0; padding: 8px 12px; border-radius: 8px; background: none; font: inherit; font-size: 13px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s, background-color 0.3s; }
  .tabs-measure__tab:hover { color: light-dark(#373a40, #f1f2f3); }
  .tabs-measure__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .tabs-measure__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-measure__dim { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; visibility: hidden; }
  .tabs-measure__ext { stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; stroke-dasharray: 2 2; }
  .tabs-measure__line { stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1; }
  .tabs-measure__tag { fill: light-dark(#373a40, #f1f2f3); }
  .tabs-measure__num { fill: light-dark(#fbfcfd, #121417); font-size: 10px; font-weight: 600; font-variant-numeric: tabular-nums; text-anchor: middle; }
  .tabs-measure__panel { padding: 6px 4px 0; min-height: calc(3.1em + 6px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
`;

export function MeasureTabs() {
  const id = useId();
  const [sel, setSel] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const st = useRef({ l: 0, r: 0, vl: 0, vr: 0, y: 0, raf: 0 });

  // Extension lines drop from the tab's edges to a dimension line, labelled with the width it spans.
  const draw = () => {
    const { l, r, y } = st.current;
    const g = svg.current!;
    const set = (q: string, attrs: Record<string, number | string>) => {
      const el = g.querySelector(q)!;
      for (const k in attrs) el.setAttribute(k, String(attrs[k]));
    };
    set('.tabs-measure__ext', { d: `M${l} ${y - 22}V${y + 4}M${r} ${y - 22}V${y + 4}` });
    set('.tabs-measure__line', { d: `M${l} ${y}H${r}M${l} ${y - 3.5}v7M${r} ${y - 3.5}v7` });
    const w = Math.round(r - l);
    const tw = String(w).length * 6 + 8;
    set('.tabs-measure__tag', { x: (l + r) / 2 - tw / 2, y: y + 6, width: tw });
    set('.tabs-measure__num', { x: (l + r) / 2, y: y + 15.5 });
    g.querySelector('.tabs-measure__num')!.textContent = String(w);
    g.style.visibility = 'visible';
  };
  const edges = (i: number) => {
    const t = tabs.current[i]!;
    return { l: t.offsetLeft, r: t.offsetLeft + t.offsetWidth, y: t.offsetTop + t.offsetHeight + 16 };
  };

  useLayoutEffect(() => {
    const place = () => {
      if (st.current.raf) return;
      Object.assign(st.current, edges(sel));
      draw();
    };
    place();
    document.fonts?.ready.then(place);
  }, []);

  // Each end of the line runs on its own spring, so the number counts through every width on the way.
  useEffect(() => {
    const s = st.current;
    const g = edges(sel);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(s, g);
      draw();
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.vl += (-170 * (s.l - g.l) - 24 * s.vl) * dt;
      s.vr += (-170 * (s.r - g.r) - 24 * s.vr) * dt;
      s.l += s.vl * dt;
      s.r += s.vr * dt;
      s.y = g.y;
      draw();
      if (Math.abs(s.l - g.l) < 0.05 && Math.abs(s.r - g.r) < 0.05 && Math.abs(s.vl) + Math.abs(s.vr) < 1) {
        Object.assign(s, g, { vl: 0, vr: 0, raf: 0 });
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
      <div className="tabs-measure">
        <div className="tabs-measure__list" role="tablist" aria-label="Inspector" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-measure__tab"
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
          <svg className="tabs-measure__dim" ref={svg} aria-hidden="true">
            <path className="tabs-measure__ext" />
            <path className="tabs-measure__line" />
            <rect className="tabs-measure__tag" height={13} rx={3} />
            <text className="tabs-measure__num" />
          </svg>
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-measure__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
