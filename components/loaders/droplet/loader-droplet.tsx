"use client";

import * as React from "react";
const css = `
  @keyframes loader-droplet-fall {
    0% { transform: translateY(0) scaleY(0.6); opacity: 0; }
    10% { transform: translateY(4px) scaleY(1); opacity: 1; }
    42% { transform: translateY(58px) scaleY(1.25); opacity: 1; }
    44%, 100% { transform: translateY(62px) scaleY(0.3); opacity: 0; }
  }
  @keyframes loader-droplet-ripple {
    0%, 42% { transform: scale(0.1); opacity: 0; }
    44% { opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }
  @keyframes loader-droplet-crown {
    0%, 43% { transform: translate(0, 0) scale(0); opacity: 0; }
    45% { transform: translate(0, 0) scale(1); opacity: 1; }
    62% { transform: translate(calc(var(--x) * 0.6), -14px) scale(1); opacity: 1; }
    78%, 100% { transform: translate(var(--x), 0) scale(0.6); opacity: 0; }
  }
  .loader-droplet { position: relative; width: 120px; height: 100px; }
  .loader-droplet__drop {
    position: absolute;
    left: 50%;
    top: 4px;
    width: 12px;
    height: 16px;
    margin-left: -6px;
    border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%;
    background: light-dark(#373a40, #f1f2f3);
    transform-origin: 50% 100%;
    animation: loader-droplet-fall 1.8s cubic-bezier(0.55, 0, 0.9, 0.5) infinite;
  }
  .loader-droplet__surface {
    position: absolute;
    left: 6px;
    right: 6px;
    top: 78px;
    height: 1px;
    background: linear-gradient(90deg, transparent, light-dark(#5f626a, #a7abb2), transparent);
  }
  .loader-droplet__ripple {
    position: absolute;
    left: 50%;
    top: 78px;
    width: 108px;
    height: 20px;
    margin: -10px 0 0 -54px;
    border-radius: 50%;
    border: 1.5px solid light-dark(#373a40, #f1f2f3);
    opacity: 0;
    animation: loader-droplet-ripple 1.8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  .loader-droplet__ripple:nth-of-type(2) { animation-delay: 0.22s; border-color: light-dark(#5f626a, #a7abb2); }
  .loader-droplet__bead {
    position: absolute;
    left: 50%;
    top: 74px;
    width: 5px;
    height: 5px;
    margin-left: -2.5px;
    border-radius: 50%;
    background: light-dark(#373a40, #f1f2f3);
    opacity: 0;
    animation: loader-droplet-crown 1.8s cubic-bezier(0.3, 0.6, 0.5, 1) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-droplet__drop, .loader-droplet__ripple, .loader-droplet__bead { animation-duration: 5s; }
  }
`;

const BEADS = ['-16px', '-8px', '9px', '17px'];

export function DropletLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-droplet" role="status" aria-label="Loading">
        <span className="loader-droplet__surface" aria-hidden="true" />
        <span className="loader-droplet__ripple" aria-hidden="true" />
        <span className="loader-droplet__ripple" aria-hidden="true" />
        <span className="loader-droplet__drop" aria-hidden="true" />
        {BEADS.map((x) => (
          <span key={x} className="loader-droplet__bead" style={{ '--x': x } as React.CSSProperties} aria-hidden="true" />
        ))}
      </div>
    </>
  );
}
