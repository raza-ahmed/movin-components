"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ITEMS = [
  { label: 'Intro', body: 'Eight bars, left hand only, very soft.' },
  { label: 'Verse', body: 'The melody comes in; keep the pedal light.' },
  { label: 'Chorus', body: 'Both hands, louder, and lean into the third.' },
  { label: 'Outro', body: 'Slow down over the last two bars and hold.' },
];

const css = `
  @keyframes tabs-piano-note-a { 0% { transform: translate(-50%, 0) scale(0.6); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(-50%, -46px) rotate(12deg) scale(1); opacity: 0; } }
  @keyframes tabs-piano-note-b { 0% { transform: translate(-50%, 0) scale(0.6); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(-50%, -46px) rotate(12deg) scale(1); opacity: 0; } }
  .tabs-piano { display: grid; justify-items: center; gap: 14px; width: 240px; }
  /* A piano is ivory and ebony in either theme: the keyboard keeps the dark palette, where the light keys are light. */
  .tabs-piano__list { position: relative; display: flex; gap: 2px; padding: 6px 6px 0; border-radius: 8px 8px 4px 4px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); color-scheme: dark; }
  .tabs-piano__tab { position: relative; padding: 0; border: 0; background: none; font: inherit; cursor: pointer; }
  .tabs-piano__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; border-radius: 8px; }
  .tabs-piano__tab { display: flex; align-items: flex-end; justify-content: center; width: 54px; height: 86px; padding-bottom: 8px; border-radius: 0 0 5px 5px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#dbdde1, #2e3035); font-size: 11px; font-weight: 600; box-shadow: inset 0 -6px 0 light-dark(#50535b, #c6c8cd), 0 2px 0 light-dark(#6d7179, #7d8087); transform-origin: 50% 0; transition: transform 0.15s, box-shadow 0.15s, color 0.2s; }
  .tabs-piano__tab:active { transform: scaleY(0.97); }
  /* Held down: shorter by the depth of the key, its front edge gone, the label darker. */
  .tabs-piano__tab[aria-selected='true'] { transform: translateY(2px); box-shadow: inset 0 -2px 0 light-dark(#50535b, #c6c8cd), inset 0 6px 8px -6px light-dark(rgba(0, 0, 0, 0.11), rgba(0, 0, 0, 0.35)); color: light-dark(#fbfcfd, #121417); }
  .tabs-piano__black { position: absolute; top: 6px; width: 30px; height: 50px; margin-left: -15px; border-radius: 0 0 3px 3px; background: light-dark(#fbfcfd, #121417); box-shadow: inset 0 -4px 0 light-dark(#ebedf0, #232529); pointer-events: none; }
  .tabs-piano__note { position: absolute; top: 0; left: calc(6px + var(--i) * 56px + 27px); width: 14px; height: 18px; opacity: 0; pointer-events: none; }
  .tabs-piano__note svg { width: 100%; height: 100%; }
  .tabs-piano__note path { fill: light-dark(#373a40, #f1f2f3); }
  .tabs-piano[data-flip='a'] .tabs-piano__note { animation: tabs-piano-note-a 0.9s ease-out; }
  .tabs-piano[data-flip='b'] .tabs-piano__note { animation: tabs-piano-note-b 0.9s ease-out; }
  .tabs-piano__panel { color: light-dark(#50535b, #c6c8cd); font-size: 13px; text-align: center; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-piano__note { animation: none !important; }
    .tabs-piano__tab { transition: none; }
  }
`;

export function PianoTabs() {
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
        className="tabs-piano"
        data-armed={flip ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--i': sel, '--p': prev < 0 ? sel : prev } as React.CSSProperties}
      >
        <div className="tabs-piano__list" role="tablist" aria-label="Song section" onKeyDown={onKeyDown}>
          {ITEMS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-piano__tab"
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
          {[1, 2, 3].map((k) => (
            <span key={k} className="tabs-piano__black" aria-hidden="true" style={{ left: 6 + k * 56 - 1 }} />
          ))}
          <span className="tabs-piano__note" aria-hidden="true">
            <svg viewBox="0 0 14 18">
              <path d="M9 0h2v12.5A3.5 3 0 1 1 9 9.8Z" />
            </svg>
          </span>
        </div>
        {ITEMS.map((t, i) => (
          <div key={t.label} className="tabs-piano__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
