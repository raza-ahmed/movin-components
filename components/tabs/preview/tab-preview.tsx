"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

// Each tab's page, sketched small: [width %, kind] rows, and the card's size for it.
const TABS = [
  {
    label: 'Overview',
    w: 132,
    h: 66,
    rows: [
      [70, 'head'],
      [92, 'line'],
      [60, 'line'],
      [100, 'box'],
    ],
    body: 'What the product does, in two minutes, with a short film.',
  },
  {
    label: 'Pricing',
    w: 156,
    h: 74,
    rows: [
      [50, 'head'],
      [100, 'cols'],
    ],
    body: 'Three plans. Teams of three or more get one invoice.',
  },
  {
    label: 'Docs',
    w: 118,
    h: 70,
    rows: [
      [60, 'head'],
      [90, 'line'],
      [80, 'line'],
      [86, 'line'],
      [50, 'line'],
    ],
    body: 'Guides, the API reference and a changelog going back to 1.0.',
  },
  {
    label: 'Blog',
    w: 144,
    h: 62,
    rows: [
      [100, 'box'],
      [75, 'head'],
      [55, 'line'],
    ],
    body: 'Notes from the team. The latest is about rewriting the editor.',
  },
] as const;
const W = 240;
const COL = W / TABS.length;
const TOP = 84;

const css = `
  .tabs-preview { position: relative; width: ${W}px; padding-top: ${TOP + 6}px; }
  /* One card glides and resizes between tabs instead of a tooltip per tab. */
  .tabs-preview__card {
    position: absolute;
    top: 0;
    box-sizing: border-box;
    padding: 9px;
    border-radius: 10px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: 0 10px 24px -10px var(--tabs-preview-shadow), inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    opacity: 0;
    transform: translateY(4px) scale(0.96);
    transform-origin: 50% 100%;
    transition: left 0.28s cubic-bezier(0.3, 1.2, 0.5, 1), top 0.28s cubic-bezier(0.3, 1.2, 0.5, 1), width 0.28s cubic-bezier(0.3, 1.2, 0.5, 1), height 0.28s cubic-bezier(0.3, 1.2, 0.5, 1), opacity 0.18s, transform 0.18s;
    pointer-events: none;
  }
  .tabs-preview { --tabs-preview-shadow: light-dark(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)); }
  .tabs-preview__card--on { opacity: 1; transform: none; }
  .tabs-preview__page { display: grid; gap: 5px; animation: tabs-preview-in 0.22s ease-out; }
  @keyframes tabs-preview-in {
    from { opacity: 0; }
  }
  .tabs-preview__head { height: 7px; border-radius: 2px; background: light-dark(#5f626a, #a7abb2); }
  .tabs-preview__line { height: 4px; border-radius: 2px; background: light-dark(#cbced3, #393c41); }
  .tabs-preview__box { height: 22px; border-radius: 4px; background: light-dark(#dbdde1, #2e3035); }
  .tabs-preview__cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; height: 40px; }
  .tabs-preview__cols span { border-radius: 4px; background: light-dark(#dbdde1, #2e3035); }
  .tabs-preview__cols span:nth-child(2) { background: light-dark(#6d7179, #7d8087); }
  .tabs-preview__nub { position: absolute; top: ${TOP - 6}px; width: 10px; height: 10px; margin-left: -5px; background: light-dark(#ebedf0, #232529); transform: rotate(45deg); opacity: 0; transition: left 0.28s cubic-bezier(0.3, 1.2, 0.5, 1), opacity 0.18s; pointer-events: none; }
  .tabs-preview__nub--on { opacity: 1; }
  .tabs-preview__list { position: relative; display: grid; grid-template-columns: repeat(${TABS.length}, 1fr); border-bottom: 1px solid light-dark(#ebedf0, #232529); }
  .tabs-preview__tab { border: 0; padding: 6px 0 9px; background: none; font: inherit; font-size: 12.5px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.25s; }
  .tabs-preview__tab:hover, .tabs-preview__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-preview__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; border-radius: 6px; }
  .tabs-preview__line-under { position: absolute; bottom: -1px; height: 2px; background: light-dark(#373a40, #f1f2f3); transition: left 0.3s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .tabs-preview__panel { padding: 10px 0 0; min-height: calc(3.1em + 10px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-preview__card, .tabs-preview__nub, .tabs-preview__line-under { transition: opacity 0.18s; }
    .tabs-preview__page { animation: none; }
  }
`;

export function PreviewTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [peek, setPeek] = useState<{ i: number; on: boolean }>({ i: 0, on: false });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // The first hover waits a moment before the card shows; after that it follows at once from tab to tab.
  const enter = (i: number) => {
    clearTimeout(timer.current);
    if (peek.on) return setPeek({ i, on: true });
    timer.current = window.setTimeout(() => setPeek({ i, on: true }), 160);
  };
  const leave = () => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPeek((p) => ({ ...p, on: false })), 120);
  };
  const t = TABS[peek.i];
  const x = Math.max(0, Math.min(W - t.w, peek.i * COL + COL / 2 - t.w / 2));
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
      <div className="tabs-preview">
        <div className={`tabs-preview__card${peek.on ? ' tabs-preview__card--on' : ''}`} style={{ left: x, top: TOP - t.h, width: t.w, height: t.h }} aria-hidden="true">
          <div key={peek.i} className="tabs-preview__page">
            {t.rows.map(([w, kind], r) =>
              kind === 'cols' ? (
                <span key={r} className="tabs-preview__cols">
                  <span />
                  <span />
                  <span />
                </span>
              ) : (
                <span key={r} className={`tabs-preview__${kind}`} style={{ width: `${w}%` }} />
              ),
            )}
          </div>
        </div>
        <span className={`tabs-preview__nub${peek.on ? ' tabs-preview__nub--on' : ''}`} style={{ left: peek.i * COL + COL / 2 }} aria-hidden="true" />
        <div className="tabs-preview__list" role="tablist" aria-label="Site" onKeyDown={onKeyDown} onPointerLeave={leave}>
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-preview__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onPointerEnter={(e) => e.pointerType === 'mouse' && enter(i)}
              onClick={() => setSel(i)}
            >
              {tab.label}
            </button>
          ))}
          <span className="tabs-preview__line-under" style={{ left: sel * COL + 14, width: COL - 28 }} aria-hidden="true" />
        </div>
        {TABS.map((tab, i) => (
          <div key={tab.label} className="tabs-preview__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {tab.body}
          </div>
        ))}
      </div>
    </>
  );
}
