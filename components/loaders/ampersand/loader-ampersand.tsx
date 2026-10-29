"use client";

// One stroke: in at the tail, up the diagonal, round the head, down into the bowl and out to the right.
const AMP = 'M46 50C38 42 26 30 20 22C15 15 17 6 25 6C33 6 34 15 28 20C22 25 12 30 11 39C10 47 17 52 25 51C33 50 39 43 43 34';

const css = `
  @keyframes loader-ampersand-write {
    0% { stroke-dashoffset: 1; }
    45% { stroke-dashoffset: 0; }
    65% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -1; }
  }
  @keyframes loader-ampersand-nib { 0%, 100% { offset-distance: 0%; opacity: 0; } 4% { opacity: 1; } 45% { offset-distance: 100%; opacity: 1; } 50%, 99% { offset-distance: 100%; opacity: 0; } }
  .loader-ampersand { position: relative; width: 56px; height: 56px; transform: scale(1.15); }
  .loader-ampersand svg { width: 100%; height: 100%; overflow: visible; }
  .loader-ampersand__ghost { fill: none; stroke: light-dark(#ebedf0, #232529); stroke-width: 4.5; stroke-linecap: round; }
  .loader-ampersand__ink { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; animation: loader-ampersand-write 2.6s cubic-bezier(0.55, 0.1, 0.4, 0.95) infinite; }
  .loader-ampersand__nib { position: absolute; left: 0; top: 0; width: 6px; height: 6px; margin: -3px; border-radius: 50%; background: light-dark(#373a40, #f1f2f3); box-shadow: 0 0 8px 2px color-mix(in oklab, light-dark(#373a40, #f1f2f3) 50%, transparent); offset-path: path('${AMP}'); offset-rotate: 0deg; animation: loader-ampersand-nib 2.6s cubic-bezier(0.55, 0.1, 0.4, 0.95) infinite; }
  @media (prefers-reduced-motion: reduce) {
    .loader-ampersand__ink { animation: none; stroke-dashoffset: 0; }
    .loader-ampersand__nib { display: none; }
  }
`;

export function AmpersandLoader() {
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-ampersand" role="status" aria-label="Loading">
        <svg viewBox="0 0 56 56" aria-hidden="true">
          <path className="loader-ampersand__ghost" d={AMP} />
          <path className="loader-ampersand__ink" d={AMP} pathLength={1} />
        </svg>
        <span className="loader-ampersand__nib" aria-hidden="true" />
      </div>
    </>
  );
}
