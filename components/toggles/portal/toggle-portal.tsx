"use client";

import { useState } from 'react';

const css = `
  @keyframes toggle-portal-go {
    0% { transform: translateX(0) scale(1); }
    40% { transform: translateX(-15px) scale(0); }
    41% { transform: translateX(51px) scale(0); }
    100% { transform: translateX(36px) scale(1); }
  }
  @keyframes toggle-portal-back {
    0% { transform: translateX(36px) scale(1); }
    40% { transform: translateX(51px) scale(0); }
    41% { transform: translateX(-15px) scale(0); }
    100% { transform: translateX(0) scale(1); }
  }
  @keyframes toggle-portal-flare-a { 0%, 100% { box-shadow: 0 0 0 0 transparent; } 40% { box-shadow: 0 0 10px 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent); } }
  @keyframes toggle-portal-flare-b { 0%, 100% { box-shadow: 0 0 0 0 transparent; } 40% { box-shadow: 0 0 10px 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent); } }
  .toggle-portal { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .toggle-portal__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .toggle-portal__track {
    position: relative;
    width: 84px;
    height: 32px;
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .toggle-portal__input:focus-visible + .toggle-portal__track { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .toggle-portal__gate {
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: 10px;
    border-radius: 50%;
    border: 2px solid light-dark(#6d7179, #7d8087);
    background: radial-gradient(ellipse, light-dark(#fbfcfd, #121417) 40%, light-dark(#ebedf0, #232529));
    transition: border-color 0.3s;
  }
  .toggle-portal__gate--a { left: 4px; }
  .toggle-portal__gate--b { right: 4px; }
  .toggle-portal__ball {
    position: absolute;
    left: 14px;
    top: 6px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, light-dark(#373a40, #f1f2f3), light-dark(#5f626a, #a7abb2));
  }
  .toggle-portal__input:checked + .toggle-portal__track .toggle-portal__ball { transform: translateX(36px); }
  .toggle-portal__input:checked + .toggle-portal__track .toggle-portal__gate--b { border-color: light-dark(#42454c, #e5e6e9); }
  .toggle-portal__input:not(:checked) + .toggle-portal__track .toggle-portal__gate--a { border-color: light-dark(#42454c, #e5e6e9); }
  /* Only after the first press, so nothing plays on page load. */
  .toggle-portal[data-armed] .toggle-portal__input:checked + .toggle-portal__track .toggle-portal__ball { animation: toggle-portal-go 0.7s cubic-bezier(0.5, 0, 0.5, 1); }
  .toggle-portal[data-armed] .toggle-portal__input:not(:checked) + .toggle-portal__track .toggle-portal__ball { animation: toggle-portal-back 0.7s cubic-bezier(0.5, 0, 0.5, 1); }
  .toggle-portal[data-armed] .toggle-portal__input:checked + .toggle-portal__track .toggle-portal__gate { animation: toggle-portal-flare-a 0.7s ease; }
  .toggle-portal[data-armed] .toggle-portal__input:not(:checked) + .toggle-portal__track .toggle-portal__gate { animation: toggle-portal-flare-b 0.7s ease; }
  @media (prefers-reduced-motion: reduce) {
    .toggle-portal[data-armed] .toggle-portal__track * { animation: none !important; }
  }
`;

export function PortalToggle() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="toggle-portal" data-armed={armed || undefined}>
        <input className="toggle-portal__input" type="checkbox" role="switch" onChange={() => setArmed(true)} />
        <span className="toggle-portal__track" aria-hidden="true">
          <span className="toggle-portal__gate toggle-portal__gate--a" />
          <span className="toggle-portal__gate toggle-portal__gate--b" />
          <span className="toggle-portal__ball" />
        </span>
        Teleport
      </label>
    </>
  );
}
