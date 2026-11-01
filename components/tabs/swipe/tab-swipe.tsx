"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const TABS = [
  { label: 'For you', posts: [['Paper cranes, folding on loop', '2.4k likes'], ['A clock face made of type', '1.1k likes']] },
  { label: 'Following', posts: [['Studio notes, week 12', 'posted 2h ago'], ['Three ways to fade a list', 'posted 5h ago']] },
  { label: 'Trending', posts: [['Liquid glass, done in CSS', '#interface'], ['The bounciest checkbox yet', '#motion']] },
];

const W = 260;
const COL = W / TABS.length;

const css = `
  .tabs-swipe { width: ${W}px; }
  .tabs-swipe__list { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); box-shadow: inset 0 -1px 0 light-dark(#ebedf0, #232529); }
  .tabs-swipe__tab { padding: 9px 0 12px; border: 0; border-radius: 6px; background: none; font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; transition: color 0.3s; }
  .tabs-swipe__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: -2px; }
  .tabs-swipe__line { position: absolute; bottom: 0; left: 0; width: ${COL - 36}px; height: 2px; border-radius: 1px; background: light-dark(#373a40, #f1f2f3); transition: transform 0.45s cubic-bezier(0.25, 1, 0.35, 1); }
  .tabs-swipe__view { overflow: hidden; margin-top: 10px; cursor: grab; touch-action: pan-y; user-select: none; -webkit-user-select: none; }
  .tabs-swipe__strip { display: flex; width: ${W * TABS.length}px; transition: transform 0.45s cubic-bezier(0.25, 1, 0.35, 1); }
  /* While a finger is down everything tracks it directly; the glide is only for the snap. */
  .tabs-swipe--held .tabs-swipe__view { cursor: grabbing; }
  .tabs-swipe--held :is(.tabs-swipe__tab, .tabs-swipe__line, .tabs-swipe__strip) { transition: none; }
  .tabs-swipe__panel { display: grid; gap: 8px; width: ${W}px; padding: 0 2px; }
  .tabs-swipe__post { display: flex; align-items: center; gap: 10px; }
  .tabs-swipe__thumb { width: 38px; height: 38px; flex: none; border-radius: 9px; background: light-dark(#ebedf0, #232529); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .tabs-swipe__title { display: block; color: light-dark(#42454c, #e5e6e9); font-size: 13px; font-weight: 500; }
  .tabs-swipe__meta { display: block; margin-top: 2px; color: light-dark(#5f626a, #a7abb2); font-size: 12px; }
  @media (prefers-reduced-motion: reduce) {
    .tabs-swipe__tab, .tabs-swipe__line, .tabs-swipe__strip { transition: none; }
  }
`;

export function SwipeTabs() {
  const id = useId();
  const [sel, setSel] = useState(0);
  const [dx, setDx] = useState(0);
  const [held, setHeld] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<{ x: number; samples: { t: number; x: number }[] } | null>(null);

  // Past the first or last panel the drag meets resistance.
  const edge = (sel === 0 && dx > 0) || (sel === TABS.length - 1 && dx < 0);
  const shift = edge ? dx * 0.3 : dx;
  // Where the underline sits, in tabs: it follows the drag continuously.
  const at = Math.max(0, Math.min(TABS.length - 1, sel - shift / W));

  const end = () => {
    const d = drag.current;
    drag.current = null;
    setHeld(false);
    if (!d) return;
    const s = d.samples;
    const v = s.length > 1 ? (s[s.length - 1].x - s[0].x) / Math.max(1, s[s.length - 1].t - s[0].t) : 0;
    // A long drag or a quick flick turns the page; anything else springs back.
    const step = dx < -W * 0.25 || v < -0.4 ? 1 : dx > W * 0.25 || v > 0.4 ? -1 : 0;
    setSel((i) => Math.max(0, Math.min(TABS.length - 1, i + step)));
    setDx(0);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = TABS.length;
    const next = { ArrowRight: Math.min(n - 1, sel + 1), ArrowLeft: Math.max(0, sel - 1), Home: 0, End: n - 1 }[e.key];
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
      <div className={`tabs-swipe${held ? ' tabs-swipe--held' : ''}`}>
        <div className="tabs-swipe__list" role="tablist" aria-label="Feed" onKeyDown={onKeyDown}>
          {TABS.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              className="tabs-swipe__tab"
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={sel === i}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={sel === i ? 0 : -1}
              onClick={() => setSel(i)}
              // Each label brightens as the line approaches it.
              style={{ color: `color-mix(in oklab, light-dark(#373a40, #f1f2f3) ${Math.round(Math.max(0, 1 - Math.abs(i - at)) * 100)}%, light-dark(#5f626a, #a7abb2))` }}
            >
              {t.label}
            </button>
          ))}
          <span className="tabs-swipe__line" style={{ transform: `translateX(${at * COL + 18}px)` }} aria-hidden="true" />
        </div>
        <div
          className="tabs-swipe__view"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { x: e.clientX, samples: [{ t: e.timeStamp, x: e.clientX }] };
            setHeld(true);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            setDx(e.clientX - d.x);
            d.samples.push({ t: e.timeStamp, x: e.clientX });
            while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift();
          }}
          onPointerUp={end}
          onPointerCancel={end}
        >
          <div className="tabs-swipe__strip" style={{ transform: `translateX(${-sel * W + shift}px)` }}>
            {TABS.map((t, i) => (
              <div key={t.label} className="tabs-swipe__panel" role="tabpanel" id={`${id}-panel-${i}`} aria-labelledby={`${id}-tab-${i}`} inert={sel !== i}>
                {t.posts.map(([title, meta]) => (
                  <div key={title} className="tabs-swipe__post">
                    <span className="tabs-swipe__thumb" aria-hidden="true" />
                    <span>
                      <span className="tabs-swipe__title">{title}</span>
                      <span className="tabs-swipe__meta">{meta}</span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
