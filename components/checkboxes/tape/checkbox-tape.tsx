"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-tape-slap {
    0% { opacity: 0; transform: translateY(-14px) rotate(-20deg) scale(1.35); }
    55% { opacity: 1; transform: rotate(-6deg) scale(0.95); }
    75% { transform: rotate(-9deg) scale(1.02); }
    100% { transform: rotate(-8deg) scale(1); }
  }
  .cb-tape { position: relative; display: inline-flex; align-items: center; gap: 14px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-tape__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-tape__box {
    position: relative;
    width: 24px;
    height: 24px;
    border-radius: 5px;
    background: light-dark(#f3f4f7, #1a1c1f);
    box-shadow: inset 0 0 0 1.5px light-dark(#6d7179, #7d8087);
    perspective: 120px;
  }
  .cb-tape__input:focus-visible + .cb-tape__box { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-tape__strip {
    position: absolute;
    left: -8px;
    top: 4px;
    width: 40px;
    height: 16px;
    background:
      repeating-linear-gradient(90deg, transparent 0 3px, color-mix(in oklab, light-dark(#5f626a, #a7abb2) 35%, transparent) 3px 4px),
      light-dark(#50535b, #c6c8cd);
    clip-path: polygon(2% 0, 98% 0, 100% 18%, 97% 36%, 100% 54%, 97% 72%, 100% 90%, 98% 100%, 2% 100%, 0 82%, 3% 64%, 0 46%, 3% 28%, 0 10%);
    box-shadow: 0 1px 2px color-mix(in oklab, light-dark(#fbfcfd, #121417) 60%, transparent);
    opacity: 0;
    transform: translate(10px, -10px) rotate(16deg) rotateY(-50deg);
    transform-origin: 0 50%;
    transition: transform 0.35s cubic-bezier(0.5, 0, 0.75, 0), opacity 0.3s ease 0.05s;
  }
  .cb-tape__strip svg { position: absolute; left: 12px; top: 1px; width: 16px; height: 14px; }
  .cb-tape__strip path { fill: none; stroke: light-dark(#f3f4f7, #1a1c1f); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
  .cb-tape__input:checked + .cb-tape__box .cb-tape__strip { opacity: 1; transform: rotate(-8deg); transition: none; }
  .cb-tape[data-armed] .cb-tape__input:checked + .cb-tape__box .cb-tape__strip { animation: cb-tape-slap 0.38s cubic-bezier(0.3, 0, 0.3, 1); }
  @media (prefers-reduced-motion: reduce) {
    .cb-tape__strip { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function TapeCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-tape" data-armed={armed || undefined}>
        <input className="cb-tape__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-tape__box" aria-hidden="true">
          <span className="cb-tape__strip">
            <svg viewBox="0 0 16 14">
              <path d="M3 7.5C4.2 8.6 5.4 10 6.3 11C8.4 7.6 10.6 5 13.5 2.8" />
            </svg>
          </span>
        </span>
        Packed
      </label>
    </>
  );
}
