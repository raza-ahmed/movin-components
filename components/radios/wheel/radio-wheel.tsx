"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const css = `
  @keyframes radio-wheel-tick-a { 0%, 100% { transform: rotate(0deg); } 10%, 30%, 50% { transform: rotate(-18deg); } 20%, 40%, 60% { transform: rotate(0deg); } 70% { transform: rotate(-10deg); } }
  @keyframes radio-wheel-tick-b { 0%, 100% { transform: rotate(0deg); } 10%, 30%, 50% { transform: rotate(-18deg); } 20%, 40%, 60% { transform: rotate(0deg); } 70% { transform: rotate(-10deg); } }
  .radio-wheel { display: flex; align-items: center; gap: 20px; }
  .radio-wheel__stage { position: relative; width: 116px; height: 124px; }
  .radio-wheel__pointer {
    position: absolute;
    left: 50px;
    top: 0;
    width: 16px;
    height: 18px;
    background: light-dark(#373a40, #f1f2f3);
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    transform-origin: 50% 20%;
    z-index: 1;
  }
  .radio-wheel[data-flip='a'] .radio-wheel__pointer { animation: radio-wheel-tick-a 1.6s ease-out; }
  .radio-wheel[data-flip='b'] .radio-wheel__pointer { animation: radio-wheel-tick-b 1.6s ease-out; }
  .radio-wheel__disc {
    position: absolute;
    left: 2px;
    top: 10px;
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background: conic-gradient(light-dark(#dbdde1, #2e3035) 0 90deg, light-dark(#cbced3, #393c41) 0 180deg, light-dark(#dbdde1, #2e3035) 0 270deg, light-dark(#cbced3, #393c41) 0);
    box-shadow: inset 0 0 0 4px light-dark(#6d7179, #7d8087), 0 6px 12px -6px color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent);
    transform: rotate(var(--radio-wheel-r));
    transition: transform 1.6s cubic-bezier(0.15, 0.7, 0.2, 1);
  }
  .radio-wheel__hub { position: absolute; left: 50%; top: 50%; width: 14px; height: 14px; margin: -7px; border-radius: 50%; background: light-dark(#50535b, #c6c8cd); }
  .radio-wheel__label {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50px;
    margin-left: -25px;
    color: light-dark(#373a40, #f1f2f3);
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    transform: rotate(var(--a)) translateY(-38px);
    transform-origin: 50% 0;
  }
  .radio-wheel__opts { display: grid; gap: 2px; }
  .radio-wheel__opt {
    position: relative;
    padding: 4px 10px;
    border-radius: 6px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-wheel__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-wheel__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-wheel__opt:has(.radio-wheel__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .radio-wheel__opt:has(.radio-wheel__input:checked) { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); transition-delay: 1.3s; }
  @media (prefers-reduced-motion: reduce) {
    .radio-wheel * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const DISHES = [
  { value: 'pizza', label: 'Pizza' },
  { value: 'sushi', label: 'Sushi' },
  { value: 'tacos', label: 'Tacos' },
  { value: 'curry', label: 'Curry' },
];
// Segment k is centred at 45 + 90k degrees clockwise from the top.
const restFor = (k: number) => -(45 + k * 90);

export function WheelRadio() {
  const name = useId();
  const [spin, setSpin] = useState({ r: restFor(0), flip: 0 });
  const turned = useRef(restFor(0));
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="radio-wheel"
        data-flip={spin.flip ? (spin.flip % 2 ? 'a' : 'b') : undefined}
        style={{ '--radio-wheel-r': `${spin.r}deg` } as React.CSSProperties}
        onChange={(e) => {
          const k = DISHES.findIndex((d) => d.value === (e.target as HTMLInputElement).value);
          // Always forward: two full turns plus whatever brings the pick under the pointer.
          const delta = (((restFor(k) - turned.current) % 360) + 360) % 360;
          turned.current += 720 + delta;
          setSpin((s) => ({ r: turned.current, flip: s.flip + 1 }));
        }}
      >
        <span className="radio-wheel__stage" aria-hidden="true">
          <span className="radio-wheel__pointer" />
          <span className="radio-wheel__disc">
            {DISHES.map((d, k) => (
              <span key={d.value} className="radio-wheel__label" style={{ '--a': `${45 + k * 90}deg` } as React.CSSProperties}>
                {d.label}
              </span>
            ))}
            <span className="radio-wheel__hub" />
          </span>
        </span>
        <div className="radio-wheel__opts" role="radiogroup" aria-label="Dinner">
          {DISHES.map((d, i) => (
            <label key={d.value} className="radio-wheel__opt">
              <input className="radio-wheel__input" type="radio" name={name} value={d.value} defaultChecked={i === 0} />
              {d.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
