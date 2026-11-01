"use client";

import { useId, useState } from 'react';

const EASE = 'cubic-bezier(0.3, 1.2, 0.5, 1)';

const css = `
  .card-expand {
    position: relative;
    width: 240px;
    height: 76px;
    border-radius: 16px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
    overflow: hidden;
    transition: height 0.45s ${EASE};
  }
  .card-expand--open { height: 210px; }
  .card-expand__toggle { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; padding: 0; border: 0; border-radius: inherit; background: none; cursor: pointer; }
  .card-expand__toggle:focus-visible { outline: 2px solid light-dark(#50535b, #c6c8cd); outline-offset: -2px; }
  .card-expand__art {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 56px;
    height: 56px;
    border-radius: 10px;
    overflow: hidden;
    transition: left 0.45s ${EASE}, top 0.45s ${EASE}, width 0.45s ${EASE}, height 0.45s ${EASE}, border-radius 0.45s ${EASE};
  }
  .card-expand--open .card-expand__art { left: 0; top: 0; width: 240px; height: 96px; border-radius: 0; }
  .card-expand__art svg { display: block; width: 100%; height: 100%; }
  .card-expand__sky { fill: light-dark(#ebedf0, #232529); }
  .card-expand__sun { fill: light-dark(#50535b, #c6c8cd); }
  .card-expand__far { fill: light-dark(#cbced3, #393c41); }
  .card-expand__near { fill: light-dark(#6d7179, #7d8087); }
  .card-expand__title, .card-expand__meta { position: absolute; margin: 0; white-space: nowrap; transition: left 0.45s ${EASE}, top 0.45s ${EASE}; }
  .card-expand__title { left: 78px; top: 18px; font-size: 13px; font-weight: 600; color: light-dark(#373a40, #f1f2f3); }
  .card-expand__meta { left: 78px; top: 40px; font-size: 11px; color: light-dark(#5f626a, #a7abb2); }
  .card-expand--open .card-expand__title { left: 14px; top: 108px; }
  .card-expand--open .card-expand__meta { left: 14px; top: 128px; }
  .card-expand__chev { position: absolute; right: 14px; top: 30px; width: 16px; height: 16px; color: light-dark(#5f626a, #a7abb2); transition: transform 0.35s ${EASE}, opacity 0.2s; }
  .card-expand--open .card-expand__chev { transform: rotate(180deg); opacity: 0; }
  .card-expand__body { position: absolute; left: 14px; right: 14px; top: 152px; margin: 0; font-size: 11.5px; line-height: 1.45; color: light-dark(#50535b, #c6c8cd); opacity: 0; transform: translateY(8px); transition: opacity 0.15s, transform 0.3s; }
  .card-expand--open .card-expand__body { opacity: 1; transform: none; transition: opacity 0.3s 0.2s, transform 0.4s ${EASE} 0.2s; }
  @media (prefers-reduced-motion: reduce) {
    .card-expand, .card-expand *, .card-expand--open .card-expand__body { transition: none !important; }
  }
`;

export function ExpandCard() {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <style>
        {css}
      </style>
      <article className={`card-expand${open ? ' card-expand--open' : ''}`}>
        {/* The art is drawn wider than its box and cropped from the middle, so growing it reveals the scene. */}
        <div className="card-expand__art" aria-hidden="true">
          <svg viewBox="0 0 240 96" preserveAspectRatio="xMidYMax slice">
            <rect className="card-expand__sky" width={240} height={96} />
            <circle className="card-expand__sun" cx={150} cy={40} r={14} />
            <path className="card-expand__far" d="M0 70 L40 48 L80 62 L120 38 L170 60 L210 44 L240 56 V96 H0 Z" />
            <path className="card-expand__near" d="M0 84 Q60 64 120 80 T240 74 V96 H0 Z" />
          </svg>
        </div>
        <p className="card-expand__title">The mill towns</p>
        <p className="card-expand__meta">8 min read · Essays</p>
        <svg className="card-expand__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
        <p className="card-expand__body" id={id} aria-hidden={!open}>
          How the paper mills along the river shaped the towns around them, told in six maps and one long walk.
        </p>
        <button type="button" className="card-expand__toggle" aria-expanded={open} aria-controls={id} aria-label={open ? 'Close The mill towns' : 'Open The mill towns'} onClick={() => setOpen((o) => !o)} />
      </article>
    </>
  );
}
