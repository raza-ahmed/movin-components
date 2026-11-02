"use client";

import * as React from "react";
import { useEffect, useId, useRef, useState } from 'react';

const NOTES = [
  { label: 'Ideas', tilt: -5, body: 'Seven loose ideas, two of them worth a sketch this week.' },
  { label: 'Doing', tilt: 4, body: 'The poster series, with proofs back from the printer on Friday.' },
  { label: 'Done', tilt: -3, body: 'Logo refresh and the spring catalogue, both signed off.' },
];
const W = 240;
const COL = W / NOTES.length;
const PIN_Y = 14;
const pinX = (i: number) => i * COL + COL / 2;

const css = `
  .tabs-pin { width: ${W}px; }
  .tabs-pin__board {
    position: relative;
    height: 84px;
    border-radius: 12px;
    background: radial-gradient(light-dark(#dbdde1, #2e3035) 0.8px, transparent 1.2px) 0 0 / 7px 7px, light-dark(#ebedf0, #232529);
  }
  .tabs-pin__list { display: grid; grid-template-columns: repeat(${NOTES.length}, 1fr); height: 100%; }
  .tabs-pin__note {
    position: relative;
    align-self: center;
    justify-self: center;
    display: grid;
    align-content: start;
    gap: 5px;
    width: 64px;
    height: 54px;
    box-sizing: border-box;
    padding: 12px 8px 0;
    border: 0;
    border-radius: 2px;
    background: light-dark(#50535b, #c6c8cd);
    color: light-dark(#f3f4f7, #1a1c1f);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    box-shadow: 0 3px 6px -2px var(--tabs-pin-shadow);
    transform-origin: 50% ${PIN_Y - 14}px;
    transform: rotate(var(--tilt));
    transition: transform 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) 0.12s, background-color 0.3s;
  }
  .tabs-pin { --tabs-pin-shadow: light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.55)); }
  .tabs-pin__note:focus-visible { outline: 2px solid light-dark(#373a40, #f1f2f3); outline-offset: 3px; }
  /* Pinned, a note hangs straight and swings once when the pin goes in. */
  .tabs-pin__note[aria-selected='true'] { background: light-dark(#373a40, #f1f2f3); transform: rotate(0deg); }
  .tabs-pin[data-live] .tabs-pin__note[aria-selected='true'] { animation: tabs-pin-swing 1s ease-out 0.62s; }
  @keyframes tabs-pin-swing {
    20% { transform: rotate(6deg); }
    45% { transform: rotate(-3.5deg); }
    70% { transform: rotate(1.5deg); }
  }
  .tabs-pin__line { display: block; height: 2px; border-radius: 1px; background: light-dark(#6d7179, #7d8087); }
  .tabs-pin__pin {
    position: absolute;
    left: -6px;
    top: -6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, light-dark(#5f626a, #a7abb2), light-dark(#cbced3, #393c41) 70%);
    filter: drop-shadow(0 1px 1px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45)));
    pointer-events: none;
  }
  .tabs-pin__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-pin__note { transition: background-color 0.3s; }
    .tabs-pin[data-live] .tabs-pin__note[aria-selected='true'] { animation: none; }
  }
`;

export function PinTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [live, setLive] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const pin = useRef<HTMLSpanElement>(null);
  const at = useRef(0);

  // The pin pulls out, arcs over to the next note growing as it lifts (its shadow falls further away),
  // and pushes in with a small squash.
  useEffect(() => {
    if (at.current === sel) return;
    const el = pin.current!;
    const m = new DOMMatrix(getComputedStyle(el).transform);
    const [fx, fy] = el.getAnimations().length ? [m.e, m.f] : [pinX(at.current), PIN_Y];
    el.getAnimations().forEach((a) => a.cancel());
    at.current = sel;
    const tx = pinX(sel);
    el.style.transform = `translate(${tx}px, ${PIN_Y}px)`;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lift = (s: number, d: number) => `drop-shadow(${d / 2}px ${d}px ${d / 2}px rgba(0, 0, 0, ${0.45 - s * 0.2}))`;
    el.animate(
      [
        { transform: `translate(${fx}px, ${fy}px) scale(1)`, filter: lift(0, 1) },
        { transform: `translate(${fx}px, ${PIN_Y - 9}px) scale(1.25)`, filter: lift(0.6, 6), offset: 0.2 },
        { transform: `translate(${(fx + tx) / 2}px, ${PIN_Y - 22}px) scale(1.35)`, filter: lift(1, 10), offset: 0.5 },
        { transform: `translate(${tx}px, ${PIN_Y - 9}px) scale(1.25)`, filter: lift(0.6, 6), offset: 0.8 },
        { transform: `translate(${tx}px, ${PIN_Y}px) scale(0.88)`, filter: lift(0, 1), offset: 0.9 },
        { transform: `translate(${tx}px, ${PIN_Y}px) scale(1)`, filter: lift(0, 1) },
      ],
      { duration: 760, easing: 'ease-in-out' },
    );
  }, [sel]);

  const pick = (i: number) => {
    setLive(true);
    setSel(i);
  };
  const n = NOTES.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    pick(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-pin" data-live={live || undefined}>
        <div className="tabs-pin__board">
          <div className="tabs-pin__list" role="tablist" aria-label="Board" onKeyDown={onKeyDown}>
            {NOTES.map((t, i) => (
              <button
                key={t.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tabs-pin__note"
                style={{ '--tilt': `${t.tilt}deg` } as React.CSSProperties}
                type="button"
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={sel === i}
                aria-controls={`${id}-panel-${i}`}
                tabIndex={sel === i ? 0 : -1}
                onClick={() => pick(i)}
              >
                {t.label}
                <span className="tabs-pin__line" style={{ width: '90%' }} aria-hidden="true" />
                <span className="tabs-pin__line" style={{ width: '60%' }} aria-hidden="true" />
              </button>
            ))}
          </div>
          <span className="tabs-pin__pin" ref={pin} style={{ transform: `translate(${pinX(0)}px, ${PIN_Y}px)` }} aria-hidden="true" />
        </div>
        {NOTES.map((t, i) => (
          <div key={t.label} className="tabs-pin__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
