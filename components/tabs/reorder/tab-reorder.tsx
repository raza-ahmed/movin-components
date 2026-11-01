"use client";

import * as React from "react";
import { useId, useLayoutEffect, useRef, useState } from 'react';

const ITEMS = [
  { key: 'inbox', label: 'Inbox', body: 'Eleven tasks waiting to be sorted.' },
  { key: 'today', label: 'Today', body: 'Four tasks, the first at ten.' },
  { key: 'later', label: 'Later', body: 'Seven tasks parked for next week.' },
  { key: 'done', label: 'Done', body: 'Twenty-three finished this month.' },
];
const BY_KEY = Object.fromEntries(ITEMS.map((t) => [t.key, t]));

const css = `
  .tabs-reorder { width: 260px; }
  .tabs-reorder__list { position: relative; display: flex; justify-content: center; gap: 2px; }
  .tabs-reorder__tab {
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
    height: 34px;
    padding: 0 10px 0 7px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: light-dark(#5f626a, #a7abb2);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    cursor: grab;
    touch-action: pan-y;
    user-select: none;
    -webkit-user-select: none;
    transition: background-color 0.2s, color 0.2s, box-shadow 0.2s, scale 0.2s;
  }
  .tabs-reorder__tab:hover { color: light-dark(#42454c, #e5e6e9); }
  .tabs-reorder__tab[aria-selected='true'] { background: light-dark(#ebedf0, #232529); color: light-dark(#373a40, #f1f2f3); }
  .tabs-reorder__tab:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  .tabs-reorder__tab--dragging {
    z-index: 2;
    scale: 1.06;
    cursor: grabbing;
    background: light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 6px 16px light-dark(rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.45));
  }
  .tabs-reorder__grip { width: 6px; height: 10px; fill: light-dark(#cbced3, #393c41); flex: none; }
  .tabs-reorder__tab:hover .tabs-reorder__grip, .tabs-reorder__tab--dragging .tabs-reorder__grip { fill: light-dark(#5f626a, #a7abb2); }
  .tabs-reorder__panel { padding: 14px 6px 0; min-height: calc(3.1em + 14px); color: light-dark(#50535b, #c6c8cd); font-size: 13px; line-height: 1.55; text-align: center; }
  .tabs-reorder__live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
`;

/** The order with the tab at i and the one after it swapped. */
const swap = (order: string[], i: number) => [...order.slice(0, i), order[i + 1], order[i], ...order.slice(i + 2)];

type Drag = { key: string; startX: number; grab: number; px: number; moved: boolean };

export function ReorderTabs() {
  const id = useId();
  const [order, setOrder] = useState(ITEMS.map((t) => t.key));
  const [sel, setSel] = useState('today');
  const [dragging, setDragging] = useState<string | null>(null);
  const [said, setSaid] = useState('');
  const list = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLButtonElement | null>>({});
  const drag = useRef<Drag | null>(null);
  const before = useRef<Record<string, number> | null>(null);
  // The drag runs on window listeners, which outlive any one render, so they read the order from here.
  const live = useRef(order);
  live.current = order;

  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const place = (key: string, px: number, grab: number) => {
    const el = els.current[key]!;
    el.style.transform = `translateX(${px - grab - el.offsetLeft}px)`;
  };
  const move = (next: string[]) => {
    // Remember where every tab was, so the ones that shift can slide from there.
    before.current = Object.fromEntries(live.current.map((k) => [k, els.current[k]!.offsetLeft]));
    live.current = next;
    setOrder(next);
  };

  useLayoutEffect(() => {
    const was = before.current;
    before.current = null;
    if (!was) return;
    for (const k of order) {
      const el = els.current[k]!;
      if (drag.current?.moved && drag.current.key === k) {
        place(k, drag.current.px, drag.current.grab);
        continue;
      }
      const dx = was[k] - el.offsetLeft;
      if (dx && !still()) el.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: 240, easing: 'cubic-bezier(0.3, 1.2, 0.5, 1)' });
    }
  }, [order]);

  // Window listeners rather than pointer capture: reordering moves tab nodes, and a moved node loses its capture.
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>, key: string) => {
    if (e.button !== 0) return;
    const el = e.currentTarget;
    const px = e.clientX - list.current!.getBoundingClientRect().left;
    drag.current = { key, startX: e.clientX, grab: px - el.offsetLeft, px, moved: false };
    const up = () => {
      removeEventListener('pointermove', onPointerMove);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      onPointerUp(key);
    };
    addEventListener('pointermove', onPointerMove);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  };
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.abs(e.clientX - d.startX) < 4) return;
    d.moved = true;
    setDragging(d.key);
    d.px = e.clientX - list.current!.getBoundingClientRect().left;
    place(d.key, d.px, d.grab);
    // Past a neighbour's middle, swap with it.
    const el = els.current[d.key]!;
    const mid = d.px - d.grab + el.offsetWidth / 2;
    const now = live.current;
    const i = now.indexOf(d.key);
    const [prev, next] = [els.current[now[i - 1]], els.current[now[i + 1]]];
    if (next && mid > next.offsetLeft + next.offsetWidth / 2) move(swap(now, i));
    else if (prev && mid < prev.offsetLeft + prev.offsetWidth / 2) move(swap(now, i - 1));
  };
  const onPointerUp = (key: string) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) return setSel(key);
    const el = els.current[key]!;
    const from = el.style.transform;
    el.style.transform = '';
    setDragging(null);
    if (!still()) el.animate([{ transform: from }, { transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.3, 1.3, 0.5, 1)' });
    setSaid(`${BY_KEY[key].label}, position ${live.current.indexOf(key) + 1} of ${live.current.length}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = order.indexOf(sel);
    const n = order.length;
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      // Alt + arrow carries the selected tab along the row.
      e.preventDefault();
      const j = e.key === 'ArrowRight' ? i + 1 : i - 1;
      if (j < 0 || j >= n) return;
      move(swap(order, Math.min(i, j)));
      setSaid(`${BY_KEY[sel].label}, position ${j + 1} of ${n}`);
      return;
    }
    const next = { ArrowRight: (i + 1) % n, ArrowLeft: (i + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setSel(order[next]);
    els.current[order[next]]?.focus();
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="tabs-reorder">
        <div ref={list} className="tabs-reorder__list" role="tablist" aria-label="Lists, Alt and arrow keys to reorder" onKeyDown={onKeyDown}>
          {order.map((k) => {
            const t = BY_KEY[k];
            return (
              <button
                key={k}
                ref={(el) => {
                  els.current[k] = el;
                }}
                className={`tabs-reorder__tab${dragging === k ? ' tabs-reorder__tab--dragging' : ''}`}
                type="button"
                role="tab"
                id={`${id}-tab-${k}`}
                aria-selected={sel === k}
                aria-controls={`${id}-panel-${k}`}
                tabIndex={sel === k ? 0 : -1}
                onPointerDown={(e) => onPointerDown(e, k)}
                onClick={(e) => e.detail === 0 && setSel(k)}
              >
                <svg className="tabs-reorder__grip" viewBox="0 0 6 10" aria-hidden="true">
                  {[1, 5, 9].map((y) => (
                    <g key={y}>
                      <circle cx="1.2" cy={y} r="1.1" />
                      <circle cx="4.8" cy={y} r="1.1" />
                    </g>
                  ))}
                </svg>
                {t.label}
              </button>
            );
          })}
        </div>
        <span className="tabs-reorder__live" aria-live="polite">
          {said}
        </span>
        {ITEMS.map((t) => (
          <div key={t.key} className="tabs-reorder__panel" role="tabpanel" id={`${id}-panel-${t.key}`} aria-labelledby={`${id}-tab-${t.key}`} hidden={sel !== t.key}>
            {t.body}
          </div>
        ))}
      </div>
    </>
  );
}
