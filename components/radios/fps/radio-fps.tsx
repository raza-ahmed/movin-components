"use client";

import { useEffect, useId, useRef, useState } from 'react';

const OPTIONS = [
  { value: 12, note: 'Steppy, like stop motion' },
  { value: 24, note: 'Smooth enough, like film' },
  { value: 60, note: 'Fluid, like a phone screen' },
];
const PERIOD = 2.4;
// Where the ball is at time t: across and back once a period, bouncing twice each way.
function pos(t: number) {
  const u = (((t % PERIOD) + PERIOD) % PERIOD) / PERIOD;
  return { x: 24 + 172 * ((1 - Math.cos(2 * Math.PI * u)) / 2), y: 76 - 50 * Math.abs(Math.sin(4 * Math.PI * u)) };
}
const START = pos(0);

const css = `
  .radio-fps { display: grid; justify-items: center; gap: 14px; width: 260px; }
  .radio-fps__stage { display: block; width: 220px; height: 92px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-fps__ground { stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1.5; }
  .radio-fps__ball { fill: light-dark(#373a40, #f1f2f3); }
  .radio-fps__ghost { fill: light-dark(#5f626a, #a7abb2); }
  .radio-fps__dot { fill: light-dark(#6d7179, #7d8087); }
  .radio-fps__read { color: light-dark(#50535b, #c6c8cd); font-size: 12px; text-align: center; }
  .radio-fps__opts { display: flex; gap: 3px; padding: 4px; border-radius: 12px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .radio-fps__opt { position: relative; flex: 1; padding: 7px 12px; border-radius: 8px; color: light-dark(#5f626a, #a7abb2); font-size: 12.5px; font-weight: 500; text-align: center; white-space: nowrap; cursor: pointer; transition: background-color 0.25s, color 0.25s; }
  .radio-fps__opt:hover { color: light-dark(#42454c, #e5e6e9); }
  .radio-fps__opt:has(input:checked) { background: light-dark(#373a40, #f1f2f3); color: light-dark(#fbfcfd, #121417); }
  .radio-fps__opt:has(input:focus-visible) { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .radio-fps__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; pointer-events: none; }
`;

export function FpsRadio() {
  const name = useId();
  const [fps, setFps] = useState(12);
  const [still, setStill] = useState(false);
  const stage = useRef<SVGSVGElement>(null);
  const ball = useRef<SVGCircleElement>(null);
  const ghosts = useRef<(SVGCircleElement | null)[]>([]);

  // The ball only moves on frame boundaries: the clock runs smoothly, but its position is read at
  // 1/fps steps. The last three frames stay faintly behind it, so the spacing shows.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setStill(true);
    let raf = 0;
    let last = -1;
    const t0 = performance.now();
    const step = (now: number) => {
      const f = Math.floor(((now - t0) / 1000) * fps);
      if (f !== last) {
        last = f;
        const p = pos(f / fps);
        ball.current!.setAttribute('cx', p.x.toFixed(1));
        ball.current!.setAttribute('cy', p.y.toFixed(1));
        ghosts.current.forEach((g, k) => {
          const q = pos((f - k - 1) / fps);
          g!.setAttribute('cx', q.x.toFixed(1));
          g!.setAttribute('cy', q.y.toFixed(1));
        });
      }
      raf = requestAnimationFrame(step);
    };
    // Only run while the stage is on screen.
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(step);
    });
    io.observe(stage.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [fps]);

  // Without motion: every frame of one pass as a dot, so 12 fps leaves wide gaps and 60 fps a near line.
  const dots = still ? Array.from({ length: Math.round(PERIOD * fps) }, (_, k) => pos(k / fps)) : [];
  return (
    <>
      <style>
        {css}
      </style>
      <div className="radio-fps">
        <svg className="radio-fps__stage" ref={stage} viewBox="0 0 220 92" aria-hidden="true">
          <line className="radio-fps__ground" x1={14} y1={84} x2={206} y2={84} />
          {dots.map((p, k) => (
            <circle key={k} className="radio-fps__dot" cx={p.x} cy={p.y} r={1.6} />
          ))}
          {!still &&
            [0.45, 0.25, 0.12].map((o, k) => (
              <circle
                key={k}
                className="radio-fps__ghost"
                ref={(el) => {
                  ghosts.current[k] = el;
                }}
                cx={START.x}
                cy={START.y}
                r={7}
                opacity={o}
              />
            ))}
          <circle className="radio-fps__ball" ref={ball} cx={START.x} cy={START.y} r={7} />
        </svg>
        <span className="radio-fps__read" aria-live="polite">
          {fps} frames a second. {OPTIONS.find((o) => o.value === fps)!.note}.
        </span>
        <div className="radio-fps__opts" role="radiogroup" aria-label="Frame rate">
          {OPTIONS.map((o) => (
            <label key={o.value} className="radio-fps__opt">
              <input className="radio-fps__input" type="radio" name={name} value={o.value} checked={fps === o.value} onChange={() => setFps(o.value)} />
              {o.value} fps
            </label>
          ))}
        </div>
      </div>
    </>
  );
}
