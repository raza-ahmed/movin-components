"use client";

import * as React from "react";
import { useState } from 'react';

const PEOPLE = [
  { i: 'MH', n: 'Mira Holt' },
  { i: 'DK', n: 'Dana Kole' },
  { i: 'AR', n: 'Ana Ruiz' },
  { i: 'JB', n: 'Jun Bae' },
  { i: 'TS', n: 'Tom Sato' },
  { i: 'LP', n: 'Lea Park' },
  { i: 'OM', n: 'Omar Malik' },
];
const A = 30;
const SHOWN = 4;

const css = `
  .card-team { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-team__title { margin: 0; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-team__sub { margin: 2px 0 14px; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .card-team__group { position: relative; display: block; width: 100%; height: ${A}px; padding: 0; border: 0; background: none; cursor: pointer; }
  .card-team__group:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: ${A / 2}px; }
  .card-team__face {
    position: absolute;
    left: 0;
    top: 0;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    width: ${A}px;
    height: ${A}px;
    border: 2px solid light-dark(#f3f4f7, #1a1c1f);
    border-radius: 50%;
    font-size: 10px;
    font-weight: 700;
    transition: transform 0.45s cubic-bezier(0.3, 1.4, 0.5, 1), opacity 0.25s;
  }
  .card-team__face:nth-child(4n + 1) { background: light-dark(#50535b, #c6c8cd); color: light-dark(#fbfcfd, #121417); }
  .card-team__face:nth-child(4n + 2) { background: light-dark(#cbced3, #393c41); color: light-dark(#373a40, #f1f2f3); }
  .card-team__face:nth-child(4n + 3) { background: light-dark(#5f626a, #a7abb2); color: light-dark(#fbfcfd, #121417); }
  .card-team__face:nth-child(4n + 4) { background: light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); }
  .card-team__more { background: light-dark(#ebedf0, #232529) !important; color: light-dark(#42454c, #e5e6e9) !important; }
  .card-team__face--hot { z-index: 2; }
  .card-team__caption { height: 16px; margin: 10px 0 0; font-size: 11.5px; color: light-dark(#50535b, #c6c8cd); }
  @media (prefers-reduced-motion: reduce) {
    .card-team__face { transition: opacity 0.2s; }
  }
`;

export function TeamCard() {
  const [open, setOpen] = useState(false);
  const [hot, setHot] = useState<number | null>(null);

  // Stacked, four faces overlap with a +3 chip; spread, all seven line up a beat apart and the chip folds away.
  const place = (i: number): React.CSSProperties => {
    const delay = `${(open ? i : PEOPLE.length - i) * 35}ms`;
    if (open) return { transform: `translateX(${i * (A + 2)}px) scale(${hot === i ? 1.12 : 1})`, transitionDelay: hot === null ? delay : '0ms' };
    if (i < SHOWN) return { transform: `translateX(${i * 20}px)`, transitionDelay: delay };
    return { transform: `translateX(${SHOWN * 20}px) scale(0.4)`, opacity: 0, transitionDelay: delay };
  };
  const caption = open ? (hot !== null ? PEOPLE[hot].n : `${PEOPLE.length} members`) : `${PEOPLE[0].n.split(' ')[0]}, ${PEOPLE[1].n.split(' ')[0]} and ${PEOPLE.length - 2} others`;

  return (
    <>
      <style>
        {css}
      </style>
      <article className="card-team" onPointerLeave={() => setOpen(false)}>
        <p className="card-team__title">Design team</p>
        <p className="card-team__sub">Posters and print</p>
        <button
          type="button"
          className="card-team__group"
          aria-expanded={open}
          aria-label={`Team: ${PEOPLE.map((p) => p.n).join(', ')}`}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
          onClick={() => setOpen((o) => !o)}
        >
          {PEOPLE.map((p, i) => (
            <span
              key={p.i}
              className={`card-team__face${hot === i ? ' card-team__face--hot' : ''}`}
              style={place(i)}
              onPointerEnter={() => open && setHot(i)}
              onPointerLeave={() => setHot(null)}
              aria-hidden="true"
            >
              {p.i}
            </span>
          ))}
          <span className="card-team__face card-team__more" style={{ transform: `translateX(${SHOWN * 20}px) scale(${open ? 0.4 : 1})`, opacity: open ? 0 : 1 }} aria-hidden="true">
            +{PEOPLE.length - SHOWN}
          </span>
        </button>
        <p className="card-team__caption" aria-hidden="true">
          {caption}
        </p>
      </article>
    </>
  );
}
