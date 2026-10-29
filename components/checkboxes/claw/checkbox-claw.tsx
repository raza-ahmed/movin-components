"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-claw-dip { 0%, 100% { transform: translateY(0); } 40%, 60% { transform: translateY(17px); } }
  @keyframes cb-claw-drop-l { 0%, 45% { transform: rotate(-12deg); } 55%, 85% { transform: rotate(32deg); } 100% { transform: rotate(-12deg); } }
  @keyframes cb-claw-drop-r { 0%, 45% { transform: rotate(12deg); } 55%, 85% { transform: rotate(-32deg); } 100% { transform: rotate(12deg); } }
  @keyframes cb-claw-grab-l { 0% { transform: rotate(-12deg); } 12%, 45% { transform: rotate(32deg); } 55%, 100% { transform: rotate(-12deg); } }
  @keyframes cb-claw-grab-r { 0% { transform: rotate(12deg); } 12%, 45% { transform: rotate(-32deg); } 55%, 100% { transform: rotate(12deg); } }
  @keyframes cb-claw-off { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  @keyframes cb-claw-on { 0%, 49% { opacity: 0; } 50%, 100% { opacity: 1; } }
  .cb-claw { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-claw__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-claw__box { position: relative; width: 44px; height: 66px; clip-path: inset(0 -12px -12px -12px); }
  .cb-claw__input:focus-visible + .cb-claw__box .cb-claw__bin { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-claw__rail { position: absolute; left: 0; right: 0; top: 0; height: 3px; border-radius: 2px; background: light-dark(#dbdde1, #2e3035); }
  .cb-claw__bin {
    position: absolute;
    left: 7px;
    bottom: 0;
    width: 30px;
    height: 24px;
    border: 1.5px solid light-dark(#6d7179, #7d8087);
    border-top: 0;
    border-radius: 0 0 7px 7px;
    background: light-dark(#f3f4f7, #1a1c1f);
  }
  .cb-claw__rig { position: absolute; left: 22px; top: 0; width: 0; height: 0; }
  .cb-claw__cable { position: absolute; left: -0.75px; top: -50px; width: 1.5px; height: 60px; background: light-dark(#6d7179, #7d8087); }
  .cb-claw__head { position: absolute; left: -6px; top: 9px; width: 12px; height: 6px; border-radius: 2px 2px 3px 3px; background: light-dark(#5f626a, #a7abb2); }
  .cb-claw__prong { position: absolute; top: 13px; width: 2px; height: 11px; border-radius: 1px; background: light-dark(#5f626a, #a7abb2); transform-origin: 50% 0; }
  .cb-claw__prong::after { content: ''; position: absolute; bottom: 0; width: 4px; height: 2px; border-radius: 1px; background: light-dark(#5f626a, #a7abb2); }
  .cb-claw__prong--l { left: -5px; transform: rotate(-12deg); }
  .cb-claw__prong--l::after { left: 0; }
  .cb-claw__prong--r { left: 3px; transform: rotate(12deg); }
  .cb-claw__prong--r::after { right: 0; }
  .cb-claw__tick { position: absolute; width: 16px; height: 13px; }
  .cb-claw__tick path { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
  .cb-claw__tick--held { left: -8px; top: 19px; }
  .cb-claw__tick--dropped { left: 6px; top: 7px; opacity: 0; }
  .cb-claw__input:checked + .cb-claw__box .cb-claw__tick--held { opacity: 0; }
  .cb-claw__input:checked + .cb-claw__box .cb-claw__tick--dropped { opacity: 1; }
  .cb-claw[data-armed] .cb-claw__input:checked + .cb-claw__box .cb-claw__rig { animation: cb-claw-dip 1s ease-in-out; }
  .cb-claw[data-armed] .cb-claw__input:checked + .cb-claw__box .cb-claw__prong--l { animation: cb-claw-drop-l 1s ease-in-out; }
  .cb-claw[data-armed] .cb-claw__input:checked + .cb-claw__box .cb-claw__prong--r { animation: cb-claw-drop-r 1s ease-in-out; }
  .cb-claw[data-armed] .cb-claw__input:checked + .cb-claw__box .cb-claw__tick--held { animation: cb-claw-off 1s linear; }
  .cb-claw[data-armed] .cb-claw__input:checked + .cb-claw__box .cb-claw__tick--dropped { animation: cb-claw-on 1s linear; }
  .cb-claw[data-armed] .cb-claw__input:not(:checked) + .cb-claw__box .cb-claw__rig { animation: cb-claw-dip 1s ease-in-out; }
  .cb-claw[data-armed] .cb-claw__input:not(:checked) + .cb-claw__box .cb-claw__prong--l { animation: cb-claw-grab-l 1s ease-in-out; }
  .cb-claw[data-armed] .cb-claw__input:not(:checked) + .cb-claw__box .cb-claw__prong--r { animation: cb-claw-grab-r 1s ease-in-out; }
  .cb-claw[data-armed] .cb-claw__input:not(:checked) + .cb-claw__box .cb-claw__tick--held { animation: cb-claw-on 1s linear; }
  .cb-claw[data-armed] .cb-claw__input:not(:checked) + .cb-claw__box .cb-claw__tick--dropped { animation: cb-claw-off 1s linear; }
  @media (prefers-reduced-motion: reduce) {
    .cb-claw__box * { animation: none !important; }
  }
`;

function Tick({ className }: { className: string }) {
  return (
    <svg className={`cb-claw__tick ${className}`} viewBox="0 0 16 13">
      <path d="M2.5 7L6.2 10.5L13.5 2.5" />
    </svg>
  );
}

export function ClawCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-claw" data-armed={armed || undefined}>
        <input className="cb-claw__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-claw__box" aria-hidden="true">
          <span className="cb-claw__rail" />
          <span className="cb-claw__bin">
            <Tick className="cb-claw__tick--dropped" />
          </span>
          <span className="cb-claw__rig">
            <span className="cb-claw__cable" />
            <Tick className="cb-claw__tick--held" />
            <span className="cb-claw__prong cb-claw__prong--l" />
            <span className="cb-claw__prong cb-claw__prong--r" />
            <span className="cb-claw__head" />
          </span>
        </span>
        Grab this one
      </label>
    </>
  );
}
