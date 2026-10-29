"use client";

import { useRef } from 'react';

const css = `
  .card-x-ray {
    --x: -100px;
    --y: -100px;
    position: relative;
    width: 210px;
    height: 176px;
    cursor: none;
  }
  .card-x-ray__face {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-rows: 74px auto auto 1fr;
    gap: 6px;
    padding: 12px;
    border-radius: 16px;
  }
  .card-x-ray__face--done { background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-x-ray__img { border-radius: 10px; background: linear-gradient(135deg, light-dark(#5f626a, #a7abb2), light-dark(#dbdde1, #2e3035)); }
  .card-x-ray__title { color: light-dark(#373a40, #f1f2f3); font-size: 13px; font-weight: 600; }
  .card-x-ray__body { color: light-dark(#5f626a, #a7abb2); font-size: 11px; }
  .card-x-ray__btn { justify-self: start; align-self: end; padding: 5px 12px; border-radius: 999px; background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); font-size: 11px; font-weight: 600; }
  /* The same layout as a wireframe, shown only inside the lens. */
  .card-x-ray__face--wire {
    background: light-dark(#fbfcfd, #121417);
    background-image: linear-gradient(light-dark(#ebedf0, #232529) 1px, transparent 1px), linear-gradient(90deg, light-dark(#ebedf0, #232529) 1px, transparent 1px);
    background-size: 12px 12px;
    box-shadow: inset 0 0 0 1px light-dark(#6d7179, #7d8087);
    clip-path: circle(0 at var(--x) var(--y));
    transition: clip-path 0.25s ease;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 9px;
    color: light-dark(#50535b, #c6c8cd);
  }
  .card-x-ray:hover .card-x-ray__face--wire { clip-path: circle(46px at var(--x) var(--y)); transition: none; }
  .card-x-ray__face--wire > * {
    display: grid;
    place-items: center;
    border: 1px dashed light-dark(#5f626a, #a7abb2);
    border-radius: 6px;
    background: none;
    color: light-dark(#50535b, #c6c8cd);
    font-weight: 400;
  }
  .card-x-ray__face--wire .card-x-ray__title, .card-x-ray__face--wire .card-x-ray__body { place-items: center start; padding: 1px 6px; }
  .card-x-ray__lens {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: 92px;
    height: 92px;
    margin: -46px;
    border-radius: 50%;
    box-shadow: 0 0 0 1.5px light-dark(#42454c, #e5e6e9), 0 0 0 5px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 10%, transparent);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
  .card-x-ray:hover .card-x-ray__lens { opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    .card-x-ray__face--wire, .card-x-ray__lens { transition: none; }
  }
`;

export function XRayCard() {
  const root = useRef<HTMLDivElement>(null);
  return (
    <>
      <style>
        {css}
      </style>
      <div
        ref={root}
        className="card-x-ray"
        role="group"
        aria-label="Field notes"
        onPointerMove={(e) => {
          const r = root.current!.getBoundingClientRect();
          root.current!.style.setProperty('--x', `${e.clientX - r.left}px`);
          root.current!.style.setProperty('--y', `${e.clientY - r.top}px`);
        }}
      >
        <div className="card-x-ray__face card-x-ray__face--done">
          <span className="card-x-ray__img" aria-hidden="true" />
          <span className="card-x-ray__title">Field notes</span>
          <span className="card-x-ray__body">Sketches from the ridge walk</span>
          <span className="card-x-ray__btn">Read</span>
        </div>
        <div className="card-x-ray__face card-x-ray__face--wire" aria-hidden="true">
          <span className="card-x-ray__img">img 186 × 74</span>
          <span className="card-x-ray__title">h3 · 13/600</span>
          <span className="card-x-ray__body">p · 11/400</span>
          <span className="card-x-ray__btn">button</span>
        </div>
        <span className="card-x-ray__lens" aria-hidden="true" />
      </div>
    </>
  );
}
