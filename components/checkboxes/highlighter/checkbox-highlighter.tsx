"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-highlighter-nib {
    0% { left: -6px; opacity: 0; }
    12% { opacity: 1; }
    88% { opacity: 1; }
    100% { left: calc(100% + 2px); opacity: 0; }
  }
  .cb-highlighter { position: relative; display: inline-flex; align-items: center; gap: 10px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-highlighter__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-highlighter__box {
    position: relative;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    box-shadow: inset 0 0 0 1.5px light-dark(#6d7179, #7d8087);
    transition: background-color 0.25s, box-shadow 0.25s;
  }
  .cb-highlighter__input:focus-visible + .cb-highlighter__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-highlighter__box svg { position: absolute; inset: 0; width: 22px; height: 22px; }
  .cb-highlighter__box path {
    fill: none;
    stroke: light-dark(#373a40, #f1f2f3);
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 0.18s ease;
  }
  .cb-highlighter__input:checked + .cb-highlighter__box {
    background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 24%, transparent);
    box-shadow: inset 0 0 0 1.5px light-dark(#50535b, #c6c8cd);
  }
  .cb-highlighter__input:checked + .cb-highlighter__box path { stroke-dashoffset: 0; transition: stroke-dashoffset 0.25s ease 0.05s; }
  .cb-highlighter__text { position: relative; isolation: isolate; padding: 2px 4px; transition: color 0.3s; }
  .cb-highlighter__text::before {
    content: '';
    position: absolute;
    z-index: -1;
    left: -2px;
    right: -4px;
    top: 3px;
    bottom: 1px;
    border-radius: 2px 8px 3px 6px;
    background: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 24%, transparent);
    transform: scaleX(0) skewX(-12deg);
    transform-origin: 100% 50%;
    transition: transform 0.3s cubic-bezier(0.6, 0, 0.4, 1);
  }
  .cb-highlighter__input:checked ~ .cb-highlighter__text { color: light-dark(#373a40, #f1f2f3); }
  .cb-highlighter__input:checked ~ .cb-highlighter__text::before {
    transform: scaleX(1) skewX(-12deg);
    transform-origin: 0 50%;
    transition: transform 0.45s cubic-bezier(0.65, 0, 0.35, 1) 0.12s;
  }
  .cb-highlighter__nib {
    position: absolute;
    top: -3px;
    left: -6px;
    width: 9px;
    height: 26px;
    opacity: 0;
    pointer-events: none;
  }
  .cb-highlighter__nib::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 3px;
    width: 9px;
    height: 7px;
    border-radius: 1px 4px 0 0;
    background: light-dark(#42454c, #e5e6e9);
    transform: skewX(-20deg);
  }
  .cb-highlighter__nib::after {
    content: '';
    position: absolute;
    left: 1px;
    top: -14px;
    width: 9px;
    height: 20px;
    border-radius: 3px;
    background: linear-gradient(90deg, light-dark(#6d7179, #7d8087), light-dark(#5f626a, #a7abb2));
  }
  .cb-highlighter[data-armed] .cb-highlighter__input:checked ~ .cb-highlighter__text .cb-highlighter__nib { animation: cb-highlighter-nib 0.45s cubic-bezier(0.65, 0, 0.35, 1) 0.12s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-highlighter *, .cb-highlighter *::before { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function HighlighterCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-highlighter" data-armed={armed || undefined}>
        <input className="cb-highlighter__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-highlighter__box" aria-hidden="true">
          <svg viewBox="0 0 22 22">
            <path pathLength={1} d="M6 11.5L9.5 15L16 7.5" />
          </svg>
        </span>
        <span className="cb-highlighter__text">
          Read the brief
          <span className="cb-highlighter__nib" aria-hidden="true" />
        </span>
      </label>
    </>
  );
}
