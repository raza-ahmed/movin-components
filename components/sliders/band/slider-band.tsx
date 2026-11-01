"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const P = 8;
const Y = 26;
const HOURS = 24;
const at = (h: number) => 14 + (h / HOURS) * (W - 28);
const clock = (h: number) => `${Math.floor(h)}:${h % 1 ? '30' : '00'}`;

const css = `
  .slider-band { position: relative; width: ${W}px; height: 92px; -webkit-user-select: none; user-select: none; }
  .slider-band__svg { position: absolute; left: 0; top: 0; width: ${W}px; height: 62px; overflow: visible; }
  .slider-band__rubber { fill: none; stroke: light-dark(#50535b, #c6c8cd); stroke-linejoin: round; }
  .slider-band__peg { fill: light-dark(#373a40, #f1f2f3); }
  .slider-band__head { fill: light-dark(#fbfcfd, #121417); }
  .slider-band__tick { stroke: light-dark(#cbced3, #393c41); stroke-width: 1.5; stroke-linecap: round; }
  .slider-band__hour { fill: light-dark(#6d7179, #7d8087); font-size: 10px; text-anchor: middle; }
  .slider-band__ring { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-band:has(.slider-band__input--lo:focus-visible) .slider-band__ring--lo,
  .slider-band:has(.slider-band__input--hi:focus-visible) .slider-band__ring--hi { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-band__value { position: absolute; left: 0; right: 0; top: 70px; display: flex; justify-content: space-between; margin: 0; font-size: 12px; color: light-dark(#5f626a, #a7abb2); font-variant-numeric: tabular-nums; }
  .slider-band__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; }
  .slider-band__input { position: absolute; left: 0; top: ${Y - 18}px; width: 100%; height: 36px; margin: 0; opacity: 0; pointer-events: none; -webkit-appearance: none; appearance: none; background: none; }
  .slider-band__input::-webkit-slider-thumb { -webkit-appearance: none; pointer-events: auto; width: 28px; height: 36px; cursor: grab; }
  .slider-band__input::-moz-range-thumb { pointer-events: auto; width: 28px; height: 36px; border: 0; cursor: grab; }
`;

export function BandSlider() {
  const [lo, setLo] = useState(9);
  const [hi, setHi] = useState(17);
  const [d, setD] = useState(0);
  const tw = useRef({ amp: 0, t: 0, raf: 0, on: false, len: at(17) - at(9) });
  const xl = at(lo);
  const xh = at(hi);
  const len = xh - xl;
  const mid = (xl + xh) / 2;
  const r = P + 2;
  // Stretched rubber thins out.
  const sw = Math.max(1.4, Math.min(6, 300 / len));

  // A pluck: the strands vibrate, higher pitched the tighter the band, and die away.
  const pluck = (a: number) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const q = tw.current;
    q.amp = Math.min(4.5, Math.max(q.amp, a));
    if (q.on) return;
    q.on = true;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.t += dt;
      q.amp *= Math.exp(-4.5 * dt);
      if (q.amp < 0.05) {
        q.on = false;
        q.amp = 0;
        setD(0);
        return;
      }
      setD(q.amp * Math.sin(q.t * Math.PI * 2 * (5 + q.len / 18)));
      q.raf = requestAnimationFrame(step);
    };
    q.raf = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(tw.current.raf), []);
  tw.current.len = len;

  const path =
    `M ${xl} ${Y - r} Q ${mid} ${Y - r - 2 * d} ${xh} ${Y - r} A ${r} ${r} 0 0 1 ${xh} ${Y + r} ` + `Q ${mid} ${Y + r + 2 * d} ${xl} ${Y + r} A ${r} ${r} 0 0 1 ${xl} ${Y - r} Z`;

  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-band" onPointerUp={() => pluck(4)} onKeyUp={() => pluck(2.5)}>
        <svg className="slider-band__svg" aria-hidden="true">
          {[0, 6, 12, 18, 24].map((h) => (
            <g key={h}>
              <line className="slider-band__tick" x1={at(h)} y1={Y + 18} x2={at(h)} y2={Y + 22} />
              <text className="slider-band__hour" x={at(h)} y={Y + 33}>
                {h}
              </text>
            </g>
          ))}
          <path className="slider-band__rubber" d={path} strokeWidth={sw} />
          {[xl, xh].map((x, i) => (
            <g key={i}>
              <circle className="slider-band__peg" cx={x} cy={Y} r={P} />
              <circle className="slider-band__head" cx={x} cy={Y} r={2.6} />
              <circle className={`slider-band__ring slider-band__ring--${i ? 'hi' : 'lo'}`} cx={x} cy={Y} r={P + 5} />
            </g>
          ))}
        </svg>
        <p className="slider-band__value" aria-hidden="true">
          <b>
            {clock(lo)} – {clock(hi)}
          </b>
          <span>{hi - lo} h</span>
        </p>
        <input
          className="slider-band__input slider-band__input--lo"
          type="range"
          min={0}
          max={HOURS}
          step={0.5}
          value={lo}
          style={{ zIndex: lo > HOURS / 2 ? 2 : 1 }}
          onChange={(e) => {
            setLo(Math.min(+e.target.value, hi - 1));
            pluck(0.8);
          }}
          aria-label="Start"
          aria-valuetext={clock(lo)}
        />
        <input
          className="slider-band__input slider-band__input--hi"
          type="range"
          min={0}
          max={HOURS}
          step={0.5}
          value={hi}
          style={{ zIndex: lo > HOURS / 2 ? 1 : 2 }}
          onChange={(e) => {
            setHi(Math.max(+e.target.value, lo + 1));
            pluck(0.8);
          }}
          aria-label="End"
          aria-valuetext={clock(hi)}
        />
      </div>
    </>
  );
}
