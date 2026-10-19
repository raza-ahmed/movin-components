"use client";

import type { CSSProperties } from 'react';

const css = `
  .loader-radar {
    --loader-radar-t: 2.4s;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    width: 64px;
    height: 64px;
    overflow: hidden;
    border: 1.5px solid #4d4d4d;
    border-radius: 50%;
    background:
      linear-gradient(#282828, #282828) 50% 0 / 1px 100% no-repeat,
      linear-gradient(#282828, #282828) 0 50% / 100% 1px no-repeat,
      repeating-radial-gradient(circle, transparent 0 9.5px, #282828 9.5px 10.5px),
      #111111;
  }

  /* The wake trails behind the bright leading edge at 70deg. */
  .loader-radar__beam {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(transparent 0deg, rgba(237, 237, 237, 0.4) 69deg, #ededed 70deg, transparent 70.5deg);
    animation: loader-radar-sweep var(--loader-radar-t) linear infinite;
  }

  /* A blip at angle a is hit when the edge (a - 70 degrees of turn) arrives;
     the delay is that point of the loop, minus one loop so it starts mid-way. */
  .loader-radar__blip {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    transform: rotate(calc(var(--loader-radar-a) * 1deg)) translateY(calc(var(--loader-radar-r) * -1px));
  }

  .loader-radar__blip::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    margin: -2.5px 0 0 -2.5px;
    border-radius: 50%;
    background: #f6f6f6;
    box-shadow: 0 0 6px rgba(246, 246, 246, 0.8);
    opacity: 0;
    animation: loader-radar-blip var(--loader-radar-t) linear infinite;
    animation-delay: calc((var(--loader-radar-a) - 70) / 360 * var(--loader-radar-t) - var(--loader-radar-t));
  }

  @keyframes loader-radar-sweep {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes loader-radar-blip {
    0% {
      opacity: 1;
      transform: scale(1.4);
    }
    10% {
      transform: scale(1);
    }
    70%,
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-radar__beam,
    .loader-radar__blip::after {
      animation: none;
    }
    .loader-radar__blip::after {
      opacity: 0.6;
    }
  }
`;

// [angle in degrees from 12 o'clock, distance from the centre in px]
const BLIPS = [
  [50, 20],
  [155, 12],
  [250, 24],
  [320, 15],
];

export function RadarLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-radar" role="status" aria-label="Loading">
        <span className="loader-radar__beam" aria-hidden="true" />
        {BLIPS.map(([a, r]) => (
          <span key={a} className="loader-radar__blip" style={{ '--loader-radar-a': a, '--loader-radar-r': r } as CSSProperties} aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
