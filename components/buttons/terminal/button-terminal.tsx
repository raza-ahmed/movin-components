"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes btn-terminal-caret { 50% { opacity: 0; } }
  .btn-terminal {
    display: inline-flex;
    flex-direction: column;
    width: 25ch;
    padding: 0;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 10px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#42454c, #e5e6e9);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .btn-terminal:hover { border-color: light-dark(#6d7179, #7d8087); box-shadow: 0 0 22px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent); }
  .btn-terminal:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-terminal__bar {
    display: flex;
    gap: 5px;
    padding: 7px 10px;
    border-bottom: 1px solid light-dark(#ebedf0, #232529);
    background: light-dark(#f3f4f7, #1a1c1f);
  }
  .btn-terminal__bar i { width: 7px; height: 7px; border-radius: 50%; background: light-dark(#dbdde1, #2e3035); }
  .btn-terminal__body {
    display: grid;
    gap: 2px;
    padding: 10px 12px 12px;
    min-height: 3.9em;
    white-space: pre;
  }
  .btn-terminal__prompt { color: light-dark(#6d7179, #7d8087); }
  .btn-terminal__cmd { color: light-dark(#373a40, #f1f2f3); }
  .btn-terminal__out { color: light-dark(#5f626a, #a7abb2); }
  .btn-terminal__out--ok { color: light-dark(#373a40, #f1f2f3); }
  .btn-terminal__caret {
    display: inline-block;
    width: 0.6em;
    height: 1.05em;
    margin-left: 1px;
    vertical-align: -0.15em;
    background: light-dark(#373a40, #f1f2f3);
    animation: btn-terminal-caret 1s steps(1) infinite;
  }
  @media (prefers-reduced-motion: reduce) { .btn-terminal__caret { animation: none; } }
`;

const CMD = 'deploy --prod';
const BAR = 12;

export function TerminalButton() {
  const [typed, setTyped] = useState(0);
  const [progress, setProgress] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const run = () => {
    if (busy.current) return;
    busy.current = true;
    setTyped(0);
    setProgress(null);
    setDone(false);
    let t = 0;
    for (let i = 1; i <= CMD.length; i++) at((t += 45), () => setTyped(i));
    t += 200;
    for (let i = 0; i <= BAR; i++) at((t += 90 + (i % 4 === 0 ? 120 : 0)), () => setProgress(i));
    at((t += 250), () => setDone(true));
    at((t += 2200), () => {
      setProgress(null);
      setDone(false);
      setTyped(0);
      busy.current = false;
    });
  };

  const bar =
    progress === null ? null : `[${'#'.repeat(progress)}${'.'.repeat(BAR - progress)}] ${String(Math.round((progress / BAR) * 100)).padStart(3)}%`;

  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-terminal" onClick={run} aria-label="Deploy to production">
        <span className="btn-terminal__bar" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="btn-terminal__body" aria-hidden="true">
          <span>
            <span className="btn-terminal__prompt">~ $ </span>
            <span className="btn-terminal__cmd">{busy.current || typed ? CMD.slice(0, typed) : 'deploy'}</span>
            {progress === null && !done && <span className="btn-terminal__caret" />}
          </span>
          {bar && <span className="btn-terminal__out">{bar}</span>}
          {done && <span className="btn-terminal__out btn-terminal__out--ok">✓ live in 1.2s</span>}
        </span>
        <span className="sr-only" aria-live="polite">
          {done ? 'Deployed' : ''}
        </span>
      </button>
    </>
  );
}
