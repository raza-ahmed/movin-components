"use client";

import { useId } from 'react';

const css = `
  .radio-route { --radio-route-k: 0; position: relative; width: 240px; height: 72px; }
  .radio-route:has(.radio-route__input[value='york']:checked) { --radio-route-k: 1; }
  .radio-route:has(.radio-route__input[value='durham']:checked) { --radio-route-k: 2; }
  .radio-route__sleepers {
    position: absolute;
    left: 6px;
    right: 6px;
    top: 27px;
    height: 10px;
    background: repeating-linear-gradient(90deg, light-dark(#ebedf0, #232529) 0 3px, transparent 3px 9px);
  }
  .radio-route__track { position: absolute; left: 6px; right: 6px; top: 30px; height: 4px; border-radius: 2px; background: light-dark(#cbced3, #393c41); }
  .radio-route__train {
    position: absolute;
    left: 13px;
    top: 12px;
    width: 34px;
    height: 15px;
    border-radius: 4px 10px 3px 3px;
    background: linear-gradient(light-dark(#42454c, #e5e6e9), light-dark(#5f626a, #a7abb2));
    transform: translateX(calc(var(--radio-route-k) * 90px));
    transition: transform 0.9s cubic-bezier(0.5, 0, 0.25, 1);
    z-index: 1;
  }
  .radio-route__train::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 3px;
    width: 21px;
    height: 5px;
    background: repeating-linear-gradient(90deg, light-dark(#dbdde1, #2e3035) 0 5px, transparent 5px 8px);
  }
  .radio-route__train::after {
    content: '';
    position: absolute;
    left: 4px;
    right: 4px;
    bottom: -3px;
    height: 5px;
    background: radial-gradient(circle at 2.5px 2.5px, light-dark(#6d7179, #7d8087) 2px, transparent 2.5px) 0 0 / 9px 5px repeat-x;
  }
  .radio-route__stops { position: absolute; inset: 0; }
  .radio-route__stop {
    position: absolute;
    top: 26px;
    display: grid;
    justify-items: center;
    gap: 9px;
    width: 64px;
    margin-left: -32px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s;
  }
  .radio-route__stop:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-route__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-route__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 2px light-dark(#6d7179, #7d8087);
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  .radio-route__stop:has(.radio-route__input:focus-visible) .radio-route__dot { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  /* The platform lights once the train has pulled in. */
  .radio-route__stop:has(.radio-route__input:checked) { color: light-dark(#373a40, #f1f2f3); transition-delay: 0.7s; }
  .radio-route__stop:has(.radio-route__input:checked) .radio-route__dot {
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: inset 0 0 0 2px light-dark(#373a40, #f1f2f3), 0 0 10px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent);
    transition-delay: 0.7s;
  }
  @media (prefers-reduced-motion: reduce) {
    .radio-route *, .radio-route__stop { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const STOPS = [
  { value: 'leeds', label: 'Leeds', x: 30 },
  { value: 'york', label: 'York', x: 120 },
  { value: 'durham', label: 'Durham', x: 210 },
];

export function RouteRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-route">
        <span className="radio-route__sleepers" aria-hidden="true" />
        <span className="radio-route__track" aria-hidden="true" />
        <span className="radio-route__train" aria-hidden="true" />
        <div className="radio-route__stops" role="radiogroup" aria-label="Destination">
          {STOPS.map((s, i) => (
            <label key={s.value} className="radio-route__stop" style={{ left: s.x }}>
              <input className="radio-route__input" type="radio" name={name} value={s.value} defaultChecked={i === 0} />
              <span className="radio-route__dot" aria-hidden="true" />
              {s.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
