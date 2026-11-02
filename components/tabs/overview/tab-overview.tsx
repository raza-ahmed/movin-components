"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const VIEWS = [
  { label: 'Photos', items: ['Harbour, 6am', 'Market stalls', 'Fog on the pier'] },
  { label: 'Notes', items: ['Poster sizes', 'Ink order', 'Call the printer'] },
  { label: 'Files', items: ['brief.pdf', 'moodboard.fig', 'invoice-1042.pdf'] },
];
const W = 240;
const H = 120;
const GAP = 24;
const ZOOM = 0.36;
const cx = (i: number) => i * (W + GAP) + W / 2;
const view = (s: number, c: number) => `translate(${W / 2}px, ${H / 2}px) scale(${s}) translate(${-c}px, ${-H / 2}px)`;

const css = `
  .tabs-overview { width: ${W}px; }
  .tabs-overview__list { display: flex; gap: 4px; margin-bottom: 10px; padding: 3px; border-radius: 10px; background: light-dark(#ebedf0, #232529); }
  .tabs-overview__tab { flex: 1; height: 26px; border: 0; border-radius: 7px; background: none; color: light-dark(#50535b, #c6c8cd); font: inherit; font-size: 12px; font-weight: 500; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
  .tabs-overview__tab[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-overview__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .tabs-overview__view { position: relative; height: ${H}px; border-radius: 14px; overflow: hidden; background: light-dark(#fbfcfd, #121417); }
  .tabs-overview__track { position: absolute; left: 0; top: 0; display: flex; gap: ${GAP}px; transform-origin: 0 0; }
  .tabs-overview__panel { box-sizing: border-box; width: ${W}px; height: ${H}px; padding: 14px; border-radius: 14px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .tabs-overview__panel b { display: block; margin-bottom: 8px; font-size: 13px; color: light-dark(#373a40, #f1f2f3); }
  .tabs-overview__panel ul { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; font-size: 12px; color: light-dark(#50535b, #c6c8cd); }
  .tabs-overview__panel li { display: flex; align-items: center; gap: 8px; }
  .tabs-overview__panel li::before { content: ''; width: 14px; height: 14px; border-radius: 4px; background: light-dark(#dbdde1, #2e3035); }
`;

export function OverviewTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const track = useRef<HTMLDivElement>(null);

  // Switching pulls back to show every panel side by side, slides along to the new one and zooms in
  // on it. It starts from wherever the view is, so a quick second pick carries on smoothly.
  useEffect(() => {
    const el = track.current!;
    const m = new DOMMatrix(getComputedStyle(el).transform);
    const s0 = m.a || 1;
    const c0 = (W / 2 - m.e) / s0;
    el.getAnimations().forEach((a) => a.cancel());
    const c1 = cx(sel);
    el.style.transform = view(1, c1);
    if (Math.abs(c0 - c1) < 1 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.animate(
      [
        { transform: view(s0, c0), easing: 'ease-in-out' },
        { transform: view(ZOOM, c0), offset: 0.3, easing: 'ease-in-out' },
        { transform: view(ZOOM, c1), offset: 0.68, easing: 'ease-in-out' },
        { transform: view(1, c1) },
      ],
      { duration: 950 },
    );
  }, [sel]);

  const n = VIEWS.length;
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
      <div className="tabs-overview">
        <div className="tabs-overview__list" role="tablist" aria-label="Library" onKeyDown={onKeyDown}>
          {VIEWS.map((v, i) => (
            <button
              key={v.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-overview__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="tabs-overview__view">
          <div className="tabs-overview__track" ref={track} style={{ transform: view(1, cx(0)) }}>
            {/* Every panel stays laid out so the overview can show them all; only the chosen one is exposed. */}
            {VIEWS.map((v, i) => (
              <div
                key={v.label}
                className="tabs-overview__panel"
                role="tabpanel"
                id={`${id}-panel-${i}`}
                aria-labelledby={`${id}-tab-${i}`}
                aria-hidden={sel !== i}
                inert={sel !== i}
              >
                <b>{v.label}</b>
                <ul>
                  {v.items.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
