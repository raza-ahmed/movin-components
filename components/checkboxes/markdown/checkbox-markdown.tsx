"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-markdown-caret { 0%, 22% { opacity: 1; } 23%, 44% { opacity: 0; } 45%, 66% { opacity: 1; } 67%, 88% { opacity: 0; } 89%, 99% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes cb-markdown-caret-b { 0%, 22% { opacity: 1; } 23%, 44% { opacity: 0; } 45%, 66% { opacity: 1; } 67%, 88% { opacity: 0; } 89%, 99% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes cb-markdown-type { 0%, 30% { opacity: 0; transform: translateY(-3px) scale(1.4); } 40% { opacity: 1; transform: none; } 100% { opacity: 1; transform: none; } }
  @keyframes cb-markdown-delete { 0%, 30% { opacity: 1; } 31%, 100% { opacity: 0; } }
  .cb-markdown {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.6ch;
    padding: 8px 12px;
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#42454c, #e5e6e9);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
  }
  .cb-markdown__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-markdown__dash { color: light-dark(#5f626a, #a7abb2); }
  .cb-markdown__box { position: relative; display: inline-flex; color: light-dark(#5f626a, #a7abb2); border-radius: 3px; }
  .cb-markdown__input:focus-visible + .cb-markdown__dash + .cb-markdown__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .cb-markdown__slot { position: relative; display: inline-block; width: 1ch; text-align: center; }
  .cb-markdown__x { display: inline-block; color: light-dark(#373a40, #f1f2f3); font-weight: 600; opacity: 0; }
  .cb-markdown__caret {
    position: absolute;
    left: 100%;
    top: 2px;
    bottom: 2px;
    width: 1.5px;
    margin-left: -0.5px;
    background: light-dark(#373a40, #f1f2f3);
    opacity: 0;
  }
  .cb-markdown__text { transition: color 0.3s; }
  .cb-markdown__input:checked ~ .cb-markdown__box .cb-markdown__x { opacity: 1; }
  .cb-markdown__input:checked ~ .cb-markdown__text { color: light-dark(#5f626a, #a7abb2); }
  .cb-markdown[data-armed] .cb-markdown__input:checked ~ .cb-markdown__box .cb-markdown__x { animation: cb-markdown-type 0.9s ease-out; }
  .cb-markdown[data-armed] .cb-markdown__input:not(:checked) ~ .cb-markdown__box .cb-markdown__x { animation: cb-markdown-delete 0.9s linear; }
  /* The same blink both ways, under two names so the browser restarts it on every change. */
  .cb-markdown[data-armed] .cb-markdown__input:checked ~ .cb-markdown__box .cb-markdown__caret { animation: cb-markdown-caret 0.9s linear; }
  .cb-markdown[data-armed] .cb-markdown__input:not(:checked) ~ .cb-markdown__box .cb-markdown__caret { animation: cb-markdown-caret-b 0.9s linear; }
  @media (prefers-reduced-motion: reduce) {
    .cb-markdown * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

export function MarkdownCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-markdown" data-armed={armed || undefined}>
        <input className="cb-markdown__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-markdown__dash" aria-hidden="true">
          -
        </span>
        <span className="cb-markdown__box" aria-hidden="true">
          [
          <span className="cb-markdown__slot">
            <span className="cb-markdown__x">x</span>
            <span className="cb-markdown__caret" />
          </span>
          ]
        </span>
        <span className="cb-markdown__text">Ship the release</span>
      </label>
    </>
  );
}
