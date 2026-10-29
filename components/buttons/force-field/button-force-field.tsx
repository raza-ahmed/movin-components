"use client";

import * as React from "react";
import { useId, useRef, useState } from 'react';

const css = `
  @property --btn-force-field-r { syntax: '<length>'; inherits: false; initial-value: 0px; }
  @keyframes btn-force-field-ripple {
    from { --btn-force-field-r: 0px; opacity: 1; }
    to { --btn-force-field-r: 240px; opacity: 0; }
  }
  .btn-force-field {
    position: relative;
    display: grid;
    place-items: center;
    width: 280px;
    height: 150px;
  }
  .btn-force-field__field, .btn-force-field__ripple {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
  .btn-force-field__field {
    opacity: 0;
    mask-image: radial-gradient(ellipse closest-side, #000 35%, transparent);
    transition: opacity 0.4s ease;
  }
  .btn-force-field__field path { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; }
  .btn-force-field__ripple path { fill: color-mix(in oklab, light-dark(#373a40, #f1f2f3) 8%, transparent); stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.2; }
  .btn-force-field__ripple {
    opacity: 0;
    mask-image: radial-gradient(circle at var(--x) var(--y), transparent calc(var(--btn-force-field-r) - 30px), #000 calc(var(--btn-force-field-r) - 8px), transparent var(--btn-force-field-r));
  }
  .btn-force-field__ripple { animation: btn-force-field-ripple 0.9s cubic-bezier(0.22, 1, 0.36, 1); }
  .btn-force-field:hover .btn-force-field__field,
  .btn-force-field:focus-within .btn-force-field__field { opacity: 1; }
  .btn-force-field__btn {
    position: relative;
    padding: 0.8rem 1.9rem;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 12px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  .btn-force-field:hover .btn-force-field__btn { border-color: light-dark(#5f626a, #a7abb2); box-shadow: 0 0 20px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 14%, transparent); }
  .btn-force-field__btn:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .btn-force-field__ripple { animation: none; }
  }
`;

// One honeycomb tile: a pointy-top hexagon plus the stem down to the next row's,
// which together tile the plane with the offset rows filled in.
const HEX = 'M10.39 0L20.78 6V18L10.39 24L0 18V6Z M10.39 24V36';

function Honeycomb({ id, className, style }: { id: string; className: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <defs>
        <pattern id={id} width="20.78" height="36" patternUnits="userSpaceOnUse" x="-0.5" y="3">
          <path d={HEX} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function ForceFieldButton() {
  const uid = useId().replace(/:/g, '');
  const root = useRef<HTMLDivElement>(null);
  const [hit, setHit] = useState<{ x: number; y: number; n: number } | null>(null);

  return (
    <>
      <style>
        {css}
      </style>
      <div ref={root} className="btn-force-field">
        <Honeycomb id={`${uid}-f`} className="btn-force-field__field" />
        {hit && (
          <Honeycomb
            key={hit.n}
            id={`${uid}-r${hit.n}`}
            className="btn-force-field__ripple"
            style={{ '--x': `${hit.x}px`, '--y': `${hit.y}px` } as React.CSSProperties}
          />
        )}
        <button
          type="button"
          className="btn-force-field__btn"
          onClick={(e) => {
            const r = root.current!.getBoundingClientRect();
            // Keyboard clicks have no pointer position: ripple from the button's centre.
            const x = e.detail ? e.clientX - r.left : r.width / 2;
            const y = e.detail ? e.clientY - r.top : r.height / 2;
            setHit((h) => ({ x, y, n: (h?.n ?? 0) + 1 }));
          }}
        >
          Raise shield
        </button>
      </div>
    </>
  );
}
