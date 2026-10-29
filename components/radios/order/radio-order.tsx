"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  .radio-order { display: grid; justify-items: center; gap: 12px; }
  .radio-order__list {
    position: relative;
    width: 204px;
    height: 112px;
    padding: 4px 0;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .radio-order__row {
    --radio-order-o: var(--radio-order-a);
    position: absolute;
    left: 6px;
    right: 6px;
    top: 4px;
    display: grid;
    grid-template-columns: 1fr 48px 40px;
    align-items: center;
    height: 26px;
    padding: 0 8px;
    border-radius: 6px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    transform: translateY(calc(var(--radio-order-o) * 26px));
    transition: transform 0.5s cubic-bezier(0.4, 1.25, 0.5, 1) calc(var(--radio-order-a) * 35ms);
  }
  .radio-order__row:nth-child(odd) { background: color-mix(in oklab, light-dark(#ebedf0, #232529) 60%, transparent); }
  .radio-order__name { color: light-dark(#42454c, #e5e6e9); font-weight: 600; }
  .radio-order__price, .radio-order__rating { text-align: right; transition: color 0.3s; }
  .radio-order:has(.radio-order__input[value='price']:checked) .radio-order__row { --radio-order-o: var(--radio-order-p); }
  .radio-order:has(.radio-order__input[value='rating']:checked) .radio-order__row { --radio-order-o: var(--radio-order-r); }
  .radio-order:has(.radio-order__input[value='price']:checked) .radio-order__price,
  .radio-order:has(.radio-order__input[value='rating']:checked) .radio-order__rating { color: light-dark(#373a40, #f1f2f3); }
  .radio-order__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-order__opt {
    position: relative;
    padding: 5px 12px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-order__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-order__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-order__opt:has(.radio-order__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-order__opt:has(.radio-order__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-order * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

// a: position by name, p: by price (low first), r: by rating (high first).
const ITEMS = [
  { name: 'Apple', price: '3.20', rating: '4.6', a: 0, p: 2, r: 1 },
  { name: 'Fig', price: '5.10', rating: '4.9', a: 1, p: 3, r: 0 },
  { name: 'Kiwi', price: '1.80', rating: '3.9', a: 2, p: 0, r: 3 },
  { name: 'Plum', price: '2.40', rating: '4.2', a: 3, p: 1, r: 2 },
];
const KEYS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
];

export function OrderRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-order">
        <span className="radio-order__list" aria-hidden="true">
          {ITEMS.map((it) => (
            <span
              key={it.name}
              className="radio-order__row"
              style={{ '--radio-order-a': it.a, '--radio-order-p': it.p, '--radio-order-r': it.r } as React.CSSProperties}
            >
              <span className="radio-order__name">{it.name}</span>
              <span className="radio-order__price">£{it.price}</span>
              <span className="radio-order__rating">{it.rating}★</span>
            </span>
          ))}
        </span>
        <div className="radio-order__opts" role="radiogroup" aria-label="Sort by">
          {KEYS.map((k, i) => (
            <label key={k.value} className="radio-order__opt">
              <input className="radio-order__input" type="radio" name={name} value={k.value} defaultChecked={i === 0} />
              {k.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
