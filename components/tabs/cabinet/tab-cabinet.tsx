"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const DRAWERS = [
  { label: 'Poems', title: 'Bishop, Elizabeth', body: 'One Art. Shelf 4, bay C.' },
  { label: 'Plays', title: 'Chekhov, Anton', body: 'The Seagull. Shelf 9, bay A.' },
  { label: 'Novels', title: 'Woolf, Virginia', body: 'To the Lighthouse. Shelf 2, bay F.' },
];

const css = `
  @keyframes tabs-cabinet-card { from { opacity: 0; transform: translateY(24px) rotate(-4deg); } }
  .tabs-cabinet { display: flex; align-items: center; gap: 14px; width: 270px; }
  .tabs-cabinet__list { display: grid; gap: 6px; padding: 8px; border-radius: 8px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 1px 0 light-dark(#dbdde1, #2e3035), 0 12px 22px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-cabinet__tab {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 5px;
    width: 92px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 4px;
    background: linear-gradient(light-dark(#cbced3, #393c41), light-dark(#dbdde1, #2e3035));
    box-shadow: inset 0 1px 0 light-dark(#6d7179, #7d8087), 0 1px 0 light-dark(#f3f4f7, #1a1c1f);
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1), box-shadow 0.3s;
  }
  .tabs-cabinet__plate { padding: 1px 8px; border-radius: 2px; background: light-dark(#42454c, #e5e6e9); box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); color: light-dark(#ebedf0, #232529); font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
  .tabs-cabinet__pull { width: 22px; height: 6px; border-radius: 0 0 10px 10px; box-shadow: inset 0 -2px 0 light-dark(#50535b, #c6c8cd); }
  .tabs-cabinet__tab:hover { transform: scale(1.02); }
  .tabs-cabinet__tab[aria-selected='true'] { z-index: 1; transform: translateY(2px) scale(1.1); box-shadow: inset 0 1px 0 light-dark(#6d7179, #7d8087), 0 8px 0 -2px light-dark(#f3f4f7, #1a1c1f), 0 14px 18px -8px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-cabinet__tab:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 2px; }
  .tabs-cabinet__panel { flex: 1; height: 112px; padding: 12px 12px; border-radius: 4px; background: repeating-linear-gradient(transparent 0 19px, color-mix(in oklab, light-dark(#5f626a, #a7abb2) 50%, transparent) 19px 20px) 0 34px / 100% 100% no-repeat, light-dark(#42454c, #e5e6e9); box-shadow: inset 0 3px 0 light-dark(#5f626a, #a7abb2), 0 10px 18px -10px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .tabs-cabinet[data-armed] .tabs-cabinet__panel { animation: tabs-cabinet-card 0.45s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .tabs-cabinet__title { display: block; margin-bottom: 8px; color: light-dark(#f3f4f7, #1a1c1f); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11.5px; font-weight: 600; }
  .tabs-cabinet__body { color: light-dark(#ebedf0, #232529); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; line-height: 20px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-cabinet__tab { transition: none; }
    .tabs-cabinet__panel { animation: none !important; }
  }
`;

export function CabinetTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    if (i === sel) return;
    setArmed(true);
    setSel(i);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = DRAWERS.length;
    const next = { ArrowDown: (sel + 1) % n, ArrowUp: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
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
      <div className="tabs-cabinet" data-armed={armed ? '' : undefined}>
        <div className="tabs-cabinet__list" role="tablist" aria-label="Catalogue" aria-orientation="vertical" onKeyDown={onKeyDown}>
          {DRAWERS.map((d, i) => (
            <button
              key={d.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-cabinet__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              <span className="tabs-cabinet__plate">{d.label}</span>
              <span className="tabs-cabinet__pull" aria-hidden="true" />
            </button>
          ))}
        </div>
        {DRAWERS.map((d, i) => (
          <div key={d.label} className="tabs-cabinet__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <span className="tabs-cabinet__title">{d.title}</span>
            <span className="tabs-cabinet__body">{d.body}</span>
          </div>
        ))}
      </div>
    </>
  );
}
