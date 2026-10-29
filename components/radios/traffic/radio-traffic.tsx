"use client";

import { useId } from 'react';

const css = `
  .radio-traffic { position: relative; display: grid; gap: 6px; padding: 10px 0 30px; }
  /* The housing and pole sit behind the lamp column. */
  .radio-traffic::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 44px;
    bottom: 22px;
    border-radius: 12px;
    background: linear-gradient(90deg, light-dark(#dbdde1, #2e3035), light-dark(#ebedf0, #232529));
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41);
  }
  .radio-traffic::after { content: ''; position: absolute; left: 19px; bottom: 0; width: 6px; height: 22px; background: light-dark(#dbdde1, #2e3035); }
  .radio-traffic__opt {
    position: relative;
    display: flex;
    align-items: center;
    gap: 18px;
    padding-left: 8px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s;
  }
  .radio-traffic__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-traffic__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-traffic__lamp {
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 2px 4px light-dark(#fbfcfd, #121417);
    /* Going out, the bulb fades slowly. */
    transition: background-color 0.6s ease, box-shadow 0.6s ease;
  }
  .radio-traffic__lamp::before {
    content: '';
    position: absolute;
    left: -3px;
    right: -3px;
    top: -4px;
    height: 12px;
    border-radius: 14px 14px 0 0;
    background: light-dark(#cbced3, #393c41);
    clip-path: inset(0 0 40% 0);
  }
  .radio-traffic__opt:has(.radio-traffic__input:focus-visible) .radio-traffic__lamp { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .radio-traffic__opt:has(.radio-traffic__input:checked) { color: light-dark(#373a40, #f1f2f3); }
  .radio-traffic__opt:has(.radio-traffic__input:checked) .radio-traffic__lamp {
    background: radial-gradient(circle at 40% 38%, light-dark(#373a40, #f1f2f3), light-dark(#50535b, #c6c8cd) 70%);
    box-shadow: inset 0 0 0 1px light-dark(#42454c, #e5e6e9), 0 0 16px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent);
    transition-duration: 0.15s, 0.3s;
  }
  @media (prefers-reduced-motion: reduce) {
    .radio-traffic * { transition-duration: 0.01s !important; }
  }
`;

const LAMPS = [
  { value: 'stop', label: 'Stop' },
  { value: 'wait', label: 'Wait' },
  { value: 'go', label: 'Go' },
];

export function TrafficRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-traffic" role="radiogroup" aria-label="Signal">
        {LAMPS.map((l, i) => (
          <label key={l.value} className="radio-traffic__opt">
            <input className="radio-traffic__input" type="radio" name={name} value={l.value} defaultChecked={i === 0} />
            <span className="radio-traffic__lamp" aria-hidden="true" />
            {l.label}
          </label>
        ))}
      </div>
    </>
  );
}
