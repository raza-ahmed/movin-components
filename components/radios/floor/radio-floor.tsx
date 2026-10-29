"use client";

import { useId, useState } from 'react';

const css = `
  @keyframes radio-floor-doors-a { 0% { transform: scaleX(0.2); } 14%, 80% { transform: scaleX(1); } 100% { transform: scaleX(0.2); } }
  @keyframes radio-floor-doors-b { 0% { transform: scaleX(0.2); } 14%, 80% { transform: scaleX(1); } 100% { transform: scaleX(0.2); } }
  .radio-floor { --radio-floor-f: 0; display: flex; align-items: center; gap: 18px; }
  .radio-floor:has(.radio-floor__input[value='1']:checked) { --radio-floor-f: 1; }
  .radio-floor:has(.radio-floor__input[value='2']:checked) { --radio-floor-f: 2; }
  .radio-floor:has(.radio-floor__input[value='3']:checked) { --radio-floor-f: 3; }
  .radio-floor__shaft {
    position: relative;
    width: 40px;
    height: 116px;
    border-radius: 6px;
    background:
      repeating-linear-gradient(transparent 0 28px, light-dark(#dbdde1, #2e3035) 28px 29px) 0 4px / 100% 100% no-repeat,
      light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .radio-floor__car {
    position: absolute;
    left: 6px;
    bottom: 4px;
    width: 28px;
    height: 24px;
    overflow: hidden;
    border-radius: 3px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 10px -2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent);
    transform: translateY(calc(var(--radio-floor-f) * -28px));
    transition: transform 0.75s cubic-bezier(0.45, 0, 0.25, 1) 0.18s;
  }
  .radio-floor__door { position: absolute; top: 0; bottom: 0; width: 14px; background: linear-gradient(90deg, light-dark(#6d7179, #7d8087), light-dark(#5f626a, #a7abb2)); transform: scaleX(0.2); }
  .radio-floor__door--l { left: 0; transform-origin: 0 50%; box-shadow: inset -1px 0 0 light-dark(#cbced3, #393c41); }
  .radio-floor__door--r { right: 0; transform-origin: 100% 50%; box-shadow: inset 1px 0 0 light-dark(#cbced3, #393c41); }
  .radio-floor[data-flip='a'] .radio-floor__door { animation: radio-floor-doors-a 1.15s ease-in-out; }
  .radio-floor[data-flip='b'] .radio-floor__door { animation: radio-floor-doors-b 1.15s ease-in-out; }
  .radio-floor__panel { display: grid; gap: 6px; padding: 8px; border-radius: 10px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-floor__button {
    position: relative;
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1.5px light-dark(#cbced3, #393c41);
    color: light-dark(#50535b, #c6c8cd);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, box-shadow 0.2s;
  }
  .radio-floor__button:hover { color: light-dark(#373a40, #f1f2f3); }
  .radio-floor__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-floor__button:has(.radio-floor__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-floor__button:has(.radio-floor__input:checked) {
    color: light-dark(#373a40, #f1f2f3);
    box-shadow: inset 0 0 0 1.5px light-dark(#373a40, #f1f2f3), 0 0 8px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 40%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    .radio-floor * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const FLOORS = [
  { value: '3', label: '3', name: 'Floor 3' },
  { value: '2', label: '2', name: 'Floor 2' },
  { value: '1', label: '1', name: 'Floor 1' },
  { value: '0', label: 'G', name: 'Ground floor' },
];

export function FloorRadio() {
  const name = useId();
  const [flip, setFlip] = useState(0);
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-floor" data-flip={flip ? (flip % 2 ? 'a' : 'b') : undefined} onChange={() => setFlip((f) => f + 1)}>
        <span className="radio-floor__shaft" aria-hidden="true">
          <span className="radio-floor__car">
            <span className="radio-floor__door radio-floor__door--l" />
            <span className="radio-floor__door radio-floor__door--r" />
          </span>
        </span>
        <div className="radio-floor__panel" role="radiogroup" aria-label="Floor">
          {FLOORS.map((f) => (
            <label key={f.value} className="radio-floor__button">
              <input className="radio-floor__input" type="radio" name={name} value={f.value} aria-label={f.name} defaultChecked={f.value === '0'} />
              <span aria-hidden="true">{f.label}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
