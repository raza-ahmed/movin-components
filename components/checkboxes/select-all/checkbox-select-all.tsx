"use client";

import { useEffect, useRef } from 'react';

const css = `
  .cb-select-all {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #ededed;
    font-size: 14px;
  }

  .cb-select-all__row {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
  }

  .cb-select-all__row--parent {
    font-weight: 600;
  }

  /* Children hang off a branch line under the parent's box. */
  .cb-select-all__branch {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-left: 10px;
    padding-left: 20px;
    border-left: 1px solid #3a3a3a;
  }

  .cb-select-all__branch .cb-select-all__row::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -20px;
    width: 14px;
    border-top: 1px solid #3a3a3a;
  }

  .cb-select-all__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  .cb-select-all__box {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    border: 2px solid #4d4d4d;
    border-radius: 5px;
    transition: background-color 0.2s, border-color 0.2s, scale 0.35s cubic-bezier(0.3, 1.8, 0.5, 1);
  }

  .cb-select-all__input:focus-visible + .cb-select-all__box {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  .cb-select-all__box svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: #111111;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .cb-select-all__tick {
    stroke-dasharray: 100 102;
    stroke-dashoffset: 101;
    transition: stroke-dashoffset 0.15s;
  }

  .cb-select-all__dash {
    transform: scaleX(0);
    transform-origin: 10px 10px;
    transition: transform 0.2s;
  }

  .cb-select-all__input:checked + .cb-select-all__box,
  .cb-select-all__input:indeterminate + .cb-select-all__box {
    border-color: #ededed;
    background: #ededed;
    scale: 1.08;
  }

  .cb-select-all__input:checked + .cb-select-all__box .cb-select-all__tick {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 0.3s cubic-bezier(0.5, 0, 0.3, 1) 0.05s;
  }

  /* Half way: a dash grows from the middle; it shrinks away as the tick draws. */
  .cb-select-all__input:indeterminate + .cb-select-all__box .cb-select-all__dash {
    transform: scaleX(1);
    transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
  }

  .cb-select-all__text {
    transition: color 0.3s;
  }

  .cb-select-all__branch .cb-select-all__input:checked ~ .cb-select-all__text {
    color: #a7a7a7;
  }

  @media (prefers-reduced-motion: reduce) {
    .cb-select-all__box,
    .cb-select-all__box * {
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  }
`;

const CHILDREN = ['Photos', 'Videos', 'Documents'];

function Box({ dash }: { dash?: boolean }) {
  return (
    <span className="cb-select-all__box" aria-hidden="true">
      <svg viewBox="0 0 20 20">
        {dash && <path className="cb-select-all__dash" d="M5.5 10h9" />}
        <path className="cb-select-all__tick" pathLength={100} d="M5 10.5l3.5 3.5 6.5-8" />
      </svg>
    </span>
  );
}

export function SelectAllCheckbox() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? initSelectAll(ref.current) : undefined), []);
  return (
    <>
      <style>{css}</style>
      <div ref={ref} className="cb-select-all" role="group" aria-label="Files to back up">
        <label className="cb-select-all__row cb-select-all__row--parent">
          <input className="cb-select-all__input cb-select-all__input--parent" type="checkbox" />
          <Box dash />
          <span className="cb-select-all__text">Back up everything</span>
        </label>
        <div className="cb-select-all__branch">
          {CHILDREN.map((name) => (
            <label key={name} className="cb-select-all__row">
              <input className="cb-select-all__input" type="checkbox" />
              <Box />
              <span className="cb-select-all__text">{name}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

// The parent's checked/indeterminate state follows its children; checking the
// parent cascades down the branch one child at a time.
function initSelectAll(root: HTMLElement): (() => void) | undefined {
  const parent = root.querySelector<HTMLInputElement>('.cb-select-all__input--parent');
  const children = Array.from(root.querySelectorAll<HTMLInputElement>('.cb-select-all__branch .cb-select-all__input'));
  if (!parent || !children.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timers: number[] = [];

  const sync = () => {
    const on = children.filter((c) => c.checked).length;
    parent.checked = on === children.length;
    parent.indeterminate = on > 0 && on < children.length;
  };
  const fromParent = () => {
    const want = parent.checked;
    parent.indeterminate = false;
    timers.forEach(clearTimeout);
    timers = [];
    children.forEach((c, i) => {
      if (c.checked === want) return;
      timers.push(
        window.setTimeout(() => {
          c.checked = want;
          c.dispatchEvent(new Event('change', { bubbles: true }));
        }, reduce ? 0 : 90 * (i + 1)),
      );
    });
  };
  const change = (e: Event) => {
    if (e.target === parent) fromParent();
    else if (children.includes(e.target as HTMLInputElement)) sync();
  };

  root.addEventListener('change', change);
  sync();
  return () => {
    timers.forEach(clearTimeout);
    root.removeEventListener('change', change);
  };
}
