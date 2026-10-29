"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-wax-drop { 0% { transform: translateY(-14px) scale(1.5); opacity: 0; } 55% { transform: scale(0.9, 0.82); opacity: 1; } 75% { transform: scale(1.06); } 100% { transform: none; opacity: 1; } }
  .cb-wax { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-wax__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-wax__env { position: relative; width: 46px; height: 32px; perspective: 160px; }
  .cb-wax__input:focus-visible + .cb-wax__env { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 4px; }
  .cb-wax__back { position: absolute; inset: 0; border-radius: 3px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41), 0 6px 12px -8px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6)); }
  .cb-wax__back::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top right, transparent calc(50% - 0.6px), light-dark(#cbced3, #393c41) 50%, transparent calc(50% + 0.6px)) left / 50% 100% no-repeat, linear-gradient(to top left, transparent calc(50% - 0.6px), light-dark(#cbced3, #393c41) 50%, transparent calc(50% + 0.6px)) right / 50% 100% no-repeat; }
  /* The flap, hinged on the top edge: open it stands up behind; checked it folds down over the front. */
  .cb-wax__flap {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 19px;
    background: light-dark(#dbdde1, #2e3035);
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    transform-origin: 50% 0;
    transform: rotateX(180deg);
    transition: transform 0.45s cubic-bezier(0.5, 0, 0.3, 1.2), background-color 0.45s;
  }
  .cb-wax__seal {
    position: absolute;
    left: 50%;
    top: 12px;
    display: grid;
    place-items: center;
    width: 15px;
    height: 15px;
    margin-left: -7.5px;
    border-radius: 46% 54% 50% 50% / 52% 48% 52% 48%;
    background: radial-gradient(circle at 40% 35%, light-dark(#42454c, #e5e6e9), light-dark(#5f626a, #a7abb2));
    box-shadow: 0 0 0 1.5px light-dark(#50535b, #c6c8cd), 0 2px 3px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45));
    color: light-dark(#dbdde1, #2e3035);
    font-size: 8px;
    font-weight: 600;
    opacity: 0;
  }
  .cb-wax__input:checked + .cb-wax__env .cb-wax__flap { transform: none; background: light-dark(#cbced3, #393c41); }
  .cb-wax__input:checked + .cb-wax__env .cb-wax__seal { opacity: 1; }
  .cb-wax[data-armed] .cb-wax__input:checked + .cb-wax__env .cb-wax__seal { animation: cb-wax-drop 0.4s cubic-bezier(0.5, 0, 0.5, 1) 0.4s both; }
  .cb-wax[data-armed] .cb-wax__input:not(:checked) + .cb-wax__env .cb-wax__flap { transition-delay: 0.1s; }
  @media (prefers-reduced-motion: reduce) {
    .cb-wax * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

export function WaxCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-wax" data-armed={armed || undefined}>
        <input className="cb-wax__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-wax__env" aria-hidden="true">
          <span className="cb-wax__back" />
          <span className="cb-wax__flap" />
          <span className="cb-wax__seal">M</span>
        </span>
        Seal and send
      </label>
    </>
  );
}
