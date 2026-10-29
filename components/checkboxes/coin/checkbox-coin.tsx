"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-coin-clunk { 0%, 55% { transform: none; } 65% { transform: translateY(1.5px); } 80%, 100% { transform: none; } }
  @keyframes cb-coin-spin { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
  .cb-coin { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-coin__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-coin__box { position: relative; width: 34px; height: 58px; border-radius: 6px; }
  .cb-coin__input:focus-visible + .cb-coin__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-coin__plate {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 34px;
    height: 36px;
    border-radius: 6px;
    background: linear-gradient(light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529));
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41);
  }
  .cb-coin__slot { position: absolute; left: 8px; top: 5px; width: 18px; height: 3px; border-radius: 2px; background: light-dark(#fbfcfd, #121417); }
  .cb-coin__screen {
    position: absolute;
    left: 6px;
    top: 13px;
    width: 22px;
    height: 16px;
    border-radius: 3px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    transition: box-shadow 0.3s;
  }
  .cb-coin__screen svg { position: absolute; left: 5px; top: 3px; width: 12px; height: 10px; }
  .cb-coin__screen path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; opacity: 0; filter: drop-shadow(0 0 2px light-dark(#50535b, #c6c8cd)); transition: opacity 0.2s; }
  .cb-coin__input:checked + .cb-coin__box .cb-coin__screen path { opacity: 1; transition-delay: 0.45s; }
  .cb-coin__input:checked + .cb-coin__box .cb-coin__screen { box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087), 0 0 10px -2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 35%, transparent); transition-delay: 0.45s; }
  /* The coin falls inside a window that ends at the slot, so it vanishes into it. */
  .cb-coin__drop { position: absolute; left: 0; right: 0; top: 0; height: 28px; overflow: hidden; perspective: 80px; }
  .cb-coin__coin {
    position: absolute;
    left: 8px;
    top: 3px;
    width: 18px;
    height: 18px;
    transition: transform 0.4s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
  .cb-coin__face {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd) 55%, light-dark(#6d7179, #7d8087));
    box-shadow: inset 0 0 0 1.5px light-dark(#5f626a, #a7abb2);
    color: light-dark(#dbdde1, #2e3035);
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
  }
  .cb-coin__input:checked + .cb-coin__box .cb-coin__coin { transform: translateY(27px); transition: transform 0.38s cubic-bezier(0.55, 0, 0.85, 0.4) 0.12s; }
  .cb-coin[data-armed] .cb-coin__input:checked + .cb-coin__box .cb-coin__face { animation: cb-coin-spin 0.3s linear; }
  .cb-coin[data-armed] .cb-coin__input:checked + .cb-coin__box .cb-coin__plate { animation: cb-coin-clunk 0.7s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .cb-coin__box * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function CoinCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-coin" data-armed={armed || undefined}>
        <input className="cb-coin__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-coin__box" aria-hidden="true">
          <span className="cb-coin__plate">
            <span className="cb-coin__slot" />
            <span className="cb-coin__screen">
              <svg viewBox="0 0 12 10">
                <path d="M1.5 5L4.5 8L10.5 1.8" />
              </svg>
            </span>
          </span>
          <span className="cb-coin__drop">
            <span className="cb-coin__coin">
              <span className="cb-coin__face">1</span>
            </span>
          </span>
        </span>
        Add a tip
      </label>
    </>
  );
}
