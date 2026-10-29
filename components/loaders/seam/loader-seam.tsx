"use client";

import { useId } from 'react';

const SEAM = 'M20 6H52A14 14 0 0 1 66 20V52A14 14 0 0 1 52 66H20A14 14 0 0 1 6 52V20A14 14 0 0 1 20 6Z';

const css = `
  @keyframes loader-seam-sew { 0% { stroke-dashoffset: 1; } 75%, 100% { stroke-dashoffset: 0; } }
  @keyframes loader-seam-pull { 0%, 80% { opacity: 1; transform: none; } 92% { opacity: 0; transform: scale(0.96); } 100% { opacity: 0; } }
  @keyframes loader-seam-needle { 0% { offset-distance: 0%; opacity: 1; } 75% { offset-distance: 100%; opacity: 1; } 82%, 100% { offset-distance: 100%; opacity: 0; } }
  .loader-seam { position: relative; width: 72px; height: 72px; }
  .loader-seam svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .loader-seam__cloth { fill: light-dark(#ebedf0, #232529); stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1; }
  .loader-seam__guide { fill: none; stroke: light-dark(#dbdde1, #2e3035); stroke-width: 1; stroke-dasharray: 1.5 3; }
  .loader-seam__stitches { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 5 4; transform-origin: 36px 36px; animation: loader-seam-pull 3.2s ease-in-out infinite; }
  .loader-seam__reveal { fill: none; stroke: light-dark(#373a40, #f1f2f3); stroke-width: 6; stroke-dasharray: 1; animation: loader-seam-sew 3.2s linear infinite; }
  .loader-seam__needle { position: absolute; left: 0; top: 0; width: 14px; height: 2px; margin: -1px -11px; border-radius: 1px; background: linear-gradient(90deg, light-dark(#6d7179, #7d8087), light-dark(#373a40, #f1f2f3)); offset-path: path('${SEAM}'); offset-rotate: auto; animation: loader-seam-needle 3.2s linear infinite; }
  .loader-seam__needle::after { content: ''; position: absolute; left: 2px; top: 0.5px; width: 3px; height: 1px; background: light-dark(#ebedf0, #232529); }
  @media (prefers-reduced-motion: reduce) {
    .loader-seam__stitches, .loader-seam__reveal, .loader-seam__needle { animation: none; }
    .loader-seam__needle { display: none; }
  }
`;

export function SeamLoader() {
  const mask = `loader-seam-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <>
      <style>
        {css}
      </style>
      <div className="loader-seam" role="status" aria-label="Loading">
        <svg viewBox="0 0 72 72" aria-hidden="true">
          <defs>
            {/* Alpha mask: the stitches show only where the needle has already been. */}
            <mask id={mask} maskUnits="userSpaceOnUse" x="-4" y="-4" width="80" height="80" style={{ maskType: 'alpha' }}>
              <path className="loader-seam__reveal" d={SEAM} pathLength={1} />
            </mask>
          </defs>
          <rect className="loader-seam__cloth" x="1" y="1" width="70" height="70" rx="18" />
          <path className="loader-seam__guide" d={SEAM} />
          <g mask={`url(#${mask})`}>
            <path className="loader-seam__stitches" d={SEAM} />
          </g>
        </svg>
        <span className="loader-seam__needle" aria-hidden="true" />
      </div>
    </>
  );
}
