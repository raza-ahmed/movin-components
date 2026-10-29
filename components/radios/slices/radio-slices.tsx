"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  .radio-slices { display: flex; align-items: center; gap: 20px; }
  .radio-slices__pizza {
    position: relative;
    width: 104px;
    height: 104px;
    border-radius: 50%;
    background: radial-gradient(circle, light-dark(#50535b, #c6c8cd) 0 58%, light-dark(#5f626a, #a7abb2) 62%, light-dark(#6d7179, #7d8087) 66%, light-dark(#cbced3, #393c41) 100%);
    box-shadow: 0 6px 12px -6px color-mix(in oklab, light-dark(#fbfcfd, #121417) 80%, transparent);
  }
  .radio-slices__topping { position: absolute; width: 9px; height: 9px; margin: -4.5px; border-radius: 50%; background: light-dark(#cbced3, #393c41); box-shadow: inset 0 -1px 0 light-dark(#dbdde1, #2e3035); }
  /* Four cuts through the centre; each option sets their angles and how many are in use. */
  .radio-slices__cut {
    --radio-slices-a: 0deg;
    --radio-slices-on: 0;
    position: absolute;
    left: 2px;
    top: 51px;
    width: 100px;
    height: 2px;
    border-radius: 1px;
    background: light-dark(#fbfcfd, #121417);
    transform: rotate(var(--radio-slices-a)) scaleX(var(--radio-slices-on));
    transition: transform 0.55s cubic-bezier(0.4, 1.2, 0.5, 1) calc(var(--i) * 60ms);
  }
  .radio-slices__cut--1 { --radio-slices-on: 1; }
  .radio-slices__cut--2 { --radio-slices-a: 90deg; --radio-slices-on: 1; }
  .radio-slices__cut--3 { --radio-slices-a: 90deg; }
  .radio-slices:has(.radio-slices__input[value='6']:checked) .radio-slices__cut--2 { --radio-slices-a: 60deg; }
  .radio-slices:has(.radio-slices__input[value='6']:checked) .radio-slices__cut--3 { --radio-slices-a: 120deg; --radio-slices-on: 1; }
  .radio-slices:has(.radio-slices__input[value='8']:checked) .radio-slices__cut--2 { --radio-slices-a: 45deg; }
  .radio-slices:has(.radio-slices__input[value='8']:checked) .radio-slices__cut--3 { --radio-slices-a: 90deg; --radio-slices-on: 1; }
  .radio-slices:has(.radio-slices__input[value='8']:checked) .radio-slices__cut--4 { --radio-slices-a: 135deg; --radio-slices-on: 1; }
  .radio-slices__opts { display: grid; gap: 2px; }
  .radio-slices__opt {
    position: relative;
    padding: 4px 10px;
    border-radius: 6px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-slices__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-slices__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-slices__opt:has(.radio-slices__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .radio-slices__opt:has(.radio-slices__input:checked) { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  @media (prefers-reduced-motion: reduce) {
    .radio-slices * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const TOPPINGS = [
  [30, 34],
  [62, 26],
  [76, 52],
  [52, 50],
  [28, 66],
  [46, 80],
  [72, 78],
  [40, 20],
  [84, 36],
];
const COUNTS = ['4', '6', '8'];

export function SlicesRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-slices">
        <span className="radio-slices__pizza" aria-hidden="true">
          {TOPPINGS.map(([x, y]) => (
            <span key={`${x}-${y}`} className="radio-slices__topping" style={{ left: x, top: y }} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`radio-slices__cut radio-slices__cut--${i + 1}`} style={{ '--i': i } as React.CSSProperties} />
          ))}
        </span>
        <div className="radio-slices__opts" role="radiogroup" aria-label="Slices">
          {COUNTS.map((c, i) => (
            <label key={c} className="radio-slices__opt">
              <input className="radio-slices__input" type="radio" name={name} value={c} defaultChecked={i === 0} />
              {c} slices
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
