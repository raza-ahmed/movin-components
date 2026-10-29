"use client";

import { useEffect, useId, useRef } from 'react';

const css = `
  .btn-plasma {
    position: relative;
    display: grid;
    place-items: center;
    width: 200px;
    height: 58px;
    padding: 0;
    border: 1px solid light-dark(#cbced3, #393c41);
    border-radius: 999px;
    background: light-dark(#fbfcfd, #121417);
    color: light-dark(#373a40, #f1f2f3);
    font-family: inherit;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.4s ease, box-shadow 0.4s ease;
  }
  .btn-plasma:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 3px; }
  .btn-plasma__energy {
    position: absolute;
    inset: -10px;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    color: light-dark(#373a40, #f1f2f3);
    opacity: 0.32;
    transition: opacity 0.5s ease;
  }
  .btn-plasma__label {
    position: relative;
    text-shadow: 0 0 6px light-dark(#fbfcfd, #121417), 0 0 14px light-dark(#fbfcfd, #121417);
  }
  .btn-plasma:hover, .btn-plasma:focus-visible {
    border-color: light-dark(#50535b, #c6c8cd);
    box-shadow: 0 0 28px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 26%, transparent);
  }
  .btn-plasma:hover .btn-plasma__energy,
  .btn-plasma:focus-visible .btn-plasma__energy { opacity: 0.95; }
`;

export function PlasmaButton() {
  const id = `plasma-${useId().replace(/:/g, '')}`;
  const svg = useRef<SVGSVGElement>(null);
  // SMIL ignores the CSS media query, so reduced motion pauses it here.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) svg.current?.pauseAnimations();
  }, []);
  return (
    <>
      <style>
        {css}
      </style>
      <button type="button" className="btn-plasma">
        <svg ref={svg} className="btn-plasma__energy" aria-hidden="true">
          <filter id={id} x="0" y="0" width="100%" height="100%">
            {/* Churning noise: the frequency itself is animated, so the field never repeats exactly. */}
            <feTurbulence type="turbulence" baseFrequency="0.012 0.06" numOctaves={4} seed={4} result="noise">
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.012 0.06; 0.02 0.08; 0.009 0.05; 0.012 0.06"
                repeatCount="indefinite"
              />
            </feTurbulence>
            {/* Turbulence is bright along its ridges: keep those as alpha, softly. */}
            <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.55" result="mask" />
            {/* Paint those cores in the text colour. */}
            <feFlood floodColor="currentColor" result="ink" />
            <feComposite in="ink" in2="mask" operator="in" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${id})`} fill="currentColor" />
        </svg>
        <span className="btn-plasma__label">Ignite</span>
      </button>
    </>
  );
}
