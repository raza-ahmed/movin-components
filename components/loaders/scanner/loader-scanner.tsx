"use client";

import { useMemo } from 'react';

const css = `
  @keyframes loader-scanner-sweep {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(48px); }
  }
  .loader-scanner {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px 8px;
    border-radius: 8px;
    background: light-dark(#fbfcfd, #121417);
    box-shadow: inset 0 0 0 1px light-dark(#dbdde1, #2e3035);
  }
  .loader-scanner__code { display: flex; align-items: stretch; height: 48px; gap: 2px; }
  .loader-scanner__bar { background: light-dark(#5f626a, #a7abb2); }
  .loader-scanner__digits {
    display: flex;
    justify-content: space-between;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 8px;
    letter-spacing: 0.08em;
    color: light-dark(#5f626a, #a7abb2);
  }
  .loader-scanner__beam {
    position: absolute;
    left: 6px;
    right: 6px;
    top: 10px;
    height: 2px;
    margin-top: -1px;
    border-radius: 2px;
    background: light-dark(#373a40, #f1f2f3);
    box-shadow: 0 0 8px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 60%, transparent), 0 0 24px 6px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 18%, transparent);
    animation: loader-scanner-sweep 1.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
  /* A band of light following the beam, lighting the bars it crosses. */
  .loader-scanner__glow {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 10px;
    height: 48px;
    pointer-events: none;
    background: linear-gradient(transparent, color-mix(in oklab, light-dark(#373a40, #f1f2f3) 30%, transparent), transparent) 0 0 / 100% 16px no-repeat;
    animation: loader-scanner-glow 1.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
  @keyframes loader-scanner-glow {
    0%, 100% { background-position: 0 -8px; }
    50% { background-position: 0 40px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .loader-scanner__beam, .loader-scanner__glow { animation-duration: 6s; }
  }
`;

export function ScannerLoader() {
  // A seeded barcode: bar widths 1–3px with matching gaps.
  const bars = useMemo(() => {
    let seed = 9;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 30 }, () => 1 + Math.floor(rand() * 3));
  }, []);

  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-scanner" role="status" aria-label="Loading">
        <span className="loader-scanner__code" aria-hidden="true">
          {bars.map((w, i) => (
            <span key={i} className="loader-scanner__bar" style={{ width: w }} />
          ))}
        </span>
        <span className="loader-scanner__digits" aria-hidden="true">
          <span>4</span>
          <span>820194</span>
          <span>730551</span>
          <span>2</span>
        </span>
        <span className="loader-scanner__glow" aria-hidden="true" />
        <span className="loader-scanner__beam" aria-hidden="true" />
      </div>
    </>
  );
}
