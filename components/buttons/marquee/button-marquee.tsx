"use client";

import * as React from "react";
const W = 200;
const H = 60;
const R = 12;
const GAP = 12;
// Bulb centres evenly spaced round the rounded rectangle, so the chase reads as one loop.
function bulbs() {
  const straight = 2 * (W - 2 * R) + 2 * (H - 2 * R);
  const total = straight + 2 * Math.PI * R;
  const n = Math.round(total / GAP);
  const out: { x: number; y: number }[] = [];
  for (let k = 0; k < n; k++) {
    let d = (k / n) * total;
    const seg = (len: number) => {
      const hit = d < len;
      if (!hit) d -= len;
      return hit;
    };
    const arc = (cx: number, cy: number, a0: number) => {
      const a = a0 + d / R;
      return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
    };
    if (seg(W - 2 * R)) out.push({ x: R + d, y: 0 });
    else if (seg((Math.PI / 2) * R)) out.push(arc(W - R, R, -Math.PI / 2));
    else if (seg(H - 2 * R)) out.push({ x: W, y: R + d });
    else if (seg((Math.PI / 2) * R)) out.push(arc(W - R, H - R, 0));
    else if (seg(W - 2 * R)) out.push({ x: W - R - d, y: H });
    else if (seg((Math.PI / 2) * R)) out.push(arc(R, H - R, Math.PI / 2));
    else if (seg(H - 2 * R)) out.push({ x: 0, y: H - R - d });
    else out.push(arc(R, R, Math.PI));
  }
  return out;
}
const BULBS = bulbs();

const css = `
  @keyframes btn-marquee-chase { 0%, 100% { background: light-dark(#cbced3, #393c41); box-shadow: none; } 12% { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 6px 1px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent); } 30% { background: light-dark(#cbced3, #393c41); box-shadow: none; } }
  @keyframes btn-marquee-flash { 0%, 40%, 80% { background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 8px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent); } 20%, 60%, 100% { background: light-dark(#cbced3, #393c41); box-shadow: none; } }
  .btn-marquee {
    position: relative;
    width: ${W}px;
    height: ${H}px;
    padding: 0;
    border: none;
    border-radius: ${R}px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 12px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    cursor: pointer;
  }
  .btn-marquee:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 6px; }
  .btn-marquee__bulb {
    position: absolute;
    width: 5px;
    height: 5px;
    margin: -2.5px;
    border-radius: 50%;
    background: light-dark(#cbced3, #393c41);
    transform: translate(var(--x), var(--y)) scale(0.86);
    left: 0;
    top: 0;
  }
  .btn-marquee__panel { position: absolute; inset: 9px; display: grid; place-items: center; border-radius: 6px; background: light-dark(#fbfcfd, #121417); box-shadow: inset 0 1px 6px light-dark(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.5)); }
  .btn-marquee__small { display: block; font-size: 9px; letter-spacing: 0.3em; margin-right: -0.3em; color: light-dark(#5f626a, #a7abb2); text-transform: uppercase; }
  .btn-marquee__big { display: block; font-size: 15px; font-weight: 600; letter-spacing: 0.14em; margin-right: -0.14em; text-transform: uppercase; }
  .btn-marquee:is(:hover, :focus-visible) .btn-marquee__bulb { animation: btn-marquee-chase 1.2s linear infinite calc(var(--k) * -0.05s); }
  .btn-marquee:active .btn-marquee__bulb { animation: btn-marquee-flash 0.5s steps(1) infinite; }
  @media (prefers-reduced-motion: reduce) {
    .btn-marquee__bulb { animation: none !important; }
    .btn-marquee:is(:hover, :focus-visible) .btn-marquee__bulb { background: light-dark(#42454c, #e5e6e9); }
  }
`;

export function MarqueeButton() {
  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-marquee">
        {BULBS.map((b, k) => (
          <span
            key={k}
            className="btn-marquee__bulb"
            aria-hidden="true"
            style={{ '--x': `${b.x.toFixed(1)}px`, '--y': `${b.y.toFixed(1)}px`, '--k': BULBS.length - k } as React.CSSProperties}
          />
        ))}
        <span className="btn-marquee__panel">
          <span>
            <span className="btn-marquee__small">Now showing</span>
            <span className="btn-marquee__big">Get tickets</span>
          </span>
        </span>
      </button>
    </>
  );
}
