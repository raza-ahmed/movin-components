"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-gift-pop {
    0% { transform: none; animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
    35% { transform: translate(-3px, -18px) rotate(-30deg); animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.5); }
    75% { transform: translate(-13px, -7px) rotate(-26deg); }
    88% { transform: translate(-13px, -9px) rotate(-29deg); }
    100% { transform: translate(-13px, -8px) rotate(-28deg); }
  }
  .cb-gift { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-gift__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-gift__box { position: relative; width: 34px; height: 36px; border-radius: 4px; }
  .cb-gift__input:focus-visible + .cb-gift__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-gift__surprise {
    position: absolute;
    left: 8px;
    top: 14px;
    width: 18px;
    height: 15px;
    opacity: 0;
    transform: translateY(8px) scale(0.5);
    transition: transform 0.2s ease-in, opacity 0.15s ease 0.05s;
  }
  .cb-gift__surprise path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }
  .cb-gift__body {
    position: absolute;
    left: 3px;
    bottom: 0;
    width: 28px;
    height: 20px;
    border-radius: 2px 2px 4px 4px;
    background: linear-gradient(90deg, transparent 12px, light-dark(#50535b, #c6c8cd) 12px 16px, transparent 16px), light-dark(#cbced3, #393c41);
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087);
  }
  .cb-gift__lid {
    position: absolute;
    left: 1px;
    top: 9px;
    width: 32px;
    height: 8px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent 14px, light-dark(#42454c, #e5e6e9) 14px 18px, transparent 18px), light-dark(#6d7179, #7d8087);
    box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2);
    transform-origin: 0 100%;
    transition: transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1) 0.1s;
  }
  .cb-gift__bow { position: absolute; top: -6px; width: 9px; height: 7px; border-radius: 50% 50% 20% 50%; border: 2px solid light-dark(#42454c, #e5e6e9); }
  .cb-gift__bow--l { left: 8px; transform: rotate(-20deg); }
  .cb-gift__bow--r { right: 8px; transform: scaleX(-1) rotate(-20deg); }
  .cb-gift__input:checked + .cb-gift__box .cb-gift__lid { transform: translate(-13px, -8px) rotate(-28deg); transition: none; }
  .cb-gift__input:checked + .cb-gift__box .cb-gift__surprise { opacity: 1; transform: translateY(-12px); transition: transform 0.5s cubic-bezier(0.3, 1.8, 0.5, 1) 0.12s, opacity 0.1s ease 0.12s; }
  .cb-gift[data-armed] .cb-gift__input:checked + .cb-gift__box .cb-gift__lid { animation: cb-gift-pop 0.55s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-gift__box * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function GiftCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-gift" data-armed={armed || undefined}>
        <input className="cb-gift__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-gift__box" aria-hidden="true">
          <svg className="cb-gift__surprise" viewBox="0 0 18 15">
            <path d="M3 8L7 12L15 3" />
          </svg>
          <span className="cb-gift__body" />
          <span className="cb-gift__lid">
            <span className="cb-gift__bow cb-gift__bow--l" />
            <span className="cb-gift__bow cb-gift__bow--r" />
          </span>
        </span>
        Surprise me
      </label>
    </>
  );
}
