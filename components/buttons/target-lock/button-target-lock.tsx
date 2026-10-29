"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  @keyframes btn-target-lock-drift {
    0%, 100% { translate: 0 0; }
    25% { translate: 3px -2px; }
    50% { translate: -2px 3px; }
    75% { translate: -3px -1px; }
  }
  @keyframes btn-target-lock-caret { 50% { opacity: 0; } }
  .btn-target-lock {
    position: relative;
    display: inline-grid;
    place-items: center;
    padding: 34px 26px 22px;
  }
  .btn-target-lock__btn {
    position: relative;
    padding: 0.75rem 1.8rem;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 4px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#42454c, #e5e6e9);
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.3s ease, border-color 0.3s ease;
  }
  .btn-target-lock__btn:focus-visible { outline: none; }
  .btn-target-lock__frame {
    position: absolute;
    left: 26px;
    right: 26px;
    top: 34px;
    bottom: 22px;
    pointer-events: none;
    transform: scale(1.45) rotate(8deg);
    opacity: 0.35;
    transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
    animation: btn-target-lock-drift 3.2s ease-in-out infinite;
  }
  .btn-target-lock__corner {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 0 solid light-dark(#373a40, #f1f2f3);
  }
  .btn-target-lock__corner:nth-child(1) { top: -7px; left: -7px; border-top-width: 2px; border-left-width: 2px; }
  .btn-target-lock__corner:nth-child(2) { top: -7px; right: -7px; border-top-width: 2px; border-right-width: 2px; }
  .btn-target-lock__corner:nth-child(3) { bottom: -7px; left: -7px; border-bottom-width: 2px; border-left-width: 2px; }
  .btn-target-lock__corner:nth-child(4) { bottom: -7px; right: -7px; border-bottom-width: 2px; border-right-width: 2px; }
  .btn-target-lock__tick {
    position: absolute;
    background: light-dark(#50535b, #c6c8cd);
    opacity: 0;
    transition: opacity 0.2s ease 0.35s;
  }
  .btn-target-lock__tick--t { top: -12px; left: calc(50% - 0.5px); width: 1px; height: 7px; }
  .btn-target-lock__tick--b { bottom: -12px; left: calc(50% - 0.5px); width: 1px; height: 7px; }
  .btn-target-lock__tick--l { left: -14px; top: calc(50% - 0.5px); width: 7px; height: 1px; }
  .btn-target-lock__tick--r { right: -14px; top: calc(50% - 0.5px); width: 7px; height: 1px; }
  .btn-target-lock__readout {
    position: absolute;
    top: 8px;
    left: 18px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    color: light-dark(#5f626a, #a7abb2);
    white-space: pre;
    pointer-events: none;
  }
  .btn-target-lock__readout i { font-style: normal; animation: btn-target-lock-caret 0.8s steps(1) infinite; }
  .btn-target-lock[data-locked] .btn-target-lock__frame {
    transform: none;
    opacity: 1;
    animation: none;
  }
  .btn-target-lock[data-locked] .btn-target-lock__tick { opacity: 1; }
  .btn-target-lock[data-locked] .btn-target-lock__btn { color: light-dark(#373a40, #f1f2f3); border-color: light-dark(#6d7179, #7d8087); }
  .btn-target-lock[data-locked] .btn-target-lock__readout { color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .btn-target-lock__frame { animation: none; transition: opacity 0.2s ease; }
  }
`;

const LOCKED = 'TGT 07 · LOCKED';
const IDLE = 'TGT 07 · ACQUIRING';

export function TargetLockButton() {
  const [locked, setLocked] = useState(false);
  const [text, setText] = useState(IDLE);
  const timer = useRef(0);

  // Retype the readout whenever the lock state flips.
  useEffect(() => {
    const target = locked ? LOCKED : IDLE;
    let n = 'TGT 07 · '.length;
    setText(target.slice(0, n));
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      n += 1;
      setText(target.slice(0, n));
      if (n >= target.length) window.clearInterval(timer.current);
    }, 38);
    return () => window.clearInterval(timer.current);
  }, [locked]);

  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="btn-target-lock"
        data-locked={locked ? '' : undefined}
        onPointerEnter={() => setLocked(true)}
        onPointerLeave={() => setLocked(false)}
      >
        <span className="btn-target-lock__readout" aria-hidden="true">
          {text}
          <i>_</i>
        </span>
        <button
          type="button"
          className="btn-target-lock__btn"
          onFocus={() => setLocked(true)}
          onBlur={() => setLocked(false)}
        >
          Engage
        </button>
        <span className="btn-target-lock__frame" aria-hidden="true">
          <span className="btn-target-lock__corner" />
          <span className="btn-target-lock__corner" />
          <span className="btn-target-lock__corner" />
          <span className="btn-target-lock__corner" />
          <span className="btn-target-lock__tick btn-target-lock__tick--t" />
          <span className="btn-target-lock__tick btn-target-lock__tick--b" />
          <span className="btn-target-lock__tick btn-target-lock__tick--l" />
          <span className="btn-target-lock__tick btn-target-lock__tick--r" />
        </span>
      </div>
    </>
  );
}
