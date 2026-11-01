"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const VALUE_W = 34;
const CLOSED = 14 + 20 + 10 + 10 + VALUE_W + 14;
const TL = 14 + 20 + 10;
const TR = W - 14 - VALUE_W - 10;
const T = 16;

const css = `
  .slider-pill { position: relative; width: ${W}px; height: 48px; }
  .slider-pill__body {
    position: absolute;
    top: 2px;
    left: 50%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    width: ${CLOSED}px;
    height: 44px;
    padding: 0 14px;
    border-radius: 22px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#373a40, #f1f2f3);
    transform: translateX(-50%);
    transition: width 0.38s cubic-bezier(0.3, 1.25, 0.5, 1);
  }
  .slider-pill--open .slider-pill__body { width: ${W}px; }
  .slider-pill__icon { flex: none; width: 20px; height: 20px; }
  .slider-pill__track { position: relative; flex: 1; min-width: 0; height: 4px; border-radius: 2px; background: light-dark(#cbced3, #393c41); opacity: 0; transition: opacity 0.15s; }
  .slider-pill--open .slider-pill__track { opacity: 1; transition-delay: 0.08s; }
  .slider-pill__fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: inherit; background: light-dark(#373a40, #f1f2f3); }
  .slider-pill__thumb {
    position: absolute;
    top: 50%;
    width: ${T}px;
    height: ${T}px;
    margin: ${-T / 2}px 0 0 ${-T / 2}px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 1px 4px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.5));
    transform: scale(0);
    transition: transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-pill--open .slider-pill__thumb { transform: scale(1); transition-delay: 0.1s; }
  .slider-pill__value { flex: none; width: ${VALUE_W}px; text-align: right; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
  .slider-pill:has(.slider-pill__input:focus-visible) .slider-pill__body { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .slider-pill__input { position: absolute; left: ${TL - T / 2}px; top: 2px; width: ${TR - TL + T}px; height: 44px; margin: 0; opacity: 0; cursor: pointer; pointer-events: none; -webkit-appearance: none; appearance: none; background: none; }
  .slider-pill--open .slider-pill__input { pointer-events: auto; }
  .slider-pill__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${T}px; height: 44px; }
  .slider-pill__input::-moz-range-thumb { width: ${T}px; height: 44px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-pill__body, .slider-pill__thumb { transition: none; }
  }
`;

export function PillSlider() {
  const [v, setV] = useState(60);
  const [hover, setHover] = useState(false);
  const [keys, setKeys] = useState(false);
  const [drag, setDrag] = useState(false);
  const [tap, setTap] = useState(false);
  const timer = useRef(0);
  const open = hover || keys || drag || tap;

  // On touch there is no hover: a tap opens it, and it folds away after a moment of no use.
  const stay = () => {
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTap(false), 2500);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <style>
        {css}
      </style>
      <div
        className={`slider-pill${open ? ' slider-pill--open' : ''}`}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(false)}
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse') return;
          setTap(true);
          stay();
        }}
      >
        <div className="slider-pill__body" aria-hidden="true">
          <svg className="slider-pill__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
            <path className="slider-pill__wave" d="M15.5 9.5a3.5 3.5 0 0 1 0 5" opacity={v > 0 ? 1 : 0.25} />
            <path className="slider-pill__wave" d="M18 7a7 7 0 0 1 0 10" opacity={v > 50 ? 1 : 0.25} />
          </svg>
          <span className="slider-pill__track">
            <span className="slider-pill__fill" style={{ width: `${v}%` }} />
            <span className="slider-pill__thumb" style={{ left: `${v}%` }} />
          </span>
          <b className="slider-pill__value">{v}%</b>
        </div>
        <input
          className="slider-pill__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onFocus={(e) => setKeys(e.currentTarget.matches(':focus-visible'))}
          onBlur={() => setKeys(false)}
          onPointerDown={() => setDrag(true)}
          onPointerUp={() => {
            setDrag(false);
            if (tap) stay();
          }}
          onPointerCancel={() => setDrag(false)}
          onChange={(e) => {
            setV(+e.target.value);
            if (tap) stay();
          }}
          aria-label="Volume"
          aria-valuetext={`${v}%`}
        />
      </div>
    </>
  );
}
