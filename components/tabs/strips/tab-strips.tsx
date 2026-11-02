"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const PLACES = [
  { label: 'Coast', body: 'Cliff paths, a cold sea and chips on the harbour wall.' },
  { label: 'Forest', body: 'Old beech woods with a river to follow all day.' },
  { label: 'Dunes', body: 'Miles of sand, and the stars at night are something else.' },
  { label: 'Peaks', body: 'Hut to hut along the ridge, with snow into June.' },
];
const W = 240;
const H = 150;
const NARROW = 30;
const GAP = 4;
const WIDE = W - (PLACES.length - 1) * (NARROW + GAP);

// Where each strip sits when one of them is open.
function layout(sel: number) {
  let x = 0;
  return PLACES.map((_, i) => {
    const w = i === sel ? WIDE : NARROW;
    const at = { x, w };
    x += w + GAP;
    return at;
  });
}

const css = `
  .tabs-strips { position: relative; width: ${W}px; height: ${H}px; }
  .tabs-strips__tab {
    position: absolute;
    top: 0;
    height: ${H}px;
    padding: 0;
    border: 0;
    border-radius: 12px;
    overflow: hidden;
    background: light-dark(#ebedf0, #232529);
    font: inherit;
    cursor: pointer;
    transition: left 0.55s cubic-bezier(0.3, 1.1, 0.4, 1), width 0.55s cubic-bezier(0.3, 1.1, 0.4, 1);
  }
  .tabs-strips__tab:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  /* The scene is drawn at the open size and centred, so a closed strip shows a slice of its middle. */
  .tabs-strips__scene { position: absolute; left: 50%; top: 0; width: ${WIDE}px; height: ${H}px; margin-left: ${-WIDE / 2}px; }
  .tabs-strips__tab::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, color-mix(in srgb, light-dark(#fbfcfd, #121417) 90%, transparent), color-mix(in srgb, light-dark(#fbfcfd, #121417) 72%, transparent) 45%, transparent 78%); }
  .tabs-strips__sky { fill: light-dark(#ebedf0, #232529); }
  .tabs-strips__a { fill: light-dark(#cbced3, #393c41); }
  .tabs-strips__b { fill: light-dark(#6d7179, #7d8087); }
  .tabs-strips__c { fill: light-dark(#50535b, #c6c8cd); }
  /* Closed, the label stands on end up the strip; open, it lies flat along the bottom. */
  .tabs-strips__label {
    position: absolute;
    left: 9px;
    bottom: 10px;
    z-index: 1;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    color: light-dark(#373a40, #f1f2f3);
    white-space: nowrap;
    transform-origin: 0 100%;
    transform: translate(14px, 0) rotate(-90deg);
    transition: transform 0.5s cubic-bezier(0.3, 1.2, 0.5, 1);
  }
  .tabs-strips__tab[aria-selected='true'] .tabs-strips__label { transform: none; font-size: 14px; }
  .tabs-strips__panel { position: absolute; bottom: 32px; z-index: 1; width: ${WIDE - 18}px; margin: 0; font-size: 11.5px; line-height: 1.45; color: light-dark(#373a40, #f1f2f3); pointer-events: none; animation: tabs-strips-in 0.4s ease-out 0.3s backwards; }
  @keyframes tabs-strips-in {
    from { opacity: 0; transform: translateY(6px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs-strips__tab, .tabs-strips__label { transition: none; }
    .tabs-strips__panel { animation: none; }
  }
`;

function Scene({ i }: { i: number }) {
  return (
    <svg className="tabs-strips__scene" viewBox={`0 0 ${WIDE} ${H}`} aria-hidden="true">
      <rect className="tabs-strips__sky" width={WIDE} height={H} />
      {i === 0 && (
        <>
          <circle className="tabs-strips__c" cx={92} cy={44} r={14} />
          <path className="tabs-strips__a" d="M0 96H138V150H0Z" />
          <path className="tabs-strips__b" d="M0 104Q17 99 34 104T69 104T103 104T138 104V150H0Z" />
          <path className="tabs-strips__a" d="M0 70L26 62L38 96H0Z" />
        </>
      )}
      {i === 1 &&
        [8, 30, 52, 74, 96, 118].map((x, k) => (
          <path key={x} className={k % 2 ? 'tabs-strips__b' : 'tabs-strips__a'} d={`M${x} ${118 - (k % 3) * 14}L${x + 14} ${150}H${x - 14}Z`} />
        ))}
      {i === 2 && (
        <>
          <circle className="tabs-strips__c" cx={46} cy={40} r={10} />
          <path className="tabs-strips__a" d="M0 98Q40 78 80 96T138 90V150H0Z" />
          <path className="tabs-strips__b" d="M0 118Q50 100 100 116T138 112V150H0Z" />
        </>
      )}
      {i === 3 && (
        <>
          <path className="tabs-strips__a" d="M-10 150L46 58L102 150Z" />
          <path className="tabs-strips__b" d="M40 150L98 70L156 150Z" />
          <path className="tabs-strips__c" d="M46 58L36 75L46 71L54 77Z M98 70L88 86L98 82L107 88Z" />
        </>
      )}
    </svg>
  );
}

export function StripsTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const at = layout(sel);
  const n = PLACES.length;
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
      <div className="tabs-strips">
        <div role="tablist" aria-label="Places" onKeyDown={onKeyDown}>
          {PLACES.map((p, i) => (
            <button
              key={p.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-strips__tab"
              style={{ left: at[i].x, width: at[i].w }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
            >
              <Scene i={i} />
              <span className="tabs-strips__label">{p.label}</span>
            </button>
          ))}
        </div>
        {PLACES.map((p, i) => (
          <p
            key={p.label}
            className="tabs-strips__panel"
            style={{ left: at[sel].x + 9 }}
            role="tabpanel"
            id={`${id}-panel-${i}`}
            aria-labelledby={`${id}-tab-${i}`}
            hidden={sel !== i}
          >
            {p.body}
          </p>
        ))}
      </div>
    </>
  );
}
