"use client";

import * as React from "react";
import { useId, useLayoutEffect, useRef, useState } from 'react';

const TABS = [
  { label: 'All', body: '1,284 pieces across every category.' },
  { label: 'Motion', body: 'Loops, transitions and kinetic type.' },
  { label: 'Interface', body: 'Buttons, menus and the small details.' },
  { label: 'Type', body: 'Lettering, layouts and specimens.' },
  { label: 'Illustration', body: 'Drawn by hand, mostly in ink.' },
  { label: '3D', body: 'Renders, materials and product shots.' },
  { label: 'Sound', body: 'Short scores and interface sounds.' },
  { label: 'Code', body: 'Generative sketches and shaders.' },
];

const css = `
  .tabs-scroller { position: relative; width: 260px; }
  .tabs-scroller__scroll {
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 var(--tabs-scroller-l), #000 calc(100% - var(--tabs-scroller-r)), transparent);
    mask-image: linear-gradient(90deg, transparent, #000 var(--tabs-scroller-l), #000 calc(100% - var(--tabs-scroller-r)), transparent);
  }
  .tabs-scroller__scroll::-webkit-scrollbar { display: none; }
  .tabs-scroller__list { position: relative; isolation: isolate; display: flex; gap: 4px; width: max-content; padding: 2px; }
  .tabs-scroller__pill {
    position: absolute;
    top: 2px;
    height: 32px;
    border-radius: 999px;
    background: light-dark(#373a40, #f1f2f3);
    transition: left 0.45s cubic-bezier(0.3, 1.25, 0.5, 1), width 0.45s cubic-bezier(0.3, 1.25, 0.5, 1);
  }
  .tabs-scroller__tab { position: relative; height: 32px; padding: 0 14px; border: 0; border-radius: 999px; background: none; color: light-dark(#50535b, #c6c8cd); font: inherit; font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; transition: color 0.25s; }
  /* Each chip's outline sits beneath the pill (z-index -1 in the list's stacking context), so the pill slides over them cleanly. */
  .tabs-scroller__tab::before { content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); }
  .tabs-scroller__tab:hover { color: light-dark(#373a40, #f1f2f3); }
  .tabs-scroller__tab[aria-selected='true'] { color: light-dark(#fbfcfd, #121417); transition-delay: 0.15s; }
  .tabs-scroller__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .tabs-scroller__arrow {
    position: absolute;
    top: 3px;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: 0;
    border-radius: 50%;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#42454c, #e5e6e9);
    box-shadow: 0 2px 8px light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
  }
  .tabs-scroller__arrow[data-hidden] { opacity: 0; transform: scale(0.7); pointer-events: none; }
  .tabs-scroller__arrow svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .tabs-scroller__panel { padding: 14px 4px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-scroller__pill { transition: none; }
  }
`;

export function ScrollerTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [box, setBox] = useState({ left: 0, width: 0 });
  const [edges, setEdges] = useState({ start: true, end: false });
  const scroll = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  const update = () => {
    const s = scroll.current!;
    setEdges({ start: s.scrollLeft < 2, end: s.scrollLeft > s.scrollWidth - s.clientWidth - 2 });
  };
  useLayoutEffect(() => {
    const measure = () => {
      const t = tabs.current[sel];
      if (t) setBox({ left: t.offsetLeft, width: t.offsetWidth });
      update();
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [sel]);

  const select = (i: number) => {
    setSel(i);
    const s = scroll.current!;
    const t = tabs.current[i]!;
    // The chosen tab glides to the middle of the row.
    s.scrollTo({ left: t.offsetLeft + t.offsetWidth / 2 - s.clientWidth / 2, behavior: smooth() });
  };
  const page = (d: number) => scroll.current!.scrollBy({ left: d * 160, behavior: smooth() });
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowRight: Math.min(n - 1, sel + 1), ArrowLeft: Math.max(0, sel - 1), Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };
  const chevron = (d: string) => (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} />
    </svg>
  );
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-scroller">
        <div
          ref={scroll}
          className="tabs-scroller__scroll"
          onScroll={update}
          style={{ '--tabs-scroller-l': edges.start ? '0px' : '40px', '--tabs-scroller-r': edges.end ? '0px' : '40px' } as React.CSSProperties}
        >
          <div className="tabs-scroller__list" role="tablist" aria-label="Category" onKeyDown={onKeyDown}>
            <span className="tabs-scroller__pill" style={{ left: box.left, width: box.width }} aria-hidden="true" />
            {TABS.map((t, i) => (
              <button
                key={t.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tabs-scroller__tab"
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => select(i)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {/* Pointer conveniences; keyboard users move along the tabs with the arrow keys. */}
        <button className="tabs-scroller__arrow" style={{ left: 0 }} type="button" tabIndex={-1} aria-hidden="true" data-hidden={edges.start || undefined} onClick={() => page(-1)}>
          {chevron('M10 3.5 5.5 8l4.5 4.5')}
        </button>
        <button className="tabs-scroller__arrow" style={{ right: 0 }} type="button" tabIndex={-1} aria-hidden="true" data-hidden={edges.end || undefined} onClick={() => page(1)}>
          {chevron('M6 3.5 10.5 8 6 12.5')}
        </button>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-scroller__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
