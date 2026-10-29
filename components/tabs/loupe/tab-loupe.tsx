"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ITEMS = [
  { label: 'Prints', body: 'Forty limited prints, signed and numbered.' },
  { label: 'Books', body: 'Monographs and catalogues, most out of print.' },
  { label: 'Letters', body: 'Correspondence from 1962 to 1978, in full.' },
];

const css = `
  .tabs-loupe { display: grid; gap: 14px; width: 228px; }
  .tabs-loupe__list { position: relative; display: flex; height: 64px; align-items: center; }
  .tabs-loupe__tab { position: relative; padding: 0; border: 0; background: none; font: inherit; cursor: pointer; }
  .tabs-loupe__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 8px; }
  .tabs-loupe__tab { width: 76px; height: 40px; color: light-dark(#5f626a, #a7abb2); font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-style: italic; transition: color 0.3s; }
  .tabs-loupe__tab[aria-selected='true'] { color: light-dark(#6d7179, #7d8087); }
  /* The lens: a ring over the chosen tab with an enlarged copy of the row inside, kept in register. */
  .tabs-loupe__lens { position: absolute; top: 4px; left: calc(var(--i) * 76px + 10px); width: 56px; height: 56px; border-radius: 50%; overflow: hidden; pointer-events: none; background: light-dark(#fbfcfd, #121417); box-shadow: inset 0 0 0 2px light-dark(#50535b, #c6c8cd), inset 0 0 12px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.4)), 0 6px 14px -6px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); transition: left 0.6s cubic-bezier(0.4, 1.3, 0.5, 1); }
  .tabs-loupe__zoom { position: absolute; left: 0; top: 0; display: flex; align-items: center; height: 64px; transform-origin: 0 0; transform: translate(calc(28px - (var(--i) + 0.5) * 76px * 1.7), -26.4px) scale(1.7); transition: transform 0.6s cubic-bezier(0.4, 1.3, 0.5, 1); }
  .tabs-loupe__zoom span { width: 76px; color: light-dark(#373a40, #f1f2f3); font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-style: italic; text-align: center; }
  .tabs-loupe__handle { position: absolute; top: 52px; left: calc(var(--i) * 76px + 52px); width: 4px; height: 20px; border-radius: 2px; background: light-dark(#6d7179, #7d8087); transform: rotate(-40deg); transform-origin: 50% 0; pointer-events: none; transition: left 0.6s cubic-bezier(0.4, 1.3, 0.5, 1); }
  .tabs-loupe__panel { color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.5; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-loupe__lens, .tabs-loupe__zoom, .tabs-loupe__handle { transition: none; }
  }
`;

export function LoupeTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 1, prev: -1, flip: 0 });
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
        className="tabs-loupe"
        data-armed={flip ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--i': sel, '--p': prev < 0 ? sel : prev } as React.CSSProperties}
      >
        <div className="tabs-loupe__list" role="tablist" aria-label="Collection" onKeyDown={onKeyDown}>
          {ITEMS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-loupe__tab"
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
          <span className="tabs-loupe__handle" aria-hidden="true" />
          <span className="tabs-loupe__lens" aria-hidden="true">
            <span className="tabs-loupe__zoom">
              {ITEMS.map((t) => (
                <span key={t.label}>{t.label}</span>
              ))}
            </span>
          </span>
        </div>
        {ITEMS.map((t, i) => (
          <div key={t.label} className="tabs-loupe__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
