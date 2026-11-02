"use client";

import { useEffect, useId, useRef, useState } from 'react';

// Spring stiffness and damping per surface (per unit mass), and how widely the dip spreads.
const OPTIONS = [
  { value: 'soft', label: 'Soft', k: 260, c: 9, spread: 2.2, note: 'Sinks in deep and settles slowly' },
  { value: 'medium', label: 'Medium', k: 900, c: 14, spread: 1.6, note: 'Gives a little, then holds' },
  { value: 'firm', label: 'Firm', k: 4000, c: 22, spread: 1.2, note: 'Barely gives, and bounces' },
];
const G = 1400;
const S = 80;
const R = 11;
const DROP = 64;

// The mattress top, dipped under the ball, and where the ball sits for a height h above the surface.
function shape(h: number, spread: number) {
  const d = Math.max(0, -h);
  const w = 16 + d * spread;
  return {
    bed: `M20 ${S}L${(110 - w).toFixed(1)} ${S}Q110 ${(S + 2 * d).toFixed(1)} ${(110 + w).toFixed(1)} ${S}L200 ${S}V104Q200 108 196 108H24Q20 108 20 104Z`,
    cy: (S - h - R).toFixed(1),
    shadow: Math.max(0, 1 - h / 70),
  };
}
const REST = shape(-G / OPTIONS[1].k, OPTIONS[1].spread);

const css = `
  .radio-firmness { display: grid; justify-items: center; gap: 14px; width: 260px; }
  .radio-firmness__stage { display: block; width: 220px; height: 112px; overflow: visible; }
  .radio-firmness__bed { fill: light-dark(#dbdde1, #2e3035); }
  .radio-firmness__seam { stroke: light-dark(#ebedf0, #232529); stroke-width: 1.5; stroke-dasharray: 3 3; }
  .radio-firmness__ball { fill: light-dark(#42454c, #e5e6e9); }
  .radio-firmness__shadow { fill: light-dark(#fbfcfd, #121417); }
  .radio-firmness__read { display: grid; color: light-dark(#50535b, #c6c8cd); font-size: 12px; }
  .radio-firmness__read > * { grid-area: 1 / 1; text-align: center; opacity: 0; transform: translateY(4px); transition: opacity 0.25s, transform 0.3s; }
  .radio-firmness:has(.radio-firmness__opt:nth-child(1) input:checked) .radio-firmness__read > :nth-child(1),
  .radio-firmness:has(.radio-firmness__opt:nth-child(2) input:checked) .radio-firmness__read > :nth-child(2),
  .radio-firmness:has(.radio-firmness__opt:nth-child(3) input:checked) .radio-firmness__read > :nth-child(3) { opacity: 1; transform: none; }
  .radio-firmness__opts { display: flex; gap: 3px; padding: 4px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-firmness__opt { position: relative; flex: 1; padding: 7px 12px; border-radius: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; text-align: center; white-space: nowrap; cursor: pointer; transition: background-color 0.25s, color 0.25s; }
  .radio-firmness__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-firmness__opt:has(input:checked) { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .radio-firmness__opt:has(input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .radio-firmness__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) {
    .radio-firmness__read > * { transition: none; }
  }
`;

export function FirmnessRadio() {
  const name = useId();
  const [pick, setPick] = useState(1);
  const bed = useRef<SVGPathElement>(null);
  const ball = useRef<SVGCircleElement>(null);
  const shadow = useRef<SVGEllipseElement>(null);
  const first = useRef(true);

  // Each pick drops the ball onto the new surface. In the air only gravity acts; once it presses
  // in, the surface pushes back like a damped spring, so a soft one swallows the ball and a firm
  // one throws it back up.
  useEffect(() => {
    const o = OPTIONS[pick];
    const draw = (h: number) => {
      const s = shape(h, o.spread);
      bed.current!.setAttribute('d', s.bed);
      ball.current!.setAttribute('cy', s.cy);
      shadow.current!.style.opacity = String(s.shadow * 0.5);
    };
    const rest = -G / o.k;
    if (first.current || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      first.current = false;
      return draw(rest);
    }
    let h = DROP;
    let v = 0;
    let raf = 0;
    let last = performance.now();
    const t0 = last;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (let k = 0; k < 8; k++) {
        const a = -G + (h < 0 ? -o.k * h - o.c * v : 0);
        v += a * (dt / 8);
        h += v * (dt / 8);
      }
      if (now - t0 > 400 && Math.abs(v) < 3 && Math.abs(h - rest) < 0.15) return draw(rest);
      draw(h);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [pick]);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-firmness">
        <svg className="radio-firmness__stage" viewBox="0 0 220 112" aria-hidden="true">
          <path className="radio-firmness__bed" ref={bed} d={REST.bed} />
          {[56, 83, 137, 164].map((x) => (
            <line key={x} className="radio-firmness__seam" x1={x} y1={S + 7} x2={x} y2={104} />
          ))}
          <ellipse className="radio-firmness__shadow" ref={shadow} cx={110} cy={S - 1} rx={12} ry={2.5} style={{ opacity: REST.shadow * 0.5 }} />
          <circle className="radio-firmness__ball" ref={ball} cx={110} cy={REST.cy} r={R} />
        </svg>
        <span className="radio-firmness__read" aria-hidden="true">
          {OPTIONS.map((o) => (
            <span key={o.value}>{o.note}</span>
          ))}
        </span>
        <div className="radio-firmness__opts" role="radiogroup" aria-label="Mattress">
          {OPTIONS.map((o, i) => (
            <label key={o.value} className="radio-firmness__opt">
              <input className="radio-firmness__input" type="radio" name={name} value={o.value} checked={pick === i} onChange={() => setPick(i)} />
              {o.label}
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
