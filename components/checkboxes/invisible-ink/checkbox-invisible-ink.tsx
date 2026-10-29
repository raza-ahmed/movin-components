"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-invisible-ink-reveal {
    0% { clip-path: circle(7px at -6px 18px); }
    55% { clip-path: circle(7px at 34px 9px); }
    72% { clip-path: circle(7px at 15px 15px); }
    100% { clip-path: circle(24px at 15px 15px); }
  }
  @keyframes cb-invisible-ink-lamp {
    0% { opacity: 0; transform: translate(-6px, 18px); }
    10% { opacity: 1; }
    55% { transform: translate(34px, 9px); }
    72% { opacity: 1; transform: translate(15px, 15px) scale(1); }
    100% { opacity: 0; transform: translate(15px, 15px) scale(2.6); }
  }
  .cb-invisible-ink { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-invisible-ink__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-invisible-ink__box {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41);
  }
  .cb-invisible-ink__input:focus-visible + .cb-invisible-ink__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-invisible-ink__ink {
    position: absolute;
    inset: 0;
    width: 30px;
    height: 30px;
    clip-path: circle(0px at 15px 15px);
    transition: clip-path 0.35s ease-in;
  }
  .cb-invisible-ink__ink path {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 2px light-dark(#373a40, #f1f2f3)) drop-shadow(0 0 5px light-dark(#50535b, #c6c8cd));
  }
  .cb-invisible-ink__lamp {
    position: absolute;
    left: -9px;
    top: -9px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(closest-side, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent), transparent);
    box-shadow: 0 0 0 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 25%, transparent);
    opacity: 0;
    pointer-events: none;
  }
  .cb-invisible-ink__input:checked + .cb-invisible-ink__box .cb-invisible-ink__ink { clip-path: circle(24px at 15px 15px); transition: none; }
  .cb-invisible-ink[data-armed] .cb-invisible-ink__input:checked + .cb-invisible-ink__box .cb-invisible-ink__ink { animation: cb-invisible-ink-reveal 1s ease-in-out; }
  .cb-invisible-ink[data-armed] .cb-invisible-ink__input:checked + .cb-invisible-ink__box .cb-invisible-ink__lamp { animation: cb-invisible-ink-lamp 1s ease-in-out; }
  @media (prefers-reduced-motion: reduce) {
    .cb-invisible-ink__box * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

export function InvisibleInkCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-invisible-ink" data-armed={armed || undefined}>
        <input className="cb-invisible-ink__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-invisible-ink__box" aria-hidden="true">
          <svg className="cb-invisible-ink__ink" viewBox="0 0 30 30">
            <path d="M8 15.5L12.8 20L22 9.5" />
          </svg>
          <span className="cb-invisible-ink__lamp" />
        </span>
        Show hidden files
      </label>
    </>
  );
}
