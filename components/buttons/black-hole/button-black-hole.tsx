"use client";

import { useLayoutEffect, useRef } from 'react';

const css = `
  @keyframes btn-black-hole-disk {
    from { transform: rotateX(72deg) rotate(0deg); }
    to { transform: rotateX(72deg) rotate(360deg); }
  }
  /* The singularity flares as the last letters fall in, then gives up the new word. */
  @keyframes btn-black-hole-core {
    0% { transform: scale(0); }
    35%, 70% { transform: scale(1); }
    100% { transform: scale(0); }
  }
  .btn-black-hole {
    position: relative;
    display: grid;
    place-items: center;
    width: 196px;
    height: 56px;
    padding: 0;
    border: 1px solid light-dark(#dbdde1, #2e3035);
    border-radius: 999px;
    background: light-dark(#f3f4f7, #1a1c1f);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.06em;
    cursor: pointer;
    perspective: 400px;
    transition: border-color 0.4s ease, background-color 0.6s ease;
  }
  .btn-black-hole:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-black-hole__word { display: flex; }
  .btn-black-hole__ch {
    display: inline-block;
    /* Orbit the singularity, not the letter's own centre: scaling about that point pulls it in. */
    transform-origin: calc(var(--dx, 0px) + 50%) 50%;
    transition:
      transform 0.75s cubic-bezier(0.55, 0, 0.9, 0.4) var(--d, 0s),
      opacity 0.3s ease calc(var(--d, 0s) + 0.45s);
  }
  .btn-black-hole__disk {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 86px;
    height: 86px;
    margin: -43px 0 0 -43px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, transparent, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 70%, transparent), transparent 40%, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 45%, transparent) 70%, transparent);
    mask-image: radial-gradient(circle, transparent 0 34%, #000 36% 62%, transparent 70%);
    transform: rotateX(72deg);
    scale: 0;
    opacity: 0;
    transition: opacity 0.4s ease, scale 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
  }
  .btn-black-hole__core {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border-radius: 50%;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: 0 0 0 1px light-dark(#50535b, #c6c8cd), 0 0 14px 3px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 35%, transparent);
    transform: scale(0);
    pointer-events: none;
  }
  .btn-black-hole__next {
    position: absolute;
    opacity: 0;
    transform: scale(0.2);
    letter-spacing: 0.3em;
    transition: opacity 0.4s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), letter-spacing 0.8s ease;
  }
  .btn-black-hole:hover, .btn-black-hole:focus-visible { border-color: light-dark(#6d7179, #7d8087); background: light-dark(#fbfcfd, #121417); }
  .btn-black-hole:hover .btn-black-hole__ch,
  .btn-black-hole:focus-visible .btn-black-hole__ch { transform: rotate(560deg) scale(0); opacity: 0; }
  .btn-black-hole:hover .btn-black-hole__disk,
  .btn-black-hole:focus-visible .btn-black-hole__disk { opacity: 0.55; scale: 1; animation: btn-black-hole-disk 1.6s linear infinite; }
  .btn-black-hole:hover .btn-black-hole__core,
  .btn-black-hole:focus-visible .btn-black-hole__core { animation: btn-black-hole-core 1.25s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  .btn-black-hole:hover .btn-black-hole__next,
  .btn-black-hole:focus-visible .btn-black-hole__next {
    opacity: 1;
    transform: none;
    letter-spacing: 0.12em;
    transition-delay: 0.95s;
  }
  @media (prefers-reduced-motion: reduce) {
    .btn-black-hole__ch, .btn-black-hole__disk, .btn-black-hole__core, .btn-black-hole__next { transition: opacity 0.2s ease; }
    .btn-black-hole:hover .btn-black-hole__ch { transform: none; }
    .btn-black-hole:hover .btn-black-hole__disk, .btn-black-hole:hover .btn-black-hole__core { animation: none; }
  }
`;

const WORD = 'Gravity';

export function BlackHoleButton() {
  const word = useRef<HTMLSpanElement>(null);

  // Each letter's distance to the button's centre: its pivot, and how long it lags.
  useLayoutEffect(() => {
    const el = word.current!;
    const mid = el.offsetWidth / 2;
    el.querySelectorAll<HTMLElement>('.btn-black-hole__ch').forEach((ch) => {
      const dx = mid - (ch.offsetLeft + ch.offsetWidth / 2);
      ch.style.setProperty('--dx', `${dx.toFixed(1)}px`);
      ch.style.setProperty('--d', `${(Math.abs(dx) / 260).toFixed(3)}s`);
    });
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-black-hole" aria-label="Enter">
        <span className="btn-black-hole__disk" aria-hidden="true" />
        <span className="btn-black-hole__core" aria-hidden="true" />
        <span ref={word} className="btn-black-hole__word" aria-hidden="true">
          {[...WORD].map((c, i) => (
            <span key={i} className="btn-black-hole__ch">
              {c}
            </span>
          ))}
        </span>
        <span className="btn-black-hole__next" aria-hidden="true">
          Enter
        </span>
      </button>
    </>
  );
}
