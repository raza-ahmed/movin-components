"use client";

import * as React from "react";
import { useId, useLayoutEffect, useRef, useState } from 'react';

const TABS = [
  { label: 'Overview', body: 'A walnut desk lamp with a linen shade and a dimmer in the base.' },
  { label: 'Materials', body: 'Oiled American walnut, washed linen and a brushed brass stem.' },
  { label: 'Reviews', body: 'Rated 4.8 from 212 reviews. “Warm light, beautifully made.”' },
];
const SMALL = 13;
const BIG = 22;
const FLY = { duration: 560, easing: 'cubic-bezier(0.32, 0.72, 0.2, 1)' };

const css = `
  .tabs-carry { position: relative; width: 270px; }
  .tabs-carry__list { display: flex; gap: 20px; }
  .tabs-carry__tab { position: relative; border: 0; padding: 6px 0; background: none; font: inherit; font-size: ${SMALL}px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-carry__tab:hover { color: light-dark(#373a40, #f1f2f3); }
  .tabs-carry__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-carry__tab::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -3px;
    width: 4px;
    height: 4px;
    margin-left: -2px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    transform: scale(0);
    transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .tabs-carry__tab[aria-selected='true']::after { transform: scale(1); }
  .tabs-carry__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; border-radius: 4px; }
  .tabs-carry__panel { padding-top: 18px; }
  .tabs-carry__head, .tabs-carry__ghost { margin: 0; font-size: ${BIG}px; font-weight: 600; line-height: 1.2; letter-spacing: -0.01em; color: light-dark(#373a40, #f1f2f3); }
  .tabs-carry__head span, .tabs-carry__ghost { display: inline-block; transform-origin: 0 0; }
  .tabs-carry__ghost { position: absolute; left: 0; top: 0; opacity: 0; pointer-events: none; white-space: nowrap; }
  .tabs-carry__body { margin: 8px 0 0; min-height: 3.1em; color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; animation: tabs-carry-in 0.45s 0.18s both; }
  @keyframes tabs-carry-in {
    from { opacity: 0; transform: translateY(4px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs-carry__body { animation: none; }
  }
`;

export function CarryTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLSpanElement>(null);
  const ghost = useRef<HTMLSpanElement>(null);
  const prev = useRef(sel);

  // The new heading starts where its tab label is and grows into place; the old one shrinks back to its tab.
  useLayoutEffect(() => {
    const from = prev.current;
    prev.current = sel;
    if (from === sel || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = root.current!.getBoundingClientRect();
    const h = head.current!.getBoundingClientRect();
    const label = (i: number) => tabs.current[i]!.querySelector('span')!.getBoundingClientRect();
    const [to, back] = [label(sel), label(from)];
    const s = SMALL / BIG;
    head.current!.animate([{ transform: `translate(${to.left - h.left}px, ${to.top - h.top}px) scale(${s})` }, { transform: 'none' }], FLY);
    const g = ghost.current!;
    g.textContent = TABS[from].label;
    const at = `translate(${h.left - box.left}px, ${h.top - box.top}px)`;
    const home = `translate(${back.left - box.left}px, ${back.top - box.top}px) scale(${s})`;
    g.animate(
      [
        { transform: at, opacity: 1 },
        { transform: home, opacity: 1, offset: 0.92 },
        { transform: home, opacity: 0 },
      ],
      FLY,
    );
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
      <div className="tabs-carry" ref={root}>
        <div className="tabs-carry__list" role="tablist" aria-label="Product details" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-carry__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-carry__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <p className="tabs-carry__head">
              <span ref={sel === i ? head : undefined}>{t.label}</span>
            </p>
            {sel === i && <p className="tabs-carry__body">{t.body}</p>}
          </div>
        ))}
        <span className="tabs-carry__ghost" ref={ghost} aria-hidden="true" />
      </div>
    </>
  );
}
