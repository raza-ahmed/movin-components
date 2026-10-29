"use client";

import { useState } from 'react';

const css = `
  @keyframes cb-polaroid-shake {
    0% { transform: rotate(-5deg); }
    12% { transform: rotate(4deg) translateX(1px); }
    24% { transform: rotate(-9deg) translateX(-1px); }
    36% { transform: rotate(3deg) translateX(1px); }
    48% { transform: rotate(-8deg); }
    62% { transform: rotate(-2deg); }
    100% { transform: rotate(-5deg); }
  }
  .cb-polaroid { position: relative; display: inline-flex; align-items: center; gap: 12px; color: light-dark(#42454c, #e5e6e9); font-size: 14px; cursor: pointer; user-select: none; }
  .cb-polaroid__input { position: absolute; width: 1px; height: 1px; margin: 0; opacity: 0; }
  .cb-polaroid__print {
    position: relative;
    width: 32px;
    height: 38px;
    padding: 3px 3px 9px;
    border-radius: 2px;
    background: light-dark(#42454c, #e5e6e9);
    box-shadow: 0 2px 5px color-mix(in oklab, light-dark(#fbfcfd, #121417) 55%, transparent);
    transform: rotate(-5deg);
  }
  .cb-polaroid__input:focus-visible + .cb-polaroid__print { outline: 2px solid light-dark(#5f626a, #a7abb2); outline-offset: 3px; }
  .cb-polaroid__photo {
    position: relative;
    display: block;
    width: 26px;
    height: 26px;
    overflow: hidden;
    background: light-dark(#fbfcfd, #121417);
    transition: background-color 0.35s ease;
  }
  .cb-polaroid__photo svg { position: absolute; inset: 0; width: 26px; height: 26px; opacity: 0; filter: blur(2px); transition: opacity 0.35s ease, filter 0.35s ease; }
  .cb-polaroid__sky { fill: light-dark(#6d7179, #7d8087); }
  .cb-polaroid__sun { fill: light-dark(#50535b, #c6c8cd); }
  .cb-polaroid__tick { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2.8; stroke-linecap: round; stroke-linejoin: round; }
  /* Developing is slow, the way it is on real film. */
  .cb-polaroid__input:checked + .cb-polaroid__print .cb-polaroid__photo { background: light-dark(#dbdde1, #2e3035); transition: background-color 1.4s ease 0.15s; }
  .cb-polaroid__input:checked + .cb-polaroid__print .cb-polaroid__photo svg { opacity: 1; filter: blur(0); transition: opacity 1.6s ease 0.3s, filter 1.6s ease 0.3s; }
  .cb-polaroid[data-armed] .cb-polaroid__input:checked + .cb-polaroid__print { animation: cb-polaroid-shake 0.7s ease-in-out; }
  @media (prefers-reduced-motion: reduce) {
    .cb-polaroid__print, .cb-polaroid__print * { animation: none !important; transition-duration: 0.01s !important; transition-delay: 0s !important; }
  }
`;

export function PolaroidCheckbox() {
  const [armed, setArmed] = useState(false);
  return (
    <>
      <style>
        {css}
      </style>
      <label className="cb-polaroid" data-armed={armed || undefined}>
        <input className="cb-polaroid__input" type="checkbox" onChange={() => setArmed(true)} />
        <span className="cb-polaroid__print" aria-hidden="true">
          <span className="cb-polaroid__photo">
            <svg viewBox="0 0 26 26">
              <path className="cb-polaroid__sky" d="M0 20L7 14L12 18L19 11L26 17V26H0Z" />
              <circle className="cb-polaroid__sun" cx="20" cy="6" r="2.5" />
              <path className="cb-polaroid__tick" d="M6.5 11L10.5 15L18 6.5" />
            </svg>
          </span>
        </span>
        Save to album
      </label>
    </>
  );
}
