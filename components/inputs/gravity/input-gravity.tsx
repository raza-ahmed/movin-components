"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const css = `
  @keyframes field-gravity-fall {
    from { transform: translate(0, 0) rotate(0deg); opacity: 1; }
    to { transform: translate(var(--dx), 86px) rotate(var(--rot)); opacity: 0; }
  }
  .field-gravity { position: relative; width: 250px; padding-bottom: 70px; }
  .field-gravity__label { display: block; margin-bottom: 6px; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-gravity__box { position: relative; }
  .field-gravity__input {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    border: 0;
    outline: 0;
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit; font-size: 15px;
    transition: box-shadow 0.2s;
  }
  .field-gravity__input:focus { box-shadow: inset 0 0 0 1px light-dark(#5f626a, #a7abb2); }
  .field-gravity__drop {
    position: absolute;
    top: 11px;
    color: light-dark(#42454c, #e5e6e9);
    font-family: inherit; font-size: 15px;
    white-space: pre;
    pointer-events: none;
    animation: field-gravity-fall 0.95s cubic-bezier(0.45, 0, 0.9, 0.55) forwards;
  }
  @media (prefers-reduced-motion: reduce) { .field-gravity__drop { display: none; } }
  .field-gravity__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-gravity__top > :first-child { margin: 0; }
  .field-gravity__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-gravity__info svg { width: 14px; height: 14px; }
  .field-gravity__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-gravity__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-gravity__info::after {
    content: attr(data-tip);
    position: absolute;
    left: -6px;
    bottom: calc(100% + 6px);
    z-index: 5;
    padding: 4px 8px;
    border-radius: 6px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    font-family: inherit; font-size: 11px; font-weight: 500; line-height: 1.3;
    width: max-content;
    max-width: 150px;
    opacity: 0;
    transform: translateY(3px);
    pointer-events: none;
    transition: opacity 0.15s, transform 0.15s;
  }
  .field-gravity__info:hover::after, .field-gravity__info:focus-visible::after { opacity: 1; transform: none; }
`;

type Drop = { id: number; ch: string; x: number; dx: number; rot: number; delay: number };
const PAD = 12;

export function GravityInput() {
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('Backspace sends these tumbling');
  const [drops, setDrops] = useState<Drop[]>([]);
  const nextId = useRef(0);
  const measure = useRef<CanvasRenderingContext2D | null>(null);

  const change = (next: string) => {
    if (next.length < value.length) {
      // Find what was removed, and where each removed letter sat on screen.
      let p = 0;
      while (p < next.length && value[p] === next[p]) p++;
      const removed = value.slice(p, p + value.length - next.length);
      const el = input.current!;
      measure.current ??= document.createElement('canvas').getContext('2d');
      const ctx = measure.current!;
      ctx.font = getComputedStyle(el).font;
      const born = [...removed].map((ch, i) => {
        const id = nextId.current++;
        const r = Math.sin(id * 78.233) * 43758.5;
        const f = r - Math.floor(r);
        return { id, ch, x: PAD + ctx.measureText(value.slice(0, p + i)).width - el.scrollLeft, dx: (f - 0.5) * 50, rot: (f - 0.5) * 300, delay: i * 25 };
      });
      setDrops((d) => [...d, ...born]);
      window.setTimeout(() => setDrops((d) => d.filter((x) => !born.includes(x))), 1100 + born.length * 25);
    }
    setValue(next);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-gravity">
        <div className="field-gravity__top">
          <label className="field-gravity__label" htmlFor="field-gravity-input">
            Caption
          </label>
          <button type="button" className="field-gravity__info" aria-label="Delete text to drop it" data-tip="Delete text to drop it">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
        </div>
        <div className="field-gravity__box">
          <input
            ref={input}
            id="field-gravity-input"
            className="field-gravity__input"
            value={value}
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => change(e.target.value)}
          />
          {drops.map((d) => (
            <span
              key={d.id}
              className="field-gravity__drop"
              aria-hidden="true"
              style={{ left: d.x, animationDelay: `${d.delay}ms`, '--dx': `${d.dx.toFixed(0)}px`, '--rot': `${d.rot.toFixed(0)}deg` } as React.CSSProperties}
            >
              {d.ch}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
