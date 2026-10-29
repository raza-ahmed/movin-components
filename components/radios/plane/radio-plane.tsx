"use client";

import { useId, useState } from 'react';

const css = `
  @keyframes radio-plane-arc-a {
    0% { transform: translateY(0) rotate(0deg); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
    50% { transform: translateY(-30px) rotate(-6deg); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); }
    100% { transform: translateY(0) rotate(0deg); }
  }
  @keyframes radio-plane-arc-b {
    0% { transform: translateY(0) rotate(0deg); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
    50% { transform: translateY(-30px) rotate(-6deg); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); }
    100% { transform: translateY(0) rotate(0deg); }
  }
  @keyframes radio-plane-idle { 0%, 100% { translate: 0 0; } 50% { translate: 0 -2px; } }
  .radio-plane { --radio-plane-k: 0; display: grid; gap: 6px; width: 232px; }
  .radio-plane:has(.radio-plane__input[value='tokyo']:checked) { --radio-plane-k: 1; }
  .radio-plane:has(.radio-plane__input[value='lima']:checked) { --radio-plane-k: 2; }
  .radio-plane__sky { position: relative; height: 44px; }
  .radio-plane__x {
    position: absolute;
    left: 25px;
    bottom: 4px;
    transform: translateX(calc(var(--radio-plane-k) * 80px));
    transition: transform 0.8s cubic-bezier(0.45, 0, 0.3, 1);
  }
  .radio-plane__y { display: block; }
  .radio-plane[data-flip='a'] .radio-plane__y { animation: radio-plane-arc-a 0.8s; }
  .radio-plane[data-flip='b'] .radio-plane__y { animation: radio-plane-arc-b 0.8s; }
  .radio-plane__craft { display: block; width: 22px; height: 18px; animation: radio-plane-idle 2.4s ease-in-out infinite; }
  .radio-plane__wing { fill: light-dark(#373a40, #f1f2f3); }
  .radio-plane__fold { fill: light-dark(#5f626a, #a7abb2); }
  .radio-plane__shadow {
    position: absolute;
    left: 24px;
    bottom: 0;
    width: 24px;
    height: 3px;
    border-radius: 50%;
    background: color-mix(in oklab, light-dark(#fbfcfd, #121417) 70%, transparent);
    transform: translateX(calc(var(--radio-plane-k) * 80px));
    transition: transform 0.8s cubic-bezier(0.45, 0, 0.3, 1);
  }
  .radio-plane__opts { display: grid; grid-template-columns: repeat(3, 72px); gap: 8px; }
  .radio-plane__opt {
    position: relative;
    padding: 7px 0;
    border-radius: 8px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s, box-shadow 0.2s;
  }
  .radio-plane__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-plane__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-plane__opt:has(.radio-plane__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-plane__opt:has(.radio-plane__input:checked) { color: light-dark(#373a40, #f1f2f3); background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#50535b, #c6c8cd); transition-delay: 0.6s; }
  @media (prefers-reduced-motion: reduce) {
    .radio-plane * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const CITIES = [
  { value: 'lisbon', label: 'Lisbon' },
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'lima', label: 'Lima' },
];

export function PlaneRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-plane" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onChange={() => setFlip((f) => f + 1)}>
        <span className="radio-plane__sky" aria-hidden="true">
          <span className="radio-plane__shadow" />
          <span className="radio-plane__x">
            <span className="radio-plane__y">
              <svg className="radio-plane__craft" viewBox="0 0 22 18">
                <path className="radio-plane__wing" d="M1 9L21 1L15 17L11 11Z" />
                <path className="radio-plane__fold" d="M11 11L21 1L9 13.5Z" />
              </svg>
            </span>
          </span>
        </span>
        <div className="radio-plane__opts" role="radiogroup" aria-label="Destination">
          {CITIES.map((c, i) => (
            <label key={c.value} className="radio-plane__opt">
              <input className="radio-plane__input" type="radio" name={name} value={c.value} defaultChecked={i === 0} />
              {c.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
