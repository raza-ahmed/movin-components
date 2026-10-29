"use client";

import { useEffect, useRef, useState } from 'react';

const OPEN = 182.4;
const CLOSE = 196.85;
// The day's price, sampled every half hour: a fixed series, so the line is the same every time.
const DAY = [182.4, 181.6, 183.9, 183.1, 185.7, 184.9, 188.2, 187.5, 186.8, 190.4, 189.6, 192.8, 191.9, 194.6, 193.8, 196.85];
const W = 220;
const H = 64;
const lo = Math.min(...DAY) - 1;
const hi = Math.max(...DAY) + 1;
const PTS = DAY.map((p, i) => `${((i / (DAY.length - 1)) * W).toFixed(1)} ${(H - ((p - lo) / (hi - lo)) * H).toFixed(1)}`);
const LINE = `M${PTS.join('L')}`;
const AREA = `${LINE}L${W} ${H}L0 ${H}Z`;

const css = `
  .card-sparkline {
    display: grid;
    gap: 10px;
    width: 252px;
    padding: 16px;
    border-radius: 18px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 12px 24px -14px light-dark(rgba(0, 0, 0, 0.21), rgba(0, 0, 0, 0.7));
    outline: none;
  }
  .card-sparkline:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .card-sparkline__head { display: flex; justify-content: space-between; align-items: flex-start; }
  .card-sparkline__sym { color: light-dark(#373a40, #f1f2f3); font-size: 14px; font-weight: 600; }
  .card-sparkline__co { color: light-dark(#5f626a, #a7abb2); font-size: 11.5px; }
  .card-sparkline__price { color: light-dark(#373a40, #f1f2f3); font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; text-align: right; }
  .card-sparkline__chg { display: inline-block; margin-top: 2px; padding: 1px 6px; border-radius: 6px; background: light-dark(#ebedf0, #232529); color: light-dark(#42454c, #e5e6e9); font-size: 11px; font-weight: 500; font-variant-numeric: tabular-nums; transform: translateY(4px); opacity: 0; transition: opacity 0.3s, transform 0.4s cubic-bezier(0.3, 1.4, 0.5, 1); }
  .card-sparkline svg { width: 100%; height: ${H}px; overflow: visible; }
  .card-sparkline__area { fill: color-mix(in oklab, light-dark(#50535b, #c6c8cd) 16%, transparent); clip-path: inset(0 100% 0 0); transition: clip-path 1.2s cubic-bezier(0.5, 0, 0.3, 1); }
  .card-sparkline__line { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 1.6; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s cubic-bezier(0.5, 0, 0.3, 1); }
  .card-sparkline__base { stroke: light-dark(#cbced3, #393c41); stroke-dasharray: 2 3; }
  .card-sparkline__ghost { fill: none; stroke: light-dark(#cbced3, #393c41); stroke-width: 1.2; stroke-linejoin: round; }
  .card-sparkline__dot { fill: light-dark(#373a40, #f1f2f3); opacity: 0; transition: opacity 0.3s 1.1s; }
  .card-sparkline__axis { display: flex; justify-content: space-between; color: light-dark(#5f626a, #a7abb2); font-size: 10px; }
  .card-sparkline[data-on] .card-sparkline__area { clip-path: inset(0 0 0 0); }
  .card-sparkline[data-on] .card-sparkline__line { stroke-dashoffset: 0; }
  .card-sparkline[data-on] .card-sparkline__dot { opacity: 1; }
  .card-sparkline[data-on] .card-sparkline__chg { opacity: 1; transform: none; transition-delay: 1.1s; }
  @media (prefers-reduced-motion: reduce) {
    .card-sparkline * { transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

const fmt = (n: number) => n.toFixed(2);

export function SparklineCard() {
  const [on, setOn] = useState(false);
  const [price, setPrice] = useState(OPEN);
  const raf = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const from = price;
    const to = on ? CLOSE : OPEN;
    if (reduce) return setPrice(to);
    const t0 = performance.now();
    // Count with the line: same 1.2s, eased the same way, so the number arrives when the line does.
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 1200);
      const e = 1 - Math.pow(1 - t, 3);
      setPrice(from + (to - from) * e);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);
  const last = PTS[PTS.length - 1]!.split(' ');
  return (
    <>
      <style>
        {css}
      </style>
      <div
        className="card-sparkline"
        data-on={on || undefined}
        tabIndex={0}
        role="group"
        aria-label={`MVN, Movin Inc. Opened at ${fmt(OPEN)}, closed at ${fmt(CLOSE)}, up 7.9 percent`}
        onPointerEnter={() => setOn(true)}
        onPointerLeave={() => setOn(false)}
        onFocus={() => setOn(true)}
        onBlur={() => setOn(false)}
      >
        <div className="card-sparkline__head" aria-hidden="true">
          <span>
            <span className="card-sparkline__sym">MVN</span>
            <br />
            <span className="card-sparkline__co">Movin Inc.</span>
          </span>
          <span>
            <span className="card-sparkline__price">${fmt(price)}</span>
            <br />
            <span style={{ display: 'block', textAlign: 'right' }}>
              <span className="card-sparkline__chg">+7.9% today</span>
            </span>
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
          <line className="card-sparkline__base" x1="0" x2={W} y1={PTS[0]!.split(' ')[1]} y2={PTS[0]!.split(' ')[1]} />
          <path className="card-sparkline__ghost" d={LINE} />
          <path className="card-sparkline__area" d={AREA} />
          <path className="card-sparkline__line" d={LINE} pathLength={1} />
          <circle className="card-sparkline__dot" cx={last[0]} cy={last[1]} r="3" />
        </svg>
        <div className="card-sparkline__axis" aria-hidden="true">
          <span>9:30</span>
          <span>12:00</span>
          <span>16:00</span>
        </div>
      </div>
    </>
  );
}
