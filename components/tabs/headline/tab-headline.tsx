"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ITEMS = [
  { label: 'City', head: 'New bridge opens at dawn', kicker: 'Crowds cross before the ribbon is cut' },
  { label: 'Arts', head: 'The lost mural returns', kicker: 'Forty years in a basement, restored' },
  { label: 'Sport', head: 'Rowers win in fog', kicker: 'A finish nobody on the bank could see' },
];

const css = `
  @keyframes tabs-headline-spin { 0% { transform: rotate(-540deg) scale(0.1); opacity: 0; } 70% { transform: rotate(8deg) scale(1.04); opacity: 1; } 100% { transform: none; opacity: 1; } }
  .tabs-headline { display: grid; justify-items: center; gap: 12px; width: 250px; }
  .tabs-headline__list { display: flex; gap: 14px; border-bottom: 1px solid light-dark(#dbdde1, #2e3035); }
  .tabs-headline__tab { position: relative; padding: 0; border: 0; background: none; font: inherit; cursor: pointer; }
  .tabs-headline__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 8px; }
  .tabs-headline__tab { padding: 4px 2px 7px; color: light-dark(#5f626a, #a7abb2); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; box-shadow: inset 0 -2px 0 transparent; transition: color 0.2s, box-shadow 0.2s; }
  .tabs-headline__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); box-shadow: inset 0 -2px 0 light-dark(#373a40, #f1f2f3); }
  .tabs-headline__panel { width: 210px; padding: 10px 12px 12px; border-radius: 2px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 12px 22px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-headline[data-armed] .tabs-headline__panel { animation: tabs-headline-spin 0.8s cubic-bezier(0.25, 0.8, 0.35, 1) both; }
  .tabs-headline__mast { display: flex; justify-content: space-between; padding-bottom: 5px; border-bottom: 2px solid light-dark(#50535b, #c6c8cd); color: light-dark(#373a40, #f1f2f3); font-family: Georgia, 'Times New Roman', serif; font-size: 13px; font-weight: 600; }
  .tabs-headline__mast small { align-self: flex-end; color: light-dark(#5f626a, #a7abb2); font-family: inherit; font-size: 8px; font-weight: 400; letter-spacing: 0.1em; }
  .tabs-headline__head { margin: 8px 0 3px; color: light-dark(#373a40, #f1f2f3); font-family: Georgia, 'Times New Roman', serif; font-size: 17px; line-height: 1.1; }
  .tabs-headline__kick { color: light-dark(#50535b, #c6c8cd); font-size: 10.5px; font-style: italic; }
  .tabs-headline__cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-top: 8px; height: 22px; background: repeating-linear-gradient(light-dark(#cbced3, #393c41) 0 1.5px, transparent 1.5px 5px); -webkit-mask: linear-gradient(90deg, #000 30%, transparent 30% 35%, #000 35% 65%, transparent 65% 70%, #000 70%); mask: linear-gradient(90deg, #000 30%, transparent 30% 35%, #000 35% 65%, transparent 65% 70%, #000 70%); }
  @media (prefers-reduced-motion: reduce) {
    .tabs-headline__panel { animation: none !important; }
  }
`;

export function HeadlineTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, prev: -1, flip: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel, prev, flip } = state;
  const select = (i: number) => {
    if (i !== sel) setState((s) => ({ sel: i, prev: s.sel, flip: s.flip + 1 }));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = ITEMS.length;
    const next = ({ ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="tabs-headline"
        data-armed={flip ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--i': sel, '--p': prev < 0 ? sel : prev } as React.CSSProperties}
      >
        <div className="tabs-headline__list" role="tablist" aria-label="Sections" onKeyDown={onKeyDown}>
          {ITEMS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-headline__tab"
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
        {ITEMS.map((t, i) => (
          <div key={t.label} className="tabs-headline__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <div className="tabs-headline__mast" aria-hidden="true">
              The Daily <small>EST. 1898</small>
            </div>
            <div className="tabs-headline__head">{t.head}</div>
            <div className="tabs-headline__kick">{t.kicker}</div>
            <div className="tabs-headline__cols" aria-hidden="true" />
          </div>
        ))}
      </div>
    </>
  );
}
