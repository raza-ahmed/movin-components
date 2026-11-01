"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const LINE = 40;
const R = 17;
const HUB = 6;
const START = R + 2;
const END = W - R - 2;
// Thread left on the spool shrinks it by area, so it empties slowly at first and quickly at the end.
const wound = (f: number) => Math.sqrt(HUB * HUB + 6 + (1 - f) * (R * R - HUB * HUB - 12));

const css = `
  .slider-spool { position: relative; width: ${W}px; height: 64px; }
  .slider-spool__svg { display: block; width: ${W}px; height: 48px; overflow: visible; }
  .slider-spool__guide { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1.5; stroke-dasharray: 1 5; stroke-linecap: round; }
  .slider-spool__thread { stroke: light-dark(#42454c, #e5e6e9); stroke-width: 2; stroke-linecap: round; fill: none; }
  .slider-spool__flange { fill: color-mix(in oklab, light-dark(#f3f4f7, #1a1c1f) 70%, transparent); stroke: light-dark(#cbced3, #393c41); stroke-width: 1; }
  .slider-spool__wound { fill: light-dark(#50535b, #c6c8cd); }
  .slider-spool__turns { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 0.8; stroke-dasharray: 9 2.5; }
  .slider-spool__hub { fill: light-dark(#f3f4f7, #1a1c1f); stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; }
  .slider-spool__hole { fill: light-dark(#cbced3, #393c41); }
  .slider-spool__body { transform-box: fill-box; transform-origin: center; transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1); }
  .slider-spool:has(.slider-spool__input:active) .slider-spool__body { transform: translateY(-2px); }
  .slider-spool__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-spool:has(.slider-spool__input:focus-visible) .slider-spool__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-spool__value { position: absolute; right: 0; top: 48px; font-size: 12px; color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; }
  .slider-spool__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; }
  .slider-spool__input { position: absolute; left: 0; top: 0; width: 100%; height: 48px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-spool__input::-webkit-slider-thumb { -webkit-appearance: none; width: ${2 * R + 4}px; height: 48px; }
  .slider-spool__input::-moz-range-thumb { width: ${2 * R + 4}px; height: 48px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-spool__body { transition: none; }
  }
`;

/** Rolls the spool to the value rather than jumping, so a click far along unwinds the thread on the way. */
function useSpring(target: number) {
  const [x, setX] = useState(target);
  const s = useRef({ x: target, v: 0, raf: 0 });
  useEffect(() => {
    const st = s.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      st.x = target;
      setX(target);
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      st.v += (-200 * (st.x - target) - 26 * st.v) * dt;
      st.x += st.v * dt;
      if (Math.abs(st.x - target) < 0.02 && Math.abs(st.v) < 0.05) {
        st.x = target;
        st.v = 0;
        setX(target);
        return;
      }
      setX(st.x);
      st.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(st.raf);
    st.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(st.raf);
  }, [target]);
  return x;
}

export function SpoolSlider() {
  const [v, setV] = useState(40);
  const cx = useSpring(START + (v / 100) * (END - START));
  const f = (cx - START) / (END - START);
  const r = wound(f);
  const cy = LINE - R;
  // It rolls on its flanges, so it turns by the distance travelled over the flange radius.
  const turn = ((cx - START) / R) * (180 / Math.PI);
  // The thread leaves the underside of what is still wound and runs back down to the line.
  const tx = cx - r * 0.35;
  const ty = cy + r * 0.94;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-spool">
        <svg className="slider-spool__svg" aria-hidden="true">
          <line className="slider-spool__guide" x1={cx + R + 4} x2={W - 1} y1={LINE} y2={LINE} />
          <path className="slider-spool__thread" d={`M1 ${LINE}H${Math.max(1, cx - R * 0.9)}Q${cx - r * 0.6} ${LINE} ${tx} ${ty}`} />
          <g className="slider-spool__body">
            <circle className="slider-spool__flange" cx={cx} cy={cy} r={R} />
            <circle className="slider-spool__wound" cx={cx} cy={cy} r={r} />
            <g transform={`rotate(${turn} ${cx} ${cy})`}>
              {[0.3, 0.55, 0.8].map((k) => (
                <circle key={k} className="slider-spool__turns" cx={cx} cy={cy} r={HUB + (r - HUB) * k} />
              ))}
              <circle className="slider-spool__hub" cx={cx} cy={cy} r={HUB} />
              {[0, 120, 240].map((a) => (
                <circle key={a} className="slider-spool__hole" cx={cx + Math.cos((a * Math.PI) / 180) * HUB * 0.5} cy={cy + Math.sin((a * Math.PI) / 180) * HUB * 0.5} r={1.2} />
              ))}
            </g>
          </g>
          <circle className="slider-spool__ring" cx={cx} cy={cy} r={R + 4} />
        </svg>
        <p className="slider-spool__value" aria-hidden="true">
          <b>{v}</b> m
        </p>
        <input
          className="slider-spool__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Length"
          aria-valuetext={`${v} metres`}
        />
      </div>
    </>
  );
}
