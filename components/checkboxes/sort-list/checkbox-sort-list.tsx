"use client";

import { useEffect, useRef } from 'react';

const css = `
  .cb-sort-list {
    --cb-sort-list-p: 0;
    box-sizing: border-box;
    width: 220px;
    padding: 12px;
    border: 1px solid #3a3a3a;
    border-radius: 14px;
    background: #202020;
    color: #ededed;
    font-size: 13px;
  }

  .cb-sort-list__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  .cb-sort-list__heading {
    font-size: 14px;
    font-weight: 600;
  }

  .cb-sort-list__count {
    color: #7c7c7c;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
  }

  .cb-sort-list__bar {
    height: 3px;
    margin: 8px 0 6px;
    overflow: hidden;
    border-radius: 2px;
    background: #3a3a3a;
  }

  .cb-sort-list__fill {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: #ededed;
    transform: scaleX(var(--cb-sort-list-p));
    transform-origin: 0 50%;
    transition: transform 0.5s cubic-bezier(0.3, 1.2, 0.5, 1);
  }

  .cb-sort-list__items {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .cb-sort-list__item {
    position: relative;
    background: #202020;
  }

  .cb-sort-list__row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    cursor: pointer;
    user-select: none;
  }

  .cb-sort-list__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .cb-sort-list__box {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    border: 2px solid #4d4d4d;
    border-radius: 50%;
    transition: background-color 0.2s, border-color 0.2s;
  }

  .cb-sort-list__input:focus-visible + .cb-sort-list__box {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  .cb-sort-list__box svg {
    width: 14px;
    height: 14px;
    fill: none;
    stroke: #111111;
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .cb-sort-list__box path {
    stroke-dasharray: 100 102;
    stroke-dashoffset: 101;
    transition: stroke-dashoffset 0.15s;
  }

  .cb-sort-list__text {
    transition: color 0.3s;
  }

  .cb-sort-list__input:checked + .cb-sort-list__box {
    border-color: #a7a7a7;
    background: #a7a7a7;
  }

  .cb-sort-list__input:checked + .cb-sort-list__box path {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.25s ease-out;
  }

  .cb-sort-list__input:checked ~ .cb-sort-list__text {
    color: #7c7c7c;
    text-decoration: line-through;
    text-decoration-color: #4d4d4d;
  }

  @media (prefers-reduced-motion: reduce) {
    .cb-sort-list *,
    .cb-sort-list__input:checked ~ * * {
      transition-duration: 0s !important;
    }
  }
`;

const TASKS = ['Reply to Sam', 'Book the venue', 'Ship the update', 'Water the plants'];

export function SortListCheckbox() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initSortList(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="cb-sort-list">
        <div className="cb-sort-list__head">
          <span className="cb-sort-list__heading">Today</span>
          <span className="cb-sort-list__count" aria-live="polite">
            0 of {TASKS.length} done
          </span>
        </div>
        <div className="cb-sort-list__bar" aria-hidden="true">
          <span className="cb-sort-list__fill" />
        </div>
        <ul className="cb-sort-list__items">
          {TASKS.map((task) => (
            <li key={task} className="cb-sort-list__item">
              <label className="cb-sort-list__row">
                <input className="cb-sort-list__input" type="checkbox" />
                <span className="cb-sort-list__box" aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <path pathLength={100} d="M5 10.5l3.5 3.5 6.5-8" />
                  </svg>
                </span>
                <span className="cb-sort-list__text">{task}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// Checked rows move below the open ones in the order they were checked. FLIP:
// measure every row, reorder the DOM, then animate each from where it was.
// The rows are never re-rendered by React, and cleanup restores their order.
function initSortList(root: HTMLElement): (() => void) | undefined {
  const list = root.querySelector<HTMLElement>('.cb-sort-list__items');
  const count = root.querySelector<HTMLElement>('.cb-sort-list__count');
  if (!list) return;
  const original = Array.from(list.children) as HTMLElement[];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const input = (li: HTMLElement) => li.querySelector<HTMLInputElement>('.cb-sort-list__input')!;
  let done = original.filter((li) => input(li).checked);
  let timer = 0;

  const progress = () => {
    const n = original.filter((li) => input(li).checked).length;
    root.style.setProperty('--cb-sort-list-p', String(n / original.length));
    if (count) count.textContent = `${n} of ${original.length} done`;
  };
  const reorder = () => {
    const before = new Map(original.map((li) => [li, li.getBoundingClientRect().top]));
    const focused = document.activeElement as HTMLElement | null;
    original.filter((li) => !input(li).checked).concat(done).forEach((li) => list.appendChild(li));
    if (focused && root.contains(focused)) focused.focus({ preventScroll: true });
    if (reduce) return;
    original.forEach((li) => {
      const dy = (before.get(li) ?? 0) - li.getBoundingClientRect().top;
      if (!dy) return;
      li.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], {
        duration: 420,
        easing: 'cubic-bezier(0.3, 1.15, 0.5, 1)',
      });
    });
  };
  const change = (e: Event) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('.cb-sort-list__item');
    if (!li) return;
    done = done.filter((x) => x !== li);
    if (input(li).checked) done.push(li);
    progress();
    // Let the tick draw before the row moves.
    window.clearTimeout(timer);
    timer = window.setTimeout(reorder, reduce ? 0 : 180);
  };

  list.addEventListener('change', change);
  progress();
  return () => {
    window.clearTimeout(timer);
    list.removeEventListener('change', change);
    original.forEach((li) => list.appendChild(li));
  };
}
