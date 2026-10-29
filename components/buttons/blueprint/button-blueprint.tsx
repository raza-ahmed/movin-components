"use client";

import { useEffect, useRef, useState } from 'react';

const css = `
  .btn-blueprint {
    display: inline-block;
    padding: 40px 64px 16px 16px;
  }
  .btn-blueprint__box { position: relative; }
  .btn-blueprint__btn {
    position: relative;
    display: block;
    padding: 0.8rem 1.9rem;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 10px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.3s ease, background-color 0.3s ease, border-radius 0.3s ease;
  }
  .btn-blueprint__btn:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-blueprint:hover .btn-blueprint__btn,
  .btn-blueprint:focus-within .btn-blueprint__btn {
    border-style: dashed;
    border-color: light-dark(#50535b, #c6c8cd);
    background:
      linear-gradient(color-mix(in oklab, light-dark(#373a40, #f1f2f3) 9%, transparent) 1px, transparent 1px) 0 0 / 8px 8px,
      linear-gradient(90deg, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 9%, transparent) 1px, transparent 1px) 0 0 / 8px 8px,
      light-dark(#fbfcfd, #121417);
  }
  .btn-blueprint__part {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
  }
  .btn-blueprint__guide--l, .btn-blueprint__guide--r {
    top: -30px; height: 30px; width: 0;
    border-left: 1px dashed light-dark(#6d7179, #7d8087);
    transform: scaleY(0); transform-origin: bottom;
  }
  .btn-blueprint__guide--l { left: 0; }
  .btn-blueprint__guide--r { right: 0; }
  .btn-blueprint__guide--t, .btn-blueprint__guide--b {
    right: -34px; width: 34px; height: 0;
    border-top: 1px dashed light-dark(#6d7179, #7d8087);
    transform: scaleX(0); transform-origin: left;
  }
  .btn-blueprint__guide--t { top: 0; }
  .btn-blueprint__guide--b { bottom: 0; }
  .btn-blueprint__dim {
    background: light-dark(#50535b, #c6c8cd);
    transition-delay: 0.12s;
  }
  .btn-blueprint__dim--w { top: -22px; left: 0; right: 0; height: 1px; transform: scaleX(0); }
  .btn-blueprint__dim--h { right: -26px; top: 0; bottom: 0; width: 1px; transform: scaleY(0); }
  .btn-blueprint__dim::before, .btn-blueprint__dim::after {
    content: '';
    position: absolute;
    border: 4px solid transparent;
  }
  .btn-blueprint__dim--w::before { left: 0; top: -4px; border-right-color: light-dark(#50535b, #c6c8cd); border-left-width: 0; }
  .btn-blueprint__dim--w::after { right: 0; top: -4px; border-left-color: light-dark(#50535b, #c6c8cd); border-right-width: 0; }
  .btn-blueprint__dim--h::before { top: 0; left: -4px; border-bottom-color: light-dark(#50535b, #c6c8cd); border-top-width: 0; }
  .btn-blueprint__dim--h::after { bottom: 0; left: -4px; border-top-color: light-dark(#50535b, #c6c8cd); border-bottom-width: 0; }
  .btn-blueprint__label {
    padding: 0 4px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#42454c, #e5e6e9);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 10px;
    line-height: 14px;
    letter-spacing: 0.04em;
    transform: translateY(4px);
    transition-delay: 0.3s;
  }
  .btn-blueprint__label--w { top: -30px; left: 50%; translate: -50% 0; }
  .btn-blueprint__label--h { right: -60px; top: 50%; translate: 0 -50%; }
  .btn-blueprint:hover .btn-blueprint__part,
  .btn-blueprint:focus-within .btn-blueprint__part { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    .btn-blueprint__part { transition: opacity 0.2s ease; transform: none; }
  }
`;

export function BlueprintButton() {
  const btn = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // The readout is the button's REAL size, so it stays true to whatever the label is.
  useEffect(() => {
    const el = btn.current!;
    const ro = new ResizeObserver(() => setSize({ w: Math.round(el.offsetWidth), h: Math.round(el.offsetHeight) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="btn-blueprint">
        <div className="btn-blueprint__box">
          <button ref={btn} type="button" className="btn-blueprint__btn">
            View specs
          </button>
          <span className="btn-blueprint__part btn-blueprint__guide--l" aria-hidden="true" />
          <span className="btn-blueprint__part btn-blueprint__guide--r" aria-hidden="true" />
          <span className="btn-blueprint__part btn-blueprint__guide--t" aria-hidden="true" />
          <span className="btn-blueprint__part btn-blueprint__guide--b" aria-hidden="true" />
          <span className="btn-blueprint__part btn-blueprint__dim btn-blueprint__dim--w" aria-hidden="true" />
          <span className="btn-blueprint__part btn-blueprint__dim btn-blueprint__dim--h" aria-hidden="true" />
          <span className="btn-blueprint__part btn-blueprint__label btn-blueprint__label--w" aria-hidden="true">
            {size.w}
          </span>
          <span className="btn-blueprint__part btn-blueprint__label btn-blueprint__label--h" aria-hidden="true">
            {size.h}
          </span>
        </div>
      </div>
    </>
  );
}
