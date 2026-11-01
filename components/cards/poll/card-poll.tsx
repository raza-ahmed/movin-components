"use client";

import { useEffect, useId, useRef, useState } from 'react';

const OPTIONS = [
  { t: 'Ease out', v: 48 },
  { t: 'Spring', v: 37 },
  { t: 'Linear', v: 15 },
];

const css = `
  .card-poll { box-sizing: border-box; width: 240px; padding: 14px; border-radius: 16px; background: light-dark(#f3f4f7, #1a1c1f); box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035); }
  .card-poll__q { margin: 0 0 10px; font-size: 13px; font-weight: 600; line-height: 1.35; color: light-dark(#373a40, #f1f2f3); }
  .card-poll__list { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
  .card-poll__opt { position: relative; display: flex; align-items: center; gap: 6px; box-sizing: border-box; width: 100%; height: 32px; padding: 0 10px; border: 1.5px solid light-dark(#dbdde1, #2e3035); border-radius: 9px; background: none; color: light-dark(#373a40, #f1f2f3); font: inherit; font-size: 12px; text-align: left; overflow: hidden; cursor: pointer; transition: border-color 0.3s; }
  .card-poll__opt:hover:not(:disabled) { border-color: light-dark(#6d7179, #7d8087); }
  .card-poll__opt:disabled { cursor: default; }
  .card-poll__opt:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  .card-poll--voted .card-poll__opt { border-color: transparent; }
  /* After the vote each option becomes a bar grown to its share, a beat after the one above. */
  .card-poll__bar { position: absolute; inset: 0; background: light-dark(#ebedf0, #232529); transform: scaleX(0); transform-origin: left; transition: transform 0.6s cubic-bezier(0.3, 1.1, 0.5, 1); }
  .card-poll__opt--mine .card-poll__bar { background: light-dark(#cbced3, #393c41); }
  .card-poll__t, .card-poll__pct, .card-poll__tick { position: relative; }
  .card-poll__pct { margin-left: auto; font-weight: 600; font-variant-numeric: tabular-nums; opacity: 0; transition: opacity 0.3s; }
  .card-poll--voted .card-poll__pct { opacity: 1; }
  .card-poll__tick { width: 12px; height: 12px; }
  .card-poll__tick path { stroke-dasharray: 1; animation: card-poll-tick 0.3s ease-out 0.3s backwards; }
  @keyframes card-poll-tick { from { stroke-dashoffset: 1; } }
  .card-poll__foot { display: flex; justify-content: space-between; margin-top: 10px; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .card-poll__again { padding: 0; border: 0; background: none; color: light-dark(#42454c, #e5e6e9); font: inherit; font-size: 11px; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
  .card-poll__again:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    .card-poll__bar { transition: none; }
    .card-poll__tick path { animation: none; }
  }
`;

export function PollCard() {
  const [mine, setMine] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const raf = useRef(0);
  const id = useId();
  const total = OPTIONS.reduce((n, o) => n + o.v, 0) + (mine === null ? 0 : 1);
  const pct = (i: number) => Math.round(((OPTIONS[i].v + (mine === i ? 1 : 0)) / total) * 100);

  // The percentages count up from zero over the same time the bars grow.
  useEffect(() => {
    cancelAnimationFrame(raf.current);
    if (mine === null) return setT(0);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setT(1);
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 700);
      setT(1 - (1 - k) ** 3);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [mine]);

  return (
    <>
      <style>
        {css}
      </style>
      <article className={`card-poll${mine !== null ? ' card-poll--voted' : ''}`}>
        <p className="card-poll__q" id={id}>
          Which easing do you reach for first?
        </p>
        <ul className="card-poll__list" aria-labelledby={id}>
          {OPTIONS.map((o, i) => (
            <li key={o.t}>
              <button
                type="button"
                className={`card-poll__opt${mine === i ? ' card-poll__opt--mine' : ''}`}
                disabled={mine !== null}
                aria-pressed={mine === i}
                aria-label={mine === null ? o.t : `${o.t}, ${pct(i)}%${mine === i ? ', your vote' : ''}`}
                onClick={() => setMine(i)}
              >
                <span className="card-poll__bar" style={{ transform: mine === null ? undefined : `scaleX(${pct(i) / 100})`, transitionDelay: `${i * 80}ms` }} aria-hidden="true" />
                <span className="card-poll__t">{o.t}</span>
                {mine === i && (
                  <svg className="card-poll__tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} />
                  </svg>
                )}
                <span className="card-poll__pct" aria-hidden="true">
                  {Math.round(pct(i) * t)}%
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="card-poll__foot">
          {total} votes
          {mine !== null && (
            <button type="button" className="card-poll__again" onClick={() => setMine(null)}>
              Change vote
            </button>
          )}
        </p>
      </article>
    </>
  );
}
