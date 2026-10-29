"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'index.ts', badge: 'TS', code: ["import { spring } from './motion';", '', 'export function enter(el) {', '  return spring(el, { y: [8, 0] });', '}'] },
  { label: 'card.css', badge: '#', code: ['.card {', '  border-radius: 12px;', '  transition: transform 0.3s;', '}', '.card:hover { scale: 1.02; }'] },
  { label: 'README', badge: 'M', code: ['# Motion kit', '', 'Small helpers for UI motion.', '', 'npm i motion-kit'] },
];
const KEYWORDS = new Set(['import', 'from', 'export', 'function', 'return', 'npm']);

const css = `
  @keyframes tabs-editor-line { from { opacity: 0; transform: translateX(-6px); } }
  .tabs-editor { width: 270px; overflow: hidden; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529), 0 14px 28px -16px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-editor__list { position: relative; display: flex; background: light-dark(#fbfcfd, #121417); box-shadow: inset 0 -1px 0 light-dark(#ebedf0, #232529); }
  .tabs-editor__accent { position: absolute; left: 0; top: 0; width: 84px; height: 2px; background: light-dark(#373a40, #f1f2f3); transform: translateX(calc(var(--tabs-editor-i) * 84px)); transition: transform 0.35s cubic-bezier(0.3, 1.3, 0.5, 1); }
  .tabs-editor__tab { display: flex; align-items: center; gap: 6px; width: 84px; height: 32px; padding: 0 10px; border: 0; background: none; box-shadow: inset -1px 0 0 light-dark(#ebedf0, #232529); color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 11.5px; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
  .tabs-editor__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-editor__tab[aria-selected='true'] { background: light-dark(#f3f4f7, #1a1c1f); color: light-dark(#373a40, #f1f2f3); }
  .tabs-editor__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -3px; }
  .tabs-editor__badge { display: grid; place-items: center; min-width: 16px; height: 13px; padding: 0 2px; border-radius: 3px; background: light-dark(#dbdde1, #2e3035); color: light-dark(#42454c, #e5e6e9); font-size: 8px; font-weight: 600; }
  .tabs-editor__panel { padding: 10px 0 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 10.5px; line-height: 1.7; }
  .tabs-editor__line { display: flex; gap: 12px; padding: 0 12px; white-space: pre; }
  .tabs-editor[data-armed] .tabs-editor__line { animation: tabs-editor-line 0.3s ease-out backwards; animation-delay: calc(var(--n) * 45ms); }
  .tabs-editor__num { width: 10px; color: light-dark(#cbced3, #393c41); text-align: right; }
  .tabs-editor__code { color: light-dark(#50535b, #c6c8cd); }
  .tabs-editor__kw { color: light-dark(#373a40, #f1f2f3); font-weight: 600; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-editor__accent { transition: none; }
    .tabs-editor__line { animation: none !important; }
  }
`;

function Line({ text }: { text: string }) {
  return (
    <span className="tabs-editor__code">
      {text.split(/(\s+)/).map((w, k) => (KEYWORDS.has(w) ? <span key={k} className="tabs-editor__kw">{w}</span> : w))}
    </span>
  );
}

export function EditorTabs() {
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
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
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
      <div className="tabs-editor" data-armed={armed ? '' : undefined} style={{ '--tabs-editor-i': sel } as React.CSSProperties}>
        <div className="tabs-editor__list" role="tablist" aria-label="Open files" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-editor__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              <span className="tabs-editor__badge" aria-hidden="true">
                {t.badge}
              </span>
              {t.label}
            </button>
          ))}
          <span className="tabs-editor__accent" aria-hidden="true" />
        </div>
        {TABS.map((t, i) => (
          <div key={t.label} className="tabs-editor__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.code.map((line, n) => (
              <div key={n} className="tabs-editor__line" style={{ '--n': n } as React.CSSProperties}>
                <span className="tabs-editor__num" aria-hidden="true">
                  {n + 1}
                </span>
                <Line text={line} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
