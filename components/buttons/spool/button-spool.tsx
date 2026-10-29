"use client";

import { useEffect, useRef, useState } from 'react';

const MS = 2200;

const css = `
  @keyframes btn-spool-wind { from { transform: scaleX(1); } to { transform: scaleX(0); } }
  @keyframes btn-spool-spin { to { transform: rotate(-720deg); } }
  @keyframes btn-spool-grow { from { r: 3px; } to { r: 8.5px; } }
  .btn-spool {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    height: 50px;
    padding: 0 14px 0 20px;
    border: none;
    border-radius: 12px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035), 0 8px 20px -12px light-dark(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.6));
    color: light-dark(#373a40, #f1f2f3);
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
  .btn-spool:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: 3px; }
  .btn-spool__label { position: relative; display: grid; min-width: 96px; text-align: left; }
  .btn-spool__label > span { grid-area: 1 / 1; transition: opacity 0.25s; }
  .btn-spool__size { color: light-dark(#5f626a, #a7abb2); font-weight: 400; }
  .btn-spool__done { opacity: 0; }
  .btn-spool[data-state='done'] .btn-spool__idle { opacity: 0; }
  .btn-spool[data-state='done'] .btn-spool__done { opacity: 1; }
  /* The tape: a line under the label that winds onto the reel as the file arrives. */
  .btn-spool__tape { position: absolute; left: 20px; right: 46px; bottom: 11px; height: 1.5px; background: light-dark(#5f626a, #a7abb2); transform-origin: 100% 50%; transform: scaleX(0); }
  .btn-spool[data-state='run'] .btn-spool__tape { animation: btn-spool-wind ${MS}ms cubic-bezier(0.4, 0, 0.6, 1) both; }
  .btn-spool__reel { position: relative; width: 30px; height: 30px; }
  .btn-spool__reel svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .btn-spool__disc { fill: none; stroke: light-dark(#6d7179, #7d8087); stroke-width: 1.2; }
  .btn-spool__hub { fill: light-dark(#dbdde1, #2e3035); stroke: light-dark(#5f626a, #a7abb2); stroke-width: 1; }
  .btn-spool__spokes { stroke: light-dark(#50535b, #c6c8cd); stroke-width: 1.2; stroke-linecap: round; transform-origin: 15px 15px; }
  .btn-spool__wound { fill: light-dark(#5f626a, #a7abb2); }
  .btn-spool[data-state='run'] .btn-spool__spokes { animation: btn-spool-spin ${MS}ms cubic-bezier(0.4, 0, 0.6, 1); }
  .btn-spool[data-state='run'] .btn-spool__wound { animation: btn-spool-grow ${MS}ms cubic-bezier(0.4, 0, 0.6, 1) both; }
  .btn-spool__tick { fill: none; stroke: light-dark(#fbfcfd, #121417); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 20; stroke-dashoffset: 20; transition: stroke-dashoffset 0.4s 0.15s; }
  .btn-spool__cap { fill: light-dark(#373a40, #f1f2f3); transform-origin: 15px 15px; transform: scale(0); transition: transform 0.35s cubic-bezier(0.3, 1.5, 0.5, 1); }
  .btn-spool[data-state='done'] .btn-spool__cap { transform: scale(1); }
  .btn-spool[data-state='done'] .btn-spool__tick { stroke-dashoffset: 0; }
  @media (prefers-reduced-motion: reduce) {
    .btn-spool * { animation: none !important; }
  }
`;

export function SpoolButton() {
  const [state, setState] = useState<'idle' | 'run' | 'done'>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const go = () => {
    if (state === 'run') return;
    if (state === 'done') return setState('idle');
    setState('run');
    timers.current = [setTimeout(() => setState('done'), MS)];
  };
  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-spool" data-state={state} onClick={go} aria-busy={state === 'run'}>
        <span className="btn-spool__label" aria-live="polite">
          <span className="btn-spool__idle" aria-hidden={state === 'done'}>
            {state === 'run' ? 'Downloading' : 'Download'} <span className="btn-spool__size">4.2 MB</span>
          </span>
          <span className="btn-spool__done" aria-hidden={state !== 'done'}>
            Saved
          </span>
        </span>
        <span className="btn-spool__tape" aria-hidden="true" />
        <span className="btn-spool__reel" aria-hidden="true">
          <svg viewBox="0 0 30 30">
            <circle className="btn-spool__disc" cx="15" cy="15" r="13" />
            <circle className="btn-spool__wound" cx="15" cy="15" r="3" />
            <g className="btn-spool__spokes">
              <path d="M15 4v5M15 21v5M4 15h5M21 15h5" />
            </g>
            <circle className="btn-spool__hub" cx="15" cy="15" r="2.5" />
            <circle className="btn-spool__cap" cx="15" cy="15" r="13" />
            <path className="btn-spool__tick" d="M9.5 15.5l3.5 3.5 7.5-8" />
          </svg>
        </span>
      </button>
    </>
  );
}
