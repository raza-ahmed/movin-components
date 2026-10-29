"use client";

import { useId } from 'react';

// One dry-brush stroke: a fat, slightly wavy band with tapered ends.
const STROKE = 'M4 27C20 8 62 6 106 9S178 6 196 15C201 21 199 34 192 41C152 51 98 46 56 48S12 50 4 40C0 36 0 31 4 27Z';

const css = `
  .btn-brushstroke {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 54px;
    padding: 0;
    border: none;
    background: none;
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 0.01em;
    cursor: pointer;
  }
  .btn-brushstroke:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 4px; border-radius: 10px; }
  .btn-brushstroke__ink {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    clip-path: inset(0 100% 0 0);
    transition: clip-path 0.55s cubic-bezier(0.6, 0, 0.2, 1);
  }
  .btn-brushstroke__ink path { fill: light-dark(#373a40, #f1f2f3); }
  .btn-brushstroke__rule {
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 46px;
    height: 1px;
    margin-left: -23px;
    background: light-dark(#5f626a, #a7abb2);
    transition: opacity 0.3s;
  }
  .btn-brushstroke__label { position: relative; display: inline-flex; align-items: center; gap: 8px; transition: color 0.3s 0.1s; }
  .btn-brushstroke__label svg { width: 15px; height: 15px; transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .btn-brushstroke:is(:hover, :focus-visible) .btn-brushstroke__ink { clip-path: inset(0 0 0 0); }
  .btn-brushstroke:is(:hover, :focus-visible) .btn-brushstroke__rule { opacity: 0; }
  .btn-brushstroke:is(:hover, :focus-visible) .btn-brushstroke__label { color: light-dark(#fbfcfd, #121417); }
  .btn-brushstroke:is(:hover, :focus-visible) .btn-brushstroke__label svg { transform: translateX(3px); }
  .btn-brushstroke:active .btn-brushstroke__ink { transform: scale(0.97); }
  @media (prefers-reduced-motion: reduce) {
    .btn-brushstroke__ink { transition: none; }
  }
`;

export function BrushstrokeButton() {
  const id = `btn-brushstroke-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-brushstroke">
        <svg className="btn-brushstroke__ink" viewBox="0 0 200 54" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            {/* Bristle texture: the stroke's edge is pushed about by fine noise, so it reads as dry brush. */}
            <filter id={id} x="-5%" y="-20%" width="110%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9 0.08" numOctaves="2" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
            </filter>
          </defs>
          <path d={STROKE} filter={`url(#${id})`} />
        </svg>
        <span className="btn-brushstroke__rule" aria-hidden="true" />
        <span className="btn-brushstroke__label">
          Read the story
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </>
  );
}
