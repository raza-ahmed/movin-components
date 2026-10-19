"use client";

import type { CSSProperties } from 'react';

const css = `
  .cb-stitch {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #ededed;
    font-size: 15px;
    cursor: pointer;
    user-select: none;
  }

  .cb-stitch__input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }

  /* Fabric: a fine weave and a stitched border inset from the edge. */
  .cb-stitch__patch {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 7px;
    background: repeating-linear-gradient(45deg, rgba(246, 246, 246, 0.04) 0 1px, transparent 1px 3px), repeating-linear-gradient(-45deg, rgba(246, 246, 246, 0.04) 0 1px, transparent 1px 3px), #282828;
    box-shadow: inset 0 0 0 1px #3a3a3a;
    transition: background-color 0.3s;
  }

  .cb-stitch__patch::before {
    content: '';
    position: absolute;
    inset: 3px;
    border: 1px dashed #4d4d4d;
    border-radius: 5px;
    transition: border-color 0.3s;
  }

  .cb-stitch__input:focus-visible + .cb-stitch__patch {
    outline: 2px solid #a7a7a7;
    outline-offset: 2px;
  }

  .cb-stitch__patch svg {
    position: absolute;
    inset: 0;
    width: 32px;
    height: 32px;
  }

  .cb-stitch__st {
    stroke: #ededed;
    stroke-width: 2.2;
    stroke-linecap: round;
    opacity: 0;
    transition: opacity 0.08s;
  }

  /* The needle rides the tick's own path; its tip leads. */
  .cb-stitch__needle {
    position: absolute;
    top: 0;
    left: 0;
    width: 11px;
    height: 2px;
    border-radius: 1px;
    background: linear-gradient(90deg, #7c7c7c, #f6f6f6);
    offset-path: path('M8 16.5L13.5 22L24 10');
    offset-anchor: 100% 50%;
    offset-rotate: auto;
    opacity: 0;
  }

  .cb-stitch__input:checked + .cb-stitch__patch::before {
    border-color: #7c7c7c;
  }

  /* Each stitch appears as the needle passes it. */
  .cb-stitch__input:checked + .cb-stitch__patch .cb-stitch__st {
    opacity: 1;
    transition: opacity 0.08s calc(0.08s + var(--cb-stitch-i) * 0.09s);
  }

  .cb-stitch__input:checked + .cb-stitch__patch .cb-stitch__needle {
    animation: cb-stitch-sew 0.6s linear;
  }

  @keyframes cb-stitch-sew {
    0% {
      offset-distance: 0%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    85% {
      offset-distance: 100%;
      opacity: 1;
    }
    100% {
      offset-distance: 100%;
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cb-stitch__st,
    .cb-stitch__input:checked + .cb-stitch__patch .cb-stitch__st {
      transition: none;
    }
    .cb-stitch__input:checked + .cb-stitch__patch .cb-stitch__needle {
      animation: none;
    }
  }
`;

// One short line per stitch along the tick; each waits for the needle to pass.
const STITCHES = [
  [8.3, 16.8, 10.1, 18.6],
  [11.3, 19.8, 13.1, 21.6],
  [14.2, 21.2, 15.9, 19.3],
  [16.9, 18.1, 18.7, 16.1],
  [19.7, 14.9, 21.4, 13.0],
];

export function StitchCheckbox() {
  return (
    <>
      <style>{css}</style>
      <label className="cb-stitch">
        <input className="cb-stitch__input" type="checkbox" />
        <span className="cb-stitch__patch" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            {STITCHES.map(([x1, y1, x2, y2], i) => (
              <line key={i} className="cb-stitch__st" style={{ '--cb-stitch-i': i } as CSSProperties} x1={x1} y1={y1} x2={x2} y2={y2} />
            ))}
          </svg>
          <span className="cb-stitch__needle" />
        </span>
        <span className="cb-stitch__label">Sewn in</span>
      </label>
    </>
  );
}
