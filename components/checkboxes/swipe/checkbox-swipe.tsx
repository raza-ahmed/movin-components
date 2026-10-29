"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-swipe-done {
    0% { transform: translateX(0); animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1); }
    38% { transform: translateX(54px); }
    55% { transform: translateX(54px); animation-timing-function: cubic-bezier(0.5, 0, 0.3, 1.4); }
    100% { transform: translateX(0); }
  }
  @keyframes cb-swipe-undo { 0% { transform: translateX(0); } 30% { transform: translateX(-8px); } 100% { transform: translateX(0); } }
  @keyframes cb-swipe-pop { 0%, 15% { transform: scale(0.4); opacity: 0; } 40% { transform: scale(1.15); opacity: 1; } 55%, 100% { transform: scale(1); opacity: 1; } }
  .cb-swipe { position: relative; display: inline-flex; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-swipe__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-swipe__row { position: relative; display: block; width: 190px; height: 42px; overflow: hidden; border-radius: 11px; background: light-dark(#dbdde1, #2e3035); }
  .cb-swipe__input:focus-visible + .cb-swipe__row { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-swipe__under { position: absolute; left: 16px; top: 11px; width: 20px; height: 20px; opacity: 0; }
  .cb-swipe__under path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
  .cb-swipe__card {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    border-radius: 11px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 2px 6px -2px color-mix(in oklab, light-dark(#fbfcfd, #121417) 70%, transparent);
  }
  .cb-swipe__dot {
    position: relative;
    flex: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1.5px light-dark(#6d7179, #7d8087);
    transition: background-color 0.2s, box-shadow 0.2s;
  }
  .cb-swipe__dot svg { position: absolute; inset: 0; width: 18px; height: 18px; }
  .cb-swipe__dot path { fill: none; stroke: light-dark(#f3f4f7, #1a1c1f); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; opacity: 0; transition: opacity 0.2s; }
  .cb-swipe__text {
    background: linear-gradient(currentColor, currentColor) 0 55% / 0% 1.5px no-repeat;
    transition: background-size 0.25s ease, color 0.25s ease;
  }
  .cb-swipe__input:checked + .cb-swipe__row .cb-swipe__dot { background: light-dark(#373a40, #f1f2f3); box-shadow: inset 0 0 0 1.5px light-dark(#373a40, #f1f2f3); transition-delay: 0.5s; }
  .cb-swipe__input:checked + .cb-swipe__row .cb-swipe__dot path { opacity: 1; transition-delay: 0.5s; }
  .cb-swipe__input:checked + .cb-swipe__row .cb-swipe__text { color: light-dark(#5f626a, #a7abb2); background-size: 100% 1.5px; transition: background-size 0.35s ease 0.55s, color 0.3s ease 0.55s; }
  .cb-swipe[data-armed] .cb-swipe__input:checked + .cb-swipe__row .cb-swipe__card { animation: cb-swipe-done 0.8s; }
  .cb-swipe[data-armed] .cb-swipe__input:checked + .cb-swipe__row .cb-swipe__under { animation: cb-swipe-pop 0.8s ease-out; }
  .cb-swipe[data-armed] .cb-swipe__input:not(:checked) + .cb-swipe__row .cb-swipe__card { animation: cb-swipe-undo 0.35s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .cb-swipe__row * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function SwipeCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-swipe" data-armed={armed || undefined}>
        <input className="cb-swipe__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-swipe__row">
          <svg className="cb-swipe__under" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 10.5L8 14.5L16 5.5" />
          </svg>
          <span className="cb-swipe__card">
            <span className="cb-swipe__dot" aria-hidden="true">
              <svg viewBox="0 0 18 18">
                <path d="M5 9.2L7.8 12L13 6.2" />
              </svg>
            </span>
            <span className="cb-swipe__text">Water the plants</span>
          </span>
        </span>
      </label>
    </>
  );
}
