"use client";

import * as React from "react";
const css = `
  @keyframes card-poster-stripes { to { background-position: 28px 0; } }
  .card-poster {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 170px;
    height: 200px;
    padding: 14px;
    border-radius: 6px;
    background: light-dark(#373a40, #f1f2f3);
    color: light-dark(#fbfcfd, #121417);
    overflow: hidden;
    cursor: pointer;
    perspective: 400px;
  }
  .card-poster:focus-visible { outline: 2px solid light-dark(#42454c, #e5e6e9); outline-offset: 4px; }
  .card-poster__stripes {
    position: absolute;
    left: 0;
    right: 0;
    top: 34px;
    height: 18px;
    background: repeating-linear-gradient(-45deg, light-dark(#fbfcfd, #121417) 0 7px, transparent 7px 14px) 0 0 / 28px 100%;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
  }
  .card-poster:hover .card-poster__stripes, .card-poster:focus-visible .card-poster__stripes {
    transform: none;
    animation: card-poster-stripes 0.6s linear infinite;
  }
  .card-poster__top { display: flex; justify-content: space-between; font-size: 9px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
  .card-poster__word { position: relative; display: flex; font-size: 34px; font-weight: 600; letter-spacing: -0.04em; line-height: 0.9; text-transform: uppercase; }
  .card-poster__ch {
    display: inline-block;
    transform-origin: 50% 100%;
    transform: rotateX(-90deg);
    opacity: 0;
    transition: transform 0.55s cubic-bezier(0.34, 1.5, 0.64, 1) calc(var(--i) * 45ms), opacity 0.2s ease calc(var(--i) * 45ms);
  }
  .card-poster__ch--rest { transform: none; opacity: 1; }
  .card-poster__line { position: relative; height: 34px; }
  .card-poster__line > * { position: absolute; left: 0; top: 0; }
  .card-poster:hover .card-poster__ch, .card-poster:focus-visible .card-poster__ch { transform: none; opacity: 1; }
  .card-poster:hover .card-poster__ch--rest, .card-poster:focus-visible .card-poster__ch--rest { transform: rotateX(90deg); opacity: 0; }
  .card-poster__foot { font-size: 10px; line-height: 1.3; font-weight: 600; }
  @media (prefers-reduced-motion: reduce) {
    .card-poster__ch, .card-poster__stripes { transition-duration: 0.01s; transition-delay: 0s; }
    .card-poster:hover .card-poster__stripes { animation: none; }
  }
`;

// Each line flips from its resting word to its hover word, letter by letter.
const LINES = [
  ['MAKE', 'MOVE'],
  ['IT', 'IT'],
];

export function PosterCard() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="card-poster" tabIndex={0} role="img" aria-label="Poster: Make it move. Motion week, 2 to 6 November">
        <div className="card-poster__top" aria-hidden="true">
          <span>Motion week</span>
          <span>N°04</span>
        </div>
        <span className="card-poster__stripes" aria-hidden="true" />
        <div aria-hidden="true">
          {LINES.map(([rest, hover], li) => (
            <div key={li} className="card-poster__line">
              <span className="card-poster__word">
                {[...rest].map((c, i) => (
                  <span key={i} className="card-poster__ch card-poster__ch--rest" style={{ '--i': i + li * 4 } as React.CSSProperties}>
                    {c}
                  </span>
                ))}
              </span>
              <span className="card-poster__word">
                {[...hover].map((c, i) => (
                  <span key={i} className="card-poster__ch" style={{ '--i': i + li * 4 } as React.CSSProperties}>
                    {c}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
        <div className="card-poster__foot" aria-hidden="true">
          2 to 6 November
          <br />
          Talks, workshops, demos
        </div>
      </div>
    </>
  );
}
