"use client";

import type { CSSProperties } from 'react';

const css = `
  .loader-sunflower {
    --loader-sunflower-t: 1.8s;
    display: inline-block;
    width: 76px;
    height: 76px;
  }

  .loader-sunflower__head {
    position: relative;
    width: 100%;
    height: 100%;
    animation: loader-sunflower-turn calc(var(--loader-sunflower-t) * 10) linear infinite;
  }

  /* Vogel's model: dot n turns n x 137.508deg (the golden angle) and sits
     sqrt(n) out from the middle. The pulse waits by that same distance, so it
     ripples outward. */
  .loader-sunflower__head span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    margin: -2px 0 0 -2px;
    border-radius: 50%;
    background: light-dark(#42454c, #e5e6e9);
    transform: rotate(calc(var(--loader-sunflower-i) * 137.508deg)) translateX(calc(sqrt(var(--loader-sunflower-i)) * 4.8px)) scale(0.35);
    animation: loader-sunflower-pulse var(--loader-sunflower-t) ease-in-out infinite;
    animation-delay: calc(sqrt(var(--loader-sunflower-i)) * var(--loader-sunflower-t) / 8 - var(--loader-sunflower-t));
  }

  @keyframes loader-sunflower-pulse {
    0%,
    100% {
      transform: rotate(calc(var(--loader-sunflower-i) * 137.508deg)) translateX(calc(sqrt(var(--loader-sunflower-i)) * 4.8px)) scale(0.35);
      opacity: 0.4;
    }
    30% {
      transform: rotate(calc(var(--loader-sunflower-i) * 137.508deg)) translateX(calc(sqrt(var(--loader-sunflower-i)) * 4.8px)) scale(1);
      opacity: 1;
    }
  }

  @keyframes loader-sunflower-turn {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-sunflower__head,
    .loader-sunflower__head span {
      animation: none;
    }
    .loader-sunflower__head span {
      opacity: 0.8;
    }
  }
`;

export function SunflowerLoader() {
  return (
    <>
      <style>{css}</style>
      <div className="loader-sunflower" role="status" aria-label="Loading">
        <div className="loader-sunflower__head" aria-hidden="true">
          {Array.from({ length: 48 }, (_, i) => (
            <span key={i} style={{ '--loader-sunflower-i': i + 1 } as CSSProperties} />
          ))}
        </div>
      </div>
    </>
  );
}
