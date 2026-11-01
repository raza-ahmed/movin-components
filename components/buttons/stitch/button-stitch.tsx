"use client";

import { useId } from 'react';

const BW = 176;
const BH = 48;
// The stitch line: the button's outline inset by 5px, starting top left and running clockwise.
const PATH = `M 24 5 H ${BW - 24} A 19 19 0 0 1 ${BW - 24} ${BH - 5} H 24 A 19 19 0 0 1 24 5 Z`;

const css = `
  .btn-stitch {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: ${BW}px;
    height: ${BH}px;
    padding: 0;
    border: none;
    border-radius: ${BH / 2}px;
    background: light-dark(#ebedf0, #232529);
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s;
  }
  .btn-stitch:active { transform: scale(0.97); }
  .btn-stitch:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .btn-stitch__svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  .btn-stitch__holes { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-opacity: 0.55; stroke-width: 1.4; stroke-linecap: round; stroke-dasharray: 0.01 2.8; }
  .btn-stitch__thread { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.8; stroke-linecap: round; stroke-dasharray: 1.5 1.3; }
  /* The mask path draws on behind the needle, revealing the stitches; leaving runs it back. */
  .btn-stitch__sew { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 6; stroke-dasharray: 100 100; stroke-dashoffset: 100; transition: stroke-dashoffset 0.5s cubic-bezier(0.5, 0, 0.5, 1); }
  .btn-stitch:is(:hover, :focus-visible) .btn-stitch__sew { stroke-dashoffset: 0; transition: stroke-dashoffset 1.1s linear; }
  .btn-stitch__needle {
    position: absolute;
    left: 0;
    top: 0;
    width: 17px;
    height: 2px;
    background: light-dark(#373a40, #f1f2f3);
    clip-path: polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%);
    offset-path: path('${PATH}');
    offset-rotate: auto;
    opacity: 0;
  }
  .btn-stitch:is(:hover, :focus-visible) .btn-stitch__needle { animation: btn-stitch-run 1.1s linear both; }
  @keyframes btn-stitch-run {
    0% { offset-distance: 0%; opacity: 1; }
    90% { opacity: 1; }
    100% { offset-distance: 100%; opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-stitch__sew, .btn-stitch:is(:hover, :focus-visible) .btn-stitch__sew { transition: none; }
    .btn-stitch:is(:hover, :focus-visible) .btn-stitch__needle { animation: none; }
  }
`;

export function StitchButton() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-stitch">
        <svg className="btn-stitch__svg" viewBox={`0 0 ${BW} ${BH}`} aria-hidden="true">
          <defs>
            <mask id={`${id}m`} style={{ maskType: 'alpha' }}>
              <path className="btn-stitch__sew" d={PATH} pathLength={100} />
            </mask>
          </defs>
          <path className="btn-stitch__holes" d={PATH} pathLength={100} />
          <path className="btn-stitch__thread" d={PATH} pathLength={100} mask={`url(#${id}m)`} />
        </svg>
        <span className="btn-stitch__needle" aria-hidden="true" />
        Customize
      </button>
    </>
  );
}
