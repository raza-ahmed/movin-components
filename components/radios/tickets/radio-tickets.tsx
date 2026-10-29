"use client";

import * as React from "react";
import { useId } from 'react';

const css = `
  .radio-tickets { --radio-tickets-n: 1; display: grid; justify-items: center; gap: 14px; }
  .radio-tickets:has(.radio-tickets__input[value='2']:checked) { --radio-tickets-n: 2; }
  .radio-tickets:has(.radio-tickets__input[value='3']:checked) { --radio-tickets-n: 3; }
  .radio-tickets:has(.radio-tickets__input[value='4']:checked) { --radio-tickets-n: 4; }
  .radio-tickets__fan { position: relative; width: 170px; height: 92px; }
  .radio-tickets__ticket {
    /* Offset from the middle of the fan, and whether this ticket is in it at all. */
    --radio-tickets-o: calc(var(--i) - (var(--radio-tickets-n) - 1) / 2);
    --radio-tickets-on: clamp(0, var(--radio-tickets-n) - var(--i), 1);
    position: absolute;
    left: 50px;
    top: 14px;
    width: 70px;
    height: 40px;
    border-radius: 5px;
    background: linear-gradient(90deg, light-dark(#42454c, #e5e6e9) 0 72%, light-dark(#50535b, #c6c8cd) 72%);
    mask:
      radial-gradient(circle 4px at 72% 0, transparent 97%, #000) top / 100% 51% no-repeat,
      radial-gradient(circle 4px at 72% 100%, transparent 97%, #000) bottom / 100% 51% no-repeat;
    opacity: var(--radio-tickets-on);
    transform-origin: 50% 160%;
    transform: rotate(calc(var(--radio-tickets-o) * 12deg)) translateY(calc((1 - var(--radio-tickets-on)) * 16px)) scale(calc(0.8 + var(--radio-tickets-on) * 0.2));
    transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0.3s;
  }
  .radio-tickets__ticket::before { content: 'ADMIT ONE'; position: absolute; left: 7px; top: 8px; color: light-dark(#ebedf0, #232529); font-size: 8px; font-weight: 600; letter-spacing: 0.1em; }
  .radio-tickets__ticket::after { content: ''; position: absolute; left: 7px; bottom: 9px; width: 30px; height: 2px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); box-shadow: 0 -5px 0 light-dark(#6d7179, #7d8087); }
  .radio-tickets__opts { display: flex; gap: 4px; padding: 4px; border-radius: 10px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-tickets__opt {
    position: relative;
    display: grid;
    place-items: center;
    width: 34px;
    height: 28px;
    border-radius: 7px;
    color: light-dark(#5f626a, #a7abb2);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;
  }
  .radio-tickets__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-tickets__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .radio-tickets__opt:has(.radio-tickets__input:focus-visible) { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .radio-tickets__opt:has(.radio-tickets__input:checked) { background: light-dark(#42454c, #e5e6e9); color: light-dark(#fbfcfd, #121417); }
  @media (prefers-reduced-motion: reduce) {
    .radio-tickets * { transition-duration: 0.01s !important; }
  }
`;

const COUNTS = ['1', '2', '3', '4'];

export function TicketsRadio() {
  const name = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-tickets">
        <span className="radio-tickets__fan" aria-hidden="true">
          {[3, 2, 1, 0].map((i) => (
            <span key={i} className="radio-tickets__ticket" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </span>
        <div className="radio-tickets__opts" role="radiogroup" aria-label="Tickets">
          {COUNTS.map((c, i) => (
            <label key={c} className="radio-tickets__opt">
              <input className="radio-tickets__input" type="radio" name={name} value={c} aria-label={`${c} ${c === '1' ? 'ticket' : 'tickets'}`} defaultChecked={i === 1} />
              <span aria-hidden="true">{c}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
