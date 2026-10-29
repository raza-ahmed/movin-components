"use client";

import * as React from "react";
import { useRef, useState } from 'react';

const css = `
  @keyframes field-combination-pop { from { transform: scale(1.6); opacity: 0; } }
  .field-combination { user-select: none; -webkit-user-select: none; display: flex; align-items: center; gap: 16px; }
  .field-combination__safe { position: relative; flex: none; width: 128px; height: 128px; }
  .field-combination__marker { position: absolute; left: 50%; top: -2px; margin-left: -5px; border: 5px solid transparent; border-top: 7px solid light-dark(#373a40, #f1f2f3); z-index: 1; }
  .field-combination__dial {
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background:
      repeating-conic-gradient(from -1deg, light-dark(#6d7179, #7d8087) 0 2deg, transparent 2deg 9deg),
      radial-gradient(circle, light-dark(#dbdde1, #2e3035) 0 60%, light-dark(#ebedf0, #232529) 61%);
    mask-image: radial-gradient(circle, #000 0 70%, transparent 70.5% 73%, #000 73.5%);
    box-shadow: inset 0 0 0 1px light-dark(#cbced3, #393c41);
    cursor: grab;
    touch-action: none;
    outline: none;
  }
  .field-combination__dial:active { cursor: grabbing; }
  .field-combination__dial:focus-visible { box-shadow: inset 0 0 0 2px light-dark(#5f626a, #a7abb2); }
  .field-combination__n { position: absolute; left: 50%; top: 50%; width: 18px; margin: -7px 0 0 -9px; color: light-dark(#42454c, #e5e6e9); font-family: inherit; font-size: 10px; font-weight: 600; line-height: 14px; text-align: center; }
  .field-combination__grip { position: absolute; inset: 34px; border-radius: 50%; background: radial-gradient(circle at 40% 35%, light-dark(#6d7179, #7d8087), light-dark(#ebedf0, #232529)); box-shadow: 0 2px 6px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); }
  .field-combination__side { display: grid; gap: 8px; width: 104px; }
  .field-combination__label { color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .field-combination__slots { display: flex; gap: 5px; }
  .field-combination__slot { display: grid; place-items: center; width: 30px; height: 32px; border-radius: 7px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); color: light-dark(#373a40, #f1f2f3); font-family: inherit; font-size: 14px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .field-combination__slot b { animation: field-combination-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .field-combination__slot[data-next] { box-shadow: inset 0 0 0 1px light-dark(#50535b, #c6c8cd); }
  .field-combination__set { height: 30px; border: 0; border-radius: 7px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font-family: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
  .field-combination__set:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 2px; }
  .field-combination__bolt { position: relative; height: 10px; border-radius: 3px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); overflow: hidden; }
  .field-combination__bolt span { position: absolute; left: 3px; top: 3px; width: 60%; height: 4px; border-radius: 2px; background: light-dark(#5f626a, #a7abb2); transition: transform 0.5s cubic-bezier(0.6, 0, 0.3, 1.3); }
  .field-combination[data-open] .field-combination__bolt span { transform: translateX(-70%); background: light-dark(#373a40, #f1f2f3); }
  .field-combination__hint { color: light-dark(#5f626a, #a7abb2); font-size: 10px; }
  .field-combination__top { display: flex; align-items: center; gap: 5px; margin-bottom: 6px; }
  .field-combination__top > :first-child { margin: 0; }
  .field-combination__info { position: relative; display: grid; place-items: center; width: 16px; height: 16px; padding: 0; border: 0; border-radius: 50%; background: none; color: light-dark(#5f626a, #a7abb2); cursor: help; }
  .field-combination__info svg { width: 14px; height: 14px; }
  .field-combination__info:hover { color: light-dark(#42454c, #e5e6e9); }
  .field-combination__info:focus-visible { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 1px; }
  /* How-to lives behind the icon, so the field itself stays minimal. */
  .field-combination__info::after {
    content: attr(data-tip);
    position: absolute;
    right: -6px;
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
  .field-combination__info:hover::after, .field-combination__info:focus-visible::after { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .field-combination__slot b { animation: none; }
    .field-combination__bolt span { transition: none; }
  }
`;

const N = 40;
const STEP = 360 / N;

export function CombinationInput() {
  const dial = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState(0);
  const [code, setCode] = useState<number[]>([]);
  const drag = useRef<number | null>(null);
  const current = ((Math.round(-rot / STEP) % N) + N) % N;
  const open = code.length === 3;
  const dir = code.length % 2 === 0 ? 'right' : 'left';

  const angle = (e: React.PointerEvent) => {
    const r = dial.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180) / Math.PI;
  };
  const enter = () => {
    if (open) {
      setCode([]);
      return;
    }
    setCode((c) => [...c, current]);
    // Settle exactly on the number that was entered.
    setRot(-current * STEP + Math.round(rot / 360) * 360);
  };

  return (
    <>
      <style>
        {css}
      </style>
      <div className="field-combination" data-open={open || undefined}>
        <div className="field-combination__safe">
          <span className="field-combination__marker" aria-hidden="true" />
          <div
            ref={dial}
            className="field-combination__dial"
            role="slider"
            tabIndex={0}
            aria-label={`Dial, turn ${dir}`}
            aria-valuemin={0}
            aria-valuemax={N - 1}
            aria-valuenow={current}
            style={{ transform: `rotate(${rot}deg)` }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = angle(e);
            }}
            onPointerMove={(e) => {
              if (drag.current === null) return;
              const a = angle(e);
              setRot((r) => r + (((a - drag.current! + 540) % 360) - 180));
              drag.current = a;
            }}
            onPointerUp={() => {
              drag.current = null;
              setRot((r) => Math.round(r / STEP) * STEP);
            }}
            onKeyDown={(e) => {
              const k = { ArrowRight: -1, ArrowUp: -1, ArrowLeft: 1, ArrowDown: 1 }[e.key];
              if (k) {
                e.preventDefault();
                setRot((r) => Math.round(r / STEP) * STEP + k * STEP);
              }
              if (e.key === 'Enter') enter();
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="field-combination__n" aria-hidden="true" style={{ transform: `rotate(${i * 45}deg) translateY(-48px)` }}>
                {i * 5}
              </span>
            ))}
            <span className="field-combination__grip" />
          </div>
        </div>
        <div className="field-combination__side">
          <div className="field-combination__top">
            <span className="field-combination__label">Combination</span>
            <button type="button" className="field-combination__info" aria-label="Turn the dial, then Enter" data-tip="Turn the dial, then Enter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 7.5v.01" />
            </svg>
          </button>
          </div>
          <div className="field-combination__slots" aria-live="polite" aria-label={`Entered: ${code.join(', ') || 'none'}`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="field-combination__slot" data-next={i === code.length || undefined}>
                {code[i] !== undefined ? <b key={code[i]}>{code[i]}</b> : i === code.length ? current : ''}
              </span>
            ))}
          </div>
          <button type="button" className="field-combination__set" onClick={enter}>
            {open ? 'Lock again' : `Enter ${current}`}
          </button>
          <span className="field-combination__bolt" aria-hidden="true">
            <span />
          </span>
          <span className="field-combination__hint">{open ? 'Open' : ''}</span>
        </div>
      </div>
    </>
  );
}
