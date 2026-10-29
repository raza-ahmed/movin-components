"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const DISHES = [
  { label: 'Pizza', sub: 'Margherita, 12 min away' },
  { label: 'Ramen', sub: 'Tonkotsu, 20 min away' },
  { label: 'Tacos', sub: 'Al pastor, 8 min away' },
  { label: 'Curry', sub: 'Green curry, 15 min away' },
];
const N = DISHES.length;
const COPIES = 5; // the reel is five copies long so a full spin always has room; the middle copy holds the real panels
const H = 62;

const css = `
  @keyframes tabs-reels-blur-a { 0%, 100% { filter: blur(0); } 15%, 70% { filter: blur(1.6px); } }
  @keyframes tabs-reels-blur-b { 0%, 100% { filter: blur(0); } 15%, 70% { filter: blur(1.6px); } }
  @keyframes tabs-reels-pull-a { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(55deg); } }
  @keyframes tabs-reels-pull-b { 0%, 100% { transform: rotate(0deg); } 30% { transform: rotate(55deg); } }
  .tabs-reels { width: 250px; }
  .tabs-reels__machine { position: relative; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 16px; background: linear-gradient(light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529)); box-shadow: inset 0 1px 0 light-dark(#cbced3, #393c41), 0 12px 22px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-reels__window { position: relative; flex: 1; height: ${H}px; overflow: hidden; border-radius: 8px; background: light-dark(#42454c, #e5e6e9); box-shadow: inset 0 0 0 2px light-dark(#f3f4f7, #1a1c1f); }
  .tabs-reels__window::after { content: ''; position: absolute; inset: 0; background: linear-gradient(color-mix(in oklab, light-dark(#fbfcfd, #121417) 55%, transparent), transparent 30%, transparent 70%, color-mix(in oklab, light-dark(#fbfcfd, #121417) 55%, transparent)); pointer-events: none; }
  .tabs-reels__strip { transform: translateY(calc(var(--tabs-reels-pos) * -${H}px)); }
  .tabs-reels[data-spin] .tabs-reels__strip { transition: transform 1.1s cubic-bezier(0.25, 0.8, 0.3, 1.06); }
  .tabs-reels[data-flip='a'] .tabs-reels__strip { animation: tabs-reels-blur-a 1.1s; }
  .tabs-reels[data-flip='b'] .tabs-reels__strip { animation: tabs-reels-blur-b 1.1s; }
  .tabs-reels__item { display: grid; align-content: center; justify-items: center; height: ${H}px; }
  .tabs-reels__word { color: light-dark(#f3f4f7, #1a1c1f); font-size: 20px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .tabs-reels__sub { color: light-dark(#cbced3, #393c41); font-size: 11px; }
  .tabs-reels__lever { position: relative; width: 14px; height: 54px; }
  .tabs-reels__stick { position: absolute; left: 5px; bottom: 6px; width: 4px; height: 40px; border-radius: 2px; background: light-dark(#5f626a, #a7abb2); transform-origin: 50% 100%; }
  .tabs-reels__stick::before { content: ''; position: absolute; left: -5px; top: -8px; width: 14px; height: 14px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2)); }
  .tabs-reels__base { position: absolute; left: 1px; bottom: 0; width: 12px; height: 10px; border-radius: 3px; background: light-dark(#cbced3, #393c41); }
  .tabs-reels[data-flip='a'] .tabs-reels__stick { animation: tabs-reels-pull-a 0.6s ease-in-out; }
  .tabs-reels[data-flip='b'] .tabs-reels__stick { animation: tabs-reels-pull-b 0.6s ease-in-out; }
  .tabs-reels__list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: 10px; }
  .tabs-reels__tab { padding: 6px 0; border: 0; border-radius: 7px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529); color: light-dark(#5f626a, #a7abb2); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; transition: color 0.2s, box-shadow 0.2s; }
  .tabs-reels__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-reels__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .tabs-reels__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-reels__strip, .tabs-reels__stick { transition: none !important; animation: none !important; }
  }
`;

export function ReelsTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, pos: 2 * N, spin: false, flip: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel, pos, spin, flip } = state;
  const select = (i: number) => {
    if (i === sel) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState((s) => ({ ...s, sel: i, pos: 2 * N + i }));
      return;
    }
    // Spin forward one full turn plus however far it is to the pick.
    setState((s) => ({ sel: i, pos: 2 * N + s.sel + ((i - s.sel + N) % N) + N, spin: true, flip: s.flip + 1 }));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % N, ArrowLeft: (sel + N - 1) % N, Home: 0, End: N - 1 }[e.key];
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
        className="tabs-reels"
        data-spin={spin ? '' : undefined}
        data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--tabs-reels-pos': pos } as React.CSSProperties}
      >
        <div className="tabs-reels__machine">
          <div className="tabs-reels__window">
            {/* Once the reel stops, snap back to the same dish in the middle copy, where the real panels live. */}
            <div className="tabs-reels__strip" onTransitionEnd={() => setState((s) => ({ ...s, pos: 2 * N + s.sel, spin: false }))}>
              {Array.from({ length: COPIES * N }, (_, k) => {
                const i = k % N;
                const d = DISHES[i];
                const real = Math.floor(k / N) === 2;
                return real ? (
                  <div
                    key={k}
                    className="tabs-reels__item"
                    role="tabpanel"
                    id={`${id}-panel-${i}`}
                    aria-labelledby={`${id}-tab-${i}`}
                    aria-hidden={sel !== i}
                    inert={sel !== i}
                  >
                    <span className="tabs-reels__word">{d.label}</span>
                    <span className="tabs-reels__sub">{d.sub}</span>
                  </div>
                ) : (
                  <div key={k} className="tabs-reels__item" aria-hidden="true">
                    <span className="tabs-reels__word">{d.label}</span>
                    <span className="tabs-reels__sub">{d.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <span className="tabs-reels__lever" aria-hidden="true">
            <span className="tabs-reels__stick" />
            <span className="tabs-reels__base" />
          </span>
        </div>
        <div className="tabs-reels__list" role="tablist" aria-label="Lunch" onKeyDown={onKeyDown}>
          {DISHES.map((d, i) => (
            <button
              key={d.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-reels__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
