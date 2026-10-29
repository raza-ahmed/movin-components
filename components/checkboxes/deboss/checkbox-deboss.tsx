"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-deboss-die {
    0% { opacity: 0; transform: translateY(-16px) scale(1.15); }
    35% { opacity: 1; transform: translateY(0) scale(1); }
    50% { transform: scale(0.94); }
    68% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: translateY(-16px) scale(1.12); }
  }
  @keyframes cb-deboss-give { 0%, 35% { transform: none; } 50% { transform: scale(0.94); } 70%, 100% { transform: none; } }
  @keyframes cb-deboss-mark { 0%, 47% { opacity: 0; } 50%, 100% { opacity: 1; } }
  .cb-deboss { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-deboss__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-deboss__box {
    position: relative;
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: light-dark(#50535b, #c6c8cd);
    box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2), 0 1px 2px color-mix(in oklab, light-dark(#fbfcfd, #121417) 50%, transparent);
  }
  .cb-deboss__input:focus-visible + .cb-deboss__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-deboss__mark { position: absolute; inset: 0; width: 30px; height: 30px; opacity: 0; transition: opacity 0.4s ease; }
  .cb-deboss__mark path { fill: none; stroke-width: 3.4; stroke-linecap: round; stroke-linejoin: round; }
  .cb-deboss__shade { stroke: light-dark(#cbced3, #393c41); transform: translate(-1.1px, -1.1px); }
  .cb-deboss__light { stroke: light-dark(#373a40, #f1f2f3); transform: translate(1.1px, 1.1px); }
  .cb-deboss__face { stroke: light-dark(#5f626a, #a7abb2); stroke-width: 2.6; }
  .cb-deboss__input:checked + .cb-deboss__box .cb-deboss__mark { opacity: 1; transition: none; }
  .cb-deboss__die {
    position: absolute;
    inset: -4px;
    border-radius: 9px;
    background: linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#dbdde1, #2e3035));
    box-shadow: 0 6px 10px -4px color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent);
    opacity: 0;
    pointer-events: none;
  }
  .cb-deboss__die::after { content: ''; position: absolute; inset: 5px; border-radius: 5px; box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087); }
  .cb-deboss[data-armed] .cb-deboss__input:checked + .cb-deboss__box { animation: cb-deboss-give 0.6s ease-out; }
  .cb-deboss[data-armed] .cb-deboss__input:checked + .cb-deboss__box .cb-deboss__die { animation: cb-deboss-die 0.6s ease-in-out; }
  .cb-deboss[data-armed] .cb-deboss__input:checked + .cb-deboss__box .cb-deboss__mark { animation: cb-deboss-mark 0.6s linear; }
  @media (prefers-reduced-motion: reduce) {
    .cb-deboss__box, .cb-deboss__box * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

const TICK = 'M8.5 15.5L13 20L21.5 10';

export function DebossCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-deboss" data-armed={armed || undefined}>
        <input className="cb-deboss__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-deboss__box" aria-hidden="true">
          <svg className="cb-deboss__mark" viewBox="0 0 30 30">
            <path className="cb-deboss__shade" d={TICK} />
            <path className="cb-deboss__light" d={TICK} />
            <path className="cb-deboss__face" d={TICK} />
          </svg>
          <span className="cb-deboss__die" />
        </span>
        Signed and sealed
      </label>
    </>
  );
}
