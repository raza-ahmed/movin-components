"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-punch-top {
    0% { opacity: 0; transform: translateY(-10px); }
    25% { opacity: 1; transform: translateY(-7px); }
    42%, 58% { transform: translateY(3px); }
    85% { opacity: 1; transform: translateY(-8px); }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  @keyframes cb-punch-bottom {
    0% { opacity: 0; transform: translateY(10px); }
    25% { opacity: 1; transform: translateY(7px); }
    42%, 58% { transform: translateY(-3px); }
    85% { opacity: 1; transform: translateY(8px); }
    100% { opacity: 0; transform: translateY(10px); }
  }
  @keyframes cb-punch-hole { 0%, 44% { opacity: 0; } 45%, 100% { opacity: 1; } }
  @keyframes cb-punch-chad {
    0%, 44% { opacity: 0; transform: none; }
    46% { opacity: 1; transform: none; }
    100% { opacity: 0; transform: translate(10px, 46px) rotate(200deg); }
  }
  @keyframes cb-punch-jolt { 0%, 40% { transform: none; } 48% { transform: translateY(1px); } 60%, 100% { transform: none; } }
  .cb-punch { position: relative; display: inline-flex; cursor: pointer; user-select: none; }
  .cb-punch__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-punch__ticket {
    position: relative;
    display: flex;
    width: 200px;
    height: 62px;
    border-radius: 8px;
    background: light-dark(#42454c, #e5e6e9);
    mask:
      radial-gradient(circle 6px at calc(100% - 56px) 0, transparent 97%, #000) top / 100% 51% no-repeat,
      radial-gradient(circle 6px at calc(100% - 56px) 100%, transparent 97%, #000) bottom / 100% 51% no-repeat;
  }
  .cb-punch__main { display: grid; align-content: center; gap: 3px; flex: 1; padding: 0 14px; }
  .cb-punch__route { color: light-dark(#dbdde1, #2e3035); font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }
  .cb-punch__label { color: light-dark(#f3f4f7, #1a1c1f); font-size: 15px; font-weight: 600; }
  .cb-punch__stub {
    position: relative;
    display: grid;
    place-items: center;
    width: 56px;
    border-left: 1.5px dashed light-dark(#6d7179, #7d8087);
  }
  .cb-punch__spot {
    position: relative;
    width: 24px;
    height: 24px;
    border-radius: 5px;
    border: 1.5px dashed light-dark(#5f626a, #a7abb2);
  }
  .cb-punch__input:focus-visible + .cb-punch__ticket .cb-punch__spot { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-punch__spot svg { position: absolute; left: -1.5px; top: -1.5px; width: 24px; height: 24px; overflow: visible; }
  .cb-punch__hole { fill: light-dark(#fbfcfd, #121417); stroke: light-dark(#6d7179, #7d8087); stroke-width: 0.8; opacity: 0; transition: opacity 0.2s; }
  .cb-punch__input:checked + .cb-punch__ticket .cb-punch__hole { opacity: 1; }
  .cb-punch__chad { fill: light-dark(#42454c, #e5e6e9); opacity: 0; transform-box: fill-box; transform-origin: center; }
  .cb-punch__jaw {
    position: absolute;
    left: 50%;
    width: 30px;
    height: 9px;
    margin-left: -15px;
    border-radius: 3px;
    background: linear-gradient(light-dark(#6d7179, #7d8087), light-dark(#dbdde1, #2e3035));
    opacity: 0;
    pointer-events: none;
  }
  .cb-punch__jaw--top { top: 3px; }
  .cb-punch__jaw--bottom { bottom: 3px; }
  .cb-punch[data-armed] .cb-punch__input:checked + .cb-punch__ticket .cb-punch__jaw--top { animation: cb-punch-top 0.6s ease-in-out; }
  .cb-punch[data-armed] .cb-punch__input:checked + .cb-punch__ticket .cb-punch__jaw--bottom { animation: cb-punch-bottom 0.6s ease-in-out; }
  .cb-punch[data-armed] .cb-punch__input:checked + .cb-punch__ticket .cb-punch__hole { animation: cb-punch-hole 0.6s linear; }
  .cb-punch[data-armed] .cb-punch__input:checked + .cb-punch__ticket .cb-punch__chad { animation: cb-punch-chad 1.1s cubic-bezier(0.4, 0, 0.9, 0.6); }
  .cb-punch[data-armed] .cb-punch__input:checked + .cb-punch__ticket { animation: cb-punch-jolt 0.6s ease-out; }
  @media (prefers-reduced-motion: reduce) {
    .cb-punch__ticket, .cb-punch__ticket * { animation: none !important; transition-duration: 0.01s !important; }
  }
`;

const TICK = 'M5.2 12.6L10 17.4L19 6.8L16.6 5L9.8 13L7.4 10.6Z';

export function PunchCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-punch" data-armed={armed || undefined}>
        <input className="cb-punch__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-punch__ticket">
          <span className="cb-punch__main">
            <span className="cb-punch__route" aria-hidden="true">
              MV 042 · Gate 4
            </span>
            <span className="cb-punch__label">Checked in</span>
          </span>
          <span className="cb-punch__stub" aria-hidden="true">
            <span className="cb-punch__jaw cb-punch__jaw--top" />
            <span className="cb-punch__spot">
              <svg viewBox="0 0 24 24">
                <path className="cb-punch__hole" d={TICK} />
                <path className="cb-punch__chad" d={TICK} />
              </svg>
            </span>
            <span className="cb-punch__jaw cb-punch__jaw--bottom" />
          </span>
        </span>
      </label>
    </>
  );
}
