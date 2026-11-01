"use client";

import { useEffect, useRef, useState } from 'react';

const W = 240;
const MID = 22;
const N = 5;
const BOUND = 1.75;
const LOOSE = 3.9;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const css = `
  .slider-strand { position: relative; width: ${W}px; height: 62px; }
  .slider-strand__svg { display: block; width: ${W}px; height: 44px; overflow: visible; }
  .slider-strand__bound { fill: none; stroke: light-dark(#42454c, #e5e6e9); stroke-width: 1.1; stroke-linecap: round; }
  .slider-strand__loose { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1; stroke-linecap: round; }
  .slider-strand__ring {
    fill: light-dark(#373a40, #f1f2f3);
    filter: drop-shadow(0 1px 2px light-dark(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.55)));
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
  }
  .slider-strand:has(.slider-strand__input:active) .slider-strand__ring { transform: scale(1.12, 1.08); }
  .slider-strand__focus { fill: none; stroke: transparent; stroke-width: 2; }
  .slider-strand:has(.slider-strand__input:focus-visible) .slider-strand__focus { stroke: light-dark(#50535b, #c6c8cd); }
  .slider-strand__value { position: absolute; left: 0; right: 0; top: 44px; display: flex; justify-content: space-between; font-size: 12px; color: light-dark(#5f626a, #a7abb2); }
  .slider-strand__value b { color: light-dark(#373a40, #f1f2f3); font-weight: 500; font-variant-numeric: tabular-nums; }
  .slider-strand__input { position: absolute; left: 0; top: 0; width: 100%; height: 44px; margin: 0; opacity: 0; cursor: pointer; -webkit-appearance: none; appearance: none; background: none; }
  .slider-strand__input::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 44px; }
  .slider-strand__input::-moz-range-thumb { width: 14px; height: 44px; border: 0; }
  @media (prefers-reduced-motion: reduce) {
    .slider-strand__ring { transition: none; }
  }
`;

/**
 * The ring follows the value on a spring. Moving it sets the slack strands rippling away from it;
 * the ripple dies down after it stops.
 */
function useStrands(target: number) {
  const [s, setS] = useState({ t: target, amp: 0, phase: 0 });
  const st = useRef({ t: target, v: 0, amp: 0, phase: 0, raf: 0 });
  useEffect(() => {
    const q = st.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(q, { t: target, v: 0, amp: 0 });
      setS({ t: target, amp: 0, phase: q.phase });
      return;
    }
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      q.v += (-240 * (q.t - target) - 28 * q.v) * dt;
      q.t += q.v * dt;
      q.amp = Math.max(q.amp * Math.exp(-dt * 2.6), Math.min(3.4, Math.abs(q.v) * 0.012));
      q.phase += dt * 9;
      if (Math.abs(q.t - target) < 0.05 && Math.abs(q.v) < 0.5 && q.amp < 0.03) {
        Object.assign(q, { t: target, v: 0, amp: 0 });
        setS({ t: target, amp: 0, phase: q.phase });
        return;
      }
      setS({ t: q.t, amp: q.amp, phase: q.phase });
      q.raf = requestAnimationFrame(step);
    };
    cancelAnimationFrame(q.raf);
    q.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(q.raf);
  }, [target]);
  return s;
}

export function StrandSlider() {
  const [v, setV] = useState(48);
  const { t, amp, phase } = useStrands(7 + (v / 100) * (W - 14));
  const strands = Array.from({ length: N }, (_, i) => {
    const o = i - (N - 1) / 2;
    const y = (x: number) => {
      // Bound behind the ring, fanning out to loose over the next 40px, held again at the far end.
      const spread = BOUND + (LOOSE - BOUND) * smooth(t, t + 40, x) * (1 - smooth(W - 26, W, x) * 0.55);
      const env = x > t ? Math.sin((Math.PI * (x - t)) / Math.max(1, W - t)) : 0;
      return MID + o * spread + amp * env * Math.sin((x - t) / 11 - phase + i * 0.9);
    };
    const pts = (a: number, b: number) => {
      const out: string[] = [];
      for (let x = a; x < b; x += 3) out.push(`${x.toFixed(1)},${y(x).toFixed(2)}`);
      out.push(`${b.toFixed(1)},${y(b).toFixed(2)}`);
      return `M${out.join('L')}`;
    };
    return { behind: pts(0.5, t), ahead: pts(t, W - 0.5) };
  });
  return (
    <>
      <style>
        {css}
      </style>
      <div className="slider-strand">
        <svg className="slider-strand__svg" aria-hidden="true">
          {strands.map((s, i) => (
            <path key={`a${i}`} className="slider-strand__loose" d={s.ahead} />
          ))}
          {strands.map((s, i) => (
            <path key={`b${i}`} className="slider-strand__bound" d={s.behind} />
          ))}
          <rect className="slider-strand__ring" x={t - 4} y={MID - 10} width={8} height={20} rx={4} />
          <rect className="slider-strand__focus" x={t - 8} y={MID - 14} width={16} height={28} rx={8} />
        </svg>
        <p className="slider-strand__value" aria-hidden="true">
          <span>Strength</span>
          <b>{v}%</b>
        </p>
        <input className="slider-strand__input" type="range" min={0} max={100} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Strength" aria-valuetext={`${v}%`} />
      </div>
    </>
  );
}
