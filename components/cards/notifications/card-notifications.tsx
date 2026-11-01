"use client";

import * as React from "react";
import { useEffect, useRef, useState } from 'react';

const ITEMS = [
  { app: 'Calendar', when: 'now', text: 'Standup moved to 10:30' },
  { app: 'Messages', when: '2m', text: 'Ana: the prints are in' },
  { app: 'Deploys', when: '5m', text: 'Production is live in 41s' },
];
const H = 52;
const GAP = 8;

const css = `
  .card-notifications { box-sizing: border-box; width: 240px; padding: 12px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-notifications__head { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
  .card-notifications__head b { margin-right: auto; font-size: 12px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-notifications__btn { height: 22px; padding: 0 8px; border: 0; border-radius: 999px; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font: inherit; font-size: 10.5px; font-weight: 600; cursor: pointer; }
  .card-notifications__btn:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-notifications__stack { position: relative; transition: height 0.45s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .card-notifications__list { margin: 0; padding: 0; list-style: none; }
  .card-notifications__item {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    height: ${H}px;
    padding: 0 10px;
    border-radius: 12px;
    background: light-dark(#ebedf0, #232529);
    box-shadow: 0 4px 10px -4px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    transition: transform 0.45s cubic-bezier(0.3, 1.25, 0.5, 1), opacity 0.3s;
  }
  .card-notifications__icon { flex: none; width: 26px; height: 26px; border-radius: 8px; background: light-dark(#cbced3, #393c41); }
  .card-notifications__item:nth-child(1) .card-notifications__icon { background: light-dark(#50535b, #c6c8cd); }
  .card-notifications__item:nth-child(2) .card-notifications__icon { background: light-dark(#6d7179, #7d8087); }
  .card-notifications__body { min-width: 0; font-size: 11px; }
  .card-notifications__app { display: flex; gap: 6px; color: light-dark(#5f626a, #a7abb2); }
  .card-notifications__text { margin: 1px 0 0; overflow: hidden; color: light-dark(#373a40, #f1f2f3); white-space: nowrap; text-overflow: ellipsis; }
  .card-notifications__empty { position: absolute; inset: 0; display: grid; place-items: center; margin: 0; font-size: 11px; color: light-dark(#5f626a, #a7abb2); opacity: 0; transition: opacity 0.3s 0.3s; }
  .card-notifications--clear .card-notifications__empty { opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    .card-notifications__stack, .card-notifications__item { transition: opacity 0.2s; }
  }
`;

export function NotificationsCard() {
  const [open, setOpen] = useState(false);
  const [clear, setClear] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  // Stacked, each one behind sits lower, smaller and fainter; open, they lay out as a list, a beat apart.
  const place = (i: number): React.CSSProperties => {
    if (clear) return { transform: `translateX(110%)`, opacity: 0, transitionDelay: `${i * 70}ms`, zIndex: 3 - i };
    if (open) return { transform: `translateY(${i * (H + GAP)}px)`, transitionDelay: `${i * 50}ms`, zIndex: 3 - i };
    return { transform: `translateY(${i * 9}px) scale(${1 - i * 0.06})`, opacity: 1 - i * 0.3, transitionDelay: `${(2 - i) * 40}ms`, zIndex: 3 - i };
  };

  return (
    <>
      <style>
        {css}
      </style>
      <article className={`card-notifications${clear ? ' card-notifications--clear' : ''}`}>
        <div className="card-notifications__head">
          <b>Notifications</b>
          <button type="button" className="card-notifications__btn" aria-expanded={open} onClick={() => setOpen((o) => !o)} disabled={clear}>
            {open ? 'Show less' : 'Show all'}
          </button>
          <button
            type="button"
            className="card-notifications__btn"
            disabled={clear}
            onClick={() => {
              setClear(true);
              // The demo deals them back after a moment.
              timer.current = window.setTimeout(() => {
                setClear(false);
                setOpen(false);
              }, 1800);
            }}
          >
            Clear
          </button>
        </div>
        <div className="card-notifications__stack" style={{ height: open && !clear ? ITEMS.length * (H + GAP) - GAP : H + 18 }}>
          <ul className="card-notifications__list">
            {ITEMS.map((n, i) => (
              <li key={n.app} className="card-notifications__item" style={place(i)} aria-hidden={clear || (!open && i > 0)}>
                <span className="card-notifications__icon" aria-hidden="true" />
                <div className="card-notifications__body">
                  <span className="card-notifications__app">
                    {n.app}
                    <span>{n.when}</span>
                  </span>
                  <p className="card-notifications__text">{n.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="card-notifications__empty" aria-live="polite">
            {clear ? 'No new notifications' : ''}
          </p>
        </div>
      </article>
    </>
  );
}
