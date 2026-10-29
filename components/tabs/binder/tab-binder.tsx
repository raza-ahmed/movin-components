"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'Notes', title: 'Notes', lines: [88, 72, 94, 60] },
  { label: 'Tasks', title: 'Tasks', lines: [64, 80, 52, 70] },
  { label: 'Links', title: 'Links', lines: [76, 58, 84, 46] },
];

const css = `
  @keyframes tabs-binder-turn { from { transform: perspective(500px) rotateY(-75deg); opacity: 0.3; } }
  .tabs-binder { display: flex; align-items: flex-start; width: 260px; }
  .tabs-binder__page { position: relative; flex: 1; height: 150px; padding: 14px 16px 14px 22px; border-radius: 6px 2px 2px 6px; background: light-dark(#ebedf0, #232529); box-shadow: 0 12px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-binder__page::before { content: ''; position: absolute; left: 7px; top: 14px; bottom: 14px; width: 6px; background: radial-gradient(circle, light-dark(#fbfcfd, #121417) 2.5px, transparent 3px) 0 0 / 6px 20px repeat-y; }
  .tabs-binder__panel { transform-origin: 0 50%; }
  .tabs-binder[data-armed] .tabs-binder__panel { animation: tabs-binder-turn 0.45s cubic-bezier(0.3, 1.1, 0.5, 1); }
  .tabs-binder__title { display: block; margin-bottom: 10px; color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; }
  .tabs-binder__line { display: block; height: 6px; margin-bottom: 9px; border-radius: 3px; background: light-dark(#cbced3, #393c41); }
  .tabs-binder__list { display: grid; gap: 4px; padding-top: 12px; }
  .tabs-binder__tab {
    width: 58px;
    height: 32px;
    padding-left: 8px;
    border: 0;
    border-radius: 0 8px 8px 0;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 1px 0 0 light-dark(#dbdde1, #2e3035);
    color: light-dark(#5f626a, #a7abb2);
    font: inherit;
    font-size: 11.5px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transform: translateX(-6px);
    transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1), background-color 0.25s, color 0.25s;
  }
  .tabs-binder__tab:hover { color: light-dark(#42454c, #e5e6e9); transform: translateX(-3px); }
  .tabs-binder__tab[aria-selected='true'] { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); box-shadow: none; transform: translateX(0); }
  .tabs-binder__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-binder__tab { transition: none; }
    .tabs-binder__panel { animation: none !important; }
  }
`;

export function BinderTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [armed, setArmed] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number) => {
    setArmed(true);
    setSel(i);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
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
      <div className="tabs-binder" data-armed={armed ? '' : undefined}>
        <div className="tabs-binder__page">
          {TABS.map((t, i) => (
            <div key={t.label} className="tabs-binder__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
              <span className="tabs-binder__title">{t.title}</span>
              {t.lines.map((w, k) => (
                <span key={k} className="tabs-binder__line" style={{ width: `${w}%` }} />
              ))}
            </div>
          ))}
        </div>
        <div className="tabs-binder__list" role="tablist" aria-label="Sections" aria-orientation="vertical" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-binder__tab"
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
    </>
  );
}
