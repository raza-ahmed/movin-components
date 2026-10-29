"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-mailbox-letter {
    0% { opacity: 0; transform: translate(-26px, -12px) rotate(-14deg); }
    20% { opacity: 1; }
    65% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
    100% { opacity: 0; transform: translate(9px, 0) scale(0.6); }
  }
  .cb-mailbox { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-mailbox__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-mailbox__box { position: relative; width: 58px; height: 48px; border-radius: 6px; }
  .cb-mailbox__input:focus-visible + .cb-mailbox__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-mailbox__post { position: absolute; left: 20px; bottom: 0; width: 6px; height: 16px; background: light-dark(#cbced3, #393c41); }
  .cb-mailbox__body {
    position: absolute;
    left: 4px;
    top: 10px;
    width: 44px;
    height: 24px;
    border-radius: 12px 12px 3px 3px;
    background: linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#cbced3, #393c41));
    box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2);
  }
  .cb-mailbox__door { position: absolute; left: 4px; top: 4px; bottom: 3px; width: 2px; border-radius: 1px; background: light-dark(#dbdde1, #2e3035); }
  .cb-mailbox__slot { position: absolute; left: 2px; top: 12px; width: 6px; height: 9px; border-radius: 2px; background: light-dark(#ebedf0, #232529); }
  .cb-mailbox__letter {
    position: absolute;
    left: 3px;
    top: 15px;
    width: 14px;
    height: 9px;
    opacity: 0;
    pointer-events: none;
  }
  .cb-mailbox__letter svg { width: 14px; height: 9px; display: block; }
  .cb-mailbox__letter rect { fill: light-dark(#373a40, #f1f2f3); }
  .cb-mailbox__letter path { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; }
  .cb-mailbox[data-armed] .cb-mailbox__input:checked + .cb-mailbox__box .cb-mailbox__letter { animation: cb-mailbox-letter 0.5s ease-in-out; }
  .cb-mailbox__flag {
    position: absolute;
    left: 40px;
    top: 10px;
    width: 3px;
    height: 18px;
    border-radius: 1.5px;
    background: light-dark(#50535b, #c6c8cd);
    transform-origin: 50% 100%;
    transform: rotate(90deg);
    transition: transform 0.35s cubic-bezier(0.5, 0, 0.75, 0);
  }
  .cb-mailbox__flag::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 0;
    width: 10px;
    height: 7px;
    border-radius: 0 2px 2px 0;
    background: light-dark(#6d7179, #7d8087);
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  .cb-mailbox__pin { position: absolute; left: 40px; top: 26px; width: 3px; height: 3px; border-radius: 50%; background: light-dark(#42454c, #e5e6e9); }
  .cb-mailbox__input:checked + .cb-mailbox__box .cb-mailbox__flag { transform: rotate(0deg); transition: transform 0.5s cubic-bezier(0.3, 1.8, 0.5, 1) 0.32s; }
  .cb-mailbox__input:checked + .cb-mailbox__box .cb-mailbox__flag::before {
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 8px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent);
    transition-delay: 0.4s;
  }
  @media (prefers-reduced-motion: reduce) {
    .cb-mailbox__box *, .cb-mailbox__box *::before { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function MailboxCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-mailbox" data-armed={armed || undefined}>
        <input className="cb-mailbox__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-mailbox__box" aria-hidden="true">
          <span className="cb-mailbox__post" />
          <span className="cb-mailbox__body">
            <span className="cb-mailbox__door" />
          </span>
          <span className="cb-mailbox__slot" />
          <span className="cb-mailbox__letter">
            <svg viewBox="0 0 14 9">
              <rect width="14" height="9" rx="1" />
              <path d="M1 1L7 5.5L13 1" />
            </svg>
          </span>
          <span className="cb-mailbox__flag" />
          <span className="cb-mailbox__pin" />
        </span>
        Ready for pickup
      </label>
    </>
  );
}
