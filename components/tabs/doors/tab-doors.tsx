"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const ROOMS = [
  { label: 'Study', body: 'A desk under the window, two walls of books and a reading lamp.' },
  { label: 'Studio', body: 'North light, a big table and the press in the corner.' },
  { label: 'Garden', body: 'Glass doors out to the herbs, a bench and the old pear tree.' },
];

const css = `
  .tabs-doors { width: 240px; }
  .tabs-doors__list { display: flex; justify-content: space-between; }
  .tabs-doors__tab { display: grid; justify-items: center; gap: 7px; padding: 0; border: 0; background: none; font: inherit; font-size: 12.5px; font-weight: 500; color: light-dark(#5f626a, #a7abb2); cursor: pointer; transition: color 0.3s; }
  .tabs-doors__tab:hover, .tabs-doors__tab[aria-selected='true'] { color: light-dark(#373a40, #f1f2f3); }
  .tabs-doors__tab:focus-visible { outline: none; }
  .tabs-doors__tab:focus-visible .tabs-doors__frame { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .tabs-doors__frame { position: relative; width: 60px; height: 92px; box-sizing: border-box; border: 3px solid light-dark(#dbdde1, #2e3035); border-bottom: 0; border-radius: 4px 4px 0 0; perspective: 260px; }
  /* Behind the door: the lit room. */
  .tabs-doors__room { position: absolute; inset: 0; overflow: hidden; background: radial-gradient(circle at 50% 28%, light-dark(#50535b, #c6c8cd), light-dark(#dbdde1, #2e3035) 75%); }
  .tabs-doors__room svg { position: absolute; left: 0; bottom: 0; width: 100%; height: 100%; }
  .tabs-doors__thing { fill: light-dark(#ebedf0, #232529); }
  .tabs-doors__leaf {
    position: absolute;
    inset: 0;
    border-radius: 1px;
    background: light-dark(#cbced3, #393c41);
    box-shadow: inset 6px 7px 0 -2px light-dark(#cbced3, #393c41), inset 6px 7px 0 0 light-dark(#6d7179, #7d8087);
    transform-origin: 0 50%;
    transition: transform 0.45s cubic-bezier(0.5, 0, 0.75, 0);
  }
  .tabs-doors__leaf::before { content: ''; position: absolute; left: 9px; right: 9px; top: 10px; height: 30px; border: 1.5px solid light-dark(#6d7179, #7d8087); border-radius: 2px; }
  .tabs-doors__leaf::after { content: ''; position: absolute; inset: 0; background: light-dark(#fbfcfd, #121417); opacity: 0; transition: opacity 0.45s; }
  .tabs-doors__knob { position: absolute; right: 7px; top: 50%; width: 5px; height: 5px; border-radius: 50%; background: light-dark(#50535b, #c6c8cd); }
  /* The chosen door swings in on its hinge, a beat after the old one starts to close. */
  .tabs-doors__tab[aria-selected='true'] .tabs-doors__leaf { transform: rotateY(-74deg); transition: transform 0.75s cubic-bezier(0.25, 1.3, 0.5, 1) 0.15s; }
  .tabs-doors__tab[aria-selected='true'] .tabs-doors__leaf::after { opacity: 0.45; transition-delay: 0.15s; }
  .tabs-doors__panel { padding: 12px 0 0; min-height: calc(3.1em + 12px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-doors__leaf, .tabs-doors__tab[aria-selected='true'] .tabs-doors__leaf, .tabs-doors__leaf::after { transition: none; }
  }
`;

function Room({ i }: { i: number }) {
  return (
    <svg viewBox="0 0 54 89" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      {i === 0 && <path className="tabs-doors__thing" d="M8 89V62H46V89H42V66H12V89Z M30 62V40L22 34H38L30 40" />}
      {i === 1 && <path className="tabs-doors__thing" d="M10 89L22 44H32L44 89H40L30 52H24L14 89Z M18 40H36V44H18Z" />}
      {i === 2 && <path className="tabs-doors__thing" d="M27 89V58M27 66C16 60 14 48 20 40C24 50 27 56 27 66ZM27 62C38 56 40 44 34 36C30 46 27 52 27 62Z M18 89H36L34 80H20Z" />}
    </svg>
  );
}

export function DoorsTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = ROOMS.length;
  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = { ArrowRight: (sel + 1) % n, ArrowLeft: (sel + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(next);
    tabs.current[next]?.focus();
  };
  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-doors">
        <div className="tabs-doors__list" role="tablist" aria-label="Rooms" onKeyDown={onKeyDown}>
          {ROOMS.map((r, i) => (
            <button
              key={r.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-doors__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <span className="tabs-doors__frame" aria-hidden="true">
                <span className="tabs-doors__room">
                  <Room i={i} />
                </span>
                <span className="tabs-doors__leaf">
                  <span className="tabs-doors__knob" />
                </span>
              </span>
              {r.label}
            </button>
          ))}
        </div>
        {ROOMS.map((r, i) => (
          <div key={r.label} className="tabs-doors__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} hidden={sel !== i}>
            {r.body}
          </div>
        ))}
      </div>
    </>
  );
}
