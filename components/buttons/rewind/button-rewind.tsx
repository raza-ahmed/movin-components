"use client";

import { useEffect, useRef, useState } from 'react';

const HISTORY = ['Moved logo', 'Renamed frame', 'Deleted layer'];

const css = `
  @keyframes btn-rewind-spin-a { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
  @keyframes btn-rewind-spin-b { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
  @keyframes btn-rewind-ghost { from { opacity: 0.5; } to { opacity: 0; transform: rotate(-120deg); } }
  /* The undone action runs back out of the label: fast, skewed, smeared. */
  @keyframes btn-rewind-out-a { 0% { transform: none; opacity: 1; filter: none; } 100% { transform: translateX(-60px) skewX(18deg); opacity: 0; filter: blur(2px); } }
  @keyframes btn-rewind-out-b { 0% { transform: none; opacity: 1; filter: none; } 100% { transform: translateX(-60px) skewX(18deg); opacity: 0; filter: blur(2px); } }
  .btn-rewind {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    height: 48px;
    padding: 0 18px 0 14px;
    border: none;
    border-radius: 12px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 8px 20px -12px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .btn-rewind:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .btn-rewind:disabled { cursor: default; color: light-dark(#5f626a, #a7abb2); }
  .btn-rewind__icon { position: relative; width: 20px; height: 20px; }
  .btn-rewind__icon svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .btn-rewind__ghost { opacity: 0; }
  .btn-rewind[data-flip='a'] .btn-rewind__arrow { animation: btn-rewind-spin-a 0.6s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .btn-rewind[data-flip='b'] .btn-rewind__arrow { animation: btn-rewind-spin-b 0.6s cubic-bezier(0.2, 0.8, 0.3, 1); }
  .btn-rewind[data-flip] .btn-rewind__ghost { animation: btn-rewind-ghost 0.5s ease-out; }
  .btn-rewind__text { position: relative; display: grid; width: 168px; text-align: left; }
  .btn-rewind__text > span { grid-area: 1 / 1; white-space: nowrap; }
  .btn-rewind__left { color: light-dark(#5f626a, #a7abb2); font-weight: 400; }
  .btn-rewind__gone { color: light-dark(#50535b, #c6c8cd); font-weight: 400; text-decoration: line-through; opacity: 0; pointer-events: none; }
  .btn-rewind[data-flip='a'] .btn-rewind__gone { animation: btn-rewind-out-a 0.55s ease-in; }
  .btn-rewind[data-flip='b'] .btn-rewind__gone { animation: btn-rewind-out-b 0.55s ease-in; }
  @media (prefers-reduced-motion: reduce) {
    .btn-rewind * { animation: none !important; }
  }
`;

export function RewindButton() {
  const [left, setLeft] = useState(HISTORY.length);
  const [flip, setFlip] = useState(0);
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const undo = () => {
    if (left === 0) return;
    setMsg(`Undid ${HISTORY[left - 1]!.toLowerCase()}`);
    setLeft((n) => n - 1);
    setFlip((f) => f + 1);
    clearTimeout(timer.current);
    // Everything undone: after a pause the history comes back, so the demo can run again.
    if (left === 1) timer.current = setTimeout(() => setLeft(HISTORY.length), 2400);
  };
  const gone = left < HISTORY.length ? HISTORY[left] : '';
  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-rewind" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onClick={undo} disabled={left === 0}>
        <span className="btn-rewind__icon" aria-hidden="true">
          <svg className="btn-rewind__ghost" viewBox="0 0 24 24" fill="none">
            <path d="M4 12a8 8 0 1 0 2.3-5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <svg className="btn-rewind__arrow" viewBox="0 0 24 24" fill="none">
            <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4.5h4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="btn-rewind__text">
          <span className="btn-rewind__now">
            {left ? 'Undo' : 'All undone'} <span className="btn-rewind__left">{left ? `· ${HISTORY[left - 1]}` : ''}</span>
          </span>
          <span className="btn-rewind__gone" key={flip} aria-hidden="true">
            {gone}
          </span>
        </span>
        <span className="btn-rewind__sr" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }} aria-live="polite">
          {msg}
        </span>
      </button>
    </>
  );
}
