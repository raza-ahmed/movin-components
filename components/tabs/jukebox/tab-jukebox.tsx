"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const SONGS = [
  { code: 'A1', label: 'Night Drive', artist: 'The Lumens', c: 'light-dark(#42454c, #e5e6e9)' },
  { code: 'B4', label: 'Paper Moon', artist: 'Ida Grey', c: 'light-dark(#5f626a, #a7abb2)' },
  { code: 'C2', label: 'Slow Train', artist: 'Marlow & Co', c: 'light-dark(#cbced3, #393c41)' },
];

const css = `
  @keyframes tabs-jukebox-spin { to { transform: rotate(360deg); } }
  @keyframes tabs-jukebox-in { from { transform: translateX(130%) rotate(90deg); } }
  @keyframes tabs-jukebox-out { to { transform: translateX(-130%) rotate(-90deg); } }
  @keyframes tabs-jukebox-arm-a { 0% { transform: rotate(26deg); } 25%, 70% { transform: rotate(-8deg); } 100% { transform: rotate(26deg); } }
  @keyframes tabs-jukebox-arm-b { 0% { transform: rotate(26deg); } 25%, 70% { transform: rotate(-8deg); } 100% { transform: rotate(26deg); } }
  @keyframes tabs-jukebox-eq { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }
  .tabs-jukebox { display: grid; grid-template-columns: 116px 1fr; gap: 12px 14px; width: 270px; }
  .tabs-jukebox__deck { position: relative; width: 116px; height: 116px; overflow: hidden; border-radius: 14px; background: linear-gradient(light-dark(#ebedf0, #232529), light-dark(#f3f4f7, #1a1c1f)); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 12px 22px -12px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7)); }
  .tabs-jukebox__record { position: absolute; left: 9px; top: 11px; width: 94px; height: 94px; }
  .tabs-jukebox[data-armed] .tabs-jukebox__record[data-on] { animation: tabs-jukebox-in 0.55s cubic-bezier(0.3, 1.1, 0.5, 1) 0.2s backwards; }
  .tabs-jukebox__record[data-prev] { animation: tabs-jukebox-out 0.35s ease-in forwards; }
  .tabs-jukebox__disc {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background:
      radial-gradient(circle, light-dark(#fbfcfd, #121417) 0 2px, var(--tabs-jukebox-c) 2.5px 16px, light-dark(#fbfcfd, #121417) 16.5px 18px, transparent 18.5px),
      repeating-radial-gradient(circle, light-dark(#fbfcfd, #121417) 0 1.5px, light-dark(#ebedf0, #232529) 1.5px 3px);
    box-shadow: 0 4px 10px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5));
    animation: tabs-jukebox-spin 1.8s linear infinite;
  }
  .tabs-jukebox__disc::after { content: ''; position: absolute; left: 50%; top: 32px; width: 2px; height: 8px; margin-left: -1px; border-radius: 1px; background: light-dark(#fbfcfd, #121417); }
  .tabs-jukebox__arm { position: absolute; right: 12px; top: 6px; width: 4px; height: 70px; border-radius: 2px; background: light-dark(#50535b, #c6c8cd); transform: rotate(26deg); transform-origin: 50% 4px; }
  .tabs-jukebox__arm::before { content: ''; position: absolute; left: -4px; top: -2px; width: 12px; height: 12px; border-radius: 50%; background: light-dark(#6d7179, #7d8087); }
  .tabs-jukebox__arm::after { content: ''; position: absolute; left: -2px; bottom: -4px; width: 8px; height: 12px; border-radius: 2px; background: light-dark(#42454c, #e5e6e9); }
  .tabs-jukebox[data-flip='a'] .tabs-jukebox__arm { animation: tabs-jukebox-arm-a 1s ease-in-out; }
  .tabs-jukebox[data-flip='b'] .tabs-jukebox__arm { animation: tabs-jukebox-arm-b 1s ease-in-out; }
  .tabs-jukebox__list { display: grid; align-content: center; gap: 6px; }
  .tabs-jukebox__tab { display: flex; align-items: center; gap: 8px; height: 30px; padding: 0 8px; border: 0; border-radius: 8px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#ebedf0, #232529), 0 2px 0 light-dark(#fbfcfd, #121417); color: light-dark(#50535b, #c6c8cd); font: inherit; font-size: 12px; font-weight: 600; text-align: left; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s, color 0.2s; }
  .tabs-jukebox__tab:hover { color: light-dark(#373a40, #f1f2f3); }
  .tabs-jukebox__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); transform: translateY(2px); box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087), 0 0 0 light-dark(#fbfcfd, #121417); }
  .tabs-jukebox__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .tabs-jukebox__code { padding: 1px 4px; border-radius: 3px; background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9.5px; }
  .tabs-jukebox__tab[aria-selected='true'] .tabs-jukebox__code { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .tabs-jukebox__panel { grid-column: 1 / -1; display: flex; align-items: center; gap: 10px; }
  .tabs-jukebox__eq { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
  .tabs-jukebox__eq span { width: 3px; height: 100%; border-radius: 1px; background: light-dark(#50535b, #c6c8cd); transform-origin: 50% 100%; animation: tabs-jukebox-eq 0.4s ease-in-out infinite alternate; }
  .tabs-jukebox__song { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .tabs-jukebox__artist { color: light-dark(#5f626a, #a7abb2); font-size: 12px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-jukebox * { animation: none !important; }
    .tabs-jukebox__record[data-prev] { display: none; }
  }
`;

export function JukeboxTabs() {
  const id = useId();
  const [state, setState] = useState({ sel: 0, prev: -1, flip: 0 });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { sel, prev, flip } = state;
  const select = (i: number) => {
    if (i !== sel) setState((s) => ({ sel: i, prev: s.sel, flip: s.flip + 1 }));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = SONGS.length;
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
      <div className="tabs-jukebox" data-armed={flip ? '' : undefined} data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined}>
        <span className="tabs-jukebox__deck" aria-hidden="true">
          {SONGS.map((s, i) =>
            i === sel || i === prev ? (
              <span
                key={s.code}
                className="tabs-jukebox__record"
                data-on={i === sel ? '' : undefined}
                data-prev={i === prev ? '' : undefined}
                style={{ '--tabs-jukebox-c': s.c } as React.CSSProperties}
              >
                <span className="tabs-jukebox__disc" />
              </span>
            ) : null,
          )}
          <span className="tabs-jukebox__arm" />
        </span>
        <div className="tabs-jukebox__list" role="tablist" aria-label="Songs" aria-orientation="vertical" onKeyDown={onKeyDown}>
          {SONGS.map((s, i) => (
            <button
              key={s.code}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-jukebox__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => select(i)}
            >
              <span className="tabs-jukebox__code">{s.code}</span>
              {s.label}
            </button>
          ))}
        </div>
        {SONGS.map((s, i) => (
          <div key={s.code} className="tabs-jukebox__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            <span className="tabs-jukebox__eq" aria-hidden="true">
              <span />
              <span style={{ animationDelay: '-0.15s' }} />
              <span style={{ animationDelay: '-0.3s' }} />
            </span>
            <span>
              <span className="tabs-jukebox__song">{s.label}</span> <span className="tabs-jukebox__artist">by {s.artist}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
