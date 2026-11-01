"use client";

import { useEffect, useId, useRef, useState } from 'react';

const W = 240;
const COLS = 34;
const ROWS = 6;
const PITCH = 7;
const TOP = 8;
const BAND = ROWS * PITCH;
const LEFT = (W - (COLS - 1) * PITCH - PITCH / 2) / 2;

const css = `
  .slider-halftone { position: relative; width: ${W}px; height: ${BAND + TOP * 2}px; }
  .slider-halftone__svg { display: block; width: ${W}px; height: ${BAND + TOP * 2}px; overflow: visible; }
  .slider-halftone__ink { fill: light-dark(#42454c, #e5e6e9); }
  .slider-halftone__paper { fill: light-dark(#cbced3, #393c41); }
  .slider-halftone__thumb {
    fill: light-dark(#373a40, #f1f2f3);
    filter: drop-shadow(0 2px 4px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.55)));
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-halftone:has(.slider-halftone__input:active) .slider-halftone__thumb { transform: scale(1.25, 1.06); }
  .slider-halftone__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-halftone:has(.slider-halftone__input:focus-visible) .slider-halftone__ring { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-halftone__input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-halftone__input::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 58px; }
  .slider-halftone__input::-moz-range-thumb { width: 12px; height: 58px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-halftone__thumb { transition: none; }
  }
`;

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

/** Follows the value on a soft spring, so a click far along the track washes the ink across. */
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

export function HalftoneSlider() {
  const [v, setV] = useState(55);
  const shown = useSpring(v);
  const clip = `slider-halftone-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const t = 6 + (shown / 100) * (W - 12);
  const dots = [];
  for (let j = 0; j < ROWS; j++) {
    // One extra column each side, cut by the clip, so the offset rows still reach the ends.
    for (let i = -1; i <= COLS; i++) {
      const x = LEFT + i * PITCH + (j % 2) * (PITCH / 2);
      const behind = t - x;
      // Far behind the thumb the dots overlap into solid ink; at the edge they are fine points.
      const r = behind > 0 ? 1.2 + 3.5 * smooth(behind / 72) : 1.1;
      dots.push(<circle key={`${i}-${j}`} className={behind > 0 ? 'slider-halftone__ink' : 'slider-halftone__paper'} cx={x} cy={TOP + PITCH / 2 + j * PITCH} r={r} />);
    }
  }
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-halftone">
        <svg className="slider-halftone__svg" aria-hidden="true">
          <defs>
            <clipPath id={clip}>
              <rect x={0} y={TOP} width={W} height={BAND} rx={9} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>{dots}</g>
          <rect className="slider-halftone__thumb" x={t - 3} y={TOP - 6} width={6} height={BAND + 12} rx={3} />
          <rect className="slider-halftone__ring" x={t - 7} y={TOP - 10} width={14} height={BAND + 20} rx={7} />
        </svg>
        <input
          className="slider-halftone__input"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="Ink coverage"
          aria-valuetext={`${v}%`}
        />
      </div>
    </>
  );
}
