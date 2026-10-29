"use client";

import * as React from "react";
const css = `
  @keyframes loader-pendulum-wave-swing {
    from { transform: translateX(-34px); }
    to { transform: translateX(34px); }
  }
  .loader-pendulum-wave {
    position: relative;
    display: grid;
    gap: 4px;
    justify-items: center;
    width: 96px;
    padding: 6px 0;
  }
  /* Seen from above: each row is one pendulum's track, the bead its bob. */
  .loader-pendulum-wave__row {
    position: relative;
    width: 76px;
    height: 4px;
    display: grid;
    place-items: center;
  }
  .loader-pendulum-wave__row::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: light-dark(#ebedf0, #232529);
  }
  .loader-pendulum-wave__bob {
    position: relative;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent);
    animation: loader-pendulum-wave-swing var(--half) cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
    animation-delay: calc(var(--half) * -1);
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-pendulum-wave__bob { animation-duration: calc(var(--half) * 4); }
  }
`;

// Pendulum i completes 10 + i swings every 12 s, so all twelve line up again every 12 s.
const CYCLE = 12;
const ROWS = Array.from({ length: 12 }, (_, i) => CYCLE / (10 + i) / 2);

export function PendulumWaveLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-pendulum-wave" role="status" aria-label="Loading">
        {ROWS.map((half, i) => (
          <span key={i} className="loader-pendulum-wave__row">
            <span className="loader-pendulum-wave__bob" style={{ '--half': `${half.toFixed(4)}s` } as React.CSSProperties} />
          </span>
        ))}
      </div>
    </>
  );
}
